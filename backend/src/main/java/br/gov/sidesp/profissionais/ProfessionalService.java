package br.gov.sidesp.profissionais;

import br.gov.sidesp.auth.*;
import br.gov.sidesp.management.ManagementRequests;
import java.time.Clock;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Regras da funcionalidade, chamadas pelo controller. */
@Service
public class ProfessionalService {
  private final JdbcTemplate db;
  private final AuthService auth;
  private final AuthRepository accounts;
  private final Clock clock;

  public ProfessionalService(JdbcTemplate db, AuthService auth, AuthRepository accounts, Clock clock) {
    this.db = db;
    this.auth = auth;
    this.accounts = accounts;
    this.clock = clock;
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

  /** Traduz ausência de cadastro em 404. */
  private void requireChanged(int rows) {
    if (rows == 0)
      throw new ApiException(
          HttpStatus.NOT_FOUND, "NAO_ENCONTRADO", "Cadastro não encontrado.", null);
  }
}
