/**
 * Testes de Alteração de Usuário por ID - ServeRest API
 * Implementa padrão Triple A (Arrange, Act, Assert)
 * 
 * Endpoint testado:
 * - PUT /usuarios/{_id} - Alterar usuário por ID
 */
const { spec } = require('pactum');

// Função para gerar email único
function generateUniqueEmail() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `usuario_${timestamp}_${random}@teste.com`;
}

describe('Testes de Alteração de Usuário por ID - ServeRest API', () => {

  // ===== TESTES DE ALTERAÇÃO COM SUCESSO =====

  test('Deve alterar usuário por ID com sucesso', async () => {
    // ARRANGE - Primeiro cria um usuário para depois alterar
    const userData = {
      nome: 'Usuário Original',
      email: generateUniqueEmail(),
      password: 'teste123',
      administrador: 'false'
    };

    console.log('📝 Criando usuário para alteração:', {
      nome: userData.nome,
      email: userData.email
    });

    // Cria o usuário
    const createResponse = await spec()
      .post('https://serverest.dev/usuarios')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withJson(userData)
      .expectStatus(201);

    const userId = createResponse.body._id;
    console.log('✅ Usuário criado com ID:', userId);

    // Dados para alteração
    const updateData = {
      nome: 'Bruce Wayne',
      email: userData.email, // Mantém o mesmo email
      password: 'batman123',
      administrador: 'true'
    };

    console.log('🔄 Alterando usuário para:', updateData.nome);

    // ACT - Altera o usuário
    const updateResponse = await spec()
      .put(`https://serverest.dev/usuarios/${userId}`)
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withJson(updateData)
      .expectStatus(200);

    console.log('📥 Resposta da alteração:', updateResponse.body);

    // ASSERT - Valida a resposta
    expect(updateResponse.body).toHaveProperty('message', 'Registro alterado com sucesso');
  });

  test('Deve alterar usuário específico por ID', async () => {
    // ARRANGE - ID de um usuário conhecido
    const userId = '0uxuPY0cbmQhpEz1'; // ID do exemplo que você mostrou

    const updateData = {
      nome: 'Fulano da Lopes',
      email: 'beltrano@qa.com.br',
      password: 'teste',
      administrador: 'true'
    };

    console.log('🔄 Alterando usuário específico com ID:', userId);

    // ACT - Altera o usuário
    const response = await spec()
      .put(`https://serverest.dev/usuarios/${userId}`)
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withJson(updateData)
      .expectStatus(200);

    console.log('📥 Resposta:', response.body);

    // ASSERT - Valida a resposta
    expect(response.body).toHaveProperty('message', 'Registro alterado com sucesso');
  });

  // ===== TESTES NEGATIVOS =====

  test('Deve falhar ao tentar alterar usuário com email já existente', async () => {
    // ARRANGE - Primeiro cria dois usuários
    const user1Data = {
      nome: 'Usuário 1',
      email: generateUniqueEmail(),
      password: 'teste123',
      administrador: 'false'
    };

    const user2Data = {
      nome: 'Usuário 2',
      email: generateUniqueEmail(),
      password: 'teste456',
      administrador: 'false'
    };

    // Cria o primeiro usuário
    const create1Response = await spec()
      .post('https://serverest.dev/usuarios')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withJson(user1Data)
      .expectStatus(201);

    // Cria o segundo usuário
    const create2Response = await spec()
      .post('https://serverest.dev/usuarios')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withJson(user2Data)
      .expectStatus(201);

    const userId1 = create1Response.body._id;
    const userId2 = create2Response.body._id;

    console.log('📝 Usuários criados:', { user1: userId1, user2: userId2 });

    // Dados para alteração (tentando usar email do usuário 1 no usuário 2)
    const updateData = {
      nome: 'Usuário 2 Alterado',
      email: user1Data.email, // Email já existente do usuário 1
      password: 'teste789',
      administrador: 'true'
    };

    console.log('❌ Tentando alterar usuário com email já existente');

    // ACT & ASSERT - Deve falhar
    await spec()
      .put(`https://serverest.dev/usuarios/${userId2}`)
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withJson(updateData)
      .expectStatus(400)
      .expectJson({
        message: 'Este email já está sendo usado'
      });
  });

  // ===== TESTES DE CONTRATO =====

  test('Deve validar contrato da resposta de alteração com sucesso', async () => {
    // ARRANGE - Cria um usuário para alterar
    const userData = {
      nome: 'Usuário para Contrato',
      email: generateUniqueEmail(),
      password: 'teste123',
      administrador: 'false'
    };

    const createResponse = await spec()
      .post('https://serverest.dev/usuarios')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withJson(userData)
      .expectStatus(201);

    const userId = createResponse.body._id;

    const updateData = {
      nome: 'Usuário Alterado',
      email: userData.email,
      password: 'senha123',
      administrador: 'true'
    };

    // ACT - Altera o usuário
    const response = await spec()
      .put(`https://serverest.dev/usuarios/${userId}`)
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withJson(updateData)
      .expectStatus(200);

    // ASSERT - Valida contrato
    expect(response.body).toMatchObject({
      message: 'Registro alterado com sucesso'
    });
  });

  test('Deve validar contrato da resposta quando email já existe', async () => {
    // ARRANGE - Cria um usuário
    const userData = {
      nome: 'Usuário Teste',
      email: generateUniqueEmail(),
      password: 'teste123',
      administrador: 'false'
    };

    const createResponse = await spec()
      .post('https://serverest.dev/usuarios')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withJson(userData)
      .expectStatus(201);

    const userId = createResponse.body._id;

    // Tenta alterar com email que já existe (beltrano@qa.com.br)
    const updateData = {
      nome: 'Usuário com Email Existente',
      email: 'beltrano@qa.com.br', // Email que já existe
      password: 'teste456',
      administrador: 'true'
    };

    // ACT - Tenta alterar usuário com email já existente
    const response = await spec()
      .put(`https://serverest.dev/usuarios/${userId}`)
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withJson(updateData)
      .expectStatus(400);

    // ASSERT - Valida contrato
    expect(response.body).toMatchObject({
      message: 'Este email já está sendo usado'
    });
  });

  test('Deve criar novo usuário quando ID não existe', async () => {
    // ARRANGE - ID que não existe
    const nonExistentUserId = 'ID_QUE_NAO_EXISTE_123';

    const newUserData = {
      nome: 'Novo Usuário Criado',
      email: generateUniqueEmail(),
      password: 'teste123',
      administrador: 'false'
    };

    console.log('🆕 Tentando alterar usuário que não existe (deve criar novo)');

    // ACT - Tenta alterar usuário que não existe (deve criar novo)
    const response = await spec()
      .put(`https://serverest.dev/usuarios/${nonExistentUserId}`)
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withJson(newUserData)
      .expectStatus(201); // Deve retornar 201 (Created) pois criou novo usuário

    console.log('📥 Resposta da criação:', response.body);

    // ASSERT - Valida que criou um novo usuário
    expect(response.body).toHaveProperty('message', 'Cadastro realizado com sucesso');
    expect(response.body).toHaveProperty('_id');
    expect(response.body._id).toMatch(/^[A-Za-z0-9]+$/);
  });

});
