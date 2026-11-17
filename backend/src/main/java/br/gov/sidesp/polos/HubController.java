package br.gov.sidesp.polos;
import br.gov.sidesp.management.ManagementRequests;
import jakarta.validation.Valid;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/** Endpoints da funcionalidade; autorização permanece na configuração de segurança. */
@RestController
@RequestMapping("/api/v1")
public class HubController {
  private final HubService service;
  public HubController(HubService service) { this.service = service; }

  /** Cadastra polo e endereço. */
  @PostMapping("/admin/polos")
  @ResponseStatus(HttpStatus.CREATED)
  public Map<String, Object> hub(@Valid @RequestBody ManagementRequests.Hub r) {
    return service.hub(r);
  }

  /** Busca polos com filtro opcional; ativo=true serve para seletores. */
  @GetMapping("/admin/polos")
  public List<Map<String, Object>> hubs(
      @RequestParam(defaultValue = "") String busca,
      @RequestParam(required = false) Boolean ativo) {
    return service.hubs(busca, ativo);
  }

  /** Altera situação do polo sem excluir. */
  @PatchMapping("/admin/polos/{id}/situacao")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void hubStatus(@PathVariable int id, @Valid @RequestBody ManagementRequests.Status r) {
    service.hubStatus(id, r.ativo());
  }

}
