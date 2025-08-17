/**
 * Testes de Listagem de Usuários - ServeRest API
 * Implementa padrão Triple A (Arrange, Act, Assert)
 * 
 * Endpoint testado:
 * - GET /usuarios - Listar usuários
 */
const { spec } = require('pactum');

describe('Testes de Listagem de Usuários - ServeRest API', () => {

  // ===== TESTES DE LISTAGEM COM SUCESSO =====

  test('Deve listar todos os usuários com sucesso', async () => {
    // ARRANGE - Preparação (não necessária para este teste)

    console.log('📤 REQUEST:', {
      method: 'GET',
      url: 'https://serverest.dev/usuarios',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    // ACT - Executa a busca de usuários
    const response = await spec()
      .get('https://serverest.dev/usuarios')
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    console.log('📥 RESPONSE:', {
      status: response.statusCode,
      headers: response.headers,
      body: {
        quantidade: response.body.quantidade,
        usuarios: `${response.body.usuarios.length} usuários retornados`
      }
    });

    // ASSERT - Valida a resposta
    expect(response.body).toHaveProperty('quantidade');
    expect(response.body).toHaveProperty('usuarios');
    expect(response.body.quantidade).toBeGreaterThan(0);
    expect(Array.isArray(response.body.usuarios)).toBe(true);
  });

  test('Deve validar contrato da resposta de listagem de usuários', async () => {
    // ARRANGE - Preparação
    
    // ACT - Executa a busca
    const response = await spec()
      .get('https://serverest.dev/usuarios')
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    // ASSERT - Valida contrato
    expect(response.body).toMatchObject({
      quantidade: expect.any(Number),
      usuarios: expect.any(Array)
    });
  });

  // ===== TESTES DE CONTRATO =====

  test('Deve validar estrutura completa de um usuário', async () => {
    // ARRANGE - Busca usuários
    const response = await spec()
      .get('https://serverest.dev/usuarios')
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    // ACT & ASSERT - Valida estrutura do primeiro usuário
    if (response.body.usuarios.length > 0) {
      const user = response.body.usuarios[0];
      
      // Valida estrutura completa
      expect(user).toMatchObject({
        nome: expect.any(String),
        email: expect.any(String),
        password: expect.any(String),
        administrador: expect.any(String),
        _id: expect.any(String)
      });

      // Validações específicas
      expect(user.nome.length).toBeGreaterThan(0);
      expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/); // Formato de email
      expect(user.password.length).toBeGreaterThan(0);
      expect(['true', 'false']).toContain(user.administrador);
      expect(user._id.length).toBeGreaterThan(0);
    }
  });

  test('Deve validar que todos os usuários têm estrutura consistente', async () => {
    // ARRANGE - Busca usuários
    const response = await spec()
      .get('https://serverest.dev/usuarios')
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    // ACT & ASSERT - Valida estrutura de todos os usuários
    response.body.usuarios.forEach((user, index) => {
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
    });
  });

});
