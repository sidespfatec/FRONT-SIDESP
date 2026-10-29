import { expect, Page, test } from '@playwright/test';

// Execução explícita em ambiente de desenvolvimento, com uma conta de teste já autorizada.
test.skip(!process.env['E2E_ADMIN_CPF'] || !process.env['E2E_ADMIN_PASSWORD'], 'Informe a conta administrativa de teste pelo ambiente.');
test.describe.configure({mode:'serial'});
const suffix=Date.now().toString();
const seed=730000000+Date.now()%1000000;
const api=process.env['E2E_API_URL'] || 'http://localhost:8080/api/v1';
const testPassword='TesteSomenteUI2026!';
let token='';
const created:{domain:string;id:number}[]=[];

/** Calcula CPF sintético para não usar identificadores de pessoas reais. */
function cpf(seed:number):string {
  let value=String(seed).padStart(9,'7');
  for(let size=9;size<11;size++){
    let sum=0;for(let i=0;i<size;i++)sum+=Number(value[i])*(size+1-i);
    const digit=11-sum%11;value+=digit>=10?0:digit;
  }
  return value;
}

/** Preenche o formulário que ambos os tipos de profissional compartilham. */
async function professional(page:Page, name:string, seed:number):Promise<void> {
  const fields:Record<string,string>={'Nome completo *':name,'CPF *':cpf(seed),'Data de nascimento *':'1990-01-01','E-mail *':seed+'-'+suffix+'@example.invalid','Telefone *':'12999999999','CEP *':'12500000','Rua *':'Rua Ficticia de Teste','Número *':'1','Bairro *':'Teste','Cidade *':'Cidade de Teste','UF *':'SP','Senha inicial *':testPassword,'Confirmar senha *':testPassword};
  for(const [label,value] of Object.entries(fields)) await page.getByLabel(label,{exact:true}).fill(value);
  await page.getByLabel('Gênero *',{exact:true}).selectOption('M');
}

test.beforeAll(async({request})=>{
  const response=await request.post(api+'/auth/login',{data:{identificador:process.env['E2E_ADMIN_CPF'],senha:process.env['E2E_ADMIN_PASSWORD']}});
  expect(response.status()).toBe(200);
  const result=await response.json();expect(result.perfil).toBe('ADMINISTRADOR_TOTAL');token=result.accessToken;
});

test.beforeEach(async({page})=>{
  await page.goto('/login');
  await page.locator('input[name="identificador"], p-inputmask input').first().fill(process.env['E2E_ADMIN_CPF']!);
  await page.getByLabel('Senha',{exact:true}).fill(process.env['E2E_ADMIN_PASSWORD']!);
  await page.getByRole('button',{name:/ENTRAR/}).click();
  await expect(page).toHaveURL(/manage-hubs/);
});

test.afterAll(async({request})=>{
  // Os registros sintéticos ficam inativos, preservando histórico e demais dados do ambiente.
  for(const item of created.reverse()){
    const response=await request.patch(api+'/admin/'+item.domain+'/'+item.id+'/situacao',{headers:{Authorization:'Bearer '+token},data:{ativo:false}});
    expect(response.ok()).toBeTruthy();
  }
});

test('cadastra professor e administrador, recarrega e altera situação real',async({page,request})=>{
  for(const [administrator,domain,route] of [[false,'professores','/manage-teachers'],[true,'administradores','/manage-admin']] as const){
    const name=(administrator?'Admin parcial UI ':'Professor UI ')+suffix;
    await page.goto(route);
    await page.getByRole('button',{name:administrator?'Novo administrador':'Novo professor',exact:true}).click();
    await professional(page,name,administrator?seed+1:seed);
    if(administrator)await page.getByLabel('Nível de permissão *',{exact:true}).selectOption('ADMINISTRADOR_PARCIAL');
    else {await page.getByLabel('Registro profissional',{exact:true}).fill('TESTE-UI');await page.getByLabel('Especialidade',{exact:true}).fill('Esporte de teste');}
    await page.getByRole('button',{name:'Cadastrar',exact:true}).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await page.reload();
    const row=page.getByRole('listitem').filter({hasText:name});await expect(row).toBeVisible();
    const response=await request.get(api+'/admin/'+domain,{headers:{Authorization:'Bearer '+token}});
    const saved=(await response.json()).find((item:{nome:string})=>item.nome===name);expect(saved).toBeTruthy();
    created.push({domain,id:saved.id});
    await row.getByRole('button',{name:'Inativar',exact:true}).click();
    await expect(row.getByText('Inativo',{exact:false})).toBeVisible();
    await page.reload();await expect(row.getByText('Inativo',{exact:false})).toBeVisible();
    await row.getByRole('button',{name:'Reativar',exact:true}).click();
    await expect(row.getByRole('button',{name:'Inativar',exact:true})).toBeVisible();
  }
});

test('cadastra polo, usa polo ativo na modalidade e persiste os filtros',async({page,request})=>{
  const hubName='Polo UI '+suffix,modalityName='Modalidade UI '+suffix;
  await page.getByRole('button',{name:'Novo polo',exact:true}).click();
  for(const [label,value] of Object.entries({'Nome *':hubName,'CEP *':'12500000','Rua *':'Rua Ficticia de Teste','Número *':'1','Bairro *':'Teste','Cidade *':'Cidade de Teste','UF *':'SP','Latitude *':'-22.816','Longitude *':'-45.193'}))await page.getByLabel(label,{exact:true}).fill(value);
  await page.getByRole('button',{name:'Cadastrar',exact:true}).click();await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.reload();await expect(page.getByRole('listitem').filter({hasText:hubName})).toBeVisible();
  const hubs=await request.get(api+'/admin/polos',{headers:{Authorization:'Bearer '+token}});const hub=(await hubs.json()).find((h:{nome:string})=>h.nome===hubName);expect(hub).toBeTruthy();created.push({domain:'polos',id:hub.id});
  await page.goto('/manage-modalites/new-modality');
  await page.getByLabel('Nome *',{exact:true}).fill(modalityName);
  await page.getByLabel('Idade mínima *',{exact:true}).fill('10');await page.getByLabel('Idade máxima *',{exact:true}).fill('8');
  await page.getByLabel('Limite de faltas mensais *',{exact:true}).fill('4');await page.getByLabel('Polo *',{exact:true}).selectOption({label:hubName});
  await page.getByRole('button',{name:'Cadastrar',exact:true}).click();await expect(page.getByRole('alert')).toContainText('mínima');
  await page.getByLabel('Idade máxima *',{exact:true}).fill('80');await page.getByRole('button',{name:'Cadastrar',exact:true}).click();await expect(page).toHaveURL(/manage-modalites$/);
  await page.reload();const row=page.getByRole('listitem').filter({hasText:modalityName});await expect(row).toContainText(hubName);
  const modalities=await request.get(api+'/admin/modalidades',{headers:{Authorization:'Bearer '+token}});const modality=(await modalities.json()).find((m:{nome:string})=>m.nome===modalityName);expect(modality.poloId).toBe(hub.id);created.push({domain:'modalidades',id:modality.id});
  await row.getByRole('button',{name:'Inativar',exact:true}).click();await page.getByLabel('Situação',{exact:true}).selectOption('inactive');await expect(row).toBeVisible();
});

test('consulta perfil real e mostra o cartão branco do cadastro',async({page})=>{
  await page.goto('/perfil');await expect(page.getByRole('heading',{name:'Meu perfil',exact:true})).toBeVisible();await expect(page.getByLabel('Nome *',{exact:true})).not.toHaveValue('');
  await page.goto('/registration');
  await expect(page.locator('.registration-card')).toHaveCSS('background-color','rgb(245, 245, 245)');
  await expect(page.getByLabel('Nome Completo',{exact:true})).toBeVisible();
  await page.screenshot({path:'.local/codespaces/cadastro-integrado.png',fullPage:true});
});
