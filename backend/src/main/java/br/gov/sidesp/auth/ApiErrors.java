package br.gov.sidesp.auth;

import java.util.*;
import org.slf4j.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

/** Tratamento HTTP central de erros, sem divulgar dados sensíveis. */
@RestControllerAdvice
public class ApiErrors {
  private static final Logger log = LoggerFactory.getLogger(ApiErrors.class);

  public record Error(String codigo, String mensagem, Map<String, String> errosCampos) {}

  /** Converte erro de negócio em status e envelope JSON, incluindo campo quando disponível. */
  @ExceptionHandler(ApiException.class)
  ResponseEntity<Error> api(ApiException e) {
    return ResponseEntity.status(e.status)
        .body(
            new Error(
                e.code,
                e.getMessage(),
                e.field == null ? Map.of() : Map.of(e.field, e.getMessage())));
  }

  /**
   * Transforma violações Bean Validation em erros por campo sem reproduzir os valores pessoais
   * enviados.
   */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  ResponseEntity<Error> validation(MethodArgumentNotValidException e) {
    Map<String, String> fields = new TreeMap<>();
    for (org.springframework.validation.FieldError field : e.getBindingResult().getFieldErrors()) {
      fields.put(field.getField(), "Confira o preenchimento deste campo.");
    }
    return ResponseEntity.badRequest()
        .body(new Error("VALIDACAO", "Confira os campos informados.", fields));
  }

  /**
   * Devolve400 para JSON inválido, campos desconhecidos ou datas impossíveis, sem detalhes
   * internos.
   */
  @ExceptionHandler(HttpMessageNotReadableException.class)
  ResponseEntity<Error> malformed() {
    return ResponseEntity.badRequest()
        .body(
            new Error(
                "VALIDACAO", "Dados inválidos. Confira as datas e os campos enviados.", Map.of()));
  }

  /**
   * Converte violação de integridade/UNICIDADE do banco em409 genérico; concorrência nunca deixa
   * CPF duplicado.
   */
  @ExceptionHandler(DataIntegrityViolationException.class)
  ResponseEntity<Error> integrity() {
    return api(ApiException.conflict());
  }

  /**
   * Registra apenas referência e tipo do erro; devolve500 genérico sem stacktrace, credenciais ou
   * corpo da requisição.
   */
  @ExceptionHandler(Exception.class)
  ResponseEntity<Error> unexpected(Exception e) {
    String id = UUID.randomUUID().toString();
    log.error("Falha operacional {}; tipo {}", id, e.getClass().getSimpleName());
    return ResponseEntity.status(500)
        .body(new Error("ERRO_INTERNO", "Não foi possível concluir. Referência: " + id, Map.of()));
  }
}
