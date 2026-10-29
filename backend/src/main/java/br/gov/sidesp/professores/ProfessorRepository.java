
package br.gov.sidesp.professores;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.Objects;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

@Repository
public class ProfessorRepository {

  private final JdbcTemplate database;

  public ProfessorRepository(JdbcTemplate database) {
    this.database = database;
  }

  public boolean cpfExists(byte[] cpfHash) {
    Integer count = database.queryForObject(
        "SELECT COUNT(*) FROM documentos WHERE doc_cpf_hash = ?",
        Integer.class,
        cpfHash);

    return count != null && count > 0;
  }

  public int createPerson(
      String nome,
      java.time.LocalDate dataNascimento,
      String sexo,
      int tipoCadastro) {

    KeyHolder keys = new GeneratedKeyHolder();

    database.update(connection -> {
      PreparedStatement statement = connection.prepareStatement(
          """
          INSERT INTO pessoas
            (pes_nome, pes_data_nascimento, pes_sexo, tpc_id)
          VALUES (?, ?, ?, ?)
          """,
          Statement.RETURN_GENERATED_KEYS);

      statement.setString(1, nome.strip());
      statement.setObject(2, dataNascimento);
      statement.setString(3, sexo);
      statement.setInt(4, tipoCadastro);

      return statement;
    }, keys);

    return Objects.requireNonNull(keys.getKey()).intValue();
  }

  public void createCpf(int pessoaId, byte[] cpfHash) {
    Integer tipoCpf = database.queryForObject(
        "SELECT tpd_id FROM tipos_documentos WHERE tpd_des = ?",
        Integer.class,
        "CPF");

    database.update(
        """
        INSERT INTO documentos (pes_id, tpd_id, doc_des, doc_cpf_hash)
        VALUES (?, ?, 'CPF protegido', ?)
        """,
        pessoaId,
        tipoCpf,
        cpfHash);
  }

  public int createProfessor(
      int pessoaId,
      String registroProfissional,
      String especialidade) {

    KeyHolder keys = new GeneratedKeyHolder();

    database.update(connection -> {
      PreparedStatement statement = connection.prepareStatement(
          """
          INSERT INTO professores
            (pes_id, pro_registro_profissional, pro_especialidade, pro_ativo)
          VALUES (?, ?, ?, TRUE)
          """,
          Statement.RETURN_GENERATED_KEYS);

      statement.setInt(1, pessoaId);
      statement.setString(2, registroProfissional.strip());
      statement.setString(3, especialidade.strip());

      return statement;
    }, keys);

    return Objects.requireNonNull(keys.getKey()).intValue();
  }
}
