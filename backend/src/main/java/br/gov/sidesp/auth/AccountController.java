package br.gov.sidesp.auth;

import br.gov.sidesp.security.AttemptLimiter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/** Endpoints do titular e respostas públicas de recuperação sem enumeração de contas. */
@RestController
@RequestMapping("/api/v1")
public class AccountController {
  private final AccountService service;
  private final RecoveryService recovery;
  private final AttemptLimiter limiter;

  /** Recebe os serviços da conta e o limitador de tentativas. */
  public AccountController(
      AccountService service, RecoveryService recovery, AttemptLimiter limiter) {
    this.service = service;
    this.recovery = recovery;
    this.limiter = limiter;
  }

  /** Obtém perfil somente da sessão autenticada. */
  @GetMapping("/perfil")
  public Map<String, Object> profile(Authentication a) {
    return service.profile((Integer) a.getPrincipal());
  }

  /** Salva dados permitidos do próprio perfil. */
  @PutMapping("/perfil")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void update(@Valid @RequestBody AccountRequests.Profile r, Authentication a) {
    service.update((Integer) a.getPrincipal(), r);
  }

  /** Troca senha mediante confirmação da senha atual. */
  @PostMapping("/perfil/senha")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void password(
      @Valid @RequestBody AccountRequests.Password r,
      Authentication a,
      HttpServletRequest request) {
    limiter.check("password", request.getRemoteAddr());
    service.password((Integer) a.getPrincipal(), r);
  }

  /** Responde igualmente exista ou não uma conta ativa para o identificador. */
  @PostMapping("/auth/recuperar-senha")
  @ResponseStatus(HttpStatus.ACCEPTED)
  public Map<String, String> recover(
      @Valid @RequestBody AccountRequests.Recovery r, HttpServletRequest request) {
    limiter.check("recovery", request.getRemoteAddr());
    recovery.request(r.identificador());
    return Map.of(
        "mensagem",
        "Se houver uma conta cadastrada, enviaremos as instruções para o e-mail informado no"
            + " cadastro.");
  }

  /** Aplica nova senha para código válido e de uso único. */
  @PostMapping("/auth/redefinir-senha")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void reset(@Valid @RequestBody AccountRequests.Reset r, HttpServletRequest request) {
    limiter.check("reset", request.getRemoteAddr());
    recovery.reset(r);
  }
}
