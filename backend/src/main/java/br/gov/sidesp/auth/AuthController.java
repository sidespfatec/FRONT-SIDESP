package br.gov.sidesp.auth;

import br.gov.sidesp.security.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/** Endpoints HTTP de autenticação; delega regras ao Service. */
@RestController
@RequestMapping("/api/v1")
public class AuthController {
  private final AuthService service;
  private final AttemptLimiter limiter;

  /** Recebe Service e limitador de tentativas por injeção de construtor do Spring. */
  public AuthController(AuthService service, AttemptLimiter limiter) {
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

  /**
   * Valida a entrada, limita tentativas por IP e retorna o JWT somente após autenticação no
   * Service.
   */
  @PostMapping("/auth/login")
  public TokenService.LoginResult login(
      @Valid @RequestBody Requests.Login r, HttpServletRequest request) {
    limiter.check("login", request.getRemoteAddr());
    return service.login(r);
  }

  /**
   * Obtém o id da conta a partir da autenticação do servidor, nunca de um parâmetro livre do
   * cliente.
   */
  @GetMapping("/auth/me")
  public AuthService.Me me(Authentication a) {
    return service.me((Integer) a.getPrincipal());
  }

  /** Informa que o processo HTTP está atendendo; não garante saúde contínua do banco. */
  @GetMapping("/health")
  public Map<String, String> health() {
    return Map.of("status", "UP");
  }
}
