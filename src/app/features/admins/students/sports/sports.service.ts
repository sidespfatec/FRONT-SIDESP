import { Injectable } from '@angular/core';
import { AcaoTurma, Esporte, EstadoTurma, TurmaEsporte } from './sports.model';

@Injectable({ providedIn: 'root' })
export class SportsService {
    idadeAluno = 14;

    private esportes: Esporte[] = [
        {
            id: 1,
            nome: 'Natação',
            icone: 'natacao',
            turmas: [
                {
                    id: 1,
                    nome: 'Infantil A',
                    polo: 'Polo Centro',
                    professor: 'Prof. Ricardo Alves',
                    dias: 'Ter e Qui',
                    horario: '14h00 – 15h00',
                    idadeMinima: 10,
                    idadeMaxima: 14,
                    vagas: 20,
                    ocupadas: 12,
                    listaEspera: false,
                    tamanhoLista: 0,
                    situacao: 'nenhuma',
                    posicao: 0
                },
                {
                    id: 2,
                    nome: 'Infantil B',
                    polo: 'Polo Centro',
                    professor: 'Prof. Ricardo Alves',
                    dias: 'Ter e Qui',
                    horario: '15h30 – 16h30',
                    idadeMinima: 10,
                    idadeMaxima: 14,
                    vagas: 20,
                    ocupadas: 20,
                    listaEspera: false,
                    tamanhoLista: 0,
                    situacao: 'matriculada',
                    posicao: 0
                },
                {
                    id: 3,
                    nome: 'Juvenil',
                    polo: 'Polo Pedregulho',
                    professor: 'Profa. Camila Dias',
                    dias: 'Seg e Qua',
                    horario: '18h00 – 19h00',
                    idadeMinima: 12,
                    idadeMaxima: 16,
                    vagas: 24,
                    ocupadas: 24,
                    listaEspera: true,
                    tamanhoLista: 4,
                    situacao: 'na-lista',
                    posicao: 3
                },
                {
                    id: 4,
                    nome: 'Iniciante Sábado',
                    polo: 'Polo Campo do Galvão',
                    professor: 'Prof. Marcos Teixeira',
                    dias: 'Sáb',
                    horario: '09h00 – 10h00',
                    idadeMinima: 10,
                    idadeMaxima: 14,
                    vagas: 16,
                    ocupadas: 16,
                    listaEspera: false,
                    tamanhoLista: 0,
                    situacao: 'nenhuma',
                    posicao: 0
                },
                {
                    id: 5,
                    nome: 'Avançado',
                    polo: 'Polo Pedregulho',
                    professor: 'Profa. Camila Dias',
                    dias: 'Ter e Qui',
                    horario: '17h00 – 18h00',
                    idadeMinima: 10,
                    idadeMaxima: 14,
                    vagas: 12,
                    ocupadas: 12,
                    listaEspera: true,
                    tamanhoLista: 2,
                    situacao: 'nenhuma',
                    posicao: 0
                },
                {
                    id: 6,
                    nome: 'Adulto Manhã',
                    polo: 'Polo Centro',
                    professor: 'Prof. Ricardo Alves',
                    dias: 'Seg, Qua e Sex',
                    horario: '07h00 – 08h00',
                    idadeMinima: 18,
                    idadeMaxima: 60,
                    vagas: 15,
                    ocupadas: 10,
                    listaEspera: false,
                    tamanhoLista: 0,
                    situacao: 'nenhuma',
                    posicao: 0
                }
            ]
        },
        {
            id: 2,
            nome: 'Vôlei',
            icone: 'volei',
            turmas: [
                {
                    id: 7,
                    nome: 'Sub-15',
                    polo: 'Polo Pedregulho',
                    professor: 'Profa. Camila Dias',
                    dias: 'Sáb',
                    horario: '09h00 – 11h00',
                    idadeMinima: 12,
                    idadeMaxima: 15,
                    vagas: 18,
                    ocupadas: 18,
                    listaEspera: true,
                    tamanhoLista: 0,
                    situacao: 'matriculada',
                    posicao: 0
                }
            ]
        },
        {
            id: 3,
            nome: 'Futsal',
            icone: 'futsal',
            turmas: [
                {
                    id: 8,
                    nome: 'Sub-15',
                    polo: 'Polo Centro',
                    professor: 'Prof. Marcos Teixeira',
                    dias: 'Seg e Qua',
                    horario: '16h00 – 17h00',
                    idadeMinima: 12,
                    idadeMaxima: 15,
                    vagas: 20,
                    ocupadas: 20,
                    listaEspera: true,
                    tamanhoLista: 3,
                    situacao: 'nenhuma',
                    posicao: 0
                },
                {
                    id: 9,
                    nome: 'Infantil',
                    polo: 'Polo Campo do Galvão',
                    professor: 'Prof. Marcos Teixeira',
                    dias: 'Sex',
                    horario: '15h00 – 16h30',
                    idadeMinima: 10,
                    idadeMaxima: 14,
                    vagas: 18,
                    ocupadas: 18,
                    listaEspera: false,
                    tamanhoLista: 0,
                    situacao: 'nenhuma',
                    posicao: 0
                }
            ]
        },
        {
            id: 4,
            nome: 'Judô',
            icone: 'judo',
            turmas: [
                {
                    id: 10,
                    nome: 'Infantil',
                    polo: 'Polo Centro',
                    professor: 'Prof. Paulo Nogueira',
                    dias: 'Ter e Qui',
                    horario: '18h00 – 19h00',
                    idadeMinima: 8,
                    idadeMaxima: 14,
                    vagas: 15,
                    ocupadas: 9,
                    listaEspera: false,
                    tamanhoLista: 0,
                    situacao: 'nenhuma',
                    posicao: 0
                }
            ]
        }
    ];

    listar(): Esporte[] {
        return this.esportes;
    }

    buscar(id: number): Esporte | undefined {
        return this.esportes.find(esporte => esporte.id === id);
    }

    estado(turma: TurmaEsporte): EstadoTurma {
        if (turma.situacao === 'matriculada') return 'matriculada';
        if (turma.situacao === 'na-lista') return 'na-lista';
        if (this.idadeAluno < turma.idadeMinima || this.idadeAluno > turma.idadeMaxima) return 'fora-idade';
        if (turma.vagas - turma.ocupadas > 0) return 'aberta';
        return turma.listaEspera ? 'cheia-lista' : 'cheia';
    }

    executar(turma: TurmaEsporte, acao: AcaoTurma): void {
        if (acao === 'inscrever') {
            turma.ocupadas++;
            turma.situacao = 'matriculada';
        } else if (acao === 'entrar-lista') {
            turma.tamanhoLista++;
            turma.posicao = turma.tamanhoLista;
            turma.situacao = 'na-lista';
        } else if (acao === 'cancelar') {
            turma.ocupadas--;
            turma.situacao = 'nenhuma';
        } else {
            turma.tamanhoLista--;
            turma.posicao = 0;
            turma.situacao = 'nenhuma';
        }
    }
}