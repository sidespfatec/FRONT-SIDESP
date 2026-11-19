
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
import org.springframework.http.HttpMethod;
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

  @Bean
  PasswordEncoder passwordEncoder() {
    return new Argon2PasswordEncoder(16, 32, 1, 19456, 2);
  }

  @Bean
  JwtEncoder jwtEncoder(@Value("${sidesp.jwt-key}") String key) {
    SecretKeySpec secret = new SecretKeySpec(Crypto.key(key), "HmacSHA256");
    return new NimbusJwtEncoder(new ImmutableSecret<>(secret));
  }

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

  private OAuth2TokenValidatorResult validateAudience(Jwt token) {
    if (!token.getAudience().contains("sidesp-web")) {
      return invalidToken();
    }
    return OAuth2TokenValidatorResult.success();
  }

  private OAuth2TokenValidatorResult invalidToken() {
    return OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token"));
  }

  @Bean
  SecurityFilterChain security(HttpSecurity http, AuthRepository repository) throws Exception {
    http.csrf(csrf -> csrf.disable());
    http.cors(cors -> {});
    http.sessionManagement(
        session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

    http.authorizeHttpRequests(
        access ->
            access
                .requestMatchers(
                    "/api/v1/auth/login",
                    "/api/v1/auth/cadastros",
                    "/api/v1/health",
                    "/api/v1/auth/recuperar-senha",
                    "/api/v1/auth/redefinir-senha")
                .permitAll()

                // Consulta pública das notícias.
                .requestMatchers(HttpMethod.GET, "/api/v1/noticias")
                .permitAll()

                // Visualização pública das imagens das notícias.
                .requestMatchers(HttpMethod.GET, "/api/v1/noticias/imagens/**")
                .permitAll()

                .requestMatchers("/api/v1/admin/administradores/**")
                .hasRole("ADMINISTRADOR_TOTAL")
                .requestMatchers("/api/v1/admin/**")
                .hasAnyRole("ADMINISTRADOR_TOTAL", "ADMINISTRADOR_PARCIAL")
                .requestMatchers("/api/v1/fichas-medicas/**")
                .hasAnyRole("ADMINISTRADOR_TOTAL", "ADMINISTRADOR_PARCIAL", "PROFESSOR")
                .requestMatchers("/api/v1/auth/me", "/api/v1/perfil/**", "/api/v1/responsavel/**")
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

  private UsernamePasswordAuthenticationToken authenticateToken(
      Jwt token, AuthRepository repository) {
    try {
      int accountId = Integer.parseInt(token.getSubject());
      Optional<AuthRepository.Account> found = repository.account(accountId);
      if (found.isEmpty()
          || !found.get().active()
          || token.getClaim("versao") == null
          || ((Number) token.getClaim("versao")).intValue() != found.get().version()) {
        throw new InvalidBearerTokenException("Token inválido");
      }
      AuthRepository.Account account = found.get();
      SimpleGrantedAuthority role = new SimpleGrantedAuthority("ROLE_" + account.role());
      return new UsernamePasswordAuthenticationToken(account.id(), null, List.of(role));
    } catch (RuntimeException exception) {
      throw new InvalidBearerTokenException("Token inválido");
    }
  }

  private static void writeError(
      HttpServletResponse response, int status, String code, String message) throws IOException {
    response.setStatus(status);
    response.setContentType("application/json;charset=UTF-8");
    response
        .getWriter()
        .write("{\"codigo\":\"" + code + "\",\"mensagem\":\"" + message + "\",\"errosCampos\":{}}");
  }

  @Bean
  CorsConfigurationSource cors(@Value("${sidesp.cors-origins}") String origins) {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(origins.split(",")));
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    configuration.setAllowCredentials(false);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/api/**", configuration);
    return source;
  }
}
