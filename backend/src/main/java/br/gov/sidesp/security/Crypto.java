package br.gov.sidesp.security;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.Mac;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/** Protege CPF e e-mail com bibliotecas padrão. Senhas usam o Password Encoder, não esta classe. */
@Component
public class Crypto {
  private final byte[] cpfKey;
  private final byte[] emailKey;
  private final byte[] aesKey;
  private final SecureRandom random = new SecureRandom();

  /**
   * Lê três chaves externas de 32 bytes e rejeita reutilização entre CPF, índice de e-mail e cifra.
   */
  public Crypto(
      @Value("${sidesp.cpf-key}") String cpf,
      @Value("${sidesp.email-hmac-key}") String email,
      @Value("${sidesp.email-encryption-key}") String aes) {
    cpfKey = key(cpf);
    emailKey = key(email);
    aesKey = key(aes);
    if (Arrays.equals(cpfKey, emailKey)
        || Arrays.equals(cpfKey, aesKey)
        || Arrays.equals(emailKey, aesKey)) {
      throw new IllegalArgumentException("Use chaves distintas.");
    }
  }

  /** Decodifica Base64 e exige exatamente 32 bytes; configuração inválida impede iniciar a API. */
  public static byte[] key(String value) {
    byte[] decoded = Base64.getDecoder().decode(value);
    if (decoded.length != 32) {
      throw new IllegalArgumentException("Cada chave deve conter 32 bytes em Base64.");
    }
    return decoded;
  }

  /**
   * Calcula HMAC do CPF normalizado. É irrecuperável e compatível com o formato armazenado desde
   * v0.3.
   */
  public byte[] cpfHash(String cpf) {
    return hmac(cpfKey, "cpf:" + cpf);
  }

  /**
   * Calcula índice HMAC do e-mail normalizado para pesquisar login/unicidade sem descriptografar.
   */
  public byte[] emailHash(String email) {
    return hmac(emailKey, "email:" + email);
  }

  /** Aplica HMAC-SHA-256 com a chave adequada e devolve32 bytes para o índice do banco. */
  private byte[] hmac(byte[] key, String text) {
    try {
      Mac algorithm = Mac.getInstance("HmacSHA256");
      algorithm.init(new SecretKeySpec(key, "HmacSHA256"));
      return algorithm.doFinal(text.getBytes(StandardCharsets.UTF_8));
    } catch (GeneralSecurityException exception) {
      throw new IllegalStateException("Falha criptográfica", exception);
    }
  }

  /**
   * Cifra e-mail com AES-GCM. Envelope: versão1, nonce 12 bytes e cifra com tag 128 bits; não
   * altera dados antigos.
   */
  public byte[] encryptEmail(String email) {
    try {
      byte[] nonce = new byte[12];
      random.nextBytes(nonce); // Nonce novo em cada cifra, mesmo quando o texto é igual.
      Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
      SecretKeySpec secret = new SecretKeySpec(aesKey, "AES");
      GCMParameterSpec parameters = new GCMParameterSpec(128, nonce);
      cipher.init(Cipher.ENCRYPT_MODE, secret, parameters);
      cipher.updateAAD("SIDESP:email:v1".getBytes(StandardCharsets.UTF_8));
      byte[] encrypted = cipher.doFinal(email.getBytes(StandardCharsets.UTF_8));

      ByteBuffer envelope = ByteBuffer.allocate(13 + encrypted.length);
      envelope.put((byte) 1); // Versão do formato, preservada para leitura futura.
      envelope.put(nonce);
      envelope.put(encrypted);
      if (envelope.capacity() > 512) {
        throw new IllegalArgumentException("E-mail excede limite criptográfico");
      }
      return envelope.array();
    } catch (GeneralSecurityException exception) {
      throw new IllegalStateException("Falha criptográfica", exception);
    }
  }
}
