/**
 * Testes de Exclusão de Produto por ID - ServeRest API
 * Implementa padrão Triple A (Arrange, Act, Assert)
 *
 * Endpoint testado:
 * - DELETE /produtos/{_id} - Excluir produto por ID
 */
const { spec } = require('pactum');

// Função para obter token de autenticação
async function getAuthToken() {
  // Primeiro faz login para obter o token
  const credentials = [
    { email: 'fulano@qa.com', password: 'teste' },
    { email: 'beltrano@qa.com.br', password: 'teste' }
  ];

  let authToken = null;

  for (const cred of credentials) {
    try {
      console.log('🔐 Tentando login com:', cred.email);

      const response = await spec()
        .post('https://serverest.dev/login')
        .withHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
        .withJson(cred)
        .expectStatus(200);

      authToken = response.body.authorization;
      console.log('✅ Login realizado com sucesso, token obtido');
      break;
    } catch (error) {
      console.log('❌ Falha no login com:', cred.email);
    }
  }

  if (!authToken) {
    throw new Error('Não foi possível obter token de autenticação');
  }

  return authToken;
}

describe('Testes de Exclusão de Produto por ID - ServeRest API', () => {

  // ===== TESTES DE EXCLUSÃO COM SUCESSO =====

  test('Deve excluir produto com sucesso', async () => {
    // ARRANGE - Obtém token de autenticação
    const authToken = await getAuthToken();

    // Primeiro lista produtos para pegar um ID válido
    const listResponse = await spec()
      .get('https://serverest.dev/produtos')
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    const productId = listResponse.body.produtos[0]._id;

    console.log('📤 REQUEST:', {
      method: 'DELETE',
      url: `https://serverest.dev/produtos/${productId}`,
      headers: {
        'Accept': 'application/json',
        'Authorization': authToken
      }
    });

    // ACT - Executa a exclusão
    const response = await spec()
      .delete(`https://serverest.dev/produtos/${productId}`)
      .withHeaders({
        'Accept': 'application/json',
        'Authorization': authToken
      })
      .expectStatus(200);

    console.log('📥 RESPONSE:', {
      status: response.statusCode,
      headers: response.headers,
      body: response.body
    });

    // ASSERT - Valida a resposta
    expect(response.body).toHaveProperty('message', 'Registro excluído com sucesso');
  });

  // ===== TESTES NEGATIVOS =====

  test('Deve falhar ao tentar excluir produto que está no carrinho', async () => {
    // ARRANGE - Obtém token de autenticação
    const authToken = await getAuthToken();

    // ID de produto que está no carrinho
    const productInCartId = 'K6leHdftCeOJj8BJ';

    console.log('📤 REQUEST:', {
      method: 'DELETE',
      url: `https://serverest.dev/produtos/${productInCartId}`,
      headers: {
        'Accept': 'application/json',
        'Authorization': authToken
      }
    });

    // ACT & ASSERT - Deve falhar
    const response = await spec()
      .delete(`https://serverest.dev/produtos/${productInCartId}`)
      .withHeaders({
        'Accept': 'application/json',
        'Authorization': authToken
      })
      .expectStatus(400);

    console.log('📥 RESPONSE:', {
      status: response.statusCode,
      headers: response.headers,
      body: response.body
    });

    // ASSERT - Validações específicas
    expect(response.body).toHaveProperty('message', 'Não é permitido excluir produto que faz parte de carrinho');
    expect(response.body).toHaveProperty('idCarrinhos');
    expect(Array.isArray(response.body.idCarrinhos)).toBe(true);
    expect(response.body.idCarrinhos.length).toBeGreaterThan(0);
    expect(typeof response.body.idCarrinhos[0]).toBe('string');
  });

  test('Deve falhar ao tentar excluir produto sem autenticação', async () => {
    // ARRANGE - Primeiro pega um ID válido da listagem
    const listResponse = await spec()
      .get('https://serverest.dev/produtos')
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    const productId = listResponse.body.produtos[0]._id;

    console.log('📤 REQUEST:', {
      method: 'DELETE',
      url: `https://serverest.dev/produtos/${productId}`,
      headers: {
        'Accept': 'application/json'
        // Sem Authorization header
      }
    });

    // ACT & ASSERT - Deve falhar por falta de autenticação
    const response = await spec()
      .delete(`https://serverest.dev/produtos/${productId}`)
      .withHeaders({
        'Accept': 'application/json'
        // Sem Authorization header
      })
      .expectStatus(401);

    console.log('📥 RESPONSE:', {
      status: response.statusCode,
      headers: response.headers,
      body: response.body
    });
  });

  test('Deve falhar ao tentar excluir produto com ID inválido', async () => {
    // ARRANGE - Obtém token de autenticação
    const authToken = await getAuthToken();

    // ID inválido
    const invalidProductId = 'ID_INVALIDO_123';

    console.log('📤 REQUEST:', {
      method: 'DELETE',
      url: `https://serverest.dev/produtos/${invalidProductId}`,
      headers: {
        'Accept': 'application/json',
        'Authorization': authToken
      }
    });

    // ACT & ASSERT - Deve falhar
    const response = await spec()
      .delete(`https://serverest.dev/produtos/${invalidProductId}`)
      .withHeaders({
        'Accept': 'application/json',
        'Authorization': authToken
      })
      .expectStatus(400)
      .expectJson({
        id: 'id deve ter exatamente 16 caracteres alfanuméricos'
      });

    console.log('📥 RESPONSE:', {
      status: response.statusCode,
      headers: response.headers,
      body: response.body
    });
  });

  // ===== TESTES DE CONTRATO =====

  test('Deve validar contrato da resposta de exclusão com sucesso', async () => {
    // ARRANGE - Obtém token de autenticação
    const authToken = await getAuthToken();

    // Primeiro lista produtos para pegar um ID válido
    const listResponse = await spec()
      .get('https://serverest.dev/produtos')
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    const productId = listResponse.body.produtos[1]._id; // Usa o segundo produto

    // ACT - Executa a exclusão
    const response = await spec()
      .delete(`https://serverest.dev/produtos/${productId}`)
      .withHeaders({
        'Accept': 'application/json',
        'Authorization': authToken
      })
      .expectStatus(200);

    // ASSERT - Valida contrato
    expect(response.body).toMatchObject({
      message: expect.any(String)
    });

    // Validações específicas
    expect(response.body.message).toBe('Registro excluído com sucesso');
  });

  test('Deve validar contrato da resposta de erro - produto no carrinho', async () => {
    // ARRANGE - Obtém token de autenticação
    const authToken = await getAuthToken();

    // ID de produto que está no carrinho
    const productInCartId = 'K6leHdftCeOJj8BJ';

    // ACT - Tenta excluir produto no carrinho
    const response = await spec()
      .delete(`https://serverest.dev/produtos/${productInCartId}`)
      .withHeaders({
        'Accept': 'application/json',
        'Authorization': authToken
      })
      .expectStatus(400);

    // ASSERT - Valida contrato
    expect(response.body).toMatchObject({
      message: expect.any(String),
      idCarrinhos: expect.any(Array)
    });

    // Validações específicas
    expect(response.body.message).toBe('Não é permitido excluir produto que faz parte de carrinho');
    expect(Array.isArray(response.body.idCarrinhos)).toBe(true);
    expect(response.body.idCarrinhos.length).toBeGreaterThan(0);
  });

});
