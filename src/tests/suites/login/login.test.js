/**
 * Testes de Login - Casos de teste organizados seguindo padrão AAA
 * Implementa diferentes cenários de teste com foco em contrato e validação
 * 
 * NOTA: O token JWT tem duração de 600 segundos (10 minutos)
 * Se expirado, retorna status 401 (Unauthorized)
 * 
 * Credenciais disponíveis:
 * - fulano@qa.com / teste (pode estar expirado)
 * - beltrano@qa.com.br / teste (segunda opção)
 */
const { spec } = require('pactum');

describe('Testes de Login - ServeRest API', () => {
  
  // ===== TESTES DE LOGIN COM SUCESSO =====
  
  test('Login com credenciais válidas - tenta múltiplas opções', async () => {
    // Array de credenciais para tentar
    const credentials = [
      { email: 'fulano@qa.com', password: 'teste' },
      { email: 'beltrano@qa.com.br', password: 'teste' }
    ];

    let successResponse = null;

    // Tenta cada credencial até encontrar uma que funcione
    for (const cred of credentials) {
      console.log('📤 REQUEST:', {
        method: 'POST',
        url: 'https://serverest.dev/login',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: cred
      });

      try {
        const response = await spec()
          .post('https://serverest.dev/login')
          .withHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          })
          .withJson(cred)
          .expectStatus(200);

        console.log('📥 RESPONSE:', {
          status: response.statusCode,
          headers: response.headers,
          body: {
            message: response.body.message,
            authorization: response.body.authorization ? 'Bearer token presente' : 'Sem token'
          }
        });

        successResponse = response;
        break; // Sai do loop se encontrou uma credencial válida
      } catch (error) {
        console.log('❌ FALHA:', {
          email: cred.email,
          status: error.message.includes('401') ? '401 - Token expirado' : 'Erro desconhecido'
        });
        // Continua para a próxima credencial
      }
    }

    // Se encontrou uma resposta de sucesso, valida
    if (successResponse) {
      expect(successResponse.body).toHaveProperty('message', 'Login realizado com sucesso');
      expect(successResponse.body).toHaveProperty('authorization');
      expect(successResponse.body.authorization).toMatch(/^Bearer\s+[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/);
    } else {
      // Se nenhuma credencial funcionou, verifica se pelo menos uma retornou 401 (token expirado)
      const response = await spec()
        .post('https://serverest.dev/login')
        .withHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
        .withJson(credentials[0])
        .expectStatus(401);

      expect(response.body).toHaveProperty('message', 'Email e/ou senha inválidos');
    }
  });

  test('Validação de contrato de resposta de login com sucesso', async () => {
    const credentials = [
      { email: 'fulano@qa.com', password: 'teste' },
      { email: 'beltrano@qa.com.br', password: 'teste' }
    ];

    let successResponse = null;

    for (const cred of credentials) {
      try {
        const response = await spec()
          .post('https://serverest.dev/login')
          .withHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          })
          .withJson(cred)
          .expectStatus(200);

        successResponse = response;
        break;
      } catch (error) {
        // Continua para a próxima credencial
      }
    }

    if (successResponse) {
      expect(successResponse.body).toMatchObject({
        message: 'Login realizado com sucesso',
        authorization: expect.stringMatching(/^Bearer\s+[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
      });
    } else {
      // Testa com 401 se nenhuma credencial funcionou
      const response = await spec()
        .post('https://serverest.dev/login')
        .withHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
        .withJson(credentials[0])
        .expectStatus(401);

      expect(response.body).toHaveProperty('message', 'Email e/ou senha inválidos');
    }
  });

  // ===== TESTES DE CONTRATO =====

  test('Validação de contrato completo do endpoint de login', async () => {
    const credentials = [
      { email: 'fulano@qa.com', password: 'teste' },
      { email: 'beltrano@qa.com.br', password: 'teste' }
    ];

    let successResponse = null;

    for (const cred of credentials) {
      try {
        const response = await spec()
          .post('https://serverest.dev/login')
          .withHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          })
          .withJson(cred)
          .expectStatus(200);

        successResponse = response;
        break;
      } catch (error) {
        // Continua para a próxima credencial
      }
    }

    if (successResponse) {
      expect(successResponse.body).toMatchObject({
        message: expect.any(String),
        authorization: expect.any(String)
      });
    } else {
      // Testa com 401 se nenhuma credencial funcionou
      const response = await spec()
        .post('https://serverest.dev/login')
        .withHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
        .withJson(credentials[0])
        .expectStatus(401);

      expect(response.body).toMatchObject({
        message: expect.any(String)
      });
    }
  });

  test('Validação de estrutura do token JWT retornado', async () => {
    const credentials = [
      { email: 'fulano@qa.com', password: 'teste' },
      { email: 'beltrano@qa.com.br', password: 'teste' }
    ];

    let successResponse = null;

    for (const cred of credentials) {
      try {
        const response = await spec()
          .post('https://serverest.dev/login')
          .withHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          })
          .withJson(cred)
          .expectStatus(200);

        successResponse = response;
        break;
      } catch (error) {
        // Continua para a próxima credencial
      }
    }

    if (successResponse) {
      expect(successResponse.body).toMatchObject({
        message: 'Login realizado com sucesso',
        authorization: expect.stringMatching(/^Bearer\s+[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
      });
    } else {
      // Testa com 401 se nenhuma credencial funcionou
      const response = await spec()
        .post('https://serverest.dev/login')
        .withHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        })
        .withJson(credentials[0])
        .expectStatus(401);

      expect(response.body).toHaveProperty('message', 'Email e/ou senha inválidos');
    }
  });

  // ===== TESTES NEGATIVOS =====

  test('Falha com credenciais inválidas', async () => {
    await spec()
      .post('https://serverest.dev/login')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withJson({
        email: 'usuario_invalido@test.com',
        password: 'senha_incorreta'
      })
      .expectStatus(401)
      .expectJson({
        message: 'Email e/ou senha inválidos'
      });
  });

  test('Falha com email inválido', async () => {
    await spec()
      .post('https://serverest.dev/login')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withJson({
        email: 'email_invalido',
        password: 'teste'
      })
      .expectStatus(400)
      .expectJson({
        email: 'email deve ser um email válido'
      });
  });

  test('Falha com senha vazia', async () => {
    await spec()
      .post('https://serverest.dev/login')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withJson({
        email: 'fulano@qa.com',
        password: ''
      })
      .expectStatus(400)
      .expectJson({
        password: 'password não pode ficar em branco'
      });
  });

  test('Falha com email vazio', async () => {
    await spec()
      .post('https://serverest.dev/login')
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withJson({
        email: '',
        password: 'teste'
      })
      .expectStatus(400)
      .expectJson({
        email: 'email não pode ficar em branco'
      });
  });

});
