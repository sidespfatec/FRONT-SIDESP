package br.gov.sidesp.dependentes;
import br.gov.sidesp.auth.AuthService;
import br.gov.sidesp.management.ManagementRequests;
import jakarta.validation.Valid;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/** Endpoints da funcionalidade; autorização permanece na configuração de segurança. */
@RestController
@RequestMapping("/api/v1")
public class DependentController {
  private final DependentService service;
  public DependentController(DependentService service) { this.service = service; }

  /** Vincula dependente apenas ao titular da sessão. */
  @PostMapping("/responsavel/dependentes")
  @ResponseStatus(HttpStatus.CREATED)
  public AuthService.Registered child(
      @Valid @RequestBody ManagementRequests.Child r, Authentication a) {
    return service.child(r, (Integer) a.getPrincipal());
  }

}
