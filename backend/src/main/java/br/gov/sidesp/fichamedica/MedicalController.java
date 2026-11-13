package br.gov.sidesp.fichamedica;
import br.gov.sidesp.management.ManagementRequests;
import java.util.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/** Endpoints da funcionalidade; autorização permanece na configuração de segurança. */
@RestController
@RequestMapping("/api/v1")
public class MedicalController {
  private final MedicalService service;
  public MedicalController(MedicalService service) { this.service = service; }

  /** Consulta ficha após conferir perfil e vínculo no serviço. */
  @GetMapping("/fichas-medicas/{id}")
  public ManagementRequests.Medical medical(@PathVariable int id, Authentication a) {
    boolean admin =
        a.getAuthorities().stream()
            .anyMatch(r -> r.getAuthority().startsWith("ROLE_ADMINISTRADOR_"));
    return service.medical(id, (Integer) a.getPrincipal(), admin);
  }
}
