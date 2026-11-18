
package br.gov.sidesp.noticias;

import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
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
}