package br.gov.sidesp.modalidades;
import br.gov.sidesp.management.ManagementRequests;
import jakarta.validation.Valid;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/** Endpoints da funcionalidade; autorização permanece na configuração de segurança. */
@RestController
@RequestMapping("/api/v1")
public class ModalityController {
  private final ModalityService service;
  public ModalityController(ModalityService service) { this.service = service; }

  /** Cadastra modalidade em polo ativo. */
  @PostMapping("/admin/modalidades")
  @ResponseStatus(HttpStatus.CREATED)
  public Map<String, Object> modality(@Valid @RequestBody ManagementRequests.Modality r) {
    return service.modality(r);
  }

  /** Retorna modalidades conforme a situação solicitada. */
  @GetMapping("/admin/modalidades")
  public List<Map<String, Object>> modalities(@RequestParam(required = false) Boolean ativo) {
    return service.modalities(ativo);
  }

  /** Inativa ou reativa modalidade. */
  @PatchMapping("/admin/modalidades/{id}/situacao")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void modalityStatus(
      @PathVariable int id, @Valid @RequestBody ManagementRequests.Status r) {
    service.modalityStatus(id, r.ativo());
  }

}
