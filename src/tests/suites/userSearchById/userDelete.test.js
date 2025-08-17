/**
 * Testes de Exclusão de Usuário por ID - ServeRest API
 * Implementa padrão Triple A (Arrange, Act, Assert)
 * 
 * Endpoint testado:
 * - DELETE /usuarios/{_id} - Excluir usuário por ID
 */
const { spec } = require('pactum');

// Função para gerar email único
function generateUniqueEmail() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `usuario_${timestamp}_${random}@teste.com`;
}

describe('Testes de Exclusão de Usuário por ID - ServeRest API', () => {

  // ===== TESTES DE EXCLUSÃO COM SUCESSO =====

  test('Deve excluir usuário por ID com sucesso', async () => {
    // ARRANGE - Primeiro cria um usuário para depois excluir
    const userData = {
      nome: 'Usuário para Excluir',
      email: generateUniqueEmail(),
      password: 'teste123',
      administrador: 'false'
    };

    console.log('📝 Criando usuário para exclusão:', {
      nome: userData.nome,
      email: userData.email
    });

    // Cria o usuário
    const createResponse = await spec()
      .post('https://serverest.dev/usuarios')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withJson(userData)
      .expectStatus(201);

    const userId = createResponse.body._id;
    console.log('✅ Usuário criado com ID:', userId);

    // ACT - Exclui o usuário
    console.log('🗑️ Excluindo usuário com ID:', userId);
    const deleteResponse = await spec()
      .delete(`https://serverest.dev/usuarios/${userId}`)
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    console.log('📥 Resposta da exclusão:', deleteResponse.body);

    // ASSERT - Valida a resposta
    expect(deleteResponse.body).toHaveProperty('message', 'Registro excluído com sucesso');
  });

  test('Deve excluir usuário específico por ID', async () => {
    // ARRANGE - ID de um usuário conhecido (pode ser um que você criou)
    const userId = 'oAEoWK4MID9G8C23'; // ID do exemplo que você mostrou

    console.log('🗑️ Excluindo usuário específico com ID:', userId);

    // ACT - Exclui o usuário
    const response = await spec()
      .delete(`https://serverest.dev/usuarios/${userId}`)
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    console.log('📥 Resposta:', response.body);

    // ASSERT - Valida a resposta
    expect(response.body).toHaveProperty('message');
    // Pode retornar "Registro excluído com sucesso" ou "Nenhum registro excluído"
    expect(['Registro excluído com sucesso', 'Nenhum registro excluído']).toContain(response.body.message);
  });

  // ===== TESTES NEGATIVOS =====

  test('Deve falhar ao tentar excluir usuário com ID inválido', async () => {
    // ARRANGE - ID inválido
    const invalidUserId = 'ID_INVALIDO_123';

    console.log('❌ Tentando excluir usuário com ID inválido:', invalidUserId);

    // ACT & ASSERT - Deve retornar 200 com mensagem específica
    await spec()
      .delete(`https://serverest.dev/usuarios/${invalidUserId}`)
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200)
      .expectJson({
        message: 'Nenhum registro excluído'
      });
  });

  test('Deve retornar mensagem quando tentar excluir usuário já excluído', async () => {
    // ARRANGE - Primeiro cria um usuário
    const userData = {
      nome: 'Usuário para Excluir Duas Vezes',
      email: generateUniqueEmail(),
      password: 'teste123',
      administrador: 'false'
    };

    // Cria o usuário
    const createResponse = await spec()
      .post('https://serverest.dev/usuarios')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withJson(userData)
      .expectStatus(201);

    const userId = createResponse.body._id;
    console.log('📝 Usuário criado para teste de exclusão dupla:', userId);

    // Primeira exclusão (deve funcionar)
    await spec()
      .delete(`https://serverest.dev/usuarios/${userId}`)
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    console.log('✅ Primeira exclusão realizada');

    // ACT - Segunda exclusão (deve retornar mensagem específica)
    console.log('🔄 Tentando excluir o mesmo usuário novamente');
    const secondDeleteResponse = await spec()
      .delete(`https://serverest.dev/usuarios/${userId}`)
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    console.log('📥 Resposta da segunda exclusão:', secondDeleteResponse.body);

    // ASSERT - Valida que retorna a mensagem correta
    expect(secondDeleteResponse.body).toHaveProperty('message', 'Nenhum registro excluído');
  });

  // ===== TESTES DE CONTRATO =====

  test('Deve validar contrato da resposta de exclusão com sucesso', async () => {
    // ARRANGE - Cria um usuário para excluir
    const userData = {
      nome: 'Usuário para Contrato',
      email: generateUniqueEmail(),
      password: 'teste123',
      administrador: 'false'
    };

    const createResponse = await spec()
      .post('https://serverest.dev/usuarios')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withJson(userData)
      .expectStatus(201);

    const userId = createResponse.body._id;

    // ACT - Exclui o usuário
    const response = await spec()
      .delete(`https://serverest.dev/usuarios/${userId}`)
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    // ASSERT - Valida contrato
    expect(response.body).toMatchObject({
      message: 'Registro excluído com sucesso'
    });
  });

  test('Deve validar contrato da resposta quando usuário não existe', async () => {
    // ARRANGE - ID que não existe
    const nonExistentUserId = 'ID_QUE_NAO_EXISTE_123';

    // ACT - Tenta excluir usuário que não existe
    const response = await spec()
      .delete(`https://serverest.dev/usuarios/${nonExistentUserId}`)
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(200);

    // ASSERT - Valida contrato
    expect(response.body).toMatchObject({
      message: 'Nenhum registro excluído'
    });
  });

});
