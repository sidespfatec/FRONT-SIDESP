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

  @org.springframework.test.context.bean.override.mockito.MockitoBean
  org.springframework.mail.javamail.JavaMailSender mail;

  /**
   * Limpa somente as tabelas de autenticação do banco de teste antes de cada caso, respeitando as
   * FKs.
   */
  @BeforeEach
  void reset() {
    for (String table :
        List.of(
            "recuperacoes_senha",
            "profissionais",
            "fichas_medicas",
            "turmas_horarios",
            "turmas_professores",
            "turmas_pessoas",
            "turmas",
            "modalidades",
            "responsaveis_dependentes",
            "enderecos",
            "polos",
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
    assertThat(flyway.info().applied()).hasSize(4);
    assertThat(flyway.migrate().migrationsExecuted).isZero();
    assertThat(
            db.queryForObject(
                "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=DATABASE() AND"
                    + " table_type='BASE TABLE'",
                Integer.class))
        .isEqualTo(36);
    assertThat(http.getForEntity("/api/v1/auth/me", JsonNode.class).getStatusCode())
        .isEqualTo(HttpStatus.UNAUTHORIZED);
    assertThat(http.getForEntity("/api/v1/admin/qualquer", JsonNode.class).getStatusCode())
        .isEqualTo(HttpStatus.UNAUTHORIZED);
  }

  /** Cria conta sintética e ajusta o perfil diretamente no banco exclusivo do teste. */
  String roleToken(int seed, String role) {
    assertThat(register(adult(seed)).getStatusCode()).isEqualTo(HttpStatus.CREATED);
    db.update(
        "UPDATE pessoas p JOIN contas c ON c.pes_id=p.pes_id SET p.tpc_id=(SELECT tpc_id FROM"
            + " tipos_cadastros WHERE tpc_des=?) WHERE c.con_email_hash=?",
        role,
        crypto.emailHash(seed + "@example.invalid"));
    return login(seed + "@example.invalid", "abcdefgh").getBody().get("accessToken").asText();
  }

  /** Executa chamada autenticada a qualquer endpoint do teste. */
  ResponseEntity<JsonNode> call(String path, HttpMethod method, Object body, String token) {
    var headers = new HttpHeaders();
    headers.setBearerAuth(token);
    return http.exchange("/api/v1" + path, method, new HttpEntity<>(body, headers), JsonNode.class);
  }

  /** Confere a matriz de permissão de cadastro por todos os perfis. */
  @Test
  void accessProfiles() {
    int seed = 710000100;
    for (String role :
        List.of(
            "ALUNO", "RESPONSAVEL", "PROFESSOR", "ADMINISTRADOR_PARCIAL", "ADMINISTRADOR_TOTAL")) {
      String token = roleToken(seed++, role);
      assertThat(
              call("/admin/administradores", HttpMethod.GET, null, token).getStatusCode().value())
          .isEqualTo(role.equals("ADMINISTRADOR_TOTAL") ? 200 : 403);
      assertThat(call("/admin/professores", HttpMethod.GET, null, token).getStatusCode().value())
          .isEqualTo(role.startsWith("ADMINISTRADOR_") ? 200 : 403);
    }
  }

  /** Cadastra profissionais, recusa CPF duplicado e impede inativar a própria conta. */
  @Test
  void professionalRegistration() {
    String token = roleToken(710000110, "ADMINISTRADOR_TOTAL");
    var body = json.createObjectNode();
    body.set("cadastro", adult(710000111));
    body.put("nivel", "ADMINISTRADOR_PARCIAL");
    var created = call("/admin/administradores", HttpMethod.POST, body, token);
    assertThat(created.getStatusCode().value()).isEqualTo(201);
    assertThat(login("710000111@example.invalid", "abcdefgh").getBody().get("perfil").asText())
        .isEqualTo("ADMINISTRADOR_PARCIAL");
    assertThat(call("/admin/administradores", HttpMethod.POST, body, token).getStatusCode().value())
        .isEqualTo(409);
    body.remove("nivel");
    body.set("cadastro", adult(710000112));
    body.put("registro", "CREF teste");
    body.put("especialidade", "Natação");
    assertThat(call("/admin/professores", HttpMethod.POST, body, token).getStatusCode().value())
        .isEqualTo(201);
    assertThat(count("turmas_professores")).isZero();
    int own =
        db.queryForObject(
            "SELECT pes_id FROM contas WHERE con_email_hash=?",
            Integer.class,
            crypto.emailHash("710000110@example.invalid"));
    assertThat(
            call(
                    "/admin/administradores/" + own + "/situacao",
                    HttpMethod.PATCH,
                    Map.of("ativo", false),
                    token)
                .getStatusCode()
                .value())
        .isEqualTo(400);
  }

  /** Verifica coordenadas, idade, vínculo de polo e exclusão lógica na oferta. */
  @Test
  void hubAndModality() {
    String token = roleToken(710000120, "ADMINISTRADOR_PARCIAL");
    var hub =
        json.createObjectNode()
            .put("nome", "Polo de teste")
            .put("latitude", -22.8)
            .put("longitude", -45.1);
    hub.set("endereco", adult(710000121).get("endereco"));
    int id = call("/admin/polos", HttpMethod.POST, hub, token).getBody().get("id").asInt();
    var modality =
        Map.of(
            "nome",
            "Natação",
            "idadeMinima",
            8,
            "idadeMaxima",
            18,
            "limiteFaltasMensais",
            3,
            "poloId",
            id);
    assertThat(call("/admin/modalidades", HttpMethod.POST, modality, token).getStatusCode().value())
        .isEqualTo(201);
    assertThat(
            call(
                    "/admin/modalidades",
                    HttpMethod.POST,
                    Map.of(
                        "nome",
                        "Inválida",
                        "idadeMinima",
                        20,
                        "idadeMaxima",
                        8,
                        "limiteFaltasMensais",
                        3,
                        "poloId",
                        id),
                    token)
                .getStatusCode()
                .value())
        .isEqualTo(400);
    assertThat(
            call(
                    "/admin/polos/" + id + "/situacao",
                    HttpMethod.PATCH,
                    Map.of("ativo", false),
                    token)
                .getStatusCode()
                .value())
        .isEqualTo(204);
    assertThat(call("/admin/modalidades?ativo=true", HttpMethod.GET, null, token).getBody())
        .isEmpty();
    assertThat(call("/admin/modalidades", HttpMethod.POST, modality, token).getStatusCode().value())
        .isEqualTo(400);
    assertThat(count("polos")).isEqualTo(1);
  }

  /** Perfil não aceita CPF nem nível de acesso; senha antiga e JWT deixam de funcionar. */
  @Test
  void profileAndPassword() {
    String token = roleToken(710000130, "ALUNO");
    var body =
        json.createObjectNode()
            .put("nome", "Nome atualizado")
            .put("email", "novo@example.invalid")
            .put("telefone", "12999999999");
    body.set("endereco", adult(710000130).get("endereco"));
    assertThat(call("/perfil", HttpMethod.PUT, body, token).getStatusCode().value()).isEqualTo(204);
    assertThat(call("/perfil", HttpMethod.GET, null, token).getBody().get("email").asText())
        .isEqualTo("novo@example.invalid");
    body.put("cpf", "12345678900");
    assertThat(call("/perfil", HttpMethod.PUT, body, token).getStatusCode().value()).isEqualTo(400);
    assertThat(
            call(
                    "/perfil/senha",
                    HttpMethod.POST,
                    Map.of(
                        "senhaAtual",
                        "incorreta",
                        "novaSenha",
                        "novasenha",
                        "confirmacaoSenha",
                        "novasenha"),
                    token)
                .getStatusCode()
                .value())
        .isEqualTo(400);
    assertThat(
            call(
                    "/perfil/senha",
                    HttpMethod.POST,
                    Map.of(
                        "senhaAtual",
                        "abcdefgh",
                        "novaSenha",
                        "novasenha",
                        "confirmacaoSenha",
                        "novasenha"),
                    token)
                .getStatusCode()
                .value())
        .isEqualTo(204);
    assertThat(me(token).getStatusCode().value()).isEqualTo(401);
    assertThat(login("novo@example.invalid", "abcdefgh").getStatusCode().value()).isEqualTo(401);
    assertThat(login("novo@example.invalid", "novasenha").getStatusCode().value()).isEqualTo(200);
  }

  /** Recuperação não enumera contas, envia código e permite apenas um consumo. */
  @Test
  void passwordRecovery() {
    String token = roleToken(710000140, "ALUNO");
    var absent =
        http.postForEntity(
            "/api/v1/auth/recuperar-senha",
            Map.of("identificador", "ausente@example.invalid"),
            JsonNode.class);
    var present =
        http.postForEntity(
            "/api/v1/auth/recuperar-senha",
            Map.of("identificador", "710000140@example.invalid"),
            JsonNode.class);
    assertThat(present.getStatusCode().value()).isEqualTo(202);
    assertThat(present.getBody()).isEqualTo(absent.getBody());
    var captured =
        org.mockito.ArgumentCaptor.forClass(org.springframework.mail.SimpleMailMessage.class);
    org.mockito.Mockito.verify(mail, org.mockito.Mockito.timeout(10000)).send(captured.capture());
    String text = captured.getValue().getText();
    String code = text.substring(text.indexOf(": ") + 2, text.indexOf("\n"));
    var reset = Map.of("token", code, "novaSenha", "recuperada", "confirmacaoSenha", "recuperada");
    db.update("UPDATE recuperacoes_senha SET rec_expira_em=DATE_SUB(NOW(),INTERVAL 1 MINUTE)");
    assertThat(
            http.postForEntity("/api/v1/auth/redefinir-senha", reset, JsonNode.class)
                .getStatusCode()
                .value())
        .isEqualTo(400);
    db.update("UPDATE recuperacoes_senha SET rec_expira_em=DATE_ADD(NOW(),INTERVAL 5 MINUTE)");
    assertThat(
            http.postForEntity("/api/v1/auth/redefinir-senha", reset, JsonNode.class)
                .getStatusCode()
                .value())
        .isEqualTo(204);
    assertThat(
            http.postForEntity("/api/v1/auth/redefinir-senha", reset, JsonNode.class)
                .getStatusCode()
                .value())
        .isEqualTo(400);
    assertThat(me(token).getStatusCode().value()).isEqualTo(401);
    assertThat(login("710000140@example.invalid", "recuperada").getStatusCode().value())
        .isEqualTo(200);
  }

  /** Cadastra dependente autenticado, cifra a ficha e bloqueia professor sem vínculo. */
  @Test
  void childAndMedicalPrivacy() {
    String owner = roleToken(710000150, "RESPONSAVEL");
    var body = json.createObjectNode();
    var person = adult(710000151).get("dadosPessoais").deepCopy();
    ((ObjectNode) person).put("dataNascimento", "2015-01-01").putNull("cpf");
    body.set("dadosPessoais", person);
    body.set("endereco", adult(710000151).get("endereco"));
    body.put("parentesco", "Mãe");
    body.putObject("fichaMedica")
        .put("condicoes", "Asma sintética")
        .put("contatoEmergencia", "Contato de teste")
        .put("telefoneEmergencia", "12999999999");
    var created = call("/responsavel/dependentes", HttpMethod.POST, body, owner);
    assertThat(created.getStatusCode().value()).isEqualTo(201);
    int id = created.getBody().get("id").asInt();
    assertThat(
            new String(
                db.queryForObject(
                    "SELECT fim_condicoes FROM fichas_medicas WHERE pes_id=?", byte[].class, id)))
        .doesNotContain("Asma");
    String teacher = roleToken(710000152, "PROFESSOR");
    assertThat(call("/fichas-medicas/" + id, HttpMethod.GET, null, teacher).getStatusCode().value())
        .isEqualTo(403);
    String admin = roleToken(710000153, "ADMINISTRADOR_TOTAL");
    assertThat(
            call("/fichas-medicas/" + id, HttpMethod.GET, null, admin)
                .getBody()
                .get("condicoes")
                .asText())
        .isEqualTo("Asma sintética");
    assertThat(me(owner).getBody().get("dependentes")).hasSize(1);
  }
}
