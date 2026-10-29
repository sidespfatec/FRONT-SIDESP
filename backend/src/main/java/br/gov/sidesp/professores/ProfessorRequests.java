
package br.gov.sidesp.professores;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ProfessorRequests {

    public record Cadastro(
        @NotBlank
        @Size(max = 150)
        String nome,

        @NotBlank
        String cpf,

        @NotNull
        @Past
        LocalDate dataNascimento,

        @NotBlank
        @Pattern(regexp = "M|F")
        String sexo,

        @NotBlank
        String telefone,

        @NotBlank
        @Size(max = 50)
        String registroProfissional,

        @NotBlank
        @Size(max = 100)
        String especialidade
    ) {}
}
