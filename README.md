# Automação de Testes de API - ServeRest com PactumJS

## 📋 Descrição

Projeto de automação de testes de API para o **ServeRest** utilizando **PactumJS** com foco em **Contract Testing** e **Joi** para validação de schemas.

## 🏗️ Arquitetura

### Padrões de Projeto Implementados

- **Builder Pattern**: Para construção de payloads de teste
- **Strategy Pattern**: Para diferentes tipos de validação
- **Singleton Pattern**: Para configuração de ambiente
- **API Object Model**: Para encapsulamento das operações de API

### Estrutura do Projeto

```
src/
├── config/           # Configurações e ambiente
├── models/           # Modelos de dados (Builders)
├── schemas/          # Schemas Joi para validação
├── services/         # Serviços de API (API Objects)
├── tests/            # Casos de teste organizados
└── utils/            # Utilitários e helpers
```

## 🚀 Funcionalidades

### ✅ Implementado

- **Login com Sucesso**: Teste completo do endpoint `POST /login`
- **Contract Testing**: Validação de schemas com Joi
- **Testes Negativos**: Cenários de erro e validação
- **Performance Testing**: Validação de tempo de resposta
- **Header Validation**: Validação de headers de request/response
- **Token JWT Validation**: Validação de estrutura do token
- **Retry Mechanism**: Suporte a retry automático

## 🛠️ Tecnologias

- **PactumJS**: Framework de testes de API
- **Joi**: Validação de schemas
- **Faker**: Geração de dados de teste
- **ESLint**: Linting de código
- **Prettier**: Formatação de código

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp env.example .env
```

## 🧪 Execução dos Testes

```bash
# Executar todos os testes
npm test

# Executar testes em paralelo
npm run test:parallel

# Executar testes de contrato
npm run test:contract

# Executar testes de smoke
npm run test:smoke

# Executar testes de regressão
npm run test:regression

# Gerar relatório HTML
npm run test:report
```

## 📝 Casos de Teste

### Login com Sucesso

**Endpoint**: `POST /login`
**Payload**:
```json
{
  "email": "fulano@qa.com",
  "password": "teste"
}
```

**Response Esperado**:
```json
{
  "message": "Login realizado com sucesso",
  "authorization": "Bearer <JWT_TOKEN>"
}
```

### Cenários de Teste

1. **Login com Credenciais Válidas**
   - Valida status 200
   - Valida mensagem de sucesso
   - Valida estrutura do token JWT

2. **Contract Testing**
   - Validação de request schema
   - Validação de response schema
   - Validação de headers

3. **Testes Negativos**
   - Credenciais inválidas
   - Email inválido
   - Senha vazia
   - Email vazio

4. **Performance Testing**
   - Tempo de resposta
   - Retry automático

## 🔧 Configuração

### Variáveis de Ambiente

```env
BASE_URL=https://serverest.dev
TIMEOUT=30000
RETRY_ATTEMPTS=3
PARALLEL_EXECUTION=false
REPORT_PATH=./reports
LOG_LEVEL=info
MAX_RESPONSE_TIME=5000
PERFORMANCE_THRESHOLD=3000
```

## 📊 Relatórios

Os relatórios são gerados na pasta `./reports` após a execução dos testes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC.

## 🔗 Links Úteis

- [ServeRest](https://serverest.dev)
- [PactumJS Documentation](https://pactumjs.github.io/)
- [Joi Documentation](https://joi.dev/)
