package br.gov.sidesp.fichamedica;

import br.gov.sidesp.auth.*;
import br.gov.sidesp.management.ManagementRequests;
import br.gov.sidesp.security.Crypto;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

/** Regras da funcionalidade, chamadas pelo controller. */
@Service
public class MedicalService {
  private final JdbcTemplate db;
  private final AuthRepository accounts;
  private final Crypto crypto;

  public MedicalService(JdbcTemplate db, AuthRepository accounts, Crypto crypto) {
    this.db = db;
    this.accounts = accounts;
    this.crypto = crypto;
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

}
