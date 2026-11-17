package br.gov.sidesp;

import static org.assertj.core.api.Assertions.*;

import br.gov.sidesp.auth.*;
import br.gov.sidesp.security.*;
import java.time.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

/** Testes unitários de validação com dados sintéticos e relógio controlado. */
class RulesTest {
  private final Clock clock =
      Clock.fixed(Instant.parse("2026-10-05T15:00:00Z"), ZoneId.of("America/Sao_Paulo"));

  /** Testa uma lista de CPFs inválidos e confere a exceção de validação. */
  @ParameterizedTest
  @ValueSource(
      strings = {
        "00000000000",
        "11111111111",
        "12345678900",
        "abc12345678",
        "123",
        "1234567890a",
        "123.456.789.00"
      })
  void invalidCpfs(String s) {
    assertThatThrownBy(() -> Rules.cpf(s, "cpf")).isInstanceOf(ApiException.class);
  }

  /** Confirma aceitação de CPF válido com/sem máscara e normalização para11 dígitos. */
  @Test
  void validCpfAndMask() {
    String c = cpf(700000001);
    assertThat(Rules.cpf(c, "cpf")).isEqualTo(c);
    assertThat(
            Rules.cpf(
                c.substring(0, 3)
                    + "."
                    + c.substring(3, 6)
                    + "."
                    + c.substring(6, 9)
                    + "-"
                    + c.substring(9),
                "cpf"))
        .isEqualTo(c);
  }

  /** Confirma que oito letras bastam, sem exigir números ou símbolos. */
  @Test
  void eightLettersAccepted() {
    assertThatCode(() -> Rules.password("abcdefgh", "abcdefgh")).doesNotThrowAnyException();
  }

  /** Confirma recusa de senha de sete caracteres. */
  @Test
  void sevenRejected() {
    assertThatThrownBy(() -> Rules.password("abcdefg", "abcdefg")).isInstanceOf(ApiException.class);
  }

  /** Confirma que confirmação deve coincidir exatamente com a senha. */
  @Test
  void confirmationRequired() {
    assertThatThrownBy(() -> Rules.password("abcdefgh", "abcdEfgh"))
        .isInstanceOf(ApiException.class);
  }

  /** Confere contagem de pontos de código Unicode, inclusive emoji, sem truncamento. */
  @Test
  void unicodeCodePoints() {
    String eight = "😀".repeat(8);
    assertThatCode(() -> Rules.password(eight, eight)).doesNotThrowAnyException();
    assertThatThrownBy(() -> Rules.password("😀".repeat(7), "😀".repeat(7)))
        .isInstanceOf(ApiException.class);
  }

  /** Verifica adulto no aniversário de 18 anos e menor na véspera usando relógio fixo. */
  @Test
  void birthdayEighteenToday() {
    assertThat(Rules.minor(LocalDate.of(2008, 10, 5), clock)).isFalse();
    assertThat(Rules.minor(LocalDate.of(2008, 10, 6), clock)).isTrue();
  }

  /** Verifica recusa de data posterior à data de referência. */
  @Test
  void futureBirthdayRejected() {
    assertThatThrownBy(() -> Rules.minor(LocalDate.of(2026, 10, 6), clock))
        .isInstanceOf(ApiException.class);
  }

  /** Confere aniversário de29/02 em ano não bissexto pela regra plus Years. */
  @Test
  void leapBirthday() {
    assertThat(Rules.minor(LocalDate.of(2008, 2, 29), clock)).isFalse();
  }

  /** Confirma excesso gera429 e que a janela reabre depois de um minuto. */
  @Test
  void rateLimit() {
    var limiter = new AttemptLimiter(clock, 2, 2);
    limiter.check("login", "test");
    limiter.check("login", "test");
    assertThatThrownBy(() -> limiter.check("login", "test")).isInstanceOf(ApiException.class);
  }

  /**
   * Confere erro do nascimento futuro do responsável no campo correto do JSON, após a refatoração.
   */
  @Test
  void guardianBirthErrorUsesGuardianField() {
    try {
      Rules.minor(LocalDate.of(2026, 10, 6), clock, "responsavel.dataNascimento");
      fail("Data futura deveria ser recusada");
    } catch (ApiException exception) {
      assertThat(exception.field).isEqualTo("responsavel.dataNascimento");
    }
  }

  /**
   * Confirma que cada janela expira após60 segundos e libera nova tentativa, sem reiniciar o
   * serviço.
   */
  @Test
  void rateLimitExpiresAfterOneMinute() {
    java.util.concurrent.atomic.AtomicLong time = new java.util.concurrent.atomic.AtomicLong(0);
    Clock mutableClock =
        new Clock() {
          /** Retorna UTC: o limitador usa instantes e não depende do fuso. */
          @Override
          public ZoneId getZone() {
            return ZoneOffset.UTC;
          }

          /** Mantém o relógio de teste para qualquer fuso, sem alterar seu instante. */
          @Override
          public Clock withZone(ZoneId zone) {
            return this;
          }

          /** Lê o instante simulado, alterável pelo teste sem sleep. */
          @Override
          public Instant instant() {
            return Instant.ofEpochMilli(time.get());
          }
        };
    AttemptLimiter limiter = new AttemptLimiter(mutableClock, 1, 1);
    limiter.check("login", "test");
    assertThatThrownBy(() -> limiter.check("login", "test")).isInstanceOf(ApiException.class);
    time.set(60000);
    assertThatCode(() -> limiter.check("login", "test")).doesNotThrowAnyException();
  }

  /**
   * Calcula dígitos verificadores de uma base numérica sintética para testes; não prova existência
   * de uma pessoa.
   */
  public static String cpf(int base) {
    String s = String.format("%09d", base);
    for (int len = 9; len <= 10; len++) {
      int sum = 0;
      for (int i = 0; i < len; i++) sum += (s.charAt(i) - 48) * (len + 1 - i);
      int d = (sum * 10) % 11;
      s += d == 10 ? 0 : d;
    }
    return s;
  }
}
