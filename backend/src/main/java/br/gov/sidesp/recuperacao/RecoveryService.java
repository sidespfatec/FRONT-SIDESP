
package br.gov.sidesp.recuperacao;

import br.gov.sidesp.perfil.AccountRequests;
import br.gov.sidesp.auth.*;
import br.gov.sidesp.security.Crypto;

import java.nio.charset.StandardCharsets;
import java.security.*;
import java.sql.Timestamp;
import java.time.Clock;
import java.util.*;
import org.slf4j.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

/** Recuperação de senha e primeiro acesso por e-mail. */
@Service
public class RecoveryService {
  private static final Logger log = LoggerFactory.getLogger(RecoveryService.class);

  private static final String RECUPERACAO = "RECUPERACAO";
  private static final String PRIMEIRO_ACESSO = "PRIMEIRO_ACESSO";

  private final JdbcTemplate db;
  private final AuthRepository accounts;
  private final Crypto crypto;
  private final JavaMailSender mail;
  private final PasswordEncoder passwords;
  private final Clock clock;
  private final TransactionTemplate transaction;
  private final String from;

  public RecoveryService(
      JdbcTemplate db,
      AuthRepository accounts,
      Crypto crypto,
      JavaMailSender mail,
      PasswordEncoder passwords,
      Clock clock,
      TransactionTemplate transaction,
      @Value("${sidesp.mail-from}") String from) {
    this.db = db;
    this.accounts = accounts;
    this.crypto = crypto;
    this.mail = mail;
    this.passwords = passwords;
    this.clock = clock;
    this.transaction = transaction;
    this.from = from;
  }

  /** Solicita recuperação de senha para uma conta ativa. */
  @Async("recoveryExecutor")
  public void request(String identifier) {
    try {
      Optional<AuthRepository.Account> found;

      if (identifier.contains("@")) {
        found = accounts.accountByEmail(crypto.emailHash(Rules.email(identifier)));
      } else {
        found = accounts.accountByCpf(
            crypto.cpfHash(Rules.cpf(identifier, "identificador")));
      }

      if (found.isEmpty() || !found.get().active()) return;

      var account = found.get();
      String token = generateToken();

      String email =
          transaction.execute(
              status -> {
                db.queryForList(
                    "SELECT con_id FROM contas WHERE con_id=? FOR UPDATE",
                    account.id());

                var current = accounts.account(account.id());

                if (current.isEmpty() || !current.get().active()) return null;

                db.update(
                    "DELETE FROM recuperacoes_senha WHERE con_id=? OR rec_expira_em<?",
                    account.id(),
                    Timestamp.from(clock.instant()));

                db.update(
                    """
                    INSERT INTO recuperacoes_senha
                    (rec_hash, con_id, rec_expira_em, rec_finalidade)
                    VALUES (?, ?, ?, ?)
                    """,
                    hash(token),
                    account.id(),
                    Timestamp.from(clock.instant().plusSeconds(900)),
                    RECUPERACAO);

                return crypto.decryptEmail(
                    db.queryForObject(
                        "SELECT con_email_criptografado FROM contas WHERE con_id=?",
                        byte[].class,
                        account.id()));
              });

      if (email == null) return;

      sendEmail(
          email,
          "Recuperação de senha — SIDESP",
          "Seu código de recuperação é: "
              + token
              + "\n\n"
              + "Válido por 15 minutos e para um único uso. "
              + "Se não solicitou, ignore esta mensagem.");

    } catch (ApiException e) {
      // Identificador inválido recebe o mesmo retorno de uma conta não cadastrada.
    } catch (Exception e) {
      log.error(
          "Não foi possível processar uma recuperação de senha; tipo {}",
          e.getClass().getSimpleName());
    }
  }

  /** Gera e envia o convite de primeiro acesso para uma conta inativa. */
  @Async("recoveryExecutor")
  public void sendFirstAccess(int accountId) {
    try {
      String token = generateToken();

      String email =
          transaction.execute(
              status -> {
                db.queryForList(
                    "SELECT con_id FROM contas WHERE con_id=? FOR UPDATE",
                    accountId);

                var current = accounts.account(accountId);

                if (current.isEmpty() || current.get().active()) return null;

                db.update(
                    "DELETE FROM recuperacoes_senha WHERE con_id=? OR rec_expira_em<?",
                    accountId,
                    Timestamp.from(clock.instant()));

                db.update(
                    """
                    INSERT INTO recuperacoes_senha
                    (rec_hash, con_id, rec_expira_em, rec_finalidade)
                    VALUES (?, ?, ?, ?)
                    """,
                    hash(token),
                    accountId,
                    Timestamp.from(clock.instant().plusSeconds(900)),
                    PRIMEIRO_ACESSO);

                return crypto.decryptEmail(
                    db.queryForObject(
                        "SELECT con_email_criptografado FROM contas WHERE con_id=?",
                        byte[].class,
                        accountId));
              });

      if (email == null) return;

      sendEmail(
          email,
          "Primeiro acesso — SIDESP",
          "Seu cadastro como professor foi realizado no SIDESP.\n\n"
              + "Seu código para definir a primeira senha é: "
              + token
              + "\n\n"
              + "O código é válido por 15 minutos e pode ser utilizado uma única vez."
              + "\n"
              + "Se você não esperava este convite, entre em contato com a administração.");

    } catch (Exception e) {
      log.error(
          "Não foi possível enviar o primeiro acesso; tipo {}",
          e.getClass().getSimpleName());
    }
  }

  /** Consome um token de recuperação e altera a senha de uma conta ativa. */
  public void reset(AccountRequests.Reset r) {
    Rules.password(r.novaSenha(), r.confirmacaoSenha());

    byte[] digest = hash(r.token());
    String password = passwords.encode(r.novaSenha());

    transaction.executeWithoutResult(
        status -> {
          var ids =
              db.queryForList(
                  """
                  SELECT con_id
                  FROM recuperacoes_senha
                  WHERE rec_hash=? AND rec_finalidade=?
                  """,
                  Integer.class,
                  digest,
                  RECUPERACAO);

          if (ids.isEmpty()) throw invalid();

          int id = ids.get(0);

          db.queryForList(
              "SELECT con_id FROM contas WHERE con_id=? FOR UPDATE",
              id);

          var account = accounts.account(id);

          if (account.isEmpty() || !account.get().active()) throw invalid();

          int used =
              db.update(
                  """
                  UPDATE recuperacoes_senha
                  SET rec_usado_em=?
                  WHERE rec_hash=?
                    AND rec_finalidade=?
                    AND rec_usado_em IS NULL
                    AND rec_expira_em>?
                  """,
                  Timestamp.from(clock.instant()),
                  digest,
                  RECUPERACAO,
                  Timestamp.from(clock.instant()));

          if (used != 1) throw invalid();

          db.update(
              """
              UPDATE contas
              SET con_senha_hash=?, con_versao=con_versao+1
              WHERE con_id=?
              """,
              password,
              id);

          db.update(
              "DELETE FROM recuperacoes_senha WHERE con_id=?",
              id);
        });
  }

  /** Define a primeira senha e ativa uma conta de professor pré-cadastrada. */
  public void activateFirstAccess(AccountRequests.Reset r) {
    Rules.password(r.novaSenha(), r.confirmacaoSenha());

    byte[] digest = hash(r.token());
    String password = passwords.encode(r.novaSenha());

    transaction.executeWithoutResult(
        status -> {
          var ids =
              db.queryForList(
                  """
                  SELECT con_id
                  FROM recuperacoes_senha
                  WHERE rec_hash=? AND rec_finalidade=?
                  """,
                  Integer.class,
                  digest,
                  PRIMEIRO_ACESSO);

          if (ids.isEmpty()) throw invalid();

          int id = ids.get(0);

          db.queryForList(
              "SELECT con_id FROM contas WHERE con_id=? FOR UPDATE",
              id);

          var account = accounts.account(id);

          if (account.isEmpty() || account.get().active()) throw invalid();

          int used =
              db.update(
                  """
                  UPDATE recuperacoes_senha
                  SET rec_usado_em=?
                  WHERE rec_hash=?
                    AND rec_finalidade=?
                    AND rec_usado_em IS NULL
                    AND rec_expira_em>?
                  """,
                  Timestamp.from(clock.instant()),
                  digest,
                  PRIMEIRO_ACESSO,
                  Timestamp.from(clock.instant()));

          if (used != 1) throw invalid();

          int activated =
              db.update(
                  """
                  UPDATE contas
                  SET con_senha_hash=?,
                      con_ativo=TRUE,
                      con_versao=con_versao+1
                  WHERE con_id=? AND con_ativo=FALSE
                  """,
                  password,
                  id);

          if (activated != 1) throw invalid();

          db.update(
              "DELETE FROM recuperacoes_senha WHERE con_id=?",
              id);
        });
  }

  /** Envia a mensagem sem expor o token em logs ou respostas HTTP. */
  private void sendEmail(String email, String subject, String content) {
    var message = new SimpleMailMessage();
    message.setFrom(from);
    message.setTo(email);
    message.setSubject(subject);
    message.setText(content);
    mail.send(message);
  }

  /** Gera um segredo aleatório de 256 bits. */
  private String generateToken() {
    byte[] bytes = new byte[32];
    new SecureRandom().nextBytes(bytes);

    return Base64.getUrlEncoder()
        .withoutPadding()
        .encodeToString(bytes);
  }

  /** Armazena somente o hash do token. */
  private byte[] hash(String token) {
    try {
      return MessageDigest.getInstance("SHA-256")
          .digest(token.getBytes(StandardCharsets.UTF_8));
    } catch (NoSuchAlgorithmException e) {
      throw new IllegalStateException(e);
    }
  }

  private ApiException invalid() {
    return ApiException.invalid("token", "Código inválido ou expirado.");
  }
}
