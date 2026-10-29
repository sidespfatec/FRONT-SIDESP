export type Perfil =
    | 'ADMINISTRADOR_TOTAL'
    | 'ADMINISTRADOR_PARCIAL'
    | 'PROFESSOR'
    | 'ALUNO'
    | 'RESPONSAVEL';

export interface ItemMenu {
    rota: string;
    nome: string;
    icone: string;
    grupo: string;
    perfis: Perfil[];
}

const ADMINS: Perfil[] = ['ADMINISTRADOR_TOTAL', 'ADMINISTRADOR_PARCIAL'];
const SO_TOTAL: Perfil[] = ['ADMINISTRADOR_TOTAL'];

export const ITENS_MENU: ItemMenu[] = [
    {
        rota: '/manage-hubs', nome: 'Gerenciar Polos',
        icone: 'pi pi-map-marker', grupo: 'Cadastros', perfis: ADMINS
    },
    {
        rota: '/manage-teachers', nome: 'Cadastrar Professores',
        icone: 'pi pi-user-plus', grupo: 'Cadastros', perfis: SO_TOTAL
    },
    {
        rota: '/manage-modalites', nome: 'Gerenciar Modalidades',
        icone: 'pi pi-list', grupo: 'Cadastros', perfis: ADMINS
    },
    {
        rota: '/admin/alunos', nome: 'Gerenciar Alunos',
        icone: 'pi pi-users', grupo: 'Gestão', perfis: ADMINS
    },
    {
        rota: '/manage-admin', nome: 'Gerenciar Administradores',
        icone: 'pi pi-shield', grupo: 'Gestão', perfis: SO_TOTAL
    },
    {
        rota: '/admin/relatorios', nome: 'Relatórios',
        icone: 'pi pi-chart-bar', grupo: 'Análise', perfis: ADMINS
    },
    {
        rota: '/admin/mapa-calor', nome: 'Mapa de Calor',
        icone: 'pi pi-map', grupo: 'Análise', perfis: ADMINS
    }
];

export const GRUPOS_MENU = ['Cadastros', 'Gestão', 'Análise'];

export function itensDoPerfil(perfil: string | null | undefined): ItemMenu[] {
    if (!perfil) { return []; }
    return ITENS_MENU.filter(item => item.perfis.includes(perfil as Perfil));
}

export function gruposDoPerfil(perfil: string | null | undefined) {
    const itens = itensDoPerfil(perfil);

    return GRUPOS_MENU
        .map(titulo => ({ titulo, itens: itens.filter(item => item.grupo === titulo) }))
        .filter(grupo => grupo.itens.length > 0);
}
