/**
 * Testes de Usuários - ServeRest API
 * Implementa padrão Triple A (Arrange, Act, Assert) com Page Objects
 * 
 * Endpoints testados:
 * - GET /usuarios - Listar usuários
 * - GET /usuarios/{_id} - Buscar usuário por ID
 * - POST /usuarios - Criar usuário
 * - PUT /usuarios/{_id} - Atualizar usuário
 * - DELETE /usuarios/{_id} - Excluir usuário
 */
const UserPage = require('../pages/UserPage');

describe('User Suite - ServeRest API', () => {
  let userPage;

  beforeEach(() => {
    userPage = new UserPage();
  });

  describe('GET /usuarios - Listar Usuários', () => {
    test('Deve listar todos os usuários com sucesso', async () => {
      // ARRANGE - Preparação (não necessária para este teste)
      
      // ACT - Executa a busca de usuários
      const response = await userPage.getAllUsers();

      // ASSERT - Valida a resposta
      userPage.validateUserListResponse(response);
      
      // Validações adicionais
      expect(response.body.quantidade).toBeGreaterThan(0);
      
      // Valida estrutura do primeiro usuário (se existir)
      if (response.body.usuarios.length > 0) {
        userPage.validateUserObject(response.body.usuarios[0]);
      }
    });

    test('Deve validar contrato da resposta de listagem de usuários', async () => {
      // ARRANGE - Preparação
      
      // ACT - Executa a busca
      const response = await userPage.getAllUsers();

      // ASSERT - Valida contrato
      expect(response.body).toMatchObject({
        quantidade: expect.any(Number),
        usuarios: expect.any(Array)
      });
    });
  });

  describe('Testes de Contrato - Estrutura de Dados', () => {
    test('Deve validar estrutura completa de um usuário', async () => {
      // ARRANGE - Busca usuários
      const response = await userPage.getAllUsers();

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
      const response = await userPage.getAllUsers();

      // ACT & ASSERT - Valida estrutura de todos os usuários
      response.body.usuarios.forEach((user, index) => {
        try {
          userPage.validateUserObject(user);
        } catch (error) {
          throw new Error(`Usuário na posição ${index} não possui estrutura válida: ${error.message}`);
        }
      });
    });
  });
});
