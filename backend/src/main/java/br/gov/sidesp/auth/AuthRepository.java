package br.gov.sidesp.auth;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

/** Executa SQL parametrizado no modelo aprovado. Não cria/atualiza tabelas automaticamente. */
@Repository
public class AuthRepository {
  private final JdbcTemplate database;
  private static final String ACCOUNT_SELECT =
      """
      SELECT c.con_id, c.pes_id, p.pes_nome, t.tpc_des,
             c.con_senha_hash, c.con_ativo, c.con_email_hash
      FROM contas c
      JOIN pessoas p ON p.pes_id = c.pes_id
      JOIN tipos_cadastros t ON t.tpc_id = p.tpc_id
      """;

  /**
   * Recebe do Spring o Jdbc Template, que gerencia conexões e participa da transação do Service.
   */
  public AuthRepository(JdbcTemplate database) {
    this.database = database;
  }

  /** Representa a conta para uso interno; o hash de senha não é retornado pelo Controller. */
  public record Account(
      int id,
      int person,
      String name,
      String role,
      String password,
      boolean active,
      byte[] emailHash) {
    /** Evita expor hashes ou dados pessoais caso alguém imprima o objeto durante depuração. */
    @Override
    public String toString() {
      return "Account[REDACTED]";
    }
  }

  /**
   * Transforma uma linha SQL em conta usando nomes de colunas, sem depender da posição numérica.
   */
  private Account mapAccount(ResultSet result, int rowNumber) throws SQLException {
    return new Account(
        result.getInt("con_id"),
        result.getInt("pes_id"),
        result.getString("pes_nome"),
        result.getString("tpc_des"),
        result.getString("con_senha_hash"),
        result.getBoolean("con_ativo"),
        result.getBytes("con_email_hash"));
  }

  /** Executa a busca com placeholders e devolve ausência ou a única conta encontrada. */
  private Optional<Account> findAccount(String sql, Object parameter) {
    List<Account> accounts = database.query(sql, this::mapAccount, parameter);
    if (accounts.isEmpty()) {
      return Optional.empty();
    }
    return Optional.of(accounts.get(0));
  }

  /** Localiza a conta do titular pelo CPF canônico em documentos, comparando apenas o hash. */
  public Optional<Account> accountByCpf(byte[] hash) {
    return findAccount(
        ACCOUNT_SELECT + "JOIN documentos d ON d.pes_id = p.pes_id WHERE d.doc_cpf_hash = ?", hash);
  }

  /**
   * Localiza conta pelo índice HMAC do e-mail; não precisa descriptografar e-mail para autenticar.
   */
  public Optional<Account> accountByEmail(byte[] hash) {
    return findAccount(ACCOUNT_SELECT + "WHERE c.con_email_hash = ?", hash);
  }

  /** Consulta a conta pelo id autenticado no JWT e obtém o perfil atual do banco. */
  public Optional<Account> account(int id) {
    return findAccount(ACCOUNT_SELECT + "WHERE c.con_id = ?", id);
  }

  /** Verifica se qualquer pessoa já usa este CPF; a garantia final é o índice UNIQUE do banco. */
  public boolean cpfExists(byte[] hash) {
    Integer count =
        database.queryForObject(
            "SELECT COUNT(*) FROM documentos WHERE doc_cpf_hash = ?", Integer.class, hash);
    return count != null && count > 0;
  }

  /** Busca o id de perfil no catálogo aprovado. A tabela é fixa, nunca vem da requisição HTTP. */
  public int registrationType(String description) {
    return database.queryForObject(
        "SELECT tpc_id FROM tipos_cadastros WHERE tpc_des = ?", Integer.class, description);
  }

  /** Executa INSERT com parâmetros e devolve o id AUTO_INCREMENT gerado pelo banco. */
  private int insert(String sql, Object... values) {
    KeyHolder keys = new GeneratedKeyHolder();
    database.update(
        connection -> {
          PreparedStatement statement =
              connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
          for (int index = 0; index < values.length; index++) {
            statement.setObject(index + 1, values[index]);
          }
          return statement;
        },
        keys);
    return Objects.requireNonNull(keys.getKey()).intValue();
  }

  /** Insere pessoa e perfil; idade não é armazenada, pois é calculada pela data de nascimento. */
  public int person(String name, LocalDate birth, String gender, int type) {
    return insert(
        "INSERT INTO pessoas(pes_nome,pes_data_nascimento,pes_sexo,tpc_id) VALUES(?,?,?,?)",
        name.strip(),
        birth,
        gender,
        type);
  }

  /** Insere documento CPF com rótulo não sensível e hash de 32 bytes, nunca CPF em doc_des. */
  public void cpf(int person, byte[] hash) {
    Integer type =
        database.queryForObject(
            "SELECT tpd_id FROM tipos_documentos WHERE tpd_des = ?", Integer.class, "CPF");
    database.update(
        "INSERT INTO documentos(pes_id,tpd_id,doc_des,doc_cpf_hash) VALUES(?,?,'CPF protegido',?)",
        person,
        type,
        hash);
  }

  /** Cria conta única para a pessoa, recebendo do Service e-mail protegido e senha já em hash. */
  public int createAccount(int person, byte[] email, byte[] hash, String password) {
    return insert(
        "INSERT INTO contas(pes_id,con_email_criptografado,con_email_hash,con_senha_hash)"
            + " VALUES(?,?,?,?)",
        person,
        email,
        hash,
        password);
  }

  /** Insere telefone ligado à pessoa ou ao responsável conforme o vínculo existente no modelo. */
  public void contact(Integer person, Integer guardian, String phone) {
    Integer type =
        database.queryForObject(
            "SELECT tct_id FROM tipos_contatos WHERE tct_des = ?", Integer.class, "TELEFONE");
    String responsibleContact = "N";
    if (guardian != null) {
      responsibleContact = "S";
    }
    database.update(
        "INSERT INTO contatos(tct_id,cnt_des,pes_id,res_id,cnt_res) VALUES(?,?,?,?,?)",
        type,
        phone,
        person,
        guardian,
        responsibleContact);
  }

  /** Guarda endereço da pessoa, normalizando CEP e UF; não cria vínculo com polo neste cadastro. */
  public void address(int person, Requests.Address address) {
    Integer type =
        database.queryForObject(
            "SELECT ten_id FROM tipos_enderecos WHERE ten_des = ?", Integer.class, "PESSOA");
    database.update(
        """
        INSERT INTO enderecos(end_cep,end_rua,end_numero,end_complemento,
          end_bairro,end_cidade,end_uf,ten_id,pes_id,pol_id)
        VALUES(?,?,?,?,?,?,?,?,?,NULL)
        """,
        address.cep().replace("-", ""),
        address.rua().strip(),
        address.numero().strip(),
        address.complemento(),
        address.bairro().strip(),
        address.cidade().strip(),
        address.uf().toUpperCase(Locale.ROOT),
        type,
        person);
  }

  /**
   * Cria responsável ligado à pessoa titular, preservando nome/data e perfil do modelo aprovado.
   */
  public int createGuardian(int person, Requests.Guardian guardian) {
    return insert(
        "INSERT INTO responsaveis(res_nome,res_data_nascimento,pes_id,tpc_id) VALUES(?,?,?,?)",
        guardian.nome().strip(),
        guardian.dataNascimento(),
        person,
        registrationType("RESPONSAVEL"));
  }

  /** Verifica se a pessoa já possui cadastro de responsável, evitando duplicar o titular. */
  public Optional<Integer> guardian(int person) {
    List<Integer> ids =
        database.query(
            "SELECT res_id FROM responsaveis WHERE pes_id = ?",
            (result, row) -> result.getInt("res_id"),
            person);
    if (ids.isEmpty()) {
      return Optional.empty();
    }
    return Optional.of(ids.get(0));
  }

  /** Associa responsável e dependente com parentesco, usando a chave composta existente. */
  public void link(int guardian, int child, String kinship) {
    database.update(
        "INSERT INTO responsaveis_dependentes(res_id,pes_id,rde_parentesco) VALUES(?,?,?)",
        guardian,
        child,
        kinship.strip());
  }

  /** Dados mínimos de um dependente retornados na sessão do próprio responsável. */
  public record Dependent(int id, String nome) {}

  /** Lista somente pessoas vinculadas ao responsável cujo titular é a pessoa autenticada. */
  public List<Dependent> dependents(int person) {
    return database.query(
        """
        SELECT p.pes_id, p.pes_nome FROM pessoas p
        JOIN responsaveis_dependentes rd ON rd.pes_id = p.pes_id
        JOIN responsaveis r ON r.res_id = rd.res_id
        WHERE r.pes_id = ? ORDER BY p.pes_id
        """,
        (result, row) -> new Dependent(result.getInt("pes_id"), result.getString("pes_nome")),
        person);
  }
}
