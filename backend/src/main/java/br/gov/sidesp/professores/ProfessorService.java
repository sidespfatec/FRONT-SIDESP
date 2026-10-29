
package br.gov.sidesp.professores;

import br.gov.sidesp.auth.ApiException;
import br.gov.sidesp.auth.AuthRepository;
import br.gov.sidesp.security.Crypto;
import br.gov.sidesp.auth.Rules;
import br.gov.sidesp.professores.ProfessorRequests.Cadastro;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfessorService {

    private final ProfessorRepository repository;
    private final AuthRepository authRepository;
    private final Crypto crypto;

    public ProfessorService(
            ProfessorRepository repository,
            AuthRepository authRepository,
            Crypto crypto) {
        this.repository = repository;
        this.authRepository = authRepository;
        this.crypto = crypto;
    }

    @Transactional
    public Resultado cadastrar(Cadastro dados) {
        String cpf = Rules.cpf(dados.cpf(), "cpf");
        String telefone = Rules.phone(dados.telefone(), "telefone");

        byte[] cpfHash = crypto.cpfHash(cpf);

        if (repository.cpfExists(cpfHash)) {
            throw ApiException.conflict();
        }

        int tipoCadastro =
                authRepository.registrationType("PROFESSOR");

        int pessoaId = repository.createPerson(
                dados.nome(),
                dados.dataNascimento(),
                dados.sexo(),
                tipoCadastro
        );

        repository.createCpf(pessoaId, cpfHash);

        authRepository.contact(
                pessoaId,
                null,
                telefone
        );

        int professorId = repository.createProfessor(
                pessoaId,
                dados.registroProfissional(),
                dados.especialidade()
        );

        return new Resultado(
                professorId,
                "Professor cadastrado com sucesso."
        );
    }

    public record Resultado(int id, String mensagem) {}
}
