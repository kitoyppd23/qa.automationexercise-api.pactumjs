/**
 * Configuração do Jest para PactumJS
 * Define configurações globais para os testes
 */

// Configurar timeout global para testes
jest.setTimeout(30000);

// Configurar hooks globais
beforeAll(() => {
  console.log('🚀 Iniciando testes de API com PactumJS...');
});

afterAll(() => {
  console.log('✅ Testes de API concluídos!');
});
