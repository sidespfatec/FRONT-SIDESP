import { tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Profile, ProfileInput } from '../models/management.models';
@Injectable({ providedIn: 'root' })
export class AccountService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private url = environment.apiUrl;
  /** Consulta o perfil da conta autenticada. */
  profile() {
    return this.http.get<Profile>(`${this.url}/perfil`);
  }
  /** Atualiza somente os campos aceitos pelo servidor. */
  update(body: ProfileInput) {
    return this.http.put<void>(`${this.url}/perfil`, body);
  }
  /** Troca a senha; após sucesso a aplicação deve encerrar a sessão local. */
  password(senhaAtual: string, novaSenha: string, confirmacaoSenha: string) {
    return this.http
      .post<void>(`${this.url}/perfil/senha`, {
        senhaAtual,
        novaSenha,
        confirmacaoSenha,
      })
      .pipe(tap(() => this.auth.clear()));
  }
  /** Solicita instruções sem revelar a existência da conta. */
  recover(identificador: string) {
    return this.http.post<{ mensagem: string }>(`${this.url}/auth/recuperar-senha`, {
      identificador,
    });
  }
  /** Consome o código recebido por e-mail e aplica a nova senha. */
  reset(token: string, novaSenha: string, confirmacaoSenha: string) {
    return this.http
      .post<void>(`${this.url}/auth/redefinir-senha`, {
        token,
        novaSenha,
        confirmacaoSenha,
      })
      .pipe(tap(() => this.auth.clear()));
  }
}
