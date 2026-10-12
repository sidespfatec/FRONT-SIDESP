import { FormControl } from '@angular/forms';
import { validCpf, isMinor, passwordValidator, birthValidator } from './validation';
describe('Regras do cadastro',()=>{
 it('aceita CPF válido com ou sem máscara',()=>{expect(validCpf('52998224725')).toBe(true);expect(validCpf('529.982.247-25')).toBe(true);});
 it('rejeita CPF repetido e dígito incorreto',()=>{expect(validCpf('11111111111')).toBe(false);expect(validCpf('52998224724')).toBe(false);});
 it('aceita oito letras sem exigir símbolos',()=>expect(passwordValidator(new FormControl('abcdefgh'))).toBeNull());
 it('rejeita sete caracteres',()=>expect(passwordValidator(new FormControl('abcdefg'))).toEqual({password:true}));
 it('conta caracteres Unicode',()=>expect(passwordValidator(new FormControl('😀😀😀😀😀😀😀😀'))).toBeNull());
 it('identifica menor na véspera de completar dezoito',()=>expect(isMinor('2008-10-06','2026-10-05')).toBe(true));
 it('considera adulto no aniversário de dezoito',()=>expect(isMinor('2008-10-05','2026-10-05')).toBe(false));
 it('alinha aniversário de 29/02 com a regra do servidor',()=>expect(isMinor('2008-02-29','2026-02-28')).toBe(false));
 it('rejeita nascimento futuro',()=>expect(birthValidator(new FormControl('2999-01-01'))).toEqual({future:true}));
});
