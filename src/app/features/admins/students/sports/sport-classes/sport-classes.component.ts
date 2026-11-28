import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AcaoTurma, EstadoTurma, TurmaEsporte } from '../sports.model';
import { SportsService } from '../sports.service';
import { SportIconComponent } from '../sport-icon/sport-icon.component';

@Component({
  selector: 'app-sport-classes',
  standalone: true,
  imports: [FormsModule, SportIconComponent],
  templateUrl: './sport-classes.component.html',
  styleUrl: './sport-classes.component.scss'
})

export class SportClassesComponent {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private service = inject(SportsService);

    esporte = this.service.buscar(Number(this.route.snapshot.paramMap.get('id')));

    polo = '';
    soDisponiveis = false;
    turmaAcao: TurmaEsporte | null = null;
    acao: AcaoTurma | null = null;

    mensagem = signal('');
    private temporizador: ReturnType<typeof setTimeout> | undefined;

    rotulos: Record<EstadoTurma, string> = {
        aberta: 'Vagas abertas',
        matriculada: 'Você está aqui',
        'na-lista': 'Você está na lista',
        'cheia-lista': 'Lista de espera',
        cheia: 'Turma cheia',
        'fora-idade': 'Fora da idade'
    };

    confirmacoes: Record<AcaoTurma, { titulo: string; botao: string; perigo: boolean; sucesso: string }> = {
        inscrever: { titulo: 'Confirmar inscrição', botao: 'Confirmar', perigo: false, sucesso: 'Inscrição confirmada' },
        'entrar-lista': {
            titulo: 'Entrar na lista de espera',
            botao: 'Entrar na lista',
            perigo: false,
            sucesso: 'Você entrou na lista de espera'
        },
        cancelar: { titulo: 'Cancelar matrícula', botao: 'Cancelar matrícula', perigo: true, sucesso: 'Matrícula cancelada' },
        'sair-lista': {
            titulo: 'Sair da lista de espera',
            botao: 'Sair da lista',
            perigo: true,
            sucesso: 'Você saiu da lista de espera'
        }
    };

    get polos(): string[] {
        const nomes = this.esporte?.turmas.map(turma => turma.polo) ?? [];
        return [...new Set(nomes)];
    }

    get turmasFiltradas(): TurmaEsporte[] {
        return (this.esporte?.turmas ?? []).filter(turma => {
            const estado = this.service.estado(turma);
            const noPolo = !this.polo || turma.polo === this.polo;
            const disponivel = !this.soDisponiveis || estado === 'aberta' || estado === 'cheia-lista';
            return noPolo && disponivel;
        });
    }

    estadoDe(turma: TurmaEsporte): EstadoTurma {
        return this.service.estado(turma);
    }

    vagasLivres(turma: TurmaEsporte): number {
        return turma.vagas - turma.ocupadas;
    }

    ocupacao(turma: TurmaEsporte): number {
        return turma.vagas ? Math.round((turma.ocupadas / turma.vagas) * 100) : 0;
    }

    textoVagas(turma: TurmaEsporte): string {
        const livres = this.vagasLivres(turma);
        return livres > 0 ? `${livres} de ${turma.vagas} livres` : `lotada (${turma.ocupadas}/${turma.vagas})`;
    }

    pedir(turma: TurmaEsporte, acao: AcaoTurma): void {
        this.turmaAcao = turma;
        this.acao = acao;
    }

    fechar(): void {
        this.turmaAcao = null;
        this.acao = null;
    }

    confirmar(): void {
        if (!this.turmaAcao || !this.acao) return;
        const aviso = this.confirmacoes[this.acao].sucesso;
        this.service.executar(this.turmaAcao, this.acao);
        this.fechar();
        this.avisar(aviso);
    }

    private avisar(texto: string): void {
        clearTimeout(this.temporizador);
        this.mensagem.set(texto);
        this.temporizador = setTimeout(() => this.mensagem.set(''), 2800);
    }

    voltar(): void {
        this.router.navigate(['/aluno/esportes']);
    }
}