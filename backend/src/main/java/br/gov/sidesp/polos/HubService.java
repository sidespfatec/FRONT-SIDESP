package br.gov.sidesp.polos;

import br.gov.sidesp.auth.*;
import br.gov.sidesp.management.ManagementRequests;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Regras da funcionalidade, chamadas pelo controller. */
@Service
public class HubService {
  private final JdbcTemplate db;

  public HubService(JdbcTemplate db) {
    this.db = db;
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

  /** Traduz ausência de cadastro em 404. */
  private void requireChanged(int rows) {
    if (rows == 0)
      throw new ApiException(
          HttpStatus.NOT_FOUND, "NAO_ENCONTRADO", "Cadastro não encontrado.", null);
  }
}
