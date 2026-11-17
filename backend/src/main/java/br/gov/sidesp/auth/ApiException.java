package br.gov.sidesp.auth;

import org.springframework.http.HttpStatus;

/** Erro de negócio com status e código para resposta controlada. */
public class ApiException extends RuntimeException {
  public final HttpStatus status;
  public final String code;
  public final String field;

  /** Guarda status HTTP, código e campo para comunicar falhas de negócio de modo controlado. */
  public ApiException(HttpStatus status, String code, String message, String field) {
    super(message);
    this.status = status;
    this.code = code;
    this.field = field;
  }

  /** Cria erro 400 de validação associado ao campo que precisa ser corrigido. */
  public static ApiException invalid(String field, String message) {
    return new ApiException(HttpStatus.BAD_REQUEST, "VALIDACAO", message, field);
  }

  /**
   * Cria erro 409 genérico para CPF/e-mail ocupado ou credenciais incorretas ao tentar vincular
   * novo dependente.
   */
  public static ApiException conflict() {
    return new ApiException(
        HttpStatus.CONFLICT,
        "CADASTRO_EXISTENTE",
        "CPF ou e-mail já cadastrado. Para outro dependente, use os dados de acesso do"
            + " responsável.",
        null);
  }

  /** Cria erro 401 idêntico para conta inexistente, inativa ou senha incorreta. */
  public static ApiException unauthorized() {
    return new ApiException(
        HttpStatus.UNAUTHORIZED, "CREDENCIAIS_INVALIDAS", "CPF/e-mail ou senha inválidos.", null);
  }
}
