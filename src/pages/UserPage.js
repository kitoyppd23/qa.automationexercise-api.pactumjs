/**
 * Page Object para Usuários - ServeRest API
 * Implementa o padrão Page Object Model para operações de usuário
 */
const BasePage = require('./BasePage');

class UserPage extends BasePage {
  constructor() {
    super();
    this.endpoint = '/usuarios';
  }

  /**
   * ARRANGE - Prepara dados para testes
   */
  arrangeUserData() {
    return {
      nome: 'Teste Usuário',
      email: 'teste@email.com',
      password: '123456',
      administrador: 'false'
    };
  }

  /**
   * ACT - Busca todos os usuários
   */
  async getAllUsers() {
    return await this.get(this.endpoint);
  }

  /**
   * ACT - Busca usuário por ID
   */
  async getUserById(userId) {
    return await this.get(`${this.endpoint}/${userId}`);
  }

  /**
   * ACT - Cria novo usuário
   */
  async createUser(userData) {
    return await this.post(this.endpoint, userData);
  }

  /**
   * ACT - Atualiza usuário
   */
  async updateUser(userId, userData) {
    return await this.put(`${this.endpoint}/${userId}`, userData);
  }

  /**
   * ACT - Remove usuário
   */
  async deleteUser(userId) {
    return await this.delete(`${this.endpoint}/${userId}`);
  }

  /**
   * ASSERT - Validações específicas para usuários
   */
  validateUserListResponse(response) {
    // Valida status e estrutura básica
    this.validateSuccessStatus(response, 200);
    this.validateResponseStructure(response, ['quantidade', 'usuarios']);
    
    // Valida que quantidade é um número
    expect(typeof response.body.quantidade).toBe('number');
    expect(response.body.quantidade).toBeGreaterThanOrEqual(0);
    
    // Valida que usuarios é um array
    expect(Array.isArray(response.body.usuarios)).toBe(true);
  }

  validateUserObject(user) {
    // Valida estrutura de um objeto usuário
    expect(user).toHaveProperty('nome');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('password');
    expect(user).toHaveProperty('administrador');
    expect(user).toHaveProperty('_id');
    
    // Valida tipos dos campos
    expect(typeof user.nome).toBe('string');
    expect(typeof user.email).toBe('string');
    expect(typeof user.password).toBe('string');
    expect(typeof user.administrador).toBe('string');
    expect(typeof user._id).toBe('string');
  }

  validateUserCreationResponse(response) {
    this.validateSuccessStatus(response, 201);
    this.validateResponseStructure(response, ['message', '_id']);
    expect(response.body.message).toBe('Cadastro realizado com sucesso');
  }

  validateUserUpdateResponse(response) {
    this.validateSuccessStatus(response, 200);
    this.validateResponseStructure(response, ['message']);
    expect(response.body.message).toBe('Registro alterado com sucesso');
  }

  validateUserDeletionResponse(response) {
    this.validateSuccessStatus(response, 200);
    this.validateResponseStructure(response, ['message']);
    expect(response.body.message).toBe('Registro excluído com sucesso');
  }
}

module.exports = UserPage;
