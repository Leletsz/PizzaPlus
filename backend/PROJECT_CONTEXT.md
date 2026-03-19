# PizzaPlus — Documentação de Contexto do Projeto (Backend)

> Documento de referência técnica do projeto. Mantido atualizado a cada nova feature, rota ou mudança de arquitetura.

---

## 1. Visão Geral

Sistema de gerenciamento de pedidos para pizzaria.  
O backend é uma API REST construída com **Node.js + TypeScript + Express**, utilizando **Prisma ORM** para comunicação com o banco de dados **PostgreSQL**.

---

## 2. Stack e Versões

### Runtime & Linguagem
| Ferramenta | Versão |
|---|---|
| Node.js | (versão do ambiente local) |
| TypeScript | ^5.9.3 |
| tsx (dev runner) | ^4.21.0 |

### Dependências de Produção
| Biblioteca | Versão | Finalidade |
|---|---|---|
| express | ^5.2.1 | Framework HTTP |
| cors | ^2.8.6 | Liberação de CORS |
| dotenv | ^17.3.1 | Variáveis de ambiente |
| jsonwebtoken | ^9.0.3 | Geração e verificação de JWT |
| bcryptjs | ^3.0.3 | Hash de senhas |
| zod | ^4.3.6 | Validação de schemas |
| @prisma/client | ^7.5.0 | Client do ORM |
| @prisma/adapter-pg | ^7.5.0 | Adapter Prisma para PostgreSQL |
| pg | ^8.20.0 | Driver PostgreSQL |

### Dependências de Desenvolvimento
| Biblioteca | Versão | Finalidade |
|---|---|---|
| prisma | ^7.5.0 | CLI e geração de migrations |
| @types/express | ^5.0.6 | Tipos para Express |
| @types/cors | ^2.8.19 | Tipos para CORS |
| @types/jsonwebtoken | ^9.0.10 | Tipos para JWT |
| @types/node | ^25.5.0 | Tipos para Node |
| @types/pg | ^8.18.0 | Tipos para pg |
| prettier | ^3.8.1 | Formatação de código |
| eslint-plugin-prettier | ^5.5.5 | Lint integrado ao prettier |
| eslint-config-prettier | ^10.1.8 | Desativa regras conflitantes |

### Scripts
```json
"dev": "tsx watch src/server.ts"
"format": "prettier --write ."
```

---

## 3. Arquitetura

O projeto segue uma arquitetura em **3 camadas**, baseada no padrão **Rotas → Controller → Service**:

```
Requisição HTTP
      │
      ▼
  [ Rotas ]               routes.ts
  (define endpoint, aplica middlewares)
      │
      ▼
  [ Middlewares ]         validateSchema | isAuthenticated | isAdmin
  (valida token, permissão, schema do body)
      │
      ▼
  [ Controller ]          controllers/<domínio>/<Ação>Controller.ts
  (recebe req, extrai dados, chama o service, retorna res)
      │
      ▼
  [ Service ]             services/<domínio>/<Ação>Service.ts
  (contém toda a lógica de negócio, comunica com o banco via Prisma)
      │
      ▼
  [ Prisma ORM ]
  (comunica com o PostgreSQL)
```

**Regras da arquitetura:**
- O **Controller** nunca acessa o banco diretamente. Ele apenas delega para o **Service**.
- O **Service** é responsável por toda a regra de negócio e retorna o resultado para o Controller.
- O Controller retorna o resultado via `res.json()` para o cliente.
- Erros lançados nos Services são capturados pelo **error handler global** no `server.ts`.

---

## 4. Organização de Pastas

```
backend/
├── prisma/
│   ├── schema.prisma           # Definição dos models e banco
│   └── migrations/             # Histórico de migrations
├── generated/
│   └── prisma/                 # Client gerado pelo Prisma
├── src/
│   ├── server.ts               # Inicialização do Express, middlewares globais
│   ├── routes.ts               # Definição de todas as rotas
│   │
│   ├── controllers/
│   │   ├── user/
│   │   │   ├── CreateUserController.ts
│   │   │   ├── AuthUserController.ts
│   │   │   └── DetailUserController.ts
│   │   └── category/
│   │       └── CreateCategoryController.ts
│   │
│   ├── services/
│   │   ├── user/
│   │   │   ├── CreateUserService.ts
│   │   │   ├── AuthUserService.ts
│   │   │   └── DetailUserService.ts
│   │   └── category/
│   │       └── CreateCategoryService.ts
│   │
│   ├── middlewares/
│   │   ├── isAuthenticated.ts  # Verifica JWT no header Authorization
│   │   ├── isAdmin.ts          # Verifica se o usuário tem role ADMIN
│   │   └── validateSchema.ts   # Valida o body/query/params com Zod
│   │
│   ├── schemas/
│   │   ├── userSchema.ts       # Schemas Zod para criação e autenticação de usuário
│   │   └── categorySchema.ts   # Schema Zod para criação de categoria
│   │
│   ├── prisma/
│   │   └── index.ts            # Instância singleton do PrismaClient
│   │
│   └── @types/
│       └── express/
│           └── index.d.ts      # Extensão do tipo Request (user_id)
│
├── package.json
├── tsconfig.json
├── prisma.config.ts
└── .env
```

---

## 5. Variáveis de Ambiente (.env)

| Variável | Descrição |
|---|---|
| `PORT` | Porta em que o servidor sobe |
| `JWT_SECRET` | Chave secreta usada para assinar e verificar tokens JWT |
| `DATABASE_URL` | URL de conexão com o PostgreSQL (usada pelo Prisma) |

---

## 6. Banco de Dados — Modelagem Prisma

**Provider:** PostgreSQL  
**Output do client gerado:** `../generated/prisma`

### Enum: Role
```prisma
enum Role {
  STAFF   // funcionário comum (padrão)
  ADMIN   // administrador com permissões extras
}
```

### Model: User → tabela `users`
| Campo | Tipo | Detalhes |
|---|---|---|
| id | String | UUID, chave primária |
| name | String | Nome do usuário |
| email | String | Único |
| password | String | Hash bcrypt |
| role | Role | Padrão: STAFF |
| CreatedAt | DateTime | Automático (agora) |
| updatedAt | DateTime | Atualiza automaticamente |

### Model: Category → tabela `categories`
| Campo | Tipo | Detalhes |
|---|---|---|
| id | String | UUID, chave primária |
| name | String | Nome da categoria |
| CreatedAt | DateTime | Automático |
| updatedAt | DateTime | Atualiza automaticamente |
| products | Product[] | Relação 1:N com produtos |

### Model: Product → tabela `products`
| Campo | Tipo | Detalhes |
|---|---|---|
| id | String | UUID, chave primária |
| name | String | Nome do produto |
| price | Int | Preço em centavos |
| description | String | Descrição |
| banner | String | URL da imagem |
| disabled | Boolean | Padrão: false |
| CreatedAt | DateTime | Automático |
| updatedAt | DateTime | Atualiza automaticamente |
| category_id | String | FK para Category (CASCADE) |
| items | Item[] | Relação 1:N com itens de pedido |

### Model: Order → tabela `orders`
| Campo | Tipo | Detalhes |
|---|---|---|
| id | String | UUID, chave primária |
| table | Int | Número da mesa |
| status | Boolean | false = pendente / true = pronto |
| draft | Boolean | true = rascunho / false = enviado para produção |
| name | String? | Nome do cliente (opcional) |
| CreatedAt | DateTime | Automático |
| updatedAt | DateTime | Atualiza automaticamente |
| items | Item[] | Relação 1:N com itens |

### Model: Item → tabela `items`
| Campo | Tipo | Detalhes |
|---|---|---|
| id | String | UUID, chave primária |
| amount | Int | Quantidade do produto |
| CreatedAt | DateTime | Automático |
| updatedAt | DateTime | Atualiza automaticamente |
| order_id | String | FK para Order (CASCADE) |
| product_id | String | FK para Product (CASCADE) |

### Diagrama de Relacionamentos
```
User (sem relação direta com pedidos)

Category ──< Product ──< Item >── Order
```

---

## 7. Endpoints

Base URL: `http://localhost:<PORT>`

### Usuários

| Método | Rota | Middlewares | Descrição |
|---|---|---|---|
| POST | `/users` | `validateSchema(createUserSchema)` | Cria um novo usuário |
| POST | `/session` | `validateSchema(authUserSchema)` | Autentica o usuário, retorna JWT |
| GET | `/me` | `isAuthenticated` | Retorna dados do usuário autenticado |

#### `POST /users`
- **Body:** `{ name, email, password }`
- **Resposta:** `{ id, name, email, role, CreatedAt }`
- **Erros:** Usuário já existente → 400

#### `POST /session`
- **Body:** `{ email, password }`
- **Resposta:** `{ id, name, email, role, token }`
- **Erros:** Email/Senha inválidos → 400

#### `GET /me`
- **Header:** `Authorization: Bearer <token>`
- **Resposta:** `{ id, name, email, role, CreatedAt }`

---

### Categorias

| Método | Rota | Middlewares | Descrição |
|---|---|---|---|
| POST | `/category` | `isAuthenticated`, `isAdmin`, `validateSchema(createCategorySchema)` | Cria uma nova categoria |
| GET | `/category` | `isAuthenticated` | Lista todas as categorias cadastradas |

#### `POST /category`
- **Header:** `Authorization: Bearer <token>` (obrigatório, role ADMIN)
- **Body:** `{ name }`
- **Resposta:** `{ id, name, CreatedAt }`
- **Erros:** Sem token → 401 / Não é ADMIN → 401

#### `GET /category`
- **Header:** `Authorization: Bearer <token>` (obrigatório)
- **Resposta:** Array de categorias `[{ id, name, CreatedAt }]` ordenadas por nome
- **Erros:** Sem token → 401

---

## 8. Middlewares

### `isAuthenticated`
**Arquivo:** `src/middlewares/isAuthenticated.ts`

Responsável por proteger rotas autenticadas.

**Fluxo:**
1. Lê o header `Authorization: Bearer <token>`
2. Verifica e decodifica o JWT com a `JWT_SECRET`
3. Extrai o `sub` (user_id) do payload
4. Injeta `req.user_id = sub` para uso nos controllers/middlewares seguintes
5. Chama `next()` ou retorna `401` caso inválido

### `isAdmin`
**Arquivo:** `src/middlewares/isAdmin.ts`

Verifica se o usuário autenticado tem permissão de ADMIN.  
**Deve ser usado após `isAuthenticated`** (depende do `req.user_id`).

**Fluxo:**
1. Lê `req.user_id` injetado pelo `isAuthenticated`
2. Busca o usuário no banco via Prisma
3. Verifica se `user.role === "ADMIN"`
4. Retorna `401` com mensagem de acesso negado caso contrário

### `validateSchema`
**Arquivo:** `src/middlewares/validateSchema.ts`

Middleware de fábrica que recebe um **schema Zod** e valida o corpo da requisição.

**Fluxo:**
1. Recebe um `ZodType` como parâmetro e retorna um middleware
2. Executa `schema.parseAsync({ body, query, params })`
3. Em caso de erro Zod, retorna `400` com lista detalhada dos campos inválidos
4. Em caso de sucesso, chama `next()`

**Formato do erro retornado:**
```json
{
  "error": "Erro validação",
  "details": [
    { "campo": "body.email", "mensagem": "Precisa ser um email valido!" }
  ]
}
```

---

## 9. Schemas de Validação (Zod)

### `createUserSchema`
**Arquivo:** `src/schemas/userSchema.ts`

```ts
z.object({
  body: z.object({
    name: z.string().min(3),      // mín. 3 caracteres
    email: z.email(),              // email válido
    password: z.string().min(6),  // mín. 6 caracteres
  }),
})
```

### `authUserSchema`
**Arquivo:** `src/schemas/userSchema.ts`

```ts
z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(6),
  }),
})
```

### `createCategorySchema`
**Arquivo:** `src/schemas/categorySchema.ts`

```ts
z.object({
  body: z.object({
    name: z.string().min(2),  // mín. 2 caracteres
  }),
})
```

---

## 10. Autenticação JWT

- **Biblioteca:** `jsonwebtoken ^9.0.3`
- **Payload:** `{ name, email }`
- **Subject (`sub`):** `user.id` (UUID do usuário)
- **Expiração:** `30d` (30 dias)
- **Chave:** variável de ambiente `JWT_SECRET`

O token é enviado pelo cliente no header:
```
Authorization: Bearer <token>
```

---

## 11. Hash de Senha

- **Biblioteca:** `bcryptjs ^3.0.3`
- **Salt rounds:** `8`
- A senha **nunca é armazenada em texto puro**. É sempre hasheada antes de salvar no banco.

---

## 12. Error Handler Global

Definido em `src/server.ts`, captura erros lançados nos services:

```ts
app.use((error: Error, _: Request, res: Response, next: NextFunction) => {
  if (error instanceof Error) {
    return res.status(400).json({ error: error.message });
  }
  return res.status(500).json({ error: "internal server error!" });
});
```

---

## 13. Comandos Prisma Úteis

```bash
# Criar migration e aplicar no banco
npx prisma migrate dev

# Gerar o client TypeScript
npx prisma generate

# Abrir interface visual do banco
npx prisma studio
```

---

## 14. Extensão de Tipos TypeScript

O tipo `Request` do Express foi estendido para incluir `user_id`:

**Arquivo:** `src/@types/express/index.d.ts`
```ts
declare namespace Express {
  interface Request {
    user_id: string;
  }
}
```

---

*Última atualização: Março 2026*
