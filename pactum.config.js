/**
 * Configuração do PactumJS
 * Define configurações globais para execução dos testes
 */
module.exports = {
  // Diretório onde estão os testes
  testDir: 'src/tests',
  
  // Extensões de arquivo para testes
  testExtensions: ['.js'],
  
  // Configurações de timeout
  timeout: 30000,
  
  // Configurações de retry
  retry: {
    count: 3,
    delay: 1000
  },
  
  // Configurações de relatório
  reporter: {
    type: 'spec',
    options: {
      verbose: true
    }
  },
  
  // Configurações de ambiente
  environment: {
    baseUrl: 'https://serverest.dev'
  },
  
  // Configurações de headers padrão
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};
