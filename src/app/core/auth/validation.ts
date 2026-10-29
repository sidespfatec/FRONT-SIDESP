import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
export function validCpf(raw:string):boolean {
 if(!/^(?:[0-9]{11}|[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2})$/.test(raw)) return false;
 const n=raw.replace(/[.-]/g,''); if(new Set(n).size===1)return false;
 for(let size=9;size<=10;size++){let sum=0;for(let i=0;i<size;i++)sum+=Number(n[i])*(size+1-i);let d=(sum*10)%11;if(d===10)d=0;if(d!==Number(n[size]))return false;}return true;
}
export const cpfValidator:ValidatorFn=(c:AbstractControl):ValidationErrors|null=>!c.value||validCpf(c.value)?null:{cpf:true};
export function todayIso():string {const now=new Date();const y=now.getFullYear();return `${y}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;}
export function isMinor(value:string,today=todayIso()):boolean {
 const [y,m,d]=value.split('-').map(Number), [ty,tm,td]=today.split('-').map(Number);
 if(!y||!m||!d)return false;
 const targetYear=y+18; const maxDay=new Date(targetYear,m,0).getDate();
 const anniversary=`${targetYear}-${String(m).padStart(2,'0')}-${String(Math.min(d,maxDay)).padStart(2,'0')}`;
 return today<anniversary;
}
export const birthValidator:ValidatorFn=(c:AbstractControl):ValidationErrors|null=>c.value&&c.value>todayIso()?{future:true}:null;
export const passwordValidator:ValidatorFn=(c:AbstractControl):ValidationErrors|null=>{const n=Array.from(c.value||'').length;return n>=8&&n<=128?null:{password:true};};
export const nonBlank:ValidatorFn=(c:AbstractControl):ValidationErrors|null=>typeof c.value==='string'&&!c.value.trim()?{required:true}:null;
