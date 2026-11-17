package br.gov.sidesp.administradores;
import br.gov.sidesp.auth.AuthService;
import br.gov.sidesp.management.ManagementRequests;
import br.gov.sidesp.profissionais.ProfessionalService;
import jakarta.validation.Valid;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/** Endpoints da funcionalidade; autorização permanece na configuração de segurança. */
@RestController
@RequestMapping("/api/v1")
public class AdministratorController {
  private final ProfessionalService service;
  public AdministratorController(ProfessionalService service) { this.service = service; }

  /** Cria administrador total ou parcial; rota exclusiva do total. */
  @PostMapping("/admin/administradores")
  @ResponseStatus(HttpStatus.CREATED)
  public AuthService.Registered administrator(
      @Valid @RequestBody ManagementRequests.Professional r, Authentication a) {
    return service.professional(r, true, (Integer) a.getPrincipal());
  }

  /** Lista administradores sem credenciais. */
  @GetMapping("/admin/administradores")
  public List<Map<String, Object>> administrators() {
    return service.professionals(true);
  }

  /** Inativa ou reativa administrador. */
  @PatchMapping("/admin/administradores/{id}/situacao")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void administratorStatus(
      @PathVariable int id, @Valid @RequestBody ManagementRequests.Status r, Authentication a) {
    service.professionalStatus(id, r.ativo(), true, (Integer) a.getPrincipal());
  }

}
