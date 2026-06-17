# API Node.js — Carros, Motos, Marcas de Roupa & Usuários

API RESTful desenvolvida com **Node.js** e **Express**, seguindo o padrão arquitetural em camadas (Layered Architecture: rotas → controllers → services → repositories → models), com persistência híbrida, autenticação JWT, proteção baseada na OWASP Top 10, testes de integração automatizados, frontend em React e conteinerização completa via Docker.

---

## 1. Documentação Escrita — Arquitetura, Tecnologias e Decisões

Esta aplicação foi desenvolvida sob o ecossistema Node.js utilizando o framework Express e o padrão arquitetural em camadas (Layered Architecture), separando rotas, controllers, services, repositories, models e middlewares para garantir manutenibilidade e clareza de responsabilidades.

O diferencial técnico do projeto é o modelo de **Persistência Híbrida**: os dados de controle de acesso (usuários e credenciais) são armazenados em um banco relacional **SQLite**, gerenciado via ORM **Sequelize**, garantindo integridade e constraints (e-mail único, tipos de dados rígidos). Já os catálogos operacionais — carros, motos e marcas de roupa — utilizam a flexibilidade de esquemas do banco NoSQL **MongoDB**, mapeados através do ODM **Mongoose**.

Para os recursos NoSQL (carros, motos e marcas de roupa), a arquitetura conta ainda com as camadas de **Repository** e **Service**: o `baseRepository.js` encapsula o acesso direto ao Mongoose (create, find, update, delete), enquanto o `baseService.js` concentra regras de negócio reutilizáveis — como impedir o cadastro de um veículo ou marca com ano de fabricação/fundação no futuro. Um único `BaseService` configurável (via parâmetros `yearField`, `maxYearOffset` e `entityName`) é reaproveitado pelos três recursos, evitando duplicação de código.

A segurança foi modelada com base na **OWASP Top 10 (2021)**. Para mitigar falhas de autenticação (A07), implementou-se controle de sessão *stateless* via **JWT**, com senhas protegidas por **bcrypt** (fator de custo 12). A proteção contra quebra de controle de acesso (A01) ocorre por meio de middlewares que validam token e papel do usuário (`user`/`admin`). Para mitigar falhas criptográficas (A02), nenhuma senha é armazenada em texto puro. Contra configurações inseguras (A05), a biblioteca **Helmet** sanitiza cabeçalhos HTTP, e o **express-rate-limit** mitiga ataques de força bruta e DoS (A04). Os logs de requisições são registrados via **morgan** (A09), apoiando auditoria e monitoramento.

A resiliência da aplicação é validada por **testes de integração automatizados** com **Jest** e **Supertest**, cobrindo autenticação, autorização e todos os CRUDs (carros, motos, marcas de roupa e usuários), com bancos de dados isolados para testes. Os testes podem ser executados tanto localmente quanto em um container Docker dedicado, sem necessidade de instalar Node.js ou MongoDB na máquina host.

O frontend foi desenvolvido com **React 18** e **Vite**, estilizado com **Tailwind CSS v4**, e servido em produção pelo **Nginx**. A interface permite login, registro, navegação entre recursos, operações completas de CRUD e controle de acesso baseado no papel do usuário (admin/user), com mensagens de sucesso e erro em tempo real.

Toda a infraestrutura foi conteinerizada com **Docker** e **Docker Compose**, orquestrando o MongoDB, a API e o frontend em containers separados, com variáveis de ambiente centralizadas em `.env`, permitindo que a aplicação completa seja executada com um único comando — sem dependências instaladas na máquina host além do Docker.

A documentação da API é gerada automaticamente via **Swagger** (OpenAPI 3.0), acessível em `/docs`, descrevendo todos os endpoints, parâmetros, corpos de requisição e respostas esperadas.

---

## 2. Tecnologias Utilizadas

| Categoria             | Tecnologia                                    |
|------------------------|-----------------------------------------------|
| Runtime                | Node.js 20                                    |
| Framework Web          | Express 4                                     |
| Banco NoSQL            | MongoDB 7 + Mongoose                          |
| Banco SQL              | SQLite + Sequelize                            |
| Autenticação           | JWT (jsonwebtoken) + bcryptjs                 |
| Validação              | express-validator                             |
| Segurança HTTP         | Helmet, CORS, express-rate-limit              |
| Logging                | morgan                                        |
| Documentação           | Swagger (swagger-jsdoc + swagger-ui-express)  |
| Testes                 | Jest + Supertest                              |
| Frontend               | React 18 + Vite                               |
| Estilização            | Tailwind CSS v4                               |
| Servidor Web           | Nginx (Alpine)                                |
| Conteinerização        | Docker + Docker Compose                       |

---

## 3. Arquitetura e Estrutura de Pastas

```bash
├── src/
│   ├── config/
│   │   ├── database.js        → Conexão MongoDB e SQLite
│   │   └── swagger.js         → Configuração do Swagger
│   ├── controllers/
│   │   ├── authController.js     → Registro e login
│   │   ├── nosqlController.js    → Factory de CRUD (delega ao Service)
│   │   └── usuarioController.js  → CRUD de usuários (SQL)
│   ├── middlewares/
│   │   ├── auth.js            → Autenticação e autorização JWT
│   │   └── validar.js         → Validação de campos
│   ├── models/
│   │   ├── nosqlModels.js      → Carro, Moto, MarcaRoupa (Mongoose)
│   │   └── Usuario.js          → Usuario (Sequelize)
│   ├── repositories/
│   │   └── baseRepository.js   → Acesso a dados (Mongoose)
│   ├── services/
│   │   └── baseService.js      → Regras de negócio configuráveis (validação de ano)
│   ├── utils/
│   │   └── errors.js           → Erros customizados (404/400)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── usuarioRoutes.js
│   │   ├── carroRoutes.js
│   │   ├── motoRoutes.js
│   │   └── marcaRoupaRoutes.js
│   ├── app.js                  → Configuração do Express e middlewares globais
│   └── server.js               → Inicialização dos bancos e do servidor
├── tests/
│   ├── setup.js                → Configuração do ambiente de teste
│   ├── auth.test.js            → Testes de Auth e Usuários
│   └── nosql.test.js           → Testes de Carros, Motos e Marcas de Roupa
├── frontend/
│   ├── src/
│   │   ├── components/    → Button, Input, Modal, Navbar, Layout, etc.
│   │   ├── context/       → AuthContext, ToastContext
│   │   ├── pages/         → Login, Registro, Home, Carros, Motos, MarcasRoupa, Usuarios
│   │   ├── routes/        → ProtectedRoute
│   │   ├── services/      → api.js, authService, nosqlService, usuarioService, useCrud
│   │   ├── App.jsx        → Roteamento principal
│   │   └── main.jsx       → Ponto de entrada
│   ├── Dockerfile         → Build com Vite + Nginx
│   ├── nginx.conf         → Configuração do servidor web
│   └── .env.example       → Modelo de variáveis do frontend
├── .env                         → Variáveis de ambiente (uso local/Docker)
├── .env.example                 → Modelo de variáveis de ambiente
├── .gitignore
├── Dockerfile                   → Build da aplicação (produção)
├── Dockerfile.test              → Build da imagem usada para rodar os testes
├── docker-compose.yml
├── package.json
└── README.md
```

---

## 4. Como Executar o Projeto (via Docker)

### Pré-requisitos
- Docker e Docker Compose instalados.

### Passo 1 — Clonar o repositório

```bash
git clone <url-do-repositorio>
cd api-node-express
```

### Passo 2 — Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Em produção, troque o valor de `JWT_SECRET` por uma chave forte e aleatória.

### Passo 3 — Subir todos os containers

```bash
docker compose up --build
```

Isso sobe três containers de uma vez:
- **mongo** — banco de dados MongoDB
- **api** — backend Node.js na porta 3000
- **frontend** — React servido pelo Nginx na porta 80

### Passo 4 — Acessar a aplicação

| Recurso | URL |
|---|---|
| Frontend | http://localhost |
| API | http://localhost:3000 |
| Documentação Swagger | http://localhost:3000/docs |

### Passo 5 — Primeiros passos na interface

1. Acesse `http://localhost`
2. Clique em **Cadastre-se** para criar uma conta (escolha o perfil **Administrador** para ter acesso completo)
3. Faça login com as credenciais cadastradas
4. Use o menu de navegação para acessar Carros, Motos, Marcas de Roupa e Usuários

---

## 5. Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|---|---|---|
| `PORT` | Porta da aplicação | `3000` |
| `JWT_SECRET` | Chave secreta para assinatura do JWT | `chave_super_secreta` |
| `JWT_EXPIRES_IN` | Tempo de expiração do token | `1h` |
| `MONGO_URI` | URI de conexão do MongoDB | `mongodb://mongo:27017/api_nosql` |
| `SQL_STORAGE` | Caminho do arquivo SQLite | `/data/database.sqlite` |
| `VITE_API_URL` | URL da API consumida pelo frontend | `http://localhost:3000` |

---

## 6. Endpoints da API

### Auth (público)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/registro` | Cria um novo usuário |
| POST | `/auth/login` | Autentica e retorna o token JWT |

### Usuários (protegido — JWT)

| Método | Rota | Permissão |
|---|---|---|
| GET | `/usuarios` | Apenas `admin` |
| GET | `/usuarios/:id` | Usuário autenticado |
| PUT | `/usuarios/:id` | Próprio usuário ou `admin` |
| DELETE | `/usuarios/:id` | Próprio usuário ou `admin` |

### Carros, Motos e Marcas de Roupa (protegido — JWT)

| Método | Rota |
|---|---|
| GET | `/carros` |
| GET | `/carros/:id` |
| POST | `/carros` |
| PUT | `/carros/:id` |
| DELETE | `/carros/:id` |

*(mesma estrutura para `/motos` e `/marcas-roupa`)*

> **Regra de negócio (camada Service):** o campo de ano (`ano` para carros/motos, `ano_fundacao` para marcas de roupa) não pode ser maior que o ano atual (+1 para carros/motos). Criar ou atualizar um registro com ano inválido retorna `400 Bad Request`.

---

## 7. Como Testar a API

### 7.1 — Via Swagger (mais simples)

1. Acesse `http://localhost:3000/docs`
2. Expanda o endpoint `POST /auth/registro` e clique em **Try it out**
3. Preencha o corpo de exemplo e clique em **Execute**
4. Repita para `POST /auth/login` e copie o `token` retornado
5. Clique no botão **Authorize** (cadeado, no topo da página)
6. Cole o token no formato: `Bearer SEU_TOKEN_AQUI`
7. Agora todos os endpoints protegidos podem ser testados diretamente pela interface

### 7.2 — Via Thunder Client (extensão do VS Code)

#### Passo 1 — Criar um usuário

- Método: `POST`
- URL: `http://localhost:3000/auth/registro`
- Aba **Body** → JSON:
```json
{
  "nome": "Gabriel Admin",
  "email": "gabriel@email.com",
  "senha": "Senha@123",
  "role": "admin"
}
```
- Resposta esperada: `201 Created`

#### Passo 2 — Login (obter o token)

- Método: `POST`
- URL: `http://localhost:3000/auth/login`
- Aba **Body** → JSON:
```json
{
  "email": "gabriel@email.com",
  "senha": "Senha@123"
}
```
- Copie o valor do campo `token` da resposta.

#### Passo 3 — Configurar autenticação

Em qualquer requisição protegida:
1. Aba **Auth**
2. **Auth Type:** `Bearer Token`
3. Cole o token copiado no Passo 2

> Se o token expirar (padrão: 1h), a API retorna `{ "erro": "Token inválido ou expirado." }`. Basta repetir o Passo 2 para obter um novo token.

#### Passo 4 — Criar um carro

- Método: `POST`
- URL: `http://localhost:3000/carros`
- Aba **Auth:** Bearer Token
- Aba **Body** → JSON:
```json
{
  "marca": "Toyota",
  "modelo": "Corolla",
  "ano": 2023,
  "cor": "Prata",
  "preco": 120000
}
```
- Resposta esperada: `201 Created`, com um campo `_id`. Copie esse ID.

#### Passo 5 — Listar carros

- Método: `GET`
- URL: `http://localhost:3000/carros`
- Aba **Auth:** Bearer Token
- Resposta esperada: `200 OK`, array com os carros cadastrados.

#### Passo 6 — Buscar carro por ID

- Método: `GET`
- URL: `http://localhost:3000/carros/{id}`
- Aba **Auth:** Bearer Token

#### Passo 7 — Atualizar carro

- Método: `PUT`
- URL: `http://localhost:3000/carros/{id}`
- Aba **Auth:** Bearer Token
- Aba **Body** → JSON:
```json
{ "cor": "Preto" }
```
- Resposta esperada: `200 OK`, com a cor atualizada.

#### Passo 8 — Deletar carro

- Método: `DELETE`
- URL: `http://localhost:3000/carros/{id}`
- Aba **Auth:** Bearer Token
- Resposta esperada: `204 No Content`

#### Passo 9 — Repita para Motos e Marcas de Roupa

**Moto** — URL base: `/motos`
```json
{
  "marca": "Honda",
  "modelo": "CB 500",
  "ano": 2022,
  "cilindradas": 500,
  "cor": "Vermelha"
}
```

**Marca de Roupa** — URL base: `/marcas-roupa`
```json
{
  "nome": "Nike",
  "pais_origem": "EUA",
  "segmento": "Esportivo",
  "ano_fundacao": 1964
}
```

#### Passo 10 — Testar CRUD de Usuários

- `GET /usuarios` — apenas com token de `admin` (retorna `403` se for `user`)
- `GET /usuarios/:id`
- `PUT /usuarios/:id` — Body: `{ "nome": "Novo Nome" }`
- `DELETE /usuarios/:id`

#### Passo 11 — Testar a proteção de rotas (OWASP)

- Método: `GET`
- URL: `http://localhost:3000/carros`
- **Não** preencher a aba Auth

Resposta esperada: `401 Unauthorized`

#### Passo 12 — Testar a regra de negócio do Service (ano inválido)

- Método: `POST`
- URL: `http://localhost:3000/carros`
- Aba **Auth:** Bearer Token
- Aba **Body** → JSON:
```json
{
  "marca": "Toyota",
  "modelo": "Corolla",
  "ano": 2099,
  "cor": "Prata",
  "preco": 120000
}
```
Resposta esperada: `400 Bad Request`

---

## 8. Testes Automatizados (Jest + Supertest)

Os testes de integração cobrem todos os endpoints da aplicação: autenticação, CRUD de usuários, carros, motos e marcas de roupa, incluindo casos de sucesso, erro, validação e proteção de rotas (32 testes no total).

### Rodando via Docker (recomendado)

Com o MongoDB já em execução:

```bash
docker compose up -d mongo
docker compose run --rm test
```

Saída esperada:
```bash
Test Suites: 2 passed, 2 total

Tests:       32 passed, 32 total
```

### Rodando localmente (sem Docker)

Requer Node.js e MongoDB rodando em `localhost:27017`:

```bash
npm install
npm test
```

---

## 9. Mapeamento de Segurança — OWASP Top 10 (2021)

| Item OWASP | Status | Como foi tratado |
|---|---|---|
| A01 — Broken Access Control | ✅ Aplicado | Middleware `autenticar` + `autorizar` com roles `user`/`admin` |
| A02 — Cryptographic Failures | ✅ Aplicado | Senhas com bcrypt (fator de custo 12), nunca em texto puro |
| A03 — Injection | ✅ Aplicado | Uso de ORMs (Sequelize/Mongoose), que parametrizam consultas automaticamente |
| A04 — Insecure Design | ✅ Aplicado | Rate limiting (100 req / 15 min por IP) + validação de regras de negócio na camada de Service |
| A05 — Security Misconfiguration | ✅ Aplicado | Helmet configurando headers HTTP seguros |
| A06 — Vulnerable Components | ⚠️ Parcial | Auditoria via `npm audit`; vulnerabilidades remanescentes estão em devDependencies (Jest, ferramentas de build) que não compõem a imagem de produção |
| A07 — Identification and Authentication Failures | ✅ Aplicado | JWT com expiração configurável + mensagens de erro genéricas no login |
| A08 — Software and Data Integrity Failures | ➖ Não aplicável | Fora do escopo (não há pipeline de CI/CD ou atualizações automáticas) |
| A09 — Security Logging and Monitoring Failures | ✅ Aplicado | Logging de requisições via `morgan` |
| A10 — Server-Side Request Forgery (SSRF) | ➖ Não aplicável | A aplicação não realiza requisições a URLs fornecidas pelo usuário |

### Auditoria de Dependências

```bash
npm audit
npm audit fix
```

---

## Autor

Gabriel — Atividade da disciplina de Arquitetura e Design de Software, 6º período.