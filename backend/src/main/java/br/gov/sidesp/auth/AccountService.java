package br.gov.sidesp.auth;

import br.gov.sidesp.security.Crypto;
import java.util.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Perfil do titular autenticado, sem identificadores de conta escolhidos pelo cliente. */
@Service
public class AccountService {
  private final JdbcTemplate db;
  private final AuthRepository accounts;
  private final Crypto crypto;
  private final PasswordEncoder passwords;

  /** Recebe banco e ferramentas já usadas no login. */
  public AccountService(
      JdbcTemplate db, AuthRepository accounts, Crypto crypto, PasswordEncoder passwords) {
    this.db = db;
    this.accounts = accounts;
    this.crypto = crypto;
    this.passwords = passwords;
  }

  /**
   * Consulta dados pessoais, contato e endereço; o CPF permanece irrecuperável e somente leitura.
   */
  public Map<String, Object> profile(int actor) {
    var account = accounts.account(actor).orElseThrow(ApiException::unauthorized);
    var result =
        db.queryForMap(
            "SELECT pes_nome AS nome,pes_nome_social AS nomeSocial,pes_data_nascimento AS"
                + " dataNascimento,pes_sexo AS genero FROM pessoas WHERE pes_id=?",
            account.person());
    byte[] email =
        db.queryForObject(
            "SELECT con_email_criptografado FROM contas WHERE con_id=?", byte[].class, actor);
    result.put("email", crypto.decryptEmail(email));
    result.put("perfil", account.role());
    result.put("cpfProtegido", true);
    result.put(
        "telefones",
        db.queryForList(
            "SELECT cnt_des FROM contatos WHERE pes_id=? AND tct_id=(SELECT tct_id FROM"
                + " tipos_contatos WHERE tct_des='TELEFONE')",
            String.class,
            account.person()));
    result.put(
        "enderecos",
        db.queryForList(
            "SELECT end_cep AS cep,end_rua AS rua,end_numero AS numero,end_complemento AS"
                + " complemento,end_bairro AS bairro,end_cidade AS cidade,end_uf AS uf FROM"
                + " enderecos WHERE pes_id=?",
            account.person()));
    return result;
  }

  /** Atualiza campos permitidos e mantém documentos e nível de acesso intactos. */
  @Transactional
  public void update(int actor, AccountRequests.Profile r) {
    lock(actor);
    var account = accounts.account(actor).orElseThrow(ApiException::unauthorized);
    Rules.address(r.endereco());
    String phone = Rules.phone(r.telefone(), "telefone");
    String email = Rules.email(r.email());
    if (email.getBytes(java.nio.charset.StandardCharsets.UTF_8).length > 254)
      throw ApiException.invalid("email", "E-mail muito longo.");
    db.update(
        "UPDATE pessoas SET pes_nome=?,pes_nome_social=? WHERE pes_id=?",
        r.nome().strip(),
        r.nomeSocial(),
        account.person());
    db.update(
        "UPDATE contas SET con_email_criptografado=?,con_email_hash=? WHERE con_id=?",
        crypto.encryptEmail(email),
        crypto.emailHash(email),
        actor);
    db.update(
        "DELETE FROM contatos WHERE pes_id=? AND tct_id=(SELECT tct_id FROM tipos_contatos WHERE"
            + " tct_des='TELEFONE')",
        account.person());
    accounts.contact(account.person(), null, phone);
    db.update("DELETE FROM enderecos WHERE pes_id=?", account.person());
    accounts.address(account.person(), r.endereco());
    // Um link solicitado antes da troca de e-mail deixa de permitir a recuperação da conta.
    db.update("DELETE FROM recuperacoes_senha WHERE con_id=?", actor);
  }

  /** Confere senha atual e revoga tokens e links de recuperação após a troca. */
  @Transactional
  public void password(int actor, AccountRequests.Password r) {
    lock(actor);
    var account = accounts.account(actor).orElseThrow(ApiException::unauthorized);
    if (!passwords.matches(r.senhaAtual(), account.password()))
      throw ApiException.invalid("senhaAtual", "Senha atual inválida.");
    Rules.password(r.novaSenha(), r.confirmacaoSenha());
    db.update(
        "UPDATE contas SET con_senha_hash=?,con_versao=con_versao+1 WHERE con_id=?",
        passwords.encode(r.novaSenha()),
        actor);
    db.update("DELETE FROM recuperacoes_senha WHERE con_id=?", actor);
  }

  /** Serializa alterações de credenciais e recuperação da mesma conta. */
  private void lock(int actor) {
    db.queryForList("SELECT con_id FROM contas WHERE con_id=? FOR UPDATE", actor);
  }
}
