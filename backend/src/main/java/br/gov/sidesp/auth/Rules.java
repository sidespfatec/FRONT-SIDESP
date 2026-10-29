package br.gov.sidesp.auth;

import java.time.Clock;
import java.time.LocalDate;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Pattern;

/** Funções pequenas de validação sem acesso ao banco, facilmente testadas com datas fixas. */
public final class Rules {
  /** Impede criar instâncias: esta classe agrupa somente funções estáticas de validação. */
  private Rules() {}

  /**
   * Aceita CPF de11 dígitos ou máscara estrita, confere ambos dígitos verificadores e devolve
   * apenas os números.
   */
  public static String cpf(String input, String field) {
    if (input == null
        || !Pattern.matches("(?:[0-9]{11}|[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}-[0-9]{2})", input)) {
      throw ApiException.invalid(field, "Informe um CPF válido.");
    }
    String digits = input.replace(".", "").replace("-", "");
    boolean allEqual = true;
    for (int index = 1; index < digits.length(); index++) {
      if (digits.charAt(index) != digits.charAt(0)) {
        allEqual = false;
        break;
      }
    }
    if (allEqual) {
      throw ApiException.invalid(field, "Informe um CPF válido.");
    }
    for (int size = 9; size <= 10; size++) {
      int sum = 0;
      for (int index = 0; index < size; index++) {
        sum += (digits.charAt(index) - '0') * (size + 1 - index);
      }
      int expected = (sum * 10) % 11;
      if (expected == 10) {
        expected = 0;
      }
      if (expected != digits.charAt(size) - '0') {
        throw ApiException.invalid(field, "Informe um CPF válido.");
      }
    }
    return digits;
  }

  /**
   * Valida nascimento do aluno usando o relógio injetado e informa se ainda não completou18 anos.
   */
  public static boolean minor(LocalDate birth, Clock clock) {
    return minor(birth, clock, "dadosPessoais.dataNascimento");
  }

  /**
   * Valida nascimento no campo indicado, rejeitando futuro/idade implausível e respeitando
   * aniversário e29/02.
   */
  public static boolean minor(LocalDate birth, Clock clock, String field) {
    LocalDate today = LocalDate.now(clock);
    if (birth == null || birth.isAfter(today)) {
      throw ApiException.invalid(field, "Nascimento não pode ser posterior à data atual.");
    }
    if (birth.isBefore(today.minusYears(130))) {
      throw ApiException.invalid(field, "Confira a data de nascimento.");
    }
    return birth.plusYears(18).isAfter(today);
  }

  /**
   * Normaliza e-mail para pesquisa consistente. Formato/obrigatoriedade são verificados pelas
   * anotações do DTO.
   */
  public static String email(String value) {
    return value.strip().toLowerCase(Locale.ROOT);
  }

  /**
   * Aceita telefone com máscara simples e10 ou11 dígitos incluindo DDD; retorna somente dígitos.
   */
  public static String phone(String value, String field) {
    if (value == null || !value.matches("[0-9() +\\-]{10,20}")) {
      throw ApiException.invalid(field, "Informe telefone com DDD.");
    }
    String digits = value.replaceAll("[^0-9]", "");
    if (digits.length() != 10 && digits.length() != 11) {
      throw ApiException.invalid(field, "Informe telefone com DDD.");
    }
    return digits;
  }

  /**
   * Exige8 a128 pontos de código Unicode e confirmação idêntica, sem exigir símbolos/números ou
   * remover espaços.
   */
  public static void password(String password, String confirmation) {
    if (password == null) {
      throw ApiException.invalid("credenciais.senha", "A senha deve ter de 8 a 128 caracteres.");
    }
    int length = password.codePointCount(0, password.length());
    if (length < 8 || length > 128) {
      throw ApiException.invalid("credenciais.senha", "A senha deve ter de 8 a 128 caracteres.");
    }
    if (!password.equals(confirmation)) {
      throw ApiException.invalid("credenciais.confirmacaoSenha", "As senhas não coincidem.");
    }
  }

  /**
   * Confere CEP com8 dígitos e UF brasileira; os demais campos já passaram pela validação dos DTOs.
   */
  public static void address(Requests.Address address) {
    if (!address.cep().matches("[0-9]{5}-?[0-9]{3}")) {
      throw ApiException.invalid("endereco.cep", "Informe CEP válido.");
    }
    Set<String> states =
        Set.of(
            "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
            "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO");
    if (!states.contains(address.uf().toUpperCase(Locale.ROOT))) {
      throw ApiException.invalid("endereco.uf", "Selecione uma UF válida.");
    }
  }
}
