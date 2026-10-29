package br.gov.sidesp.auth;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

/** Contratos do perfil e de recuperação; nunca aceitam alteração de CPF ou de perfil de acesso. */
public final class AccountRequests {
  /** Agrupa os contratos da conta. */
  private AccountRequests() {}

  public record Profile(
      @NotBlank @Size(max = 150) String nome,
      @Size(max = 150) String nomeSocial,
      @NotBlank @Email @Size(max = 254) String email,
      @NotBlank @Size(max = 20) String telefone,
      @NotNull @Valid Requests.Address endereco) {}

  public record Password(
      @NotNull @Size(max = 256) String senhaAtual,
      @NotNull @Size(max = 256) String novaSenha,
      @NotNull @Size(max = 256) String confirmacaoSenha) {
    /** Oculta segredos em depuração. */
    @Override
    public String toString() {
      return "Password[REDACTED]";
    }
  }

  public record Recovery(@NotBlank @Size(max = 254) String identificador) {}

  public record Reset(
      @NotBlank @Size(max = 100) String token,
      @NotNull @Size(max = 256) String novaSenha,
      @NotNull @Size(max = 256) String confirmacaoSenha) {
    /** Oculta o token e as senhas em depuração. */
    @Override
    public String toString() {
      return "Reset[REDACTED]";
    }
  }
}
