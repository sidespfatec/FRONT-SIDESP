package br.gov.sidesp.security;

import br.gov.sidesp.auth.AuthRepository;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Clock;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtIssuerValidator;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.InvalidBearerTokenException;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/** Configura senha, JWT e acesso HTTP; o frontend nunca decide sozinho a autorização. */
@Configuration
public class SecurityConfig {
  /**
   * Cria o codificador Argon2id: salt 16 bytes, hash 32 bytes, paralelismo 1, memória 19 Mi B e
   * duas iterações.
   */
  @Bean
  PasswordEncoder passwordEncoder() {
    return new Argon2PasswordEncoder(16, 32, 1, 19456, 2);
  }

  /**
   * Cria o assinador JWT com chave externa Base64 de 32 bytes; a chave não vai para o navegador.
   */
  @Bean
  JwtEncoder jwtEncoder(@Value("${sidesp.jwt-key}") String key) {
    SecretKeySpec secret = new SecretKeySpec(Crypto.key(key), "HmacSHA256");
    return new NimbusJwtEncoder(new ImmutableSecret<>(secret));
  }

  /**
   * Aceita apenas assinatura HS256 válida, emissor SIDESP, audiência do frontend e datas válidas.
   */
  @Bean
  JwtDecoder jwtDecoder(@Value("${sidesp.jwt-key}") String key, Clock clock) {
    SecretKeySpec secret = new SecretKeySpec(Crypto.key(key), "HmacSHA256");
    NimbusJwtDecoder decoder =
        NimbusJwtDecoder.withSecretKey(secret).macAlgorithm(MacAlgorithm.HS256).build();
    decoder.setJwtValidator(
        new DelegatingOAuth2TokenValidator<Jwt>(
            new JwtIssuerValidator("sidesp"),
            token -> validateTokenDates(token, clock),
            this::validateAudience));
    return decoder;
  }

  /** Rejeita token sem expiração/emissão, expirado ou emitido mais de 30 s no futuro. */
  private OAuth2TokenValidatorResult validateTokenDates(Jwt token, Clock clock) {
    if (token.getExpiresAt() == null || !token.getExpiresAt().isAfter(clock.instant())) {
      return invalidToken();
    }
    if (token.getIssuedAt() == null
        || token.getIssuedAt().isAfter(clock.instant().plusSeconds(30))) {
      return invalidToken();
    }
    return OAuth2TokenValidatorResult.success();
  }

  /** Garante que o JWT foi emitido para sidesp-web, impedindo aceitar token de outra aplicação. */
  private OAuth2TokenValidatorResult validateAudience(Jwt token) {
    if (!token.getAudience().contains("sidesp-web")) {
      return invalidToken();
    }
    return OAuth2TokenValidatorResult.success();
  }

  /** Produz resultado genérico de validação JWT, sem divulgar o motivo específico ao cliente. */
  private OAuth2TokenValidatorResult invalidToken() {
    return OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token"));
  }

  /**
   * Define endpoints públicos, sessão stateless, JWT e erros JSON. Demais APIs ainda não
   * implementadas são negadas.
   */
  @Bean
  SecurityFilterChain security(HttpSecurity http, AuthRepository repository) throws Exception {
    // A autenticação usa Bearer manual, sem cookies de sessão; CSRF é desabilitado somente nesse
    // modelo.
    http.csrf(csrf -> csrf.disable());
    http.cors(cors -> {});
    http.sessionManagement(
        session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
    http.authorizeHttpRequests(
        access ->
            access
                .requestMatchers("/api/v1/auth/login", "/api/v1/auth/cadastros", "/api/v1/health")
                .permitAll()
                .requestMatchers("/api/v1/auth/me")
                .authenticated()
                .anyRequest()
                .denyAll());
    http.oauth2ResourceServer(
        resource ->
            resource
                .jwt(
                    jwt ->
                        jwt.jwtAuthenticationConverter(
                            token -> authenticateToken(token, repository)))
                .authenticationEntryPoint(
                    (request, response, exception) ->
                        writeError(response, 401, "AUTENTICACAO", "Faça login novamente.")));
    http.exceptionHandling(
        errors ->
            errors
                .authenticationEntryPoint(
                    (request, response, exception) ->
                        writeError(response, 401, "AUTENTICACAO", "Faça login novamente."))
                .accessDeniedHandler(
                    (request, response, exception) ->
                        writeError(response, 403, "ACESSO_NEGADO", "Acesso não autorizado.")));
    return http.build();
  }

  /**
   * Consulta atividade/perfil atual da conta em CADA acesso; inativar conta bloqueia até tokens já
   * emitidos.
   */
  private UsernamePasswordAuthenticationToken authenticateToken(
      Jwt token, AuthRepository repository) {
    try {
      int accountId = Integer.parseInt(token.getSubject());
      Optional<AuthRepository.Account> found = repository.account(accountId);
      if (found.isEmpty() || !found.get().active()) {
        throw new InvalidBearerTokenException("Token inválido");
      }
      AuthRepository.Account account = found.get();
      SimpleGrantedAuthority role = new SimpleGrantedAuthority("ROLE_" + account.role());
      return new UsernamePasswordAuthenticationToken(account.id(), null, List.of(role));
    } catch (RuntimeException exception) {
      throw new InvalidBearerTokenException("Token inválido");
    }
  }

  /**
   * Escreve envelope JSON para erros da camada de segurança, que ocorrem antes do Controller
   * Advice.
   */
  private static void writeError(
      HttpServletResponse response, int status, String code, String message) throws IOException {
    response.setStatus(status);
    response.setContentType("application/json;charset=UTF-8");
    // Código/mensagem são constantes internas acima, nunca entrada fornecida pelo usuário.
    response
        .getWriter()
        .write("{\"codigo\":\"" + code + "\",\"mensagem\":\"" + message + "\",\"errosCampos\":{}}");
  }

  /**
   * Permite apenas origens configuradas, métodos da API e cabeçalhos necessários; não permite
   * cookie cross-origin.
   */
  @Bean
  CorsConfigurationSource cors(@Value("${sidesp.cors-origins}") String origins) {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(origins.split(",")));
    configuration.setAllowedMethods(List.of("GET", "POST", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    configuration.setAllowCredentials(false);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/api/**", configuration);
    return source;
  }
}
