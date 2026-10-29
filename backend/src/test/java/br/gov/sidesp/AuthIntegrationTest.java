package br.gov.sidesp;

import static org.assertj.core.api.Assertions.*;

import br.gov.sidesp.security.*;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.node.*;
import java.time.*;
import java.util.*;
import java.util.concurrent.*;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

/** Testes reais de HTTP/Flyway/banco, habilitados apenas com TEST_DB_URL contendo sidesp_test. */
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    properties = {"sidesp.login-limit=1000", "sidesp.registration-limit=1000"})
@EnabledIfEnvironmentVariable(named = "TEST_DB_URL", matches = ".*sidesp_test.*")
class AuthIntegrationTest {
  /**
   * Configura conexão exclusivamente com sidesp_test e chaves sintéticas diferentes usadas somente
   * nos testes.
   */
  @DynamicPropertySource
  static void properties(DynamicPropertyRegistry r) {
    r.add("spring.datasource.url", () -> System.getenv("TEST_DB_URL"));
    r.add(
        "spring.datasource.username",
        () -> System.getenv().getOrDefault("TEST_DB_USERNAME", "root"));
    r.add("spring.datasource.password", () -> System.getenv().getOrDefault("TEST_DB_PASSWORD", ""));
    r.add("sidesp.cpf-key", () -> key(1));
    r.add("sidesp.email-hmac-key", () -> key(2));
    r.add("sidesp.email-encryption-key", () -> key(3));
    r.add("sidesp.jwt-key", () -> key(4));
  }

  /** Gera chave determinística fictícia de 32 bytes para teste; não usar em configuração real. */
  static String key(int n) {
    byte[] b = new byte[32];
    Arrays.fill(b, (byte) n);
    return Base64.getEncoder().encodeToString(b);
  }

  @Autowired TestRestTemplate http;
  @Autowired JdbcTemplate db;
  @Autowired ObjectMapper json;
  @Autowired Crypto crypto;
  @Autowired JwtEncoder encoder;
  @Autowired Flyway flyway;

  /**
   * Limpa somente as tabelas de autenticação do banco de teste antes de cada caso, respeitando as
   * FKs.
   */
  @BeforeEach
  void reset() {
    for (String table :
        List.of(
            "responsaveis_dependentes",
            "enderecos",
            "contatos",
            "contas",
            "documentos",
            "responsaveis",
            "pessoas")) db.update("DELETE FROM " + table);
  }

  /**
   * Monta cadastro adulto sintético com CPF calculado, e-mail example.invalid e senha de oito
   * letras.
   */
  ObjectNode adult(int seed) {
    var r = json.createObjectNode();
    r.putObject("dadosPessoais")
        .put("nome", "Aluno de Teste")
        .put("cpf", RulesTest.cpf(seed))
        .put("dataNascimento", "2000-01-01")
        .put("genero", "M")
        .put("telefone", "12999999999");
    r.putObject("endereco")
        .put("cep", "12500000")
        .put("rua", "Rua de Teste")
        .put("numero", "1")
        .put("bairro", "Bairro")
        .put("cidade", "Guaratingueta")
        .put("uf", "SP");
    r.putObject("credenciais")
        .put("email", seed + "@example.invalid")
        .put("senha", "abcdefgh")
        .put("confirmacaoSenha", "abcdefgh")
        .put("cpfLogin", RulesTest.cpf(seed));
    return r;
  }

  /**
   * Adapta cadastro sintético para menor sem CPF e acrescenta responsável adulto titular das
   * credenciais.
   */
  ObjectNode child(int seed, int guardian) {
    var r = adult(seed);
    ((ObjectNode) r.get("dadosPessoais")).put("dataNascimento", "2015-01-01").putNull("cpf");
    r.putObject("responsavel")
        .put("nome", "Responsavel de Teste")
        .put("cpf", RulesTest.cpf(guardian))
        .put("dataNascimento", "1980-01-01")
        .put("telefone", "12988888888")
        .put("parentesco", "Pai");
    ((ObjectNode) r.get("credenciais"))
        .put("cpfLogin", RulesTest.cpf(guardian))
        .put("email", guardian + "@example.invalid");
    return r;
  }

  /** Envia POST real de cadastro ao servidor Spring iniciado na suíte e devolve a resposta HTTP. */
  ResponseEntity<JsonNode> register(ObjectNode body) {
    return http.postForEntity("/api/v1/auth/cadastros", body, JsonNode.class);
  }

  /** Envia POST real com identificador/senha para exercitar a autenticação completa. */
  ResponseEntity<JsonNode> login(String identifier, String password) {
    return http.postForEntity(
        "/api/v1/auth/login",
        Map.of("identificador", identifier, "senha", password),
        JsonNode.class);
  }

  /** Envia GET protegido com Bearer para verificar identidade e vínculos retornados pela API. */
  ResponseEntity<JsonNode> me(String token) {
    var h = new HttpHeaders();
    h.setBearerAuth(token);
    return http.exchange("/api/v1/auth/me", HttpMethod.GET, new HttpEntity<>(h), JsonNode.class);
  }

  /**
   * Conta linhas de tabela fixa de teste para detectar cadastro parcial ou duplicado; tabela nunca
   * vem de HTTP.
   */
  int count(String table) {
    return db.queryForObject("SELECT COUNT(*) FROM " + table, Integer.class);
  }

  /** Verifica cadastro adulto201, login por CPF/e-mail e identidade/perfil autenticados. */
  @Test
  void fullAdultCpfAndEmailLogin() {
    var r = adult(700000101);
    assertThat(register(r).getStatusCode()).isEqualTo(HttpStatus.CREATED);
    for (String id : List.of(RulesTest.cpf(700000101), "700000101@EXAMPLE.INVALID")) {
      var result = login(id, "abcdefgh");
      assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
      assertThat(result.getBody().get("expiresIn").asInt()).isEqualTo(1800);
      assertThat(me(result.getBody().get("accessToken").asText()).getBody().get("perfil").asText())
          .isEqualTo("ALUNO");
    }
  }

  /** Confirma recusa de senha curta e de confirmação diferente, sem inserir pessoas. */
  @Test
  void weakAndDifferentPasswords() {
    var r = adult(700000102);
    ((ObjectNode) r.get("credenciais")).put("senha", "abcdefg").put("confirmacaoSenha", "abcdefg");
    assertThat(register(r).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    assertThat(count("pessoas")).isZero();
    ((ObjectNode) r.get("credenciais")).put("senha", "abcdefgh");
    assertThat(register(r).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
  }

  /** Confirma recusa de CPF repetido, dígito incorreto e ausência de CPF do adulto. */
  @Test
  void repeatedInvalidAndMissingCpf() {
    for (String cpf : List.of("11111111111", "12345678900", "")) {
      var r = adult(700000103);
      ((ObjectNode) r.get("dadosPessoais")).put("cpf", cpf);
      assertThat(register(r).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }
    assertThat(count("pessoas")).isZero();
  }

  /** Confirma409 para CPF oue-mail já usado e preservação de apenas um cadastro. */
  @Test
  void duplicateCpfAndEmail() {
    var r = adult(700000104);
    assertThat(register(r).getStatusCode()).isEqualTo(HttpStatus.CREATED);
    assertThat(register(r).getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
    var other = adult(700000105);
    ((ObjectNode) other.get("credenciais")).put("email", "700000104@example.invalid");
    assertThat(register(other).getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
    assertThat(count("pessoas")).isEqualTo(1);
  }

  /** Confirma400 para nascimento futuro e data de calendário impossível, sem gravação parcial. */
  @Test
  void futureAndImpossibleBirthdates() {
    var r = adult(700000106);
    ((ObjectNode) r.get("dadosPessoais"))
        .put(
            "dataNascimento", LocalDate.now(ZoneId.of("America/Sao_Paulo")).plusDays(1).toString());
    assertThat(register(r).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    ((ObjectNode) r.get("dadosPessoais")).put("dataNascimento", "2025-02-30");
    assertThat(register(r).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    assertThat(count("pessoas")).isZero();
  }

  /**
   * Confirma que menor sem responsável ou com responsável menor é recusado; responsável adulto
   * funciona.
   */
  @Test
  void minorRequiresAdultGuardian() {
    var r = child(700000107, 700000108);
    r.remove("responsavel");
    assertThat(register(r).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    r = child(700000107, 700000108);
    ((ObjectNode) r.get("responsavel")).put("dataNascimento", "2015-01-01");
    assertThat(register(r).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    assertThat(count("pessoas")).isZero();
  }

  /**
   * Verifica dois dependentes em uma só conta e recusa terceiro com senha diferente, sem criar
   * pessoa extra.
   */
  @Test
  void twoChildrenOneResponsibleWithCredentialProof() {
    var r = child(700000109, 700000110);
    assertThat(register(r).getStatusCode()).isEqualTo(HttpStatus.CREATED);
    var r2 = child(700000111, 700000110);
    assertThat(register(r2).getStatusCode()).isEqualTo(HttpStatus.CREATED);
    assertThat(count("contas")).isEqualTo(1);
    assertThat(count("responsaveis")).isEqualTo(1);
    assertThat(count("pessoas")).isEqualTo(3);
    var token = login(RulesTest.cpf(700000110), "abcdefgh").getBody().get("accessToken").asText();
    assertThat(me(token).getBody().get("dependentes").size()).isEqualTo(2);
    var r3 = child(700000112, 700000110);
    ((ObjectNode) r3.get("credenciais"))
        .put("senha", "different")
        .put("confirmacaoSenha", "different");
    assertThat(register(r3).getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
    assertThat(count("pessoas")).isEqualTo(3);
  }

  /**
   * Força duplicidade no CPF do filho após iniciar criação do responsável e confirma rollback de
   * todo cadastro.
   */
  @Test
  void rollbackWhenChildCpfAlreadyExists() {
    assertThat(register(adult(700000113)).getStatusCode()).isEqualTo(HttpStatus.CREATED);
    var r = child(700000114, 700000115);
    ((ObjectNode) r.get("dadosPessoais")).put("cpf", RulesTest.cpf(700000113));
    assertThat(register(r).getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
    assertThat(count("pessoas")).isEqualTo(1);
    assertThat(count("contas")).isEqualTo(1);
    assertThat(count("responsaveis")).isZero();
  }

  /** Recusa e-mail ausente e campo deperfil administrativo enviado ao cadastro público. */
  @Test
  void emailRequiredAndNoPrivilegeInjection() {
    var r = adult(700000116);
    ((ObjectNode) r.get("credenciais")).remove("email");
    assertThat(register(r).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    r = adult(700000116);
    r.put("perfil", "ADMINISTRADOR_TOTAL");
    assertThat(register(r).getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    assertThat(count("pessoas")).isZero();
  }

  /** Confirma que a pessoa que completa18 anos hoje pode cadastrar conta própria. */
  @Test
  void birthOnEighteenthBirthdayIsAdult() {
    var r = adult(700000117);
    ((ObjectNode) r.get("dadosPessoais"))
        .put(
            "dataNascimento",
            LocalDate.now(ZoneId.of("America/Sao_Paulo")).minusYears(18).toString());
    assertThat(register(r).getStatusCode()).isEqualTo(HttpStatus.CREATED);
  }

  /**
   * Compara erro de conta inexistente/senha errada e verifica token adulterado/expirado e conta
   * inativada.
   */
  @Test
  void loginGenericInactivityAndTokens() {
    assertThat(register(adult(700000118)).getStatusCode()).isEqualTo(HttpStatus.CREATED);
    var wrong = login(RulesTest.cpf(700000118), "wrongpass");
    var absent = login(RulesTest.cpf(700000119), "wrongpass");
    assertThat(wrong.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    assertThat(wrong.getBody()).isEqualTo(absent.getBody());
    var logged = login(RulesTest.cpf(700000118), "abcdefgh");
    String token = logged.getBody().get("accessToken").asText();
    assertThat(me(token).getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(me(token.substring(0, token.lastIndexOf('.') + 1) + "invalid").getStatusCode())
        .isEqualTo(HttpStatus.UNAUTHORIZED);
    String id = db.queryForObject("SELECT con_id FROM contas", String.class);
    var claims =
        JwtClaimsSet.builder()
            .subject(id)
            .issuer("sidesp")
            .audience(List.of("sidesp-web"))
            .issuedAt(Instant.now().minusSeconds(3600))
            .expiresAt(Instant.now().minusSeconds(1))
            .build();
    var expired =
        encoder
            .encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims))
            .getTokenValue();
    assertThat(me(expired).getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    db.update("UPDATE contas SET con_ativo=FALSE");
    assertThat(me(token).getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    assertThat(login(RulesTest.cpf(700000118), "abcdefgh").getBody()).isEqualTo(wrong.getBody());
  }

  /**
   * Confere hash Argon2, e-mail cifrado, CPFprotegido, um CPF por pessoa, múltiplos RG permitidos e
   * catálogo CPF imutável.
   */
  @Test
  void databaseSecrecyAndSelectiveCpfConstraints() {
    assertThat(register(adult(700000120)).getStatusCode()).isEqualTo(HttpStatus.CREATED);
    int person = db.queryForObject("SELECT pes_id FROM contas", Integer.class);
    String hash = db.queryForObject("SELECT con_senha_hash FROM contas", String.class);
    assertThat(hash).startsWith("$argon2id$").doesNotContain("abcdefgh");
    assertThat(db.queryForObject("SELECT doc_des FROM documentos", String.class))
        .isEqualTo("CPF protegido");
    assertThat(db.queryForObject("SELECT con_email_criptografado FROM contas", byte[].class))
        .isNotEqualTo("700000120@example.invalid".getBytes());
    assertThatThrownBy(
            () ->
                db.update(
                    "INSERT INTO documentos(pes_id,tpd_id,doc_des,doc_cpf_hash) VALUES(?,1,'CPF"
                        + " protegido',?)",
                    person,
                    crypto.cpfHash(RulesTest.cpf(700000121))))
        .isInstanceOf(org.springframework.dao.DataAccessException.class);
    db.update(
        "INSERT INTO documentos(pes_id,tpd_id,doc_des) VALUES(?,2,'RG teste 1'),(?,2,'RG teste 2')",
        person,
        person);
    assertThatThrownBy(
            () ->
                db.update(
                    "INSERT INTO documentos(pes_id,tpd_id,doc_des) VALUES(?,1,'texto')", person))
        .isInstanceOf(org.springframework.dao.DataAccessException.class);
    assertThatThrownBy(
            () -> db.update("UPDATE tipos_documentos SET tpd_des='OUTRO' WHERE tpd_des='CPF'"))
        .isInstanceOf(org.springframework.dao.DataAccessException.class);
  }

  /**
   * Dispara dois cadastros simultâneos iguais: espera um201 e um409, com apenas uma pessoa/conta.
   */
  @Test
  void concurrentCpfUnique() throws Exception {
    var body = adult(700000122);
    var pool = Executors.newFixedThreadPool(2);
    try {
      var start = new CountDownLatch(1);
      Callable<HttpStatusCode> task =
          () -> {
            start.await();
            return register(body.deepCopy()).getStatusCode();
          };
      var a = pool.submit(task);
      var b = pool.submit(task);
      start.countDown();
      assertThat(List.of(a.get(), b.get()))
          .containsExactlyInAnyOrder(HttpStatus.CREATED, HttpStatus.CONFLICT);
      assertThat(count("pessoas")).isEqualTo(1);
      assertThat(count("contas")).isEqualTo(1);
    } finally {
      pool.shutdownNow();
    }
  }

  /**
   * Confirma três migrations,32 tabelas+histórico, repetição sem novas DDL e recusa de acesso HTTP
   * nãoautenticado.
   */
  @Test
  void migrationsCompleteAndRepeatSafe() {
    assertThat(flyway.info().applied()).hasSize(3);
    assertThat(flyway.migrate().migrationsExecuted).isZero();
    assertThat(
            db.queryForObject(
                "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=DATABASE() AND"
                    + " table_type='BASE TABLE'",
                Integer.class))
        .isEqualTo(33);
    assertThat(http.getForEntity("/api/v1/auth/me", JsonNode.class).getStatusCode())
        .isEqualTo(HttpStatus.UNAUTHORIZED);
    assertThat(http.getForEntity("/api/v1/admin/qualquer", JsonNode.class).getStatusCode())
        .isEqualTo(HttpStatus.UNAUTHORIZED);
  }
}
