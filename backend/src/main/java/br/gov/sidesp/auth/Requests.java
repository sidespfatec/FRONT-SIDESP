package br.gov.sidesp.auth;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

/**
 * DTOs imutáveis deentrada. Bean Validation exige campos/tamanhos; regras entre campos ficam no
 * Service.
 */
public final class Requests {
  /** Impede instanciar o agrupador de DTOs; os records definem os campos aceitos no JSON. */
  private Requests() {}

  public record Person(
      @NotBlank @Size(max = 150) String nome,
      @Size(max = 14) String cpf,
      @NotNull LocalDate dataNascimento,
      @NotBlank @Pattern(regexp = "[MF]") String genero,
      @NotBlank @Size(max = 20) String telefone) {}

  public record Address(
      @NotBlank @Size(max = 9) String cep,
      @NotBlank @Size(max = 50) String rua,
      @NotBlank @Size(max = 8) String numero,
      @Size(max = 100) String complemento,
      @NotBlank @Size(max = 40) String bairro,
      @NotBlank @Size(max = 30) String cidade,
      @NotBlank @Size(max = 2) String uf) {}

  public record Credentials(
      @NotBlank @Email @Size(max = 254) String email,
      @NotNull String senha,
      @NotNull String confirmacaoSenha,
      @NotBlank @Size(max = 14) String cpfLogin) {
    /**
     * Oculta conteúdo sensível quando o DTO é convertido para texto durante depuração; não muda sua
     * serialização JSON.
     */
    @Override
    public String toString() {
      return "Credentials[REDACTED]";
    }
  }

  public record Guardian(
      @NotBlank @Size(max = 80) String nome,
      @NotBlank @Size(max = 14) String cpf,
      @NotNull LocalDate dataNascimento,
      @NotBlank @Size(max = 20) String telefone,
      @NotBlank @Size(max = 50) String parentesco) {}

  public record Registration(
      @NotNull @Valid Person dadosPessoais,
      @NotNull @Valid Address endereco,
      @NotNull @Valid Credentials credenciais,
      @Valid Guardian responsavel) {
    /**
     * Oculta conteúdo sensível quando o DTO é convertido para texto durante depuração; não muda sua
     * serialização JSON.
     */
    @Override
    public String toString() {
      return "Registration[REDACTED]";
    }
  }

  public record Login(
      @NotBlank @Size(max = 254) String identificador, @NotNull @Size(max = 256) String senha) {
    /**
     * Oculta conteúdo sensível quando o DTO é convertido para texto durante depuração; não muda sua
     * serialização JSON.
     */
    @Override
    public String toString() {
      return "Login[REDACTED]";
    }
  }
}
