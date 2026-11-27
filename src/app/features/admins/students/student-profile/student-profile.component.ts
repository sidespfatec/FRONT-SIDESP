import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { MaskCaretDirective } from '../../../../directives/mask-caret.directive';
import { Aba, Aula, DiaCalendario, PerfilAluno, StatusAula, Turma } from './student-profile.model';

@Component({
    selector: 'app-student-profile',
    standalone: true,
    imports: [DatePipe, FormsModule, InputTextModule, InputMaskModule, MaskCaretDirective],
    templateUrl: './student-profile.component.html',
    styleUrl: './student-profile.component.scss'
})
export class StudentProfileComponent {
    private router = inject(Router);

    abas: { id: Aba; nome: string }[] = [
        { id: 'turmas', nome: 'Turmas' },
        { id: 'frequencia', nome: 'Frequência' },
        { id: 'documentos', nome: 'Documentos' },
        { id: 'dados', nome: 'Dados' }
    ];

    letrasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    nomesMeses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    rotulos: Record<StatusAula, string> = {
        presente: 'presente',
        falta: 'falta',
        cancelada: 'aula cancelada'
    };

    hoje = new Date();
    abaAtual: Aba = 'turmas';
    turmaFiltro = 0;
    mesAtual = new Date(this.hoje.getFullYear(), this.hoje.getMonth(), 1);
    diaSelecionado = '';
    secaoEditando: '' | 'contato' | 'endereco' = '';
    documentoEscolhido = 0;

    rascunho = { telefone: '', email: '', cep: '', rua: '', bairro: '' };

    aluno: PerfilAluno = {
        nome: 'Mariana Lopes da Silva',
        foto: '',
        nascimento: '2012-03-12',
        cpf: '412.885.908-20',
        genero: 'Feminino',
        entrada: '2026-02-12',
        ativo: true,
        prazoDocumentos: '30/11',
        telefone: '(12) 99812-4470',
        email: 'mariana.l@email.com',
        cep: '12505-010',
        rua: 'Rua Dr. Morais Filho, 212',
        bairro: 'Centro',
        cidade: 'Guaratinguetá',
        uf: 'SP',
        turmas: [
            {
                id: 1,
                modalidade: 'Natação',
                nome: 'Infantil B',
                polo: 'Polo Centro',
                professor: 'Prof. Ricardo Alves',
                dias: 'Ter e Qui',
                horario: '15h30 – 16h30',
                aulas: 71,
                presencas: 61
            },
            {
                id: 2,
                modalidade: 'Vôlei',
                nome: 'Sub-15',
                polo: 'Polo Pedregulho',
                professor: 'Profa. Camila Dias',
                dias: 'Sáb',
                horario: '09h00 – 11h00',
                aulas: 42,
                presencas: 32
            }
        ],
        documentos: [
            { id: 1, nome: 'Atestado médico', situacao: 'vencendo', detalhe: 'Vence em 30/11/2026' },
            { id: 2, nome: 'RG ou certidão', situacao: 'pendente', detalhe: 'Ainda não entregue' },
            { id: 3, nome: 'Comprovante de residência', situacao: 'pendente', detalhe: 'Ainda não entregue' },
            { id: 4, nome: 'Autorização do responsável', situacao: 'entregue', detalhe: 'Entregue em 12/02/2026' }
        ]
    };

    aulas: Aula[] = [
        { data: '2026-10-17', turmaId: 2, status: 'falta' },
        { data: '2026-10-20', turmaId: 1, status: 'presente' },
        { data: '2026-10-22', turmaId: 1, status: 'presente' },
        { data: '2026-10-24', turmaId: 2, status: 'cancelada' },
        { data: '2026-10-27', turmaId: 1, status: 'falta' },
        { data: '2026-10-29', turmaId: 1, status: 'presente' },
        { data: '2026-10-31', turmaId: 2, status: 'presente' },
        { data: '2026-11-03', turmaId: 1, status: 'presente' }
    ];

    get idade(): number {
        const nascimento = new Date(this.aluno.nascimento + 'T00:00:00');
        let anos = this.hoje.getFullYear() - nascimento.getFullYear();
        const meses = this.hoje.getMonth() - nascimento.getMonth();
        if (meses < 0 || (meses === 0 && this.hoje.getDate() < nascimento.getDate())) {
            anos--;
        }
        return anos;
    }

    get pendencias(): number {
        return this.aluno.documentos.filter(documento => documento.situacao !== 'entregue').length;
    }

    get turmasFiltradas(): Turma[] {
        return this.aluno.turmas.filter(turma => !this.turmaFiltro || turma.id === this.turmaFiltro);
    }

    get resumo() {
        const aulas = this.turmasFiltradas.reduce((soma, turma) => soma + turma.aulas, 0);
        const presencas = this.turmasFiltradas.reduce((soma, turma) => soma + turma.presencas, 0);
        return {
            aulas,
            presencas,
            faltas: aulas - presencas,
            percentual: this.percentual(aulas, presencas)
        };
    }

    get aulasFiltradas(): Aula[] {
        return this.aulas.filter(aula => !this.turmaFiltro || aula.turmaId === this.turmaFiltro);
    }

    get aulasDoDia(): Aula[] {
        return this.aulasFiltradas.filter(aula => aula.data === this.diaSelecionado);
    }

    get tituloMes(): string {
        return `${this.nomesMeses[this.mesAtual.getMonth()]} de ${this.mesAtual.getFullYear()}`;
    }

    get podeAnterior(): boolean {
        const entrada = new Date(this.aluno.entrada + 'T00:00:00');
        return this.indiceMes(this.mesAtual) > this.indiceMes(entrada);
    }

    get podeProximo(): boolean {
        return this.indiceMes(this.mesAtual) < this.indiceMes(this.hoje);
    }

    get dias(): (DiaCalendario | null)[] {
        const ano = this.mesAtual.getFullYear();
        const mes = this.mesAtual.getMonth();
        const vazios = new Date(ano, mes, 1).getDay();
        const totalDias = new Date(ano, mes + 1, 0).getDate();
        const dias: (DiaCalendario | null)[] = Array(vazios).fill(null);

        for (let numero = 1; numero <= totalDias; numero++) {
            const data = this.formatarData(new Date(ano, mes, numero));
            const aulasDoDia = this.aulasFiltradas.filter(aula => aula.data === data);
            dias.push({ numero, data, status: this.statusDoDia(aulasDoDia) });
        }

        return dias;
    }

    percentual(aulas: number, presencas: number): number {
        return aulas ? Math.round((presencas / aulas) * 100) : 0;
    }

    turma(id: number): Turma | undefined {
        return this.aluno.turmas.find(turma => turma.id === id);
    }

    voltar(): void {
        this.router.navigate(['/']);
    }

    filtrar(turmaId: number): void {
        this.turmaFiltro = turmaId;
        this.diaSelecionado = '';
    }

    verCalendario(turmaId: number): void {
        this.filtrar(turmaId);
        this.abaAtual = 'frequencia';
    }

    mudarMes(passo: number): void {
        this.mesAtual = new Date(this.mesAtual.getFullYear(), this.mesAtual.getMonth() + passo, 1);
        this.diaSelecionado = '';
    }

    abrirDia(dia: DiaCalendario): void {
        if (!dia.status) return;
        this.diaSelecionado = this.diaSelecionado === dia.data ? '' : dia.data;
    }

    escolherArquivo(id: number, campo: HTMLInputElement): void {
        this.documentoEscolhido = id;
        campo.value = '';
        campo.click();
    }

    anexar(evento: Event): void {
        const campo = evento.target as HTMLInputElement;
        if (!campo.files?.length) return;

        const documento = this.aluno.documentos.find(item => item.id === this.documentoEscolhido);
        if (!documento) return;

        documento.situacao = 'entregue';
        documento.detalhe = 'Entregue em ' + new Date().toLocaleDateString('pt-BR');
        this.documentoEscolhido = 0;
    }

    editar(secao: 'contato' | 'endereco'): void {
        this.rascunho = {
            telefone: this.aluno.telefone,
            email: this.aluno.email,
            cep: this.aluno.cep,
            rua: this.aluno.rua,
            bairro: this.aluno.bairro
        };
        this.secaoEditando = secao;
    }

    cancelar(): void {
        this.secaoEditando = '';
    }

    podeSalvar(): boolean {
        if (this.secaoEditando === 'contato') {
            return !!this.rascunho.telefone && this.rascunho.email.includes('@');
        }
        return !!this.rascunho.cep && !!this.rascunho.rua.trim() && !!this.rascunho.bairro.trim();
    }

    salvar(): void {
        if (!this.podeSalvar()) return;

        if (this.secaoEditando === 'contato') {
            this.aluno.telefone = this.rascunho.telefone;
            this.aluno.email = this.rascunho.email.trim();
        } else {
            this.aluno.cep = this.rascunho.cep;
            this.aluno.rua = this.rascunho.rua.trim();
            this.aluno.bairro = this.rascunho.bairro.trim();
        }

        this.secaoEditando = '';
    }

    private indiceMes(data: Date): number {
        return data.getFullYear() * 12 + data.getMonth();
    }

    private formatarData(data: Date): string {
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        return `${data.getFullYear()}-${mes}-${dia}`;
    }

    private statusDoDia(aulas: Aula[]): StatusAula | '' {
        if (!aulas.length) return '';
        if (aulas.some(aula => aula.status === 'falta')) return 'falta';
        if (aulas.some(aula => aula.status === 'presente')) return 'presente';
        return 'cancelada';
    }
}