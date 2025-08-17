/**
 * Testes de Edição de Produto por ID - ServeRest API
 * Implementa padrão Triple A (Arrange, Act, Assert)
 *
 * Endpoint testado:
 * - PUT /produtos/{_id} - Editar produto por ID
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

describe('Testes de Edição de Produto por ID - ServeRest API', () => {

  // ===== TESTES DE EDIÇÃO COM SUCESSO =====

  test('Deve editar produto com sucesso alterando o nome', async () => {
    // ARRANGE - Obtém token de autenticação
    const authToken = await getAuthToken();

    // Primeiro cria um produto para depois editá-lo
    const createProductData = {
      nome: generateUniqueProductName(),
      preco: 100,
      descricao: 'Produto para edição',
      quantidade: 5
    };

    const createResponse = await spec()
      .post('https://serverest.dev/produtos')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authToken
      })
      .withJson(createProductData)
      .expectStatus(201);

    const productId = createResponse.body._id;

    // Dados para edição (alterando o nome)
    const updateData = {
      nome: generateUniqueProductName(), // Novo nome único
      preco: 150,
      descricao: 'Produto editado',
      quantidade: 10
    };

    console.log('📤 REQUEST:', {
      method: 'PUT',
      url: `https://serverest.dev/produtos/${productId}`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authToken
      },
      body: updateData
    });

    // ACT - Executa a edição
    const response = await spec()
      .put(`https://serverest.dev/produtos/${productId}`)
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authToken
      })
      .withJson(updateData)
      .expectStatus(200);

    console.log('📥 RESPONSE:', {
      status: response.statusCode,
      headers: response.headers,
      body: response.body
    });

    // ASSERT - Valida a resposta
    expect(response.body).toHaveProperty('message', 'Registro alterado com sucesso');
  });

  test('Deve editar produto com sucesso alterando apenas quantidade', async () => {
    // ARRANGE - Obtém token de autenticação
    const authToken = await getAuthToken();

    // Primeiro cria um produto para depois editá-lo
    const createProductData = {
      nome: generateUniqueProductName(),
      preco: 200,
      descricao: 'Produto para edição de quantidade',
      quantidade: 1
    };

    const createResponse = await spec()
      .post('https://serverest.dev/produtos')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authToken
      })
      .withJson(createProductData)
      .expectStatus(201);

    const productId = createResponse.body._id;

    // Dados para edição (alterando apenas quantidade)
    const updateData = {
      nome: createProductData.nome, // Mesmo nome
      preco: createProductData.preco, // Mesmo preço
      descricao: createProductData.descricao, // Mesma descrição
      quantidade: 50 // Nova quantidade
    };

    console.log('📤 REQUEST:', {
      method: 'PUT',
      url: `https://serverest.dev/produtos/${productId}`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authToken
      },
      body: updateData
    });

    // ACT - Executa a edição
    const response = await spec()
      .put(`https://serverest.dev/produtos/${productId}`)
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authToken
      })
      .withJson(updateData)
      .expectStatus(200);

    console.log('📥 RESPONSE:', {
      status: response.statusCode,
      headers: response.headers,
      body: response.body
    });

    // ASSERT - Valida a resposta
    expect(response.body).toHaveProperty('message', 'Registro alterado com sucesso');
  });

  // ===== TESTES NEGATIVOS =====

  test('Deve falhar ao tentar editar produto com nome já existente', async () => {
    // ARRANGE - Obtém token de autenticação
    const authToken = await getAuthToken();

    // Primeiro cria dois produtos
    const product1Data = {
      nome: generateUniqueProductName(),
      preco: 100,
      descricao: 'Primeiro produto',
      quantidade: 5
    };

    const product2Data = {
      nome: generateUniqueProductName(),
      preco: 200,
      descricao: 'Segundo produto',
      quantidade: 10
    };

    // Cria o primeiro produto
    const create1Response = await spec()
      .post('https://serverest.dev/produtos')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authToken
      })
      .withJson(product1Data)
      .expectStatus(201);

    // Cria o segundo produto
    const create2Response = await spec()
      .post('https://serverest.dev/produtos')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authToken
      })
      .withJson(product2Data)
      .expectStatus(201);

    const product2Id = create2Response.body._id;

    // Tenta editar o segundo produto usando o nome do primeiro
    const updateData = {
      nome: product1Data.nome, // Nome que já existe
      preco: 300,
      descricao: 'Tentativa de edição',
      quantidade: 15
    };

    console.log('📤 REQUEST:', {
      method: 'PUT',
      url: `https://serverest.dev/produtos/${product2Id}`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authToken
      },
      body: updateData
    });

    // ACT & ASSERT - Deve falhar
    const response = await spec()
      .put(`https://serverest.dev/produtos/${product2Id}`)
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authToken
      })
      .withJson(updateData)
      .expectStatus(400);

    console.log('📥 RESPONSE:', {
      status: response.statusCode,
      headers: response.headers,
      body: response.body
    });

    // ASSERT - Valida a resposta de erro
    expect(response.body).toHaveProperty('message', 'Já existe produto com esse nome');
  });

  test('Deve falhar ao tentar editar produto sem autenticação', async () => {
    // ARRANGE - Primeiro cria um produto
    const authToken = await getAuthToken();

    const createProductData = {
      nome: generateUniqueProductName(),
      preco: 100,
      descricao: 'Produto para teste sem auth',
      quantidade: 5
    };

    const createResponse = await spec()
      .post('https://serverest.dev/produtos')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authToken
      })
      .withJson(createProductData)
      .expectStatus(201);

    const productId = createResponse.body._id;

    // Dados para edição
    const updateData = {
      nome: 'Novo Nome',
      preco: 150,
      descricao: 'Descrição editada',
      quantidade: 10
    };

    console.log('📤 REQUEST:', {
      method: 'PUT',
      url: `https://serverest.dev/produtos/${productId}`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        // Sem Authorization header
      },
      body: updateData
    });

    // ACT & ASSERT - Deve falhar por falta de autenticação
    const response = await spec()
      .put(`https://serverest.dev/produtos/${productId}`)
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        // Sem Authorization header
      })
      .withJson(updateData)
      .expectStatus(401);

    console.log('📥 RESPONSE:', {
      status: response.statusCode,
      headers: response.headers,
      body: response.body
    });
  });

  test('Deve falhar ao tentar editar produto com ID inválido', async () => {
    // ARRANGE - Obtém token de autenticação
    const authToken = await getAuthToken();

    // ID inválido
    const invalidProductId = 'ID_INVALIDO_123';

    // Dados para edição
    const updateData = {
      nome: 'Produto Teste',
      preco: 100,
      descricao: 'Descrição teste',
      quantidade: 5
    };

    console.log('📤 REQUEST:', {
      method: 'PUT',
      url: `https://serverest.dev/produtos/${invalidProductId}`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authToken
      },
      body: updateData
    });

    // ACT & ASSERT - Deve falhar
    const response = await spec()
      .put(`https://serverest.dev/produtos/${invalidProductId}`)
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authToken
      })
      .withJson(updateData)
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

  test('Deve validar contrato da resposta de edição com sucesso', async () => {
    // ARRANGE - Obtém token de autenticação
    const authToken = await getAuthToken();

    // Primeiro cria um produto
    const createProductData = {
      nome: generateUniqueProductName(),
      preco: 100,
      descricao: 'Produto para contrato',
      quantidade: 5
    };

    const createResponse = await spec()
      .post('https://serverest.dev/produtos')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authToken
      })
      .withJson(createProductData)
      .expectStatus(201);

    const productId = createResponse.body._id;

    // Dados para edição
    const updateData = {
      nome: generateUniqueProductName(),
      preco: 150,
      descricao: 'Descrição editada',
      quantidade: 10
    };

    // ACT - Executa a edição
    const response = await spec()
      .put(`https://serverest.dev/produtos/${productId}`)
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authToken
      })
      .withJson(updateData)
      .expectStatus(200);

    // ASSERT - Valida contrato
    expect(response.body).toMatchObject({
      message: expect.any(String)
    });

    // Validações específicas
    expect(response.body.message).toBe('Registro alterado com sucesso');
  });

  test('Deve validar contrato da resposta de erro - nome já existente', async () => {
    // ARRANGE - Obtém token de autenticação
    const authToken = await getAuthToken();

    // Primeiro cria dois produtos
    const product1Data = {
      nome: generateUniqueProductName(),
      preco: 100,
      descricao: 'Primeiro produto',
      quantidade: 5
    };

    const product2Data = {
      nome: generateUniqueProductName(),
      preco: 200,
      descricao: 'Segundo produto',
      quantidade: 10
    };

    // Cria o primeiro produto
    await spec()
      .post('https://serverest.dev/produtos')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authToken
      })
      .withJson(product1Data)
      .expectStatus(201);

    // Cria o segundo produto
    const create2Response = await spec()
      .post('https://serverest.dev/produtos')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authToken
      })
      .withJson(product2Data)
      .expectStatus(201);

    const product2Id = create2Response.body._id;

    // Tenta editar o segundo produto usando o nome do primeiro
    const updateData = {
      nome: product1Data.nome, // Nome que já existe
      preco: 300,
      descricao: 'Tentativa de edição',
      quantidade: 15
    };

    // ACT - Tenta editar com nome duplicado
    const response = await spec()
      .put(`https://serverest.dev/produtos/${product2Id}`)
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authToken
      })
      .withJson(updateData)
      .expectStatus(400);

    // ASSERT - Valida contrato
    expect(response.body).toMatchObject({
      message: expect.any(String)
    });

    // Validações específicas
    expect(response.body.message).toBe('Já existe produto com esse nome');
  });

});
