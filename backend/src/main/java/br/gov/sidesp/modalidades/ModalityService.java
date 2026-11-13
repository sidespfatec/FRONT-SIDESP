package br.gov.sidesp.modalidades;

import br.gov.sidesp.auth.*;
import br.gov.sidesp.management.ManagementRequests;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Regras da funcionalidade, chamadas pelo controller. */
@Service
public class ModalityService {
  private final JdbcTemplate db;

  public ModalityService(JdbcTemplate db) {
    this.db = db;
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

  /** Traduz ausência de cadastro em 404. */
  private void requireChanged(int rows) {
    if (rows == 0)
      throw new ApiException(
          HttpStatus.NOT_FOUND, "NAO_ENCONTRADO", "Cadastro não encontrado.", null);
  }
}
