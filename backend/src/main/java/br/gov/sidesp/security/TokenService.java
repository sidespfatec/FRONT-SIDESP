package br.gov.sidesp.security;

import br.gov.sidesp.auth.AuthRepository;
import java.time.*;
import java.util.*;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

/** Emissão da sessão JWT após login bem-sucedido. */
@Service
public class TokenService {
  private final JwtEncoder encoder;
  private final Clock clock;

  /** Recebe assinador JWT e relógio para emissão testável de sessões. */
  public TokenService(JwtEncoder encoder, Clock clock) {
    this.encoder = encoder;
    this.clock = clock;
  }

  public record LoginResult(
      String accessToken, String tokenType, long expiresIn, String perfil, String nome) {}

  /**
   * Emite JWT HS256 com validade 30 min, emissor/audiência/id da conta/perfil; CPF, e-mail e senha
   * ficam fora do token.
   */
  public LoginResult issue(AuthRepository.Account a) {
    Instant now = clock.instant();
    var claims =
        JwtClaimsSet.builder()
            .issuer("sidesp")
            .audience(List.of("sidesp-web"))
            .subject(Integer.toString(a.id()))
            .issuedAt(now)
            .expiresAt(now.plusSeconds(1800))
            .claim("perfil", a.role())
            .id(UUID.randomUUID().toString())
            .build();
    var header = JwsHeader.with(MacAlgorithm.HS256).build();
    return new LoginResult(
        encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue(),
        "Bearer",
        1800,
        a.role(),
        a.name());
  }
}
