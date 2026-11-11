/** Modelo usado pelas notícias da área pública do SIDESP. */
export interface NewsItem {
  id: number;
  title: string;
  description: string;
  image: string;
  /** Data da publicação (não é a data de cadastro). */
  date: Date;
  /** Indicador demonstrativo. A regra RN021 deverá ser aplicada também pelo backend. */
  published: boolean;
}
