
export interface NewsItem {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;

  //o card da main mostra estes dois; a API ainda não devolve nenhum deles
  fim?: string | null;
  arquivada?: boolean;
}

export interface NoticiaDados {
  titulo: string;
  conteudo: string;
  dataPublicacao: string;
}

export interface NoticiaCriada {
  id: number;
  imagem: string;
}

export interface NoticiaParaEnviar {
  dados: NoticiaDados;
  imagem: File;
  previa: string;
}

export const IMAGEM_TIPOS = [
  'image/jpeg',
  'image/png',
  'image/webp'
];

export const IMAGEM_TAMANHO_MAX = 10 * 1024 * 1024;

export const TITULO_MAX = 100;

export function paraDataHoraLocal(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  const hora = String(data.getHours()).padStart(2, '0');
  const minuto = String(data.getMinutes()).padStart(2, '0');

  return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
}

export function ordenarPorData(lista: NewsItem[]): NewsItem[] {
  return [...lista].sort((a, b) => b.date.localeCompare(a.date));
}
