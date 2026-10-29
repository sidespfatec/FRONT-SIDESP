package br.gov.sidesp.security;

import br.gov.sidesp.auth.ApiException;
import java.time.Clock;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

/**
 * Limita tentativas por IP em uma instância. Estado em memória é perdido ao reiniciar o serviço.
 */
@Component
public class AttemptLimiter {
  private final Clock clock;
  private final int loginLimit;
  private final int registrationLimit;
  private final Map<String, Window> windows = new LinkedHashMap<>();

  private record Window(long start, int count) {}

  /** Recebe relógio e limites configuráveis: padrão30 logins/20 cadastros por minuto e IP. */
  public AttemptLimiter(
      Clock clock,
      @Value("${sidesp.login-limit:30}") int loginLimit,
      @Value("${sidesp.registration-limit:20}") int registrationLimit) {
    this.clock = clock;
    this.loginLimit = loginLimit;
    this.registrationLimit = registrationLimit;
  }

  /**
   * Atualiza contador de forma sincronizada; rejeita excesso com429 e mantém no máximo 10000
   * janelas.
   */
  public synchronized void check(String operation, String ip) {
    long now = clock.millis();
    removeExpiredWindows(now);
    String key = operation + ":" + ip;
    Window window = windows.get(key);
    if (window == null) {
      window = new Window(now, 0);
    }
    int limit = registrationLimit;
    if (operation.equals("login")) {
      limit = loginLimit;
    }
    if (window.count() >= limit) {
      throw limitExceeded("Muitas tentativas. Aguarde um minuto.");
    }
    if (windows.size() >= 10000 && !windows.containsKey(key)) {
      throw limitExceeded("Aguarde um minuto.");
    }
    windows.put(key, new Window(window.start(), window.count() + 1));
  }

  /** Remove janelas de pelo menos 60 segundos usando Iterator, sem acumular IPs indefinidamente. */
  private void removeExpiredWindows(long now) {
    Iterator<Map.Entry<String, Window>> iterator = windows.entrySet().iterator();
    while (iterator.hasNext()) {
      Window window = iterator.next().getValue();
      if (now - window.start() >= 60000) {
        iterator.remove();
      }
    }
  }

  /** Monta erro HTTP429 padronizado, sem revelar contas ou identificadores. */
  private ApiException limitExceeded(String message) {
    return new ApiException(HttpStatus.TOO_MANY_REQUESTS, "LIMITE_TENTATIVAS", message, null);
  }
}
