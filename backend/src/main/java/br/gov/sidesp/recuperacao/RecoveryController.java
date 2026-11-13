package br.gov.sidesp.recuperacao;
import br.gov.sidesp.perfil.AccountRequests;
import br.gov.sidesp.security.AttemptLimiter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/** Solicitação e redefinição de senha sem revelar a existência da conta. */
@RestController
@RequestMapping("/api/v1")
public class RecoveryController {
  private final RecoveryService recovery;
  private final AttemptLimiter limiter;
  public RecoveryController(RecoveryService recovery, AttemptLimiter limiter) {
    this.recovery = recovery;
    this.limiter = limiter;
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
