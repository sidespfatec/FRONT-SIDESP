
package br.gov.sidesp.noticias;

import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NoticiaService {

    private final JdbcTemplate db;
    private final NoticiaStorageService storage;

    public NoticiaService(
            JdbcTemplate db,
            NoticiaStorageService storage) {
        this.db = db;
        this.storage = storage;
    }

    @Transactional
    public Map<String, Object> create(
            NoticiaRequests.Create r, MultipartFile imagem) {

        String nomeImagem = storage.armazenar(imagem);

        try {
            db.update(
                    """
                    INSERT INTO noticias
                    (ntc_titulo, ntc_conteudo, ntc_imagem,
                     ntc_data_publicacao, nst_id)
                    VALUES (
                        ?, ?, ?, ?,
                        (SELECT nst_id FROM noticias_status
                         WHERE nst_des = CASE
                             WHEN ? > CURRENT_TIMESTAMP THEN 'EM ESPERA'
                             ELSE 'PUBLICADA'
                         END)
                    )
                    """,
                    r.titulo().strip(),
                    r.conteudo().strip(),
                    nomeImagem,
                    r.dataPublicacao(),
                    r.dataPublicacao());

            Integer id = db.queryForObject(
                    "SELECT LAST_INSERT_ID()", Integer.class);

            return Map.of("id", id, "imagem", nomeImagem);

        } catch (RuntimeException e) {
            try {
                storage.excluir(nomeImagem);
            } catch (RuntimeException erroExclusao) {
                e.addSuppressed(erroExclusao);
            }

            throw e;
        }
    }

    public List<Map<String, Object>> listarPublicadas() {

        return db.query(
                """
                SELECT
                    n.ntc_id AS id,
                    n.ntc_titulo AS titulo,
                    n.ntc_conteudo AS conteudo,
                    n.ntc_imagem AS imagem,
                    n.ntc_data_publicacao AS dataPublicacao
                FROM noticias n
                JOIN noticias_status s
                    ON s.nst_id = n.nst_id
                WHERE s.nst_des = 'PUBLICADA'
                  AND n.ntc_data_publicacao <= CURRENT_TIMESTAMP
                ORDER BY n.ntc_data_publicacao DESC
                """,
                (rs, rowNum) -> {
                    Map<String, Object> noticia =
                            new java.util.LinkedHashMap<>();

                    noticia.put("id", rs.getInt("id"));
                    noticia.put("titulo", rs.getString("titulo"));
                    noticia.put("conteudo", rs.getString("conteudo"));
                    noticia.put("imagem", rs.getString("imagem"));
                    noticia.put(
                            "dataPublicacao",
                            rs.getTimestamp("dataPublicacao")
                                    .toLocalDateTime()
                    );

                    return noticia;
                }
        );
    }
}
