package br.gov.sidesp.management;

import br.gov.sidesp.auth.Rules;
import br.gov.sidesp.security.Crypto;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/** Armazena anamnese cifrada nos dois fluxos de cadastro de menores. */
@Repository
public class MedicalRepository {
  private final JdbcTemplate db;
  private final Crypto crypto;

  /** Recebe banco e proteção criptográfica. */
  public MedicalRepository(JdbcTemplate db, Crypto crypto) {
    this.db = db;
    this.crypto = crypto;
  }

  /** Grava os dados sensíveis cifrados em ficha única por pessoa. */
  public void saveMedical(int person, ManagementRequests.Medical r) {
    String phone = Rules.phone(r.telefoneEmergencia(), "telefoneEmergencia");
    db.update(
        """
INSERT INTO fichas_medicas(pes_id,fim_condicoes,fim_alergias,fim_medicamentos,fim_restricoes,fim_emergencia_nome,fim_emergencia_telefone)
VALUES(?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE fim_condicoes=VALUES(fim_condicoes),fim_alergias=VALUES(fim_alergias),
fim_medicamentos=VALUES(fim_medicamentos),fim_restricoes=VALUES(fim_restricoes),fim_emergencia_nome=VALUES(fim_emergencia_nome),fim_emergencia_telefone=VALUES(fim_emergencia_telefone)
""",
        person,
        crypto.encryptMedical(r.condicoes()),
        crypto.encryptMedical(r.alergias()),
        crypto.encryptMedical(r.medicamentos()),
        crypto.encryptMedical(r.restricoes()),
        crypto.encryptMedical(r.contatoEmergencia()),
        crypto.encryptMedical(phone));
  }
}
