/** FIXA fica no ar para sempre; TEMPORARIA some depois da data de validade. */
export type NewsDuration = 'FIXA' | 'TEMPORARIA';

export interface NewsItem {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  duration: NewsDuration;
  expiresAt?: string;     // só quando TEMPORARIA
}

/** O que vai no POST: o id quem gera é o back. */
export type NewNews = Omit<NewsItem, 'id'>;


/** Notícia temporária vencida não aparece mais. */
export function estaVisivel(item: NewsItem, agora = new Date()): boolean {
  if (item.duration === 'FIXA' || !item.expiresAt) {
    return true;
  }
  // 'T23:59:59' = vale até o fim do dia escolhido, não até a meia-noite dele.
  return new Date(`${item.expiresAt}T23:59:59`) >= agora;
}

/** Da mais nova para a mais antiga. */
export function ordenarPorData(lista: NewsItem[]): NewsItem[] {
  return [...lista].sort((a, b) => b.date.localeCompare(a.date));
}

/** Date -> 'aaaa-mm-dd', que é o formato que o back espera. */
export function paraIsoCurto(data: Date): string {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  return `${data.getFullYear()}-${mes}-${dia}`;
}
