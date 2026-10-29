package br.gov.sidesp.auth;

import java.util.concurrent.Executor;
import org.springframework.context.annotation.*;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

/** Fila limitada para que SMTP não retenha as requisições públicas. */
@Configuration
@EnableAsync
public class RecoveryConfig {
  /** Limita concorrência e memória; excesso de pedidos é descartado sem expor contas. */
  @Bean("recoveryExecutor")
  public Executor recoveryExecutor() {
    var executor = new ThreadPoolTaskExecutor();
    executor.setCorePoolSize(1);
    executor.setMaxPoolSize(2);
    executor.setQueueCapacity(100);
    executor.setThreadNamePrefix("recuperacao-");
    executor.setRejectedExecutionHandler(
        new java.util.concurrent.ThreadPoolExecutor.DiscardPolicy());
    executor.initialize();
    return executor;
  }
}
