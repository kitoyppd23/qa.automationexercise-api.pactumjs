/**
 * Testes de Busca de Produto por ID - ServeRest API
 * Implementa padrão Triple A (Arrange, Act, Assert)
 *
 * Endpoint testado:
 * - GET /produtos/{_id} - Buscar produto por ID
 */
const { spec } = require('pactum');

describe('Testes de Busca de Produto por ID - ServeRest API', () => {

  // ===== TESTES DE BUSCA POR ID =====

  test('Deve buscar produto por ID usando dados da listagem', async () => {
    // ARRANGE - Primeiro lista todos os produtos
    const listResponse = await spec()
      .get('https://serverest.dev/produtos')
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    // Pega um produto aleatório da lista
    const randomIndex = Math.floor(Math.random() * listResponse.body.produtos.length);
    const randomProduct = listResponse.body.produtos[randomIndex];
    const productId = randomProduct._id;

    console.log('🔍 Buscando produto com ID:', productId);
    console.log('📋 Dados armazenados:', {
      nome: randomProduct.nome,
      preco: randomProduct.preco,
      descricao: randomProduct.descricao,
      quantidade: randomProduct.quantidade,
      _id: randomProduct._id
    });

    // ACT - Busca o produto específico por ID
    const searchResponse = await spec()
      .get(`https://serverest.dev/produtos/${productId}`)
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    console.log('📥 Dados retornados:', {
      nome: searchResponse.body.nome,
      preco: searchResponse.body.preco,
      descricao: searchResponse.body.descricao,
      quantidade: searchResponse.body.quantidade,
      _id: searchResponse.body._id
    });

    // ASSERT - Valida se os dados batem com os armazenados
    expect(searchResponse.body).toMatchObject({
      nome: randomProduct.nome,
      preco: randomProduct.preco,
      descricao: randomProduct.descricao,
      quantidade: randomProduct.quantidade,
      _id: randomProduct._id
    });
  });

  test('Deve buscar produto por ID específico', async () => {
    // ARRANGE - Primeiro pega um ID válido da listagem
    const listResponse = await spec()
      .get('https://serverest.dev/produtos')
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    const productId = listResponse.body.produtos[0]._id; // Usa um ID válido da listagem

    console.log('📤 REQUEST:', {
      method: 'GET',
      url: `https://serverest.dev/produtos/${productId}`,
      headers: {
        'Accept': 'application/json'
      }
    });

    // ACT - Busca o produto específico
    const response = await spec()
      .get(`https://serverest.dev/produtos/${productId}`)
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    console.log('📥 RESPONSE:', {
      status: response.statusCode,
      headers: response.headers,
      body: response.body
    });

    // ASSERT - Valida a estrutura e dados específicos
    expect(response.body).toMatchObject({
      nome: expect.any(String),
      preco: expect.any(Number),
      descricao: expect.any(String),
      quantidade: expect.any(Number),
      _id: productId
    });

    // Validações específicas baseadas no exemplo
    expect(response.body.nome.length).toBeGreaterThan(0);
    expect(response.body.preco).toBeGreaterThan(0);
    expect(response.body.descricao.length).toBeGreaterThan(0);
    expect(response.body.quantidade).toBeGreaterThanOrEqual(0);
  });

  test('Deve falhar ao buscar produto com ID inválido', async () => {
    // ARRANGE - ID inválido (formato incorreto)
    const invalidProductId = 'ID_INVALIDO_123';

    console.log('📤 REQUEST:', {
      method: 'GET',
      url: `https://serverest.dev/produtos/${invalidProductId}`,
      headers: {
        'Accept': 'application/json'
      }
    });

    // ACT & ASSERT - Deve retornar erro
    const response = await spec()
      .get(`https://serverest.dev/produtos/${invalidProductId}`)
      .withHeaders({
        'Accept': 'application/json'
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

  test('Deve validar contrato da resposta de busca por ID', async () => {
    // ARRANGE - Primeiro pega um ID válido da listagem
    const listResponse = await spec()
      .get('https://serverest.dev/produtos')
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    const productId = listResponse.body.produtos[0]._id;

    // ACT - Busca o produto
    const response = await spec()
      .get(`https://serverest.dev/produtos/${productId}`)
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    // ASSERT - Valida contrato
    expect(response.body).toMatchObject({
      nome: expect.any(String),
      preco: expect.any(Number),
      descricao: expect.any(String),
      quantidade: expect.any(Number),
      _id: expect.any(String)
    });
  });

  test('Deve validar estrutura completa de produto retornado por ID', async () => {
    // ARRANGE - Primeiro pega um ID válido da listagem
    const listResponse = await spec()
      .get('https://serverest.dev/produtos')
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    const productId = listResponse.body.produtos[0]._id;

    // ACT - Busca o produto
    const response = await spec()
      .get(`https://serverest.dev/produtos/${productId}`)
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    // ASSERT - Valida estrutura completa
    const product = response.body;
    
    // Valida estrutura básica
    expect(product).toHaveProperty('nome');
    expect(product).toHaveProperty('preco');
    expect(product).toHaveProperty('descricao');
    expect(product).toHaveProperty('quantidade');
    expect(product).toHaveProperty('_id');

    // Valida tipos
    expect(typeof product.nome).toBe('string');
    expect(typeof product.preco).toBe('number');
    expect(typeof product.descricao).toBe('string');
    expect(typeof product.quantidade).toBe('number');
    expect(typeof product._id).toBe('string');

    // Validações específicas
    expect(product.nome.length).toBeGreaterThan(0);
    expect(product.preco).toBeGreaterThan(0);
    expect(product.descricao.length).toBeGreaterThan(0);
    expect(product.quantidade).toBeGreaterThanOrEqual(0);
    expect(product._id.length).toBeGreaterThan(0);
    expect(product._id).toBe(productId); // ID deve ser o mesmo que foi buscado
  });

});
