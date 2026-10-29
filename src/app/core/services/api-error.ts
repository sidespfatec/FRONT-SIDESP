import { HttpErrorResponse } from '@angular/common/http';
/** Apresenta erros de campo da API sem substituir uma falha por sucesso local. */
export function apiError(error: HttpErrorResponse): string {
  const fields = Object.values(error.error?.errosCampos ?? {}).join(' ');
  return [
    error.error?.mensagem ||
      (error.status === 0
        ? 'Não foi possível conectar ao servidor.'
        : 'Não foi possível concluir a operação.'),
    fields,
  ]
    .filter(Boolean)
    .join(' ');
}
