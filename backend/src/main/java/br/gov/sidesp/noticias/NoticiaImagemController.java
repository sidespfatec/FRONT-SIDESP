
package br.gov.sidesp.noticias;

import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/noticias/imagens")
public class NoticiaImagemController {

    private final Path diretorio;

    public NoticiaImagemController(
            @Value("${sidesp.upload-dir}") String uploadDir) {
        this.diretorio = Path.of(uploadDir)
                .toAbsolutePath()
                .normalize();
    }

    @GetMapping("/{nomeArquivo}")
    public ResponseEntity<Resource> buscarImagem(
            @PathVariable String nomeArquivo) {

        try {
            Path arquivo = diretorio.resolve(nomeArquivo).normalize();

            if (!arquivo.startsWith(diretorio)
                    || !Files.isRegularFile(arquivo)) {
                return ResponseEntity.notFound().build();
            }

            Resource recurso = new UrlResource(arquivo.toUri());

            String tipo = Files.probeContentType(arquivo);

            MediaType mediaType = tipo != null
                    ? MediaType.parseMediaType(tipo)
                    : MediaType.APPLICATION_OCTET_STREAM;

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + nomeArquivo + "\"")
                    .body(recurso);

        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
