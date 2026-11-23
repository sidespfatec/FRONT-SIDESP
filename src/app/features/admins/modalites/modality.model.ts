//o que o GET /api/v1/admin/modalidades devolve
export interface ModalidadeDaLista {
    id: number;
    nome: string;
    ativo: boolean;
    idadeMinima?: number;
    idadeMaxima?: number;
    limiteFaltasMensais?: number;
    poloId?: number;
}
