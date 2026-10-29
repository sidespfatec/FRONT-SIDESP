# Consulta de ficha médica

A rota /fichas-medicas consulta GET /api/v1/fichas-medicas/{id} com um identificador real informado pela pessoa usuária. Administração pode consultar; professor exige vínculo ativo conferido no servidor. A tela limpa a consulta anterior ao buscar outro ID e não persiste os dados em storage. A listagem de alunos depende de endpoint ainda inexistente.
