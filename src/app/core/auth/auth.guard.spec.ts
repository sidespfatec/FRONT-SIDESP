import { TestBed } from '@angular/core/testing';
import {
  provideRouter,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { firstValueFrom, Observable, of } from 'rxjs';
import { adminGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('Permissões de rota', () => {
  /** Executa o guard com identidade fornecida pelo servidor simulado. */
  async function check(perfil: string, roles?: string[], token: string | null = 'token') {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            token: () => token,
            me: () => of({ perfil }),
          },
        },
      ],
    });
    const route = { data: roles ? { roles } : {} } as ActivatedRouteSnapshot;
    const result = TestBed.runInInjectionContext(() =>
      adminGuard(route, {} as RouterStateSnapshot),
    );
    const value = result instanceof Observable ? await firstValueFrom(result) : result;
    return value === true
      ? true
      : TestBed.inject(Router).serializeUrl(value as ReturnType<Router['createUrlTree']>);
  }
  it('redireciona sessão ausente para login', async () =>
    expect(await check('ALUNO', undefined, null)).toBe('/login'));
  it('bloqueia professor em rota administrativa', async () =>
    expect(await check('PROFESSOR')).toBe('/home'));
  it('permite administração parcial nas áreas comuns', async () =>
    expect(await check('ADMINISTRADOR_PARCIAL')).toBe(true));
  it('bloqueia parcial na administração de administradores', async () =>
    expect(await check('ADMINISTRADOR_PARCIAL', ['ADMINISTRADOR_TOTAL'])).toBe('/home'));
  it('permite total na administração de administradores', async () =>
    expect(await check('ADMINISTRADOR_TOTAL', ['ADMINISTRADOR_TOTAL'])).toBe(true));
});
