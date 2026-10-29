# Sprint 2 — implementação e limites

Base do frontend: `main`, commit `6018b93e0367177e2b7bc142eef64b3a3a66ddb5`, consultado em 29/10/2026. Backend e regras de cadastro foram reaproveitados da versão enviada. Não houve push nem fechamento de issues no GitHub.

Os estilos e os componentes administrativos da main foram preservados. As únicas mudanças nos componentes atendem login, cadastro previamente integrado e menu por perfil. Não foram criadas páginas sem descrição em `paginas/`.

| Issue | Entregue | Falta para concluir ponta a ponta |
|---|---|---|
| PB08 | HttpClient, environments, proxy, models e services por domínio | Substituir listas fixas nos componentes administrativos e demais módulos |
| PB09 | Login e identidade conectados, sessão na aba | A tela da main recebe CPF; a API também aceita e-mail |
| PB10 | Guard, interceptor, menu parcial/total e autorização real no servidor | Não há telas específicas de aluno e professor na main |
| PB11 | Cadastro adulto e login após conclusão | Validação visual completa em navegador real nesta versão |
| PB12 | API de criação/listagem/situação; total/parcial; CPF único | Ligar formulário e listagem existentes; resolver botão de dois fatores |
| PB13 | API de criação/listagem/situação; registro/especialidade/endereço | Ligar formulário e listagem existentes |
| PB15 | Código por SMTP, prazo de 15 min, uso único, resposta genérica e revogação de sessões | Tela para informar código/nova senha; configurar SMTP no ambiente real |
| PB16 | Consulta/edição do próprio perfil e troca de senha atual | Tela de perfil conectada |
| PB17 | Responsável sem nome/idade/CPF duplicados; endereço e saúde cifrada | Coleta da anamnese na interface e confirmação dos campos com a Secretaria |
| PB18 | Menor pelo cadastro já integrado; outro dependente pelo titular autenticado; anamnese via API | Interface para outro dependente/anamnese e rotina futura de notificações |
| PB19 | API de polos com endereço/coordenadas, busca e situação | Ligar a tela da main aos services |
| PB20 | Faixas/limite mensal, seleção na turma, dias/horários, coordenadas | Validar os campos propostos com a Secretaria; uso do limite mensal na futura rotina de faltas |
| PB21 | API de modalidade com polo ativo, idades e limite de faltas | Ligar formulário/listagem existentes |

## Decisões usadas no código

- Senhas: oito a 128 caracteres, sem exigência de símbolo ou número; confirmação obrigatória.
- Administrador total cria/inativa administradores. Total e parcial gerenciam professores, polos e modalidades. O cadastro público nunca concede esses perfis.
- Profissionais usam a mesma pessoa, conta, documentos, contatos e endereço do cadastro comum; dados de trabalho ficam em `profissionais`.
- Dois fatores não foi implementado: a opção do protótipo não representa proteção disponível no servidor. Não foi criada coluna que fingisse ativar esse recurso.
- Nome, nascimento e CPF do responsável vêm de `pessoas`/`documentos`. `responsaveis` identifica o vínculo adulto; parentesco fica em `responsaveis_dependentes`.
- Ficha médica tem condições, alergias, medicamentos, restrições e contato de emergência. Todos os textos são cifrados. Campos desconhecidos podem ficar nulos; não há diagnóstico ou consentimento preenchido automaticamente.
- A API aceita ficha médica opcional no cadastro público para preservar o contrato anterior; o endpoint autenticado de outro dependente exige ficha. A interface pública atual ainda não a coleta.
- Ficha é lida pela administração ou por professor com vínculo `ATIVO` e aluno `ATIVO` na mesma turma. O titular não escolhe uma conta alheia para vincular dependentes.
- Limite mensal fica em modalidade. `trm_faltas_maximas` permanece como campo legado para preservar dados; a rotina de frequência ainda deverá adotar a modalidade. Não foi aplicado desconto ou cancelamento automático.
- Processo seletivo fica em turma. Horários são linhas por dia da semana (1 segunda, 7 domingo), com início e fim. Não foi criado CRUD de turma fora do escopo.
- Campos novos da oferta são nulos para registros legados; os endpoints exigem os valores de novos cadastros. Nenhuma coordenada ou faixa etária foi inventada para dados antigos.
- `pol_des` e `mdl_des` passam a `VARCHAR(100)`. Inativação preserva registros e impede selecionar polo inativo.

## Próxima integração de telas

As descrições atuais em `paginas/` cobrem cadastro e login. Antes de alterar as demais páginas, a equipe precisa escrever as explicações correspondentes, conforme `AGENTS.md`. Services e contratos desta entrega podem ser usados sem redesenhar as telas, mas ligar os formulários requer alterar suas funções e bindings. Esta entrega não marca esses fluxos como concluídos.
