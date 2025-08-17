/**
 * Testes de Listagem de Produtos - ServeRest API
 * Implementa padrão Triple A (Arrange, Act, Assert)
 *
 * Endpoint testado:
 * - GET /produtos - Listar produtos
 */
const { spec } = require('pactum');

describe('Testes de Listagem de Produtos - ServeRest API', () => {

  // ===== TESTES DE LISTAGEM COM SUCESSO =====

  test('Deve listar todos os produtos com sucesso', async () => {
    // ARRANGE - Preparação (não necessária para este teste)

    console.log('📤 REQUEST:', {
      method: 'GET',
      url: 'https://serverest.dev/produtos',
      headers: {
        'Accept': 'application/json'
      }
    });

    // ACT - Executa a busca de produtos
    const response = await spec()
      .get('https://serverest.dev/produtos')
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    console.log('📥 RESPONSE:', {
      status: response.statusCode,
      headers: response.headers,
      body: {
        quantidade: response.body.quantidade,
        produtos: `${response.body.produtos.length} produtos retornados`
      }
    });

    // ASSERT - Valida a resposta
    expect(response.body).toHaveProperty('quantidade');
    expect(response.body).toHaveProperty('produtos');
    expect(response.body.quantidade).toBeGreaterThan(0);
    expect(Array.isArray(response.body.produtos)).toBe(true);
  });

  test('Deve validar contrato da resposta de listagem de produtos', async () => {
    // ARRANGE - Preparação

    // ACT - Executa a busca
    const response = await spec()
      .get('https://serverest.dev/produtos')
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    // ASSERT - Valida contrato
    expect(response.body).toMatchObject({
      quantidade: expect.any(Number),
      produtos: expect.any(Array)
    });
  });

  // ===== TESTES DE CONTRATO =====

  test('Deve validar estrutura completa de um produto', async () => {
    // ARRANGE - Busca produtos
    const response = await spec()
      .get('https://serverest.dev/produtos')
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    // ACT & ASSERT - Valida estrutura do primeiro produto
    if (response.body.produtos.length > 0) {
      const product = response.body.produtos[0];

      console.log('🔍 ESTRUTURA DO PRODUTO:', {
        nome: product.nome,
        preco: product.preco,
        descricao: product.descricao,
        quantidade: product.quantidade,
        _id: product._id
      });

      // Valida estrutura completa
      expect(product).toMatchObject({
        nome: expect.any(String),
        preco: expect.any(Number),
        descricao: expect.any(String),
        quantidade: expect.any(Number),
        _id: expect.any(String)
      });

      // Validações específicas
      expect(product.nome.length).toBeGreaterThan(0);
      expect(product.preco).toBeGreaterThan(0);
      expect(product.descricao.length).toBeGreaterThan(0);
      expect(product.quantidade).toBeGreaterThanOrEqual(0);
      expect(product._id.length).toBeGreaterThan(0);
    }
  });

  test('Deve validar que todos os produtos têm estrutura consistente', async () => {
    // ARRANGE - Busca produtos
    const response = await spec()
      .get('https://serverest.dev/produtos')
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    // ACT & ASSERT - Valida estrutura de todos os produtos
    response.body.produtos.forEach((product, index) => {
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
    });
  });

});
