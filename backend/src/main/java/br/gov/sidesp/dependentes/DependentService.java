package br.gov.sidesp.dependentes;

import br.gov.sidesp.auth.*;
import br.gov.sidesp.management.ManagementRequests;
import br.gov.sidesp.fichamedica.MedicalRepository;
import br.gov.sidesp.security.Crypto;
import java.time.Clock;
import java.util.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Regras da funcionalidade, chamadas pelo controller. */
@Service
public class DependentService {
  private final JdbcTemplate db;
  private final AuthRepository accounts;
  private final Crypto crypto;
  private final Clock clock;
  private final MedicalRepository medical;

  public DependentService(JdbcTemplate db, AuthRepository accounts, Crypto crypto, Clock clock, MedicalRepository medical) {
    this.db = db;
    this.accounts = accounts;
    this.crypto = crypto;
    this.clock = clock;
    this.medical = medical;
  }

  /** Cadastra novo dependente usando a identidade autenticada, sem receber senha do titular. */
  @Transactional
  public AuthService.Registered child(ManagementRequests.Child r, int actor) {
    var owner = accounts.account(actor).orElseThrow(ApiException::unauthorized);
    var birth =
        db.queryForObject(
            "SELECT pes_data_nascimento FROM pessoas WHERE pes_id=?",
            java.sql.Date.class,
            owner.person());
    if (birth == null || Rules.minor(birth.toLocalDate(), clock))
      throw ApiException.invalid("responsavel", "O titular deve ser adulto.");
    if (!Rules.minor(r.dadosPessoais().dataNascimento(), clock))
      throw ApiException.invalid("dataNascimento", "Este fluxo é exclusivo para menor de idade.");
    Rules.address(r.endereco());
    String phone = Rules.phone(r.dadosPessoais().telefone(), "telefone");
    int guardian =
        accounts
            .guardian(owner.person())
            .orElseGet(() -> accounts.createGuardian(owner.person(), null));
    var p = r.dadosPessoais();
    int person =
        accounts.person(
            p.nome(), p.dataNascimento(), p.genero(), accounts.registrationType("ALUNO"));
    if (p.cpf() != null && !p.cpf().isBlank())
      accounts.cpf(person, crypto.cpfHash(Rules.cpf(p.cpf(), "cpf")));
    accounts.contact(person, null, phone);
    accounts.address(person, r.endereco());
    accounts.link(guardian, person, r.parentesco());
    medical.saveMedical(person, r.fichaMedica());
    return new AuthService.Registered(person, "Dependente cadastrado.");
  }

}
