/**
 * Testes de Busca de Usuário por ID - ServeRest API
 * Implementa padrão Triple A (Arrange, Act, Assert)
 * 
 * Endpoint testado:
 * - GET /usuarios/{_id} - Buscar usuário por ID
 */
const { spec } = require('pactum');

describe('Testes de Busca de Usuário por ID - ServeRest API', () => {

  // ===== TESTES DE BUSCA POR ID =====

  test('Deve buscar usuário por ID usando dados da listagem', async () => {
    // ARRANGE - Primeiro lista todos os usuários
    const listResponse = await spec()
      .get('https://serverest.dev/usuarios')
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    // Pega um usuário aleatório da lista
    const randomIndex = Math.floor(Math.random() * listResponse.body.usuarios.length);
    const randomUser = listResponse.body.usuarios[randomIndex];
    const userId = randomUser._id;

    console.log('🔍 Buscando usuário com ID:', userId);
    console.log('📋 Dados armazenados:', {
      nome: randomUser.nome,
      email: randomUser.email,
      administrador: randomUser.administrador,
      _id: randomUser._id
    });

    // ACT - Busca o usuário específico por ID
    const searchResponse = await spec()
      .get(`https://serverest.dev/usuarios/${userId}`)
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    console.log('📥 Dados retornados:', {
      nome: searchResponse.body.nome,
      email: searchResponse.body.email,
      administrador: searchResponse.body.administrador,
      _id: searchResponse.body._id
    });

    // ASSERT - Valida se os dados batem com os armazenados
    expect(searchResponse.body).toMatchObject({
      nome: randomUser.nome,
      email: randomUser.email,
      password: randomUser.password,
      administrador: randomUser.administrador,
      _id: randomUser._id
    });
  });

  test('Deve buscar usuário por ID específico', async () => {
    // ARRANGE - ID de um usuário conhecido
    const userId = '0PrFpvsz3h3S82RH'; // ID do exemplo que você mostrou

    // ACT - Busca o usuário específico
    const response = await spec()
      .get(`https://serverest.dev/usuarios/${userId}`)
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    // ASSERT - Valida a estrutura e dados específicos
    expect(response.body).toMatchObject({
      nome: expect.any(String),
      email: expect.any(String),
      password: expect.any(String),
      administrador: expect.any(String),
      _id: userId
    });

    // Validações específicas baseadas no exemplo
    expect(response.body.nome.length).toBeGreaterThan(0);
    expect(response.body.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(response.body.password.length).toBeGreaterThan(0);
    expect(['true', 'false']).toContain(response.body.administrador);
  });

  test('Deve falhar ao buscar usuário com ID inválido', async () => {
    // ARRANGE - ID inválido
    const invalidUserId = 'ID_INVALIDO_123';

    // ACT & ASSERT - Deve retornar erro
    await spec()
      .get(`https://serverest.dev/usuarios/${invalidUserId}`)
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(400);
  });

  // ===== TESTES DE CONTRATO =====

  test('Deve validar contrato da resposta de busca por ID', async () => {
    // ARRANGE - Primeiro pega um ID válido da listagem
    const listResponse = await spec()
      .get('https://serverest.dev/usuarios')
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    const userId = listResponse.body.usuarios[0]._id;

    // ACT - Busca o usuário
    const response = await spec()
      .get(`https://serverest.dev/usuarios/${userId}`)
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    // ASSERT - Valida contrato
    expect(response.body).toMatchObject({
      nome: expect.any(String),
      email: expect.any(String),
      password: expect.any(String),
      administrador: expect.any(String),
      _id: expect.any(String)
    });
  });

  test('Deve validar estrutura completa de usuário retornado por ID', async () => {
    // ARRANGE - Primeiro pega um ID válido da listagem
    const listResponse = await spec()
      .get('https://serverest.dev/usuarios')
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    const userId = listResponse.body.usuarios[0]._id;

    // ACT - Busca o usuário
    const response = await spec()
      .get(`https://serverest.dev/usuarios/${userId}`)
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    // ASSERT - Valida estrutura completa
    const user = response.body;
    
    // Valida estrutura básica
    expect(user).toHaveProperty('nome');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('password');
    expect(user).toHaveProperty('administrador');
    expect(user).toHaveProperty('_id');

    // Valida tipos
    expect(typeof user.nome).toBe('string');
    expect(typeof user.email).toBe('string');
    expect(typeof user.password).toBe('string');
    expect(typeof user.administrador).toBe('string');
    expect(typeof user._id).toBe('string');

    // Validações específicas
    expect(user.nome.length).toBeGreaterThan(0);
    expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(user.password.length).toBeGreaterThan(0);
    expect(['true', 'false']).toContain(user.administrador);
    expect(user._id.length).toBeGreaterThan(0);
    expect(user._id).toBe(userId); // ID deve ser o mesmo que foi buscado
  });

});
