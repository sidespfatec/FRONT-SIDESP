
package br.gov.sidesp.noticias;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

/** Dados recebidos para cadastrar uma noticia. */
public final class NoticiaRequests {

  private NoticiaRequests() {}

  public record Create(
      @NotBlank @Size(max = 100) String titulo,
      @NotBlank String conteudo,
      @NotNull LocalDateTime dataPublicacao) {}
}
