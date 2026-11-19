//informações esperadas para uma futura api,
// assim o front sabe o que esperar na aplicação e puxar as informações
export interface NewsItem {
  id: number;
  title: string;
  description: string;
  image: string;
  date: Date;              // quando entra no ar
  fim?: Date | null;       // quando sai do ar. null = fica fixa
  arquivada?: boolean;     // sai da home, mas continua guardada
}
