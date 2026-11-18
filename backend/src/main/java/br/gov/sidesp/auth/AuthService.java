
package br.gov.sidesp.auth;

import br.gov.sidesp.security.Crypto;
import br.gov.sidesp.security.TokenService;
import java.security.MessageDigest;
import java.time.Clock;
import java.util.List;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthRepository repository;
    private final Crypto crypto;
    private final PasswordEncoder passwordEncoder;
    private final Clock clock;
    private final TokenService tokenService;
    private final String dummyPasswordHash;
    private final br.gov.sidesp.fichamedica.MedicalRepository medical;

    public AuthService(
            AuthRepository repository,
            Crypto crypto,
            PasswordEncoder passwordEncoder,
            Clock clock,
            TokenService tokenService,
            br.gov.sidesp.fichamedica.MedicalRepository medical) {

        this.medical = medical;
        this.repository = repository;
        this.crypto = crypto;
        this.passwordEncoder = passwordEncoder;
        this.clock = clock;
        this.tokenService = tokenService;
        this.dummyPasswordHash =
                passwordEncoder.encode("unused-dummy-password");
    }

    public record Registered(int id, String mensagem) {}

    @Transactional
    public Registered register(Requests.Registration registration) {

        Requests.Person person = registration.dadosPessoais();
        Requests.Credentials credentials = registration.credenciais();

        Rules.password(credentials.senha(), credentials.confirmacaoSenha());
        Rules.address(registration.endereco());

        boolean minor = Rules.minor(person.dataNascimento(), clock);

        String phone = Rules.phone(
                person.telefone(),
                "dadosPessoais.telefone");

        String cpf = optionalCpf(person.cpf());
        String email = Rules.email(credentials.email());

        if (email.getBytes(java.nio.charset.StandardCharsets.UTF_8).length > 254) {
            throw ApiException.invalid(
                    "credenciais.email",
                    "E-mail excede limite em bytes.");
        }

        int personId;

        if (minor) {
            personId = registerMinor(registration, cpf, email);
        } else {
            personId = registerAdult(registration, cpf, email);
        }

        repository.contact(personId, null, phone);
        repository.address(personId, registration.endereco());

        if (registration.fichaMedica() != null) {
            medical.saveMedical(personId, registration.fichaMedica());
        }

        return new Registered(
                personId,
                "Cadastro concluído. Você já pode fazer login.");
    }

    private String optionalCpf(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return Rules.cpf(value, "dadosPessoais.cpf");
    }

    private int registerAdult(
            Requests.Registration registration,
            String cpf,
            String email) {

        if (cpf == null) {
            throw ApiException.invalid(
                    "dadosPessoais.cpf",
                    "CPF é obrigatório para maior de idade.");
        }

        if (registration.responsavel() != null) {
            throw ApiException.invalid(
                    "responsavel",
                    "Dados do responsável são usados somente para menores nesta versão.");
        }

        validateLoginCpf(
                registration.credenciais().cpfLogin(),
                cpf,
                "O titular do login deve ser o próprio aluno.");

        checkAvailable(cpf, email);

        Requests.Person person = registration.dadosPessoais();

        int personId = repository.person(
                person.nome(),
                person.dataNascimento(),
                person.genero(),
                repository.registrationType("ALUNO"));

        repository.cpf(personId, crypto.cpfHash(cpf));

        createAccount(
                personId,
                email,
                registration.credenciais().senha());

        return personId;
    }

    private int registerMinor(
            Requests.Registration registration,
            String childCpf,
            String email) {

        Requests.Guardian guardian = registration.responsavel();

        if (guardian == null) {
            throw ApiException.invalid(
                    "responsavel",
                    "Menor de idade precisa de responsável.");
        }

        if (Rules.minor(
                guardian.dataNascimento(),
                clock,
                "responsavel.dataNascimento")) {

            throw ApiException.invalid(
                    "responsavel.dataNascimento",
                    "O responsável deve ter 18 anos completos.");
        }

        String guardianCpf = Rules.cpf(
                guardian.cpf(),
                "responsavel.cpf");

        if (guardianCpf.equals(childCpf)) {
            throw ApiException.invalid(
                    "responsavel.cpf",
                    "CPF do responsável deve ser diferente do CPF do aluno.");
        }

        validateLoginCpf(
                registration.credenciais().cpfLogin(),
                guardianCpf,
                "O titular do login deve ser o responsável.");

        String guardianPhone = Rules.phone(
                guardian.telefone(),
                "responsavel.telefone");

        int guardianId = ensureGuardian(
                guardian,
                guardianCpf,
                guardianPhone,
                email,
                registration.credenciais().senha());

        Requests.Person child = registration.dadosPessoais();

        int childId = repository.person(
                child.nome(),
                child.dataNascimento(),
                child.genero(),
                repository.registrationType("ALUNO"));

        if (childCpf != null) {
            byte[] childCpfHash = crypto.cpfHash(childCpf);

            if (repository.cpfExists(childCpfHash)) {
                throw ApiException.conflict();
            }

            repository.cpf(childId, childCpfHash);
        }

        repository.link(
                guardianId,
                childId,
                guardian.parentesco());

        return childId;
    }

    private int ensureGuardian(
            Requests.Guardian guardian,
            String cpf,
            String phone,
            String email,
            String password) {

        Optional<AuthRepository.Account> existing =
                repository.accountByCpf(crypto.cpfHash(cpf));

        if (existing.isPresent()) {
            AuthRepository.Account account = existing.get();

            boolean passwordMatches =
                    passwordEncoder.matches(password, account.password());

            boolean emailMatches = MessageDigest.isEqual(
                    account.emailHash(),
                    crypto.emailHash(email));

            if (!account.active() || !passwordMatches || !emailMatches) {
                throw ApiException.conflict();
            }

            Optional<Integer> guardianId =
                    repository.guardian(account.person());

            if (guardianId.isPresent()) {
                return guardianId.get();
            }

            return repository.createGuardian(account.person(), guardian);
        }

        checkAvailable(cpf, email);

        int personId = repository.person(
                guardian.nome(),
                guardian.dataNascimento(),
                null,
                repository.registrationType("RESPONSAVEL"));

        repository.cpf(personId, crypto.cpfHash(cpf));

        int guardianId = repository.createGuardian(personId, guardian);

        repository.contact(personId, guardianId, phone);

        createAccount(personId, email, password);

        return guardianId;
    }

    private void validateLoginCpf(
            String suppliedCpf,
            String ownerCpf,
            String message) {

        if (!ownerCpf.equals(Rules.cpf(
                suppliedCpf,
                "credenciais.cpfLogin"))) {

            throw ApiException.invalid(
                    "credenciais.cpfLogin",
                    message);
        }
    }

    private void checkAvailable(String cpf, String email) {

        if (repository.cpfExists(crypto.cpfHash(cpf))
                || repository.accountByEmail(
                        crypto.emailHash(email)).isPresent()) {

            throw ApiException.conflict();
        }
    }

    private void createAccount(
            int ownerId,
            String email,
            String password) {

        repository.createAccount(
                ownerId,
                crypto.encryptEmail(email),
                crypto.emailHash(email),
                passwordEncoder.encode(password));
    }

    public TokenService.LoginResult login(Requests.Login request) {

        Optional<AuthRepository.Account> found =
                findLoginAccount(request.identificador());

        String storedHash = dummyPasswordHash;

        if (found.isPresent()) {
            storedHash = found.get().password();
        }

        boolean passwordMatches =
                passwordEncoder.matches(request.senha(), storedHash);

        if (found.isEmpty()
                || !passwordMatches
                || !found.get().active()) {

            throw ApiException.unauthorized();
        }

        return tokenService.issue(found.get());
    }

    private Optional<AuthRepository.Account> findLoginAccount(
            String identifier) {

        if (identifier.contains("@")) {
            return repository.accountByEmail(
                    crypto.emailHash(Rules.email(identifier)));
        }

        try {
            String cpf = Rules.cpf(identifier, "identificador");

            return repository.accountByCpf(
                    crypto.cpfHash(cpf));

        } catch (ApiException exception) {
            return Optional.empty();
        }
    }

    public record Me(
            int id,
            String nome,
            String perfil,
            List<AuthRepository.Dependent> dependentes) {}

    public Me me(int accountId) {

        Optional<AuthRepository.Account> found =
                repository.account(accountId);

        if (found.isEmpty() || !found.get().active()) {
            throw ApiException.unauthorized();
        }

        AuthRepository.Account account = found.get();

        return new Me(
                account.id(),
                account.name(),
                account.role(),
                repository.dependents(account.person()));
    }
}
