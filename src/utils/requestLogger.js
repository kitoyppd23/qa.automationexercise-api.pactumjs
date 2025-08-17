/**
 * Helper para logar requisições e respostas automaticamente
 * Facilita o debug e visualização dos dados trocados
 */

const { spec } = require('pactum');

// Função para logar requisição
function logRequest(method, url, headers, body) {
  console.log('\n📤 REQUEST:');
  console.log(`Method: ${method}`);
  console.log(`URL: ${url}`);
  console.log('Headers:', JSON.stringify(headers, null, 2));
  console.log('Body:', JSON.stringify(body, null, 2));
  console.log('─'.repeat(50));
}

// Função para logar resposta
function logResponse(response) {
  console.log('\n📥 RESPONSE:');
  console.log(`Status: ${response.statusCode}`);
  console.log('Headers:', JSON.stringify(response.headers, null, 2));
  console.log('Body:', JSON.stringify(response.body, null, 2));
  console.log('─'.repeat(50));
}

// Wrapper para spec() que automaticamente loga
function specWithLogging() {
  const originalSpec = spec();
  
  // Intercepta a requisição antes de enviar
  const originalWithJson = originalSpec.withJson;
  originalSpec.withJson = function(data) {
    logRequest('POST', this.url, this.headers, data);
    return originalWithJson.call(this, data);
  };

  // Intercepta a resposta
  const originalExpectStatus = originalSpec.expectStatus;
  originalSpec.expectStatus = function(status) {
    return originalExpectStatus.call(this, status).then(response => {
      logResponse(response);
      return response;
    });
  };

  return originalSpec;
}

module.exports = {
  logRequest,
  logResponse,
  specWithLogging
};
