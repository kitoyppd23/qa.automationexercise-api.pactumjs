

Projeto de automação de testes de API para a plataforma [ServeRest](https://serverest.dev) utilizando PactumJS e Jest.


Este projeto implementa testes automatizados para a API ServeRest, cobrindo funcionalidades de **usuários** e **produtos**. Os testes seguem o padrão **Triple A (Arrange, Act, Assert)** e incluem cenários de sucesso, negativos e validação de contratos.

### 🎯 Funcionalidades Testadas

#### 👤 **Usuários (`/usuarios`)**
- ✅ **POST /login** - Autenticação de usuário
- ✅ **GET /usuarios** - Listagem de todos os usuários
- ✅ **POST /usuarios** - Criação de novo usuário
- ✅ **GET /usuarios/{_id}** - Busca de usuário por ID
- ✅ **DELETE /usuarios/{_id}** - Exclusão de usuário por ID
- ✅ **PUT /usuarios/{_id}** - Atualização de usuário por ID

#### 📦 **Produtos (`/produtos`)**
- ✅ **GET /produtos** - Listagem de todos os produtos
- ✅ **POST /produtos** - Criação de novo produto (requer autenticação)
- ✅ **GET /produtos/{_id}** - Busca de produto por ID
- ✅ **DELETE /produtos/{_id}** - Exclusão de produto por ID (requer autenticação)
- ✅ **PUT /produtos/{_id}** - Atualização de produto por ID (requer autenticação)

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **PactumJS** - Framework de testes de API
- **Jest** - Test runner e framework de asserções
- **Jest HTML Reporters** - Geração de relatórios HTML

## 📦 Pré-requisitos

- Node.js (versão 16.0.0 ou superior)
- npm (incluído com Node.js)

## 🚀 Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/kitoyppd23/qa.automationexercise-api.pactumjs.git
   cd qa.automationexercise-api.pactumjs
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

## 🧪 Executando os Testes

### 📊 **Executar Todos os Testes**
```bash
npm test
```

### 🔍 **Executar Testes Específicos**

#### **Login**
```bash
npm run test:login
```

#### **Usuários**
```bash
# Listagem de usuários
npm run test:user

# Criação de usuário
npm run test:user-creation

# Busca de usuário por ID
npm run test:user-search

# Exclusão de usuário por ID
npm run test:user-delete

# Atualização de usuário por ID
npm run test:user-update
```

#### **Produtos**
```bash
# Listagem de produtos
npm run test:products

# Criação de produto
npm run test:product-creation

# Busca de produto por ID
npm run test:product-search

# Exclusão de produto por ID
npm run test:product-delete

# Atualização de produto por ID
npm run test:product-update
```

### 📈 **Executar com Relatório HTML**
```bash
npm run report
```

O relatório será gerado em: `reports/report.html`


```

## 📁 Estrutura do Projeto

```
qa.automationexercise-api.pactumjs/
├── src/
│   └── tests/
│       └── suites/
│           ├── login/
│           │   └── login.test.js
│           ├── userListing/
│           │   └── userListing.test.js
│           ├── criacao-usuario/
│           │   └── userCreation.test.js
│           ├── userSearchById/
│           │   ├── userSearch.test.js
│           │   ├── userDelete.test.js
│           │   └── userUpdate.test.js
│           └── products/
│               ├── productListing.test.js
│               ├── productCreation.test.js
│               ├── productSearch.test.js
│               ├── productDelete.test.js
│               └── productUpdate.test.js
├── reports/
│   └── report.html
├── jest.setup.js
├── package.json
└── README.md
```

## 🔧 Configurações

### **Jest Configuration**
- **Test Environment**: Node.js
- **Test Pattern**: `**/src/tests/**/*.test.js`
- **Setup File**: `jest.setup.js`
- **Reporters**: Default + HTML Reporter

### **HTML Reporter**
- **Output**: `reports/report.html`
- **Include**: Console logs, failure messages, stack traces
- **Expand**: All test details

## 🎯 Características dos Testes

### **Padrão Triple A**
- **Arrange**: Preparação dos dados e configurações
- **Act**: Execução da ação/requisição
- **Assert**: Validação dos resultados

### **Tipos de Testes**
- ✅ **Testes de Sucesso**: Validação de cenários positivos
- ❌ **Testes Negativos**: Validação de cenários de erro
- 📋 **Testes de Contrato**: Validação da estrutura das respostas

### **Logs Padronizados**
Todos os testes incluem logs detalhados no terminal:
- 📤 **REQUEST**: Método, URL, headers e body
- 📥 **RESPONSE**: Status, headers e body
- 🔐 **AUTH**: Tentativas de login e obtenção de token

## 🔐 Autenticação

Alguns endpoints requerem autenticação via Bearer Token:
- **Credenciais utilizadas**:
  - `fulano@qa.com` / `teste`
  - `beltrano@qa.com.br` / `teste`
- **Token expira em**: 600 segundos (10 minutos)
- **Função automática**: `getAuthToken()` tenta múltiplas credenciais

## 📊 Relatórios

### **HTML Report**
- **Localização**: `reports/report.html`
- **Conteúdo**: 
  - Resumo de execução
  - Detalhes de cada teste
  - Logs de console
  - Stack traces de falhas
  - Tempo de execução


## 🚀 CI/CD

O projeto inclui pipeline GitHub Actions configurado para:
- Executar testes automaticamente em cada PR
- Validar qualidade do código
- Gerar relatórios de execução

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request



## 👨‍💻 Autor

Desenvolvido como parte do desafio técnico de automação de testes de API.

---

**🎯 Objetivo**: Demonstrar conhecimento em automação de testes de API, boas práticas de desenvolvimento e organização de código.
