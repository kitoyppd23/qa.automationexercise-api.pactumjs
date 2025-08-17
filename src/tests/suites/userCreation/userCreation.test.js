/**
 * Testes de Criação de Usuários - ServeRest API
 * Implementa padrão Triple A (Arrange, Act, Assert)
 * 
 * Endpoint testado:
 * - POST /usuarios - Criar usuário
 */
const { spec } = require('pactum');

// Função para gerar email único
function generateUniqueEmail() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `usuario_${timestamp}_${random}@teste.com`;
}

describe('Testes de Criação de Usuários - ServeRest API', () => {

  // ===== TESTES DE CRIAÇÃO COM SUCESSO =====

  test('Deve criar usuário com sucesso', async () => {
    // ARRANGE - Preparação dos dados
    const userData = {
      nome: 'Fulano da Silva',
      email: generateUniqueEmail(),
      password: 'teste',
      administrador: 'true'
    };

    console.log('📤 REQUEST:', {
      method: 'POST',
      url: 'https://serverest.dev/usuarios',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: userData
    });

    // ACT - Executa a criação do usuário
    const response = await spec()
      .post('https://serverest.dev/usuarios')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withJson(userData)
      .expectStatus(201);

    console.log('📥 RESPONSE:', {
      status: response.statusCode,
      headers: response.headers,
      body: response.body
    });

    // ASSERT - Valida a resposta
    expect(response.body).toHaveProperty('message', 'Cadastro realizado com sucesso');
    expect(response.body).toHaveProperty('_id');
    expect(response.body._id).toMatch(/^[A-Za-z0-9]+$/);
  });

  test('Deve validar contrato da resposta de criação com sucesso', async () => {
    // ARRANGE - Preparação dos dados
    const userData = {
      nome: 'Beltrano Santos',
      email: generateUniqueEmail(),
      password: 'teste123',
      administrador: 'false'
    };

    // ACT - Executa a criação
    const response = await spec()
      .post('https://serverest.dev/usuarios')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withJson(userData)
      .expectStatus(201);

    // ASSERT - Valida contrato
    expect(response.body).toMatchObject({
      message: 'Cadastro realizado com sucesso',
      _id: expect.stringMatching(/^[A-Za-z0-9]+$/)
    });
  });

  // ===== TESTES DE CONTRATO =====

  test('Deve validar estrutura completa da resposta de criação', async () => {
    // ARRANGE - Preparação dos dados
    const userData = {
      nome: 'Ciclano Oliveira',
      email: generateUniqueEmail(),
      password: 'senha123',
      administrador: 'true'
    };

    // ACT - Executa a criação
    const response = await spec()
      .post('https://serverest.dev/usuarios')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withJson(userData)
      .expectStatus(201);

    // ASSERT - Valida estrutura completa
    expect(response.body).toMatchObject({
      message: expect.any(String),
      _id: expect.any(String)
    });

    // Validações específicas
    expect(response.body.message).toBe('Cadastro realizado com sucesso');
    expect(response.body._id.length).toBeGreaterThan(0);
    expect(response.body._id).toMatch(/^[A-Za-z0-9]+$/);
  });

  // ===== TESTES NEGATIVOS =====

  test('Deve falhar ao tentar criar usuário com email já existente', async () => {
    // ARRANGE - Preparação dos dados
    const userData = {
      nome: 'Usuário Duplicado',
      email: 'beltrano@qa.com.br', // Email que já existe
      password: 'teste',
      administrador: 'false'
    };

    // ACT & ASSERT - Executa e valida falha
    await spec()
      .post('https://serverest.dev/usuarios')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withJson(userData)
      .expectStatus(400)
      .expectJson({
        message: 'Este email já está sendo usado'
      });
  });

  test('Deve falhar ao tentar criar usuário sem nome', async () => {
    // ARRANGE - Preparação dos dados
    const userData = {
      email: generateUniqueEmail(),
      password: 'teste',
      administrador: 'false'
    };

    // ACT & ASSERT - Executa e valida falha
    await spec()
      .post('https://serverest.dev/usuarios')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withJson(userData)
      .expectStatus(400);
  });

  test('Deve falhar ao tentar criar usuário sem email', async () => {
    // ARRANGE - Preparação dos dados
    const userData = {
      nome: 'Usuário Sem Email',
      password: 'teste',
      administrador: 'false'
    };

    // ACT & ASSERT - Executa e valida falha
    await spec()
      .post('https://serverest.dev/usuarios')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withJson(userData)
      .expectStatus(400);
  });

  test('Deve falhar ao tentar criar usuário sem senha', async () => {
    // ARRANGE - Preparação dos dados
    const userData = {
      nome: 'Usuário Sem Senha',
      email: generateUniqueEmail(),
      administrador: 'false'
    };

    // ACT & ASSERT - Executa e valida falha
    await spec()
      .post('https://serverest.dev/usuarios')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withJson(userData)
      .expectStatus(400);
  });

  test('Deve falhar ao tentar criar usuário com email inválido', async () => {
    // ARRANGE - Preparação dos dados
    const userData = {
      nome: 'Usuário Email Inválido',
      email: 'email_invalido',
      password: 'teste',
      administrador: 'false'
    };

    // ACT & ASSERT - Executa e valida falha
    await spec()
      .post('https://serverest.dev/usuarios')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withJson(userData)
      .expectStatus(400);
  });

});
