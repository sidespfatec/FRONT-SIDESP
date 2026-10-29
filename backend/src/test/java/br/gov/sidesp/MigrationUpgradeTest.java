package br.gov.sidesp;

import static org.assertj.core.api.Assertions.*;

import java.sql.*;
import java.util.UUID;
import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.MigrationVersion;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;

/** Confere atualização de V3 com dados já gravados, sem tocar no banco de desenvolvimento. */
@EnabledIfEnvironmentVariable(named = "TEST_DB_URL", matches = ".*sidesp_test.*")
class MigrationUpgradeTest {
  /** Cria banco exclusivo, aplica V3, insere responsável e confere preservação após V4. */
  @Test
  void upgradesPopulatedV3() throws Exception {
    String base = System.getenv("TEST_DB_URL").split("\\?")[0];
    String database = "sidesp_test_upgrade_" + UUID.randomUUID().toString().replace("-", "");
    String url = base.substring(0, base.lastIndexOf('/') + 1) + database;
    String user = System.getenv().getOrDefault("TEST_DB_USERNAME", "root");
    String password = System.getenv().getOrDefault("TEST_DB_PASSWORD", "");
    try (var connection = DriverManager.getConnection(base, user, password);
        var sql = connection.createStatement()) {
      sql.execute("CREATE DATABASE " + database);
      try {
        Flyway.configure()
            .dataSource(url, user, password)
            .target(MigrationVersion.fromVersion("3"))
            .load()
            .migrate();
        try (var target = DriverManager.getConnection(url, user, password);
            var statement = target.createStatement()) {
          statement.execute(
              "INSERT INTO pessoas(pes_id,pes_nome,pes_data_nascimento,tpc_id)"
                  + " VALUES(1,'Responsável legado','1980-01-01',5)");
          statement.execute(
              "INSERT INTO responsaveis(res_nome,res_data_nascimento,pes_id,tpc_id)"
                  + " VALUES('Responsável legado','1980-01-01',1,5)");
          statement.execute("INSERT INTO polos(pol_des) VALUES('Polo legado')");
        }
        var flyway = Flyway.configure().dataSource(url, user, password).load();
        assertThat(flyway.migrate().migrationsExecuted).isEqualTo(1);
        assertThat(flyway.migrate().migrationsExecuted).isZero();
        try (var target = DriverManager.getConnection(url, user, password);
            var statement = target.createStatement()) {
          try (var row =
              statement.executeQuery(
                  "SELECT p.pes_nome,p.pes_data_nascimento FROM pessoas p JOIN responsaveis r ON"
                      + " r.pes_id=p.pes_id")) {
            assertThat(row.next()).isTrue();
            assertThat(row.getString(1)).isEqualTo("Responsável legado");
            assertThat(row.getDate(2).toString()).isEqualTo("1980-01-01");
          }
          try (var row = statement.executeQuery("SELECT pol_des,pol_ativo FROM polos")) {
            assertThat(row.next()).isTrue();
            assertThat(row.getString(1)).isEqualTo("Polo legado");
            assertThat(row.getBoolean(2)).isTrue();
          }
        }
      } finally {
        sql.execute("DROP DATABASE " + database);
      }
    }
  }
}
