/**
 * Classe Base para Page Objects
 * Fornece métodos comuns para todas as páginas de API
 */
const { spec } = require('pactum');

class BasePage {
  constructor() {
    this.baseUrl = 'https://serverest.dev';
    this.defaultHeaders = {
      'Accept': 'application/json'
    };
  }

  /**
   * Método base para requisições GET
   */
  async get(endpoint, headers = {}) {
    return await spec()
      .get(`${this.baseUrl}${endpoint}`)
      .withHeaders({ ...this.defaultHeaders, ...headers });
  }

  /**
   * Método base para requisições POST
   */
  async post(endpoint, body, headers = {}) {
    return await spec()
      .post(`${this.baseUrl}${endpoint}`)
      .withHeaders({ ...this.defaultHeaders, ...headers })
      .withJson(body);
  }

  /**
   * Método base para requisições PUT
   */
  async put(endpoint, body, headers = {}) {
    return await spec()
      .put(`${this.baseUrl}${endpoint}`)
      .withHeaders({ ...this.defaultHeaders, ...headers })
      .withJson(body);
  }

  /**
   * Método base para requisições DELETE
   */
  async delete(endpoint, headers = {}) {
    return await spec()
      .delete(`${this.baseUrl}${endpoint}`)
      .withHeaders({ ...this.defaultHeaders, ...headers });
  }

  /**
   * Validação base para status de sucesso
   */
  validateSuccessStatus(response, expectedStatus = 200) {
    expect(response.statusCode).toBe(expectedStatus);
  }

  /**
   * Validação base para estrutura de resposta
   */
  validateResponseStructure(response, expectedProperties) {
    expectedProperties.forEach(property => {
      expect(response.body).toHaveProperty(property);
    });
  }

  /**
   * Validação base para tempo de resposta
   */
  validateResponseTime(response, maxTime = 5000) {
    expect(response.responseTime).toBeLessThan(maxTime);
  }
}

module.exports = BasePage;
