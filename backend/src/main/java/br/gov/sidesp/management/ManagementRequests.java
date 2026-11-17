package br.gov.sidesp.management;

import br.gov.sidesp.auth.Requests;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

/** Entradas da Sprint 2. Campos desconhecidos são recusados pelo Jackson. */
public final class ManagementRequests {
  /** Agrupa contratos sem criar estado compartilhado. */
  private ManagementRequests() {}

  public record Professional(
      @NotNull @Valid Requests.Registration cadastro,
      @Pattern(regexp = "ADMINISTRADOR_TOTAL|ADMINISTRADOR_PARCIAL") String nivel,
      @Size(max = 20) String rg,
      @Size(max = 40) String registro,
      @Size(max = 150) String especialidade,
      @Size(max = 100) String cargo,
      @Size(max = 100) String unidade,
      @PastOrPresent LocalDate admissao) {
    /** Evita imprimir credenciais e documentos em depuração. */
    @Override
    public String toString() {
      return "Professional[REDACTED]";
    }
  }

  public record Hub(
      @NotBlank @Size(max = 100) String nome,
      @NotNull @Valid Requests.Address endereco,
      @NotNull @DecimalMin("-90") @DecimalMax("90") BigDecimal latitude,
      @NotNull @DecimalMin("-180") @DecimalMax("180") BigDecimal longitude) {}

  public record Modality(
      @NotBlank @Size(max = 100) String nome,
      @NotNull @Min(0) @Max(130) Integer idadeMinima,
      @NotNull @Min(0) @Max(130) Integer idadeMaxima,
      @NotNull @Min(0) @Max(31) Integer limiteFaltasMensais,
      @NotNull @Positive Integer poloId) {}

  public record Status(@NotNull Boolean ativo) {}

  public record Medical(
      @Size(max = 1000) String condicoes,
      @Size(max = 1000) String alergias,
      @Size(max = 1000) String medicamentos,
      @Size(max = 1000) String restricoes,
      @NotBlank @Size(max = 100) String contatoEmergencia,
      @NotBlank @Size(max = 20) String telefoneEmergencia) {
    /** Não inclui informações de saúde em logs acidentais. */
    @Override
    public String toString() {
      return "Medical[REDACTED]";
    }
  }

  public record Child(
      @NotNull @Valid Requests.Person dadosPessoais,
      @NotNull @Valid Requests.Address endereco,
      @NotBlank @Size(max = 50) String parentesco,
      @NotNull @Valid Medical fichaMedica) {}
}
