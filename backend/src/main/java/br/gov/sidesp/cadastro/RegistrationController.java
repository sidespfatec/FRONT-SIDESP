package br.gov.sidesp.cadastro;
import br.gov.sidesp.auth.*;
import br.gov.sidesp.security.AttemptLimiter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

/** Cadastro público; regras compartilhadas permanecem em AuthService. */
@RestController
@RequestMapping("/api/v1")
public class RegistrationController {
  private final AuthService service;
  private final AttemptLimiter limiter;
  public RegistrationController(AuthService service, AttemptLimiter limiter) {
    this.service = service;
    this.limiter = limiter;
  }
  /**
   * Valida o JSON com @Valid, limita tentativas por IP e chama o cadastro; retorna201 sem dados de
   * acesso.
   */
  @PostMapping("/auth/cadastros")
  public ResponseEntity<AuthService.Registered> register(
      @Valid @RequestBody Requests.Registration r, HttpServletRequest request) {
    limiter.check("register", request.getRemoteAddr());
    return ResponseEntity.status(HttpStatus.CREATED).body(service.register(r));
  }

}
