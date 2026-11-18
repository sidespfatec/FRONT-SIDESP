
package br.gov.sidesp.noticias;

import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/admin/noticias")
public class NoticiaController {

    private final NoticiaService service;

    public NoticiaController(NoticiaService service) {
        this.service = service;
    }

    @PostMapping(consumes = "multipart/form-data")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> create(
            @Valid @RequestPart("dados") NoticiaRequests.Create r,
            @RequestPart("imagem") MultipartFile imagem) {

        return service.create(r, imagem);
    }

}
