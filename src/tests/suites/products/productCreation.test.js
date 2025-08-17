/**
 * Testes de Criação de Produtos - ServeRest API
 * Implementa padrão Triple A (Arrange, Act, Assert)
 *
 * Endpoint testado:
 * - POST /produtos - Criar produto
 */
const { spec } = require('pactum');

// Função para gerar nome único de produto
function generateUniqueProductName() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `Produto Teste ${timestamp}_${random}`;
}

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

describe('Testes de Criação de Produtos - ServeRest API', () => {

  // ===== TESTES DE CRIAÇÃO COM SUCESSO =====

  test('Deve criar produto com sucesso', async () => {
    // ARRANGE - Obtém token de autenticação
    const authToken = await getAuthToken();

    // Preparação dos dados do produto
    const productData = {
      nome: generateUniqueProductName(),
      preco: 470,
      descricao: 'Mouse Logitech MX Master',
      quantidade: 2
    };

    console.log('📤 REQUEST:', {
      method: 'POST',
      url: 'https://serverest.dev/produtos',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authToken
      },
      body: productData
    });

    // ACT - Executa a criação do produto
    const response = await spec()
      .post('https://serverest.dev/produtos')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authToken
      })
      .withJson(productData)
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
    // ARRANGE - Obtém token de autenticação
    const authToken = await getAuthToken();

    // Preparação dos dados do produto
    const productData = {
      nome: generateUniqueProductName(),
      preco: 299,
      descricao: 'Teclado Mecânico RGB',
      quantidade: 5
    };

    console.log('📤 REQUEST:', {
      method: 'POST',
      url: 'https://serverest.dev/produtos',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authToken
      },
      body: productData
    });

    // ACT - Executa a criação
    const response = await spec()
      .post('https://serverest.dev/produtos')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authToken
      })
      .withJson(productData)
      .expectStatus(201);

    console.log('📥 RESPONSE:', {
      status: response.statusCode,
      headers: response.headers,
      body: response.body
    });

    // ASSERT - Valida contrato
    expect(response.body).toMatchObject({
      message: 'Cadastro realizado com sucesso',
      _id: expect.stringMatching(/^[A-Za-z0-9]+$/)
    });
  });

  // ===== TESTES DE CONTRATO =====

  test('Deve validar estrutura completa da resposta de criação', async () => {
    // ARRANGE - Obtém token de autenticação
    const authToken = await getAuthToken();

    // Preparação dos dados do produto
    const productData = {
      nome: generateUniqueProductName(),
      preco: 150,
      descricao: 'Mousepad Gaming',
      quantidade: 10
    };

    // ACT - Executa a criação
    const response = await spec()
      .post('https://serverest.dev/produtos')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authToken
      })
      .withJson(productData)
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

  test('Deve falhar ao tentar criar produto com nome já existente', async () => {
    // ARRANGE - Obtém token de autenticação
    const authToken = await getAuthToken();

    // Primeiro cria um produto
    const productData = {
      nome: generateUniqueProductName(),
      preco: 100,
      descricao: 'Produto Original',
      quantidade: 1
    };

    await spec()
      .post('https://serverest.dev/produtos')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authToken
      })
      .withJson(productData)
      .expectStatus(201);

    // Agora tenta criar outro produto com o mesmo nome
    const duplicateProductData = {
      nome: productData.nome, // Mesmo nome
      preco: 200,
      descricao: 'Produto Duplicado',
      quantidade: 2
    };

    console.log('📤 REQUEST:', {
      method: 'POST',
      url: 'https://serverest.dev/produtos',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authToken
      },
      body: duplicateProductData
    });

    // ACT & ASSERT - Deve falhar
    const response = await spec()
      .post('https://serverest.dev/produtos')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authToken
      })
      .withJson(duplicateProductData)
      .expectStatus(400)
      .expectJson({
        message: 'Já existe produto com esse nome'
      });

    console.log('📥 RESPONSE:', {
      status: response.statusCode,
      headers: response.headers,
      body: response.body
    });
  });

  test('Deve falhar ao tentar criar produto sem autenticação', async () => {
    // ARRANGE - Dados do produto sem token
    const productData = {
      nome: generateUniqueProductName(),
      preco: 100,
      descricao: 'Produto sem Auth',
      quantidade: 1
    };

    console.log('📤 REQUEST:', {
      method: 'POST',
      url: 'https://serverest.dev/produtos',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        // Sem Authorization header
      },
      body: productData
    });

    // ACT & ASSERT - Deve falhar por falta de autenticação
    const response = await spec()
      .post('https://serverest.dev/produtos')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        // Sem Authorization header
      })
      .withJson(productData)
      .expectStatus(401);

    console.log('📥 RESPONSE:', {
      status: response.statusCode,
      headers: response.headers,
      body: response.body
    });
  });

});
