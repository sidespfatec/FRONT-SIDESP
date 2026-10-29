import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { App } from './app';
@Component({standalone:true,template:'<h1>Página de teste</h1>'})
class TestPage {}
describe('App',()=>{
  beforeEach(()=>TestBed.configureTestingModule({imports:[App],providers:[provideRouter([{path:'teste',component:TestPage}])]}));
  it('cria a aplicação',()=>expect(TestBed.createComponent(App).componentInstance).toBeTruthy());
  it('exibe a página navegada no lugar do título antigo do projeto inicial',async()=>{
    const fixture=TestBed.createComponent(App);
    await TestBed.inject(Router).navigateByUrl('/teste');
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('h1')?.textContent).toBe('Página de teste');
  });
});
