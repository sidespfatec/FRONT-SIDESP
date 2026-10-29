import { test as base, expect, Page, chromium } from '@playwright/test';
const test=base.extend<{page:Page}>({page:async({},use)=>{const browser=await chromium.launch(process.env['BROWSER_PATH']?{executablePath:process.env['BROWSER_PATH'],args:process.env['E2E_SANDBOX_FLAGS']?['--no-sandbox','--no-zygote','--single-process']:[]}:{});const page=await browser.newPage({baseURL:process.env['E2E_URL']||'http://127.0.0.1:4200'});try{await use(page);}finally{await browser.close();}}});
// Exclusivamente ambiente de teste; cria registros sintéticos, sem apagar dados.
const seed=700000000+Math.floor(Date.now()/1000)%9000000;
function cpf(seed:number){let n=String(seed).padStart(9,'0');for(let size=9;size<=10;size++){let sum=0;for(let i=0;i<size;i++)sum+=Number(n[i])*(size+1-i);let d=(sum*10)%11;if(d===10)d=0;n+=d;}return n;}
async function personal(p:Page,id:number,minor=false){await p.goto('/registration');await p.locator('#name').fill(minor?'Dependente Teste':'Adulto Teste');await p.locator('#cpf').fill(minor?'':cpf(id));await p.locator('#birthdate').fill(minor?'2015-01-01':'2000-01-01');await p.locator('#gender').selectOption('M');await p.locator('#phone').fill('12999999999');}
async function address(p:Page){await p.getByRole('button',{name:'Próximo',exact:true}).click();await p.locator('#cep').fill('12500000');await p.locator('#street').fill('Rua de Teste');await p.locator('#number').fill('1');await p.locator('#neighborhood').fill('Bairro');await p.locator('#city').fill('Guaratingueta');await p.locator('#state').fill('SP');await p.locator('p-step-item').nth(1).getByRole('button',{name:'Próximo',exact:true}).click();}
async function credentials(p:Page,id:number,password='abcdefgh'){await p.locator('#email').fill(id+'@example.invalid');await p.locator('#password').fill(password);await p.locator('#confirmPassword').fill(password);}
async function login(p:Page,id:string){await p.goto('/login');await p.locator('#identificador').fill(id);await p.locator('#password').fill('abcdefgh');await p.getByRole('button',{name:'ENTRAR',exact:true}).click();await expect(p).toHaveURL(/home/);}
test('cadastro adulto, senha mínima, login CPF/e-mail, sessão e CPF único',async({page})=>{
 await personal(page,seed);await address(page);await credentials(page,seed,'abcdefg');await page.getByRole('button',{name:'Finalizar'}).click();await expect(page.getByRole('alert')).toContainText('8 a 128');await credentials(page,seed);await page.getByRole('button',{name:'Finalizar'}).click();await expect(page).toHaveURL(/login.*cadastrado/);
 await login(page,cpf(seed));await expect(page.getByText('Olá, Adulto Teste')).toBeVisible();await page.reload();await expect(page.getByText('Olá, Adulto Teste')).toBeVisible();await page.getByRole('button',{name:'Sair',exact:true}).click();await expect(page).toHaveURL(/login/);
 await login(page,seed+'@example.invalid');await page.getByRole('button',{name:'Sair',exact:true}).click();await personal(page,seed);await address(page);await credentials(page,seed+1);await page.getByRole('button',{name:'Finalizar'}).click();await expect(page.getByRole('alert')).toBeVisible();await expect(page).toHaveURL(/registration/);
});
test('CPF inválido, nascimento futuro e responsável obrigatório',async({page})=>{
 await personal(page,seed+2);await page.locator('#cpf').fill('11111111111');await page.getByRole('button',{name:'Próximo',exact:true}).click();await expect(page.getByRole('alert')).toBeVisible();await page.locator('#cpf').fill(cpf(seed+2));await page.locator('#birthdate').fill('2999-01-01');await page.getByRole('button',{name:'Próximo',exact:true}).click();await expect(page.getByRole('alert')).toBeVisible();
 await page.locator('#birthdate').fill('2015-01-01');await page.getByRole('button',{name:'Próximo',exact:true}).click();await expect(page.locator('#guardianName')).toBeVisible();await expect(page.locator('#cep')).not.toBeVisible();
});
test('menor sem CPF, responsável adulto e conta com dependente',async({page})=>{
 await personal(page,seed+3,true);await page.locator('#guardianName').fill('Responsável Teste');await page.locator('#guardianCpf').fill(cpf(seed+4));await page.locator('#guardianBirthdate').fill('2015-01-01');await page.locator('#guardianPhone').fill('12988888888');await page.locator('#kinship').fill('Pai');await page.getByRole('button',{name:'Próximo',exact:true}).click();await expect(page.getByRole('alert')).toContainText('18 anos');await page.locator('#guardianBirthdate').fill('1980-01-01');await address(page);await credentials(page,seed+4);await page.getByRole('button',{name:'Finalizar'}).click();await expect(page).toHaveURL(/login.*cadastrado/);await login(page,cpf(seed+4));await expect(page.getByText('Olá, Responsável Teste')).toBeVisible();await expect(page.getByText('Dependente Teste',{exact:true})).toBeVisible();
});
test('layout móvel e rotas administrativas protegidas',async({page})=>{
 await page.setViewportSize({width:360,height:844});await page.goto('/login');await expect(page.locator('#identificador')).toBeVisible();await page.screenshot({path:'test-results/login-mobile.png',fullPage:true});await page.goto('/manage-hubs');await expect(page).toHaveURL(/login/);await page.goto('/registration');await expect(page.locator('#name')).toBeVisible();await page.screenshot({path:'test-results/registration-mobile.png',fullPage:true});
});

test('login responsivo e navegação por teclado sem erros em execução',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [360,768,1280]){
  await page.setViewportSize({width,height:900});await page.goto('/login');
  await expect(page.locator('#identificador')).toBeVisible();
  await expect(page.locator('#password')).toBeVisible();
  await page.keyboard.press('Tab');await expect(page.locator('#identificador')).toBeFocused();
  await page.keyboard.press('Tab');await expect(page.locator('#password')).toBeFocused();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
  expect(overflow).toBe(false);
 }
 expect(errors).toEqual([]);
});
