package br.gov.sidesp.auth;

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

/** Recuperação por e-mail com segredo aleatório, prazo curto e consumo único. */
@Service
public class RecoveryService {
  private static final Logger log = LoggerFactory.getLogger(RecoveryService.class);
  private final JdbcTemplate db;
  private final AuthRepository accounts;
  private final Crypto crypto;
  private final JavaMailSender mail;
  private final PasswordEncoder passwords;
  private final Clock clock;
  private final TransactionTemplate transaction;
  private final String from;

  /** Usa SMTP externo; nenhum link ou token é retornado ao navegador ou escrito em log. */
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

  /** Executa fora da resposta HTTP para não revelar a existência da conta pelo envio SMTP. */
  @Async("recoveryExecutor")
  public void request(String identifier) {
    try {
      Optional<AuthRepository.Account> found;
      if (identifier.contains("@"))
        found = accounts.accountByEmail(crypto.emailHash(Rules.email(identifier)));
      else found = accounts.accountByCpf(crypto.cpfHash(Rules.cpf(identifier, "identificador")));
      if (found.isEmpty() || !found.get().active()) return;
      var account = found.get();
      byte[] bytes = new byte[32];
      new SecureRandom().nextBytes(bytes);
      String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
      String email =
          transaction.execute(
              status -> {
                db.queryForList(
                    "SELECT con_id FROM contas WHERE con_id=? FOR UPDATE", account.id());
                if (!accounts.account(account.id()).orElseThrow().active()) return null;
                db.update(
                    "DELETE FROM recuperacoes_senha WHERE con_id=? OR rec_expira_em<?",
                    account.id(),
                    Timestamp.from(clock.instant()));
                db.update(
                    "INSERT INTO recuperacoes_senha(rec_hash,con_id,rec_expira_em) VALUES(?,?,?)",
                    hash(token),
                    account.id(),
                    Timestamp.from(clock.instant().plusSeconds(900)));
                return crypto.decryptEmail(
                    db.queryForObject(
                        "SELECT con_email_criptografado FROM contas WHERE con_id=?",
                        byte[].class,
                        account.id()));
              });
      if (email == null) return;
      var message = new SimpleMailMessage();
      message.setFrom(from);
      message.setTo(email);
      message.setSubject("Recuperação de senha — SIDESP");
      message.setText(
          "Seu código de recuperação é: "
              + token
              + "\n"
              + "Válido por 15 minutos e para um único uso. Se não solicitou, ignore esta"
              + " mensagem.");
      mail.send(message);
    } catch (ApiException e) {
      // Identificador inválido recebe o mesmo retorno de uma conta não cadastrada.
    } catch (Exception e) {
      log.error(
          "Não foi possível processar uma recuperação de senha; tipo {}",
          e.getClass().getSimpleName());
    }
  }

  /** Consome o token sob trava da conta e invalida todas as sessões anteriores. */
  public void reset(AccountRequests.Reset r) {
    Rules.password(r.novaSenha(), r.confirmacaoSenha());
    byte[] digest = hash(r.token());
    String password = passwords.encode(r.novaSenha());
    transaction.executeWithoutResult(
        status -> {
          var ids =
              db.queryForList(
                  "SELECT con_id FROM recuperacoes_senha WHERE rec_hash=?", Integer.class, digest);
          if (ids.isEmpty()) throw invalid();
          int id = ids.get(0);
          db.queryForList("SELECT con_id FROM contas WHERE con_id=? FOR UPDATE", id);
          int used =
              db.update(
                  "UPDATE recuperacoes_senha SET rec_usado_em=? WHERE rec_hash=? AND rec_usado_em"
                      + " IS NULL AND rec_expira_em>?",
                  Timestamp.from(clock.instant()),
                  digest,
                  Timestamp.from(clock.instant()));
          if (used != 1 || !accounts.account(id).orElseThrow().active()) throw invalid();
          db.update(
              "UPDATE contas SET con_senha_hash=?,con_versao=con_versao+1 WHERE con_id=?",
              password,
              id);
          db.update("DELETE FROM recuperacoes_senha WHERE con_id=?", id);
        });
  }

  /** Resume o token para pesquisa sem armazenar o segredo de acesso. */
  private byte[] hash(String token) {
    try {
      return MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8));
    } catch (NoSuchAlgorithmException e) {
      throw new IllegalStateException(e);
    }
  }

  /** Mantém a mesma mensagem para código inexistente, expirado ou já usado. */
  private ApiException invalid() {
    return ApiException.invalid("token", "Código inválido ou expirado.");
  }
}
