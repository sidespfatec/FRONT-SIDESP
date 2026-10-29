package br.gov.sidesp.management;

import br.gov.sidesp.auth.*;
import br.gov.sidesp.security.Crypto;
import java.time.Clock;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Cadastros administrativos e de dependentes; SQL sempre usa parâmetros. */
@Service
public class ManagementService {
  private final JdbcTemplate db;
  private final AuthService auth;
  private final AuthRepository accounts;
  private final Crypto crypto;
  private final Clock clock;
  private final MedicalRepository medical;

  /** Reaproveita as validações e a transação do cadastro já existente. */
  public ManagementService(
      JdbcTemplate db,
      AuthService auth,
      AuthRepository accounts,
      Crypto crypto,
      Clock clock,
      MedicalRepository medical) {
    this.db = db;
    this.auth = auth;
    this.accounts = accounts;
    this.crypto = crypto;
    this.clock = clock;
    this.medical = medical;
  }

  /** Cadastra profissional adulto e atribui somente o perfil autorizado pelo endpoint. */
  @Transactional
  public AuthService.Registered professional(
      ManagementRequests.Professional r, boolean administrator, int actor) {
    if (Rules.minor(r.cadastro().dadosPessoais().dataNascimento(), clock))
      throw ApiException.invalid("dataNascimento", "O profissional deve ser maior de idade.");
    String role = "PROFESSOR";
    if (administrator) {
      if (r.nivel() == null)
        throw ApiException.invalid("nivel", "Informe acesso total ou parcial.");
      role = r.nivel();
    } else if (r.nivel() != null) {
      throw ApiException.invalid("nivel", "Cadastro de professor não aceita nível administrativo.");
    }
    if (!administrator
        && (r.registro() == null
            || r.registro().isBlank()
            || r.especialidade() == null
            || r.especialidade().isBlank()))
      throw ApiException.invalid("registro", "Informe registro profissional e especialidade.");
    AuthService.Registered result = auth.register(r.cadastro());
    db.update(
        "UPDATE pessoas SET tpc_id=? WHERE pes_id=?", accounts.registrationType(role), result.id());
    db.update(
        "INSERT INTO"
            + " profissionais(pes_id,pro_registro,pro_especialidade,pro_cargo,pro_unidade,pro_admissao,pro_criado_por)"
            + " VALUES(?,?,?,?,?,?,?)",
        result.id(),
        r.registro(),
        r.especialidade(),
        r.cargo(),
        r.unidade(),
        r.admissao(),
        actor);
    if (r.rg() != null && !r.rg().isBlank())
      db.update(
          "INSERT INTO documentos(pes_id,tpd_id,doc_des) VALUES(?,(SELECT tpd_id FROM"
              + " tipos_documentos WHERE tpd_des='RG'),?)",
          result.id(),
          r.rg().strip());
    return result;
  }

  /** Lista profissionais sem devolver hashes, CPF ou dados de saúde. */
  public List<Map<String, Object>> professionals(boolean administrator) {
    return db.queryForList(
        """
        SELECT p.pes_id AS id,p.pes_nome AS nome,t.tpc_des AS perfil,c.con_ativo AS ativo,
          pr.pro_registro AS registro,pr.pro_especialidade AS especialidade,
          pr.pro_cargo AS cargo,pr.pro_unidade AS unidade,pr.pro_admissao AS admissao
        FROM pessoas p JOIN contas c ON c.pes_id=p.pes_id
        JOIN tipos_cadastros t ON t.tpc_id=p.tpc_id
        LEFT JOIN profissionais pr ON pr.pes_id=p.pes_id
        WHERE t.tpc_des IN (?,?) ORDER BY p.pes_nome LIMIT 200
        """,
        administrator ? "ADMINISTRADOR_TOTAL" : "PROFESSOR",
        administrator ? "ADMINISTRADOR_PARCIAL" : "PROFESSOR");
  }

  /** Inativa sem excluir, impedindo que alguém inative a própria sessão administrativa. */
  @Transactional
  public void professionalStatus(int person, boolean active, boolean administrator, int actor) {
    var account = accounts.account(actor).orElseThrow(ApiException::unauthorized);
    // Serializa mudanças no catálogo de perfis administrativos para preservar o último total ativo.
    db.queryForList(
        "SELECT tpc_id FROM tipos_cadastros WHERE tpc_des='ADMINISTRADOR_TOTAL' FOR UPDATE");
    if (!active && account.person() == person)
      throw ApiException.invalid("ativo", "Não é possível inativar a própria conta.");
    if (!active && administrator) {
      Integer total =
          db.queryForObject(
              "SELECT COUNT(*) FROM contas c JOIN pessoas p ON p.pes_id=c.pes_id JOIN"
                  + " tipos_cadastros t ON t.tpc_id=p.tpc_id WHERE c.con_ativo=TRUE AND"
                  + " t.tpc_des='ADMINISTRADOR_TOTAL' AND p.pes_id<>?",
              Integer.class,
              person);
      if (total == 0)
        throw ApiException.invalid("ativo", "Mantenha ao menos um administrador total ativo.");
    }
    int changed =
        db.update(
            """
UPDATE contas c JOIN pessoas p ON p.pes_id=c.pes_id JOIN tipos_cadastros t ON t.tpc_id=p.tpc_id
SET c.con_ativo=?,c.con_versao=c.con_versao+1 WHERE p.pes_id=? AND t.tpc_des IN (?,?)
""",
            active,
            person,
            administrator ? "ADMINISTRADOR_TOTAL" : "PROFESSOR",
            administrator ? "ADMINISTRADOR_PARCIAL" : "PROFESSOR");
    requireChanged(changed);
  }

  /** Insere polo e endereço na mesma transação. */
  @Transactional
  public Map<String, Object> hub(ManagementRequests.Hub r) {
    Rules.address(r.endereco());
    db.update(
        "INSERT INTO polos(pol_des,pol_latitude,pol_longitude) VALUES(?,?,?)",
        r.nome().strip(),
        r.latitude(),
        r.longitude());
    int id = db.queryForObject("SELECT LAST_INSERT_ID()", Integer.class);
    var a = r.endereco();
    db.update(
        "INSERT INTO"
            + " enderecos(end_cep,end_rua,end_numero,end_complemento,end_bairro,end_cidade,end_uf,ten_id,pol_id)"
            + " VALUES(?,?,?,?,?,?,?,(SELECT ten_id FROM tipos_enderecos WHERE ten_des='POLOS'),?)",
        a.cep().replace("-", ""),
        a.rua(),
        a.numero(),
        a.complemento(),
        a.bairro(),
        a.cidade(),
        a.uf().toUpperCase(Locale.ROOT),
        id);
    return Map.of("id", id);
  }

  /** Busca polos por nome e situação, retornando o endereço junto das coordenadas. */
  public List<Map<String, Object>> hubs(String search, Boolean active) {
    return db.queryForList(
        """
SELECT p.pol_id AS id,p.pol_des AS nome,p.pol_latitude AS latitude,p.pol_longitude AS longitude,p.pol_ativo AS ativo,
e.end_cep AS cep,e.end_rua AS rua,e.end_numero AS numero,e.end_complemento AS complemento,
e.end_bairro AS bairro,e.end_cidade AS cidade,e.end_uf AS uf FROM polos p
LEFT JOIN enderecos e ON e.pol_id=p.pol_id WHERE p.pol_des LIKE ? AND (? IS NULL OR p.pol_ativo=?)
ORDER BY p.pol_des LIMIT 200
""",
        "%" + search + "%",
        active,
        active);
  }

  /** Inativa ou reativa polo; modalidades também conferem a situação do polo na leitura. */
  @Transactional
  public void hubStatus(int id, boolean active) {
    requireChanged(db.update("UPDATE polos SET pol_ativo=? WHERE pol_id=?", active, id));
  }

  /** Valida faixa etária e exige polo ativo, travado contra inativação concorrente. */
  @Transactional
  public Map<String, Object> modality(ManagementRequests.Modality r) {
    if (r.idadeMinima() > r.idadeMaxima())
      throw ApiException.invalid("idadeMinima", "A idade mínima não pode superar a máxima.");
    var found =
        db.queryForList(
            "SELECT pol_id FROM polos WHERE pol_id=? AND pol_ativo=TRUE FOR UPDATE", r.poloId());
    if (found.isEmpty()) throw ApiException.invalid("poloId", "Escolha um polo ativo.");
    db.update(
        "INSERT INTO"
            + " modalidades(mdl_des,mdl_idade_minima,mdl_idade_maxima,mdl_faltas_mensais,pol_id)"
            + " VALUES(?,?,?,?,?)",
        r.nome().strip(),
        r.idadeMinima(),
        r.idadeMaxima(),
        r.limiteFaltasMensais(),
        r.poloId());
    return Map.of("id", db.queryForObject("SELECT LAST_INSERT_ID()", Integer.class));
  }

  /** Filtra modalidades elegíveis para seleção quando ativo=true, inclusive pelo estado do polo. */
  public List<Map<String, Object>> modalities(Boolean active) {
    return db.queryForList(
        """
SELECT m.mdl_id AS id,m.mdl_des AS nome,m.mdl_idade_minima AS idadeMinima,
m.mdl_idade_maxima AS idadeMaxima,m.mdl_faltas_mensais AS limiteFaltasMensais,m.mdl_ativo AS ativo,m.pol_id AS poloId
FROM modalidades m LEFT JOIN polos p ON p.pol_id=m.pol_id
WHERE (? IS NULL OR m.mdl_ativo=?) AND (? IS NULL OR ?=FALSE OR p.pol_ativo=TRUE)
ORDER BY m.mdl_des LIMIT 200
""",
        active,
        active,
        active,
        active);
  }

  /** Muda somente situação, preservando vínculos e histórico. */
  @Transactional
  public void modalityStatus(int id, boolean active) {
    if (active
        && db.queryForList(
                "SELECT m.mdl_id FROM modalidades m JOIN polos p ON p.pol_id=m.pol_id WHERE"
                    + " m.mdl_id=? AND p.pol_ativo=TRUE",
                id)
            .isEmpty()) throw ApiException.invalid("poloId", "A modalidade precisa de polo ativo.");
    requireChanged(db.update("UPDATE modalidades SET mdl_ativo=? WHERE mdl_id=?", active, id));
  }

  /** Cadastra novo dependente usando a identidade autenticada, sem receber senha do titular. */
  @Transactional
  public AuthService.Registered child(ManagementRequests.Child r, int actor) {
    var owner = accounts.account(actor).orElseThrow(ApiException::unauthorized);
    var birth =
        db.queryForObject(
            "SELECT pes_data_nascimento FROM pessoas WHERE pes_id=?",
            java.sql.Date.class,
            owner.person());
    if (birth == null || Rules.minor(birth.toLocalDate(), clock))
      throw ApiException.invalid("responsavel", "O titular deve ser adulto.");
    if (!Rules.minor(r.dadosPessoais().dataNascimento(), clock))
      throw ApiException.invalid("dataNascimento", "Este fluxo é exclusivo para menor de idade.");
    Rules.address(r.endereco());
    String phone = Rules.phone(r.dadosPessoais().telefone(), "telefone");
    int guardian =
        accounts
            .guardian(owner.person())
            .orElseGet(() -> accounts.createGuardian(owner.person(), null));
    var p = r.dadosPessoais();
    int person =
        accounts.person(
            p.nome(), p.dataNascimento(), p.genero(), accounts.registrationType("ALUNO"));
    if (p.cpf() != null && !p.cpf().isBlank())
      accounts.cpf(person, crypto.cpfHash(Rules.cpf(p.cpf(), "cpf")));
    accounts.contact(person, null, phone);
    accounts.address(person, r.endereco());
    accounts.link(guardian, person, r.parentesco());
    medical.saveMedical(person, r.fichaMedica());
    return new AuthService.Registered(person, "Dependente cadastrado.");
  }

  /** Permite leitura por administrador ou professor atualmente vinculado à turma do aluno. */
  public ManagementRequests.Medical medical(int person, int actor, boolean administrator) {
    if (!administrator) {
      int teacher = accounts.account(actor).orElseThrow(ApiException::unauthorized).person();
      Integer links =
          db.queryForObject(
              """
SELECT COUNT(*) FROM turmas_professores tp JOIN turmas_professores_status ts ON ts.tpfs_id=tp.tpfs_id
JOIN turmas_pessoas a ON a.trm_id=tp.trm_id JOIN turmas_pessoas_status ast ON ast.tps_id=a.tps_id
WHERE tp.pes_id=? AND a.pes_id=? AND UPPER(ts.tpfs_des)='ATIVO' AND UPPER(ast.tps_des)='ATIVO'
""",
              Integer.class,
              teacher,
              person);
      if (links == 0)
        throw new ApiException(
            HttpStatus.FORBIDDEN, "ACESSO_NEGADO", "Acesso não autorizado.", null);
    }
    var rows =
        db.query(
            "SELECT * FROM fichas_medicas WHERE pes_id=?",
            (rs, n) ->
                new ManagementRequests.Medical(
                    crypto.decryptMedical(rs.getBytes("fim_condicoes")),
                        crypto.decryptMedical(rs.getBytes("fim_alergias")),
                    crypto.decryptMedical(rs.getBytes("fim_medicamentos")),
                        crypto.decryptMedical(rs.getBytes("fim_restricoes")),
                    crypto.decryptMedical(rs.getBytes("fim_emergencia_nome")),
                        crypto.decryptMedical(rs.getBytes("fim_emergencia_telefone"))),
            person);
    if (rows.isEmpty())
      throw new ApiException(HttpStatus.NOT_FOUND, "NAO_ENCONTRADO", "Ficha não encontrada.", null);
    return rows.get(0);
  }

  /** Traduz ausência de cadastro em 404. */
  private void requireChanged(int rows) {
    if (rows == 0)
      throw new ApiException(
          HttpStatus.NOT_FOUND, "NAO_ENCONTRADO", "Cadastro não encontrado.", null);
  }
}
