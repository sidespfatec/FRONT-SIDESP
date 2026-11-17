package br.gov.sidesp;

import static org.assertj.core.api.Assertions.*;

import br.gov.sidesp.security.Crypto;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.Mac;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.junit.jupiter.api.Test;

/**
 * Testa compatibilidade criptográfica com o banco existente usando apenas chaves e e-mails
 * fictícios.
 */
class CryptoCompatibilityTest {
  /** Produz chave sintética de 32 bytes diferente por número; exclusiva desta suíte. */
  private String key(int value) {
    byte[] bytes = new byte[32];
    Arrays.fill(bytes, (byte) value);
    return Base64.getEncoder().encodeToString(bytes);
  }

  /**
   * Compara o hash CPF com o cálculo padrão e prefixo antigo, evitando quebrar logins após
   * atualização.
   */
  @Test
  void cpfHashRemainsCompatible() throws Exception {
    Crypto crypto = new Crypto(key(1), key(2), key(3));
    Mac standard = Mac.getInstance("HmacSHA256");
    standard.init(new SecretKeySpec(Base64.getDecoder().decode(key(1)), "HmacSHA256"));
    assertThat(crypto.cpfHash("70000000191"))
        .isEqualTo(standard.doFinal("cpf:70000000191".getBytes(StandardCharsets.UTF_8)));
  }

  /**
   * Decifra envelope versão1 com AES-GCM/AAD existentes e confirma nonce diferente para cifrar o
   * mesmoe-mail.
   */
  @Test
  void emailEnvelopeRemainsCompatible() throws Exception {
    Crypto crypto = new Crypto(key(1), key(2), key(3));
    String email = "teste@example.invalid";
    byte[] envelope = crypto.encryptEmail(email);
    assertThat(envelope[0]).isEqualTo((byte) 1);
    assertThat(envelope).isNotEqualTo(crypto.encryptEmail(email));
    Cipher standard = Cipher.getInstance("AES/GCM/NoPadding");
    standard.init(
        Cipher.DECRYPT_MODE,
        new SecretKeySpec(Base64.getDecoder().decode(key(3)), "AES"),
        new GCMParameterSpec(128, Arrays.copyOfRange(envelope, 1, 13)));
    standard.updateAAD("SIDESP:email:v1".getBytes(StandardCharsets.UTF_8));
    assertThat(
            new String(
                standard.doFinal(Arrays.copyOfRange(envelope, 13, envelope.length)),
                StandardCharsets.UTF_8))
        .isEqualTo(email);
  }

  /**
   * Rejeita chave curta ou repetida, impedindo iniciar com parâmetros inseguros de proteção dos
   * dados.
   */
  @Test
  void invalidOrRepeatedKeysAreRejected() {
    assertThatThrownBy(() -> Crypto.key(Base64.getEncoder().encodeToString(new byte[16])))
        .isInstanceOf(IllegalArgumentException.class);
    assertThatThrownBy(() -> new Crypto(key(1), key(1), key(3)))
        .isInstanceOf(IllegalArgumentException.class);
  }
}
