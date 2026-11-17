package br.gov.sidesp;

import java.time.*;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

/** Ponto de entrada da aplicação e configuração do relógio de negócio. */
@SpringBootApplication
public class SidespApplication {
  /** Inicia o Spring Boot, que registra componentes e sobe a API HTTP. */
  public static void main(String[] args) {
    SpringApplication.run(SidespApplication.class, args);
  }

  /**
   * Define o relógio no fuso America/Sao_Paulo; testes podem controlar a data sem depender do
   * computador.
   */
  @Bean
  Clock clock() {
    return Clock.system(ZoneId.of("America/Sao_Paulo"));
  }
}
