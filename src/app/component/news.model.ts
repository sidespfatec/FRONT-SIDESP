export interface NewsItem {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

/** O campo 'dados' do multipart, com os nomes que o back espera. */
export interface NoticiaDados {
  titulo: string;
  conteudo: string;
  dataPublicacao: string;
}

/** O que o POST devolve: só o id e o nome do arquivo salvo. */
export interface NoticiaCriada {
  id: number;
  imagem: string;
}

/** O que a modal entrega: a imagem vai como arquivo, não em base64. */
export interface NoticiaParaEnviar {
  dados: NoticiaDados;
  imagem: File;
  previa: string;
}

export const IMAGEM_TIPOS = ['image/jpeg', 'image/png', 'image/webp'];
export const IMAGEM_TAMANHO_MAX = 10 * 1024 * 1024;   // igual ao limite do Spring
export const TITULO_MAX = 100;                        // @Size(max = 100) no Java

/**
 * Date -> '2026-11-18T14:30:00'.
 * O back recebe LocalDateTime: toISOString() manda '...Z' no fim e ele recusa.
 */
export function paraDataHoraLocal(data: Date): string {
  const d = (n: number) => String(n).padStart(2, '0');
  return `${data.getFullYear()}-${d(data.getMonth() + 1)}-${d(data.getDate())}`
    + `T${d(data.getHours())}:${d(data.getMinutes())}:${d(data.getSeconds())}`;
}

/** Da mais nova para a mais antiga. */
export function ordenarPorData(lista: NewsItem[]): NewsItem[] {
  return [...lista].sort((a, b) => b.date.localeCompare(a.date));
}