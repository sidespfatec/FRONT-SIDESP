export interface ApiErro {
    erro: string;
    mensagem: string;
    campos?: Record<string, string>;
    pesId?: number;
    nome?: string;
    jaEhProfessor?: boolean;
}
