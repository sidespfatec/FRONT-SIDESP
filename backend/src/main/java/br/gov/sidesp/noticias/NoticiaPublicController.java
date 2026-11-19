
package br.gov.sidesp.noticias;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/noticias")
public class NoticiaPublicController {

    private final NoticiaService service;

    public NoticiaPublicController(NoticiaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Map<String, Object>> listar() {
        return service.listarPublicadas();
    }
}
