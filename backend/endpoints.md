# PizzaPlus — Documentação Completa de Endpoints

> Referência técnica de todos os endpoints da API REST do PizzaPlus.  
> Base URL: `http://localhost:<PORT>`

---

## Sumário

- [Usuários](#usuários)
  - [POST /users](#post-users)
  - [POST /session](#post-session)
  - [GET /me](#get-me)
- [Categorias](#categorias)
  - [POST /category](#post-category)
  - [GET /category](#get-category)
- [Produtos](#produtos)
  - [POST /product](#post-product)
  - [GET /products](#get-products)
  - [DELETE /product](#delete-product)
  - [GET /category/product](#get-categoryproduct)
- [Pedidos](#pedidos)
  - [POST /order](#post-order)
  - [GET /orders](#get-orders)
  - [POST /order/add](#post-orderadd)
  - [DELETE /order/remove](#delete-orderremove)
  - [GET /order/detail](#get-orderdetail)
  - [PUT /order/send](#put-ordersend)
  - [PUT /order/finish](#put-orderfinish)
  - [DELETE /order](#delete-order)

---

## Usuários

### POST /users

Cria um novo usuário no sistema.

**Autenticação:** ❌ Não requerida  
**Middlewares:** `validateSchema(createUserSchema)`  
**Controller:** `CreateUserController`  
**Service:** `CreateUserService`

#### Request

```http
POST /users
Content-Type: application/json
```

| Campo | Tipo | Obrigatório | Validação |
|---|---|---|---|
| `name` | string | ✅ | Mínimo 3 caracteres |
| `email` | string | ✅ | Formato de e-mail válido |
| `password` | string | ✅ | Mínimo 6 caracteres |

**Exemplo de body:**
```json
{
  "name": "João Silva",
  "email": "joao@pizzaplus.com",
  "password": "senha123"
}
```

#### Response

**200 OK**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "João Silva",
  "email": "joao@pizzaplus.com",
  "role": "STAFF",
  "CreatedAt": "2026-03-29T15:00:00.000Z"
}
```

#### Erros

| Status | Condição | Body |
|---|---|---|
| 400 | E-mail já cadastrado | `{ "error": "Usuário já existe" }` |
| 400 | Schema inválido | `{ "error": "Erro validação", "details": [...] }` |

---

### POST /session

Autentica o usuário e retorna um token JWT.

**Autenticação:** ❌ Não requerida  
**Middlewares:** `validateSchema(authUserSchema)`  
**Controller:** `AuthUserController`  
**Service:** `AuthUserService`

#### Request

```http
POST /session
Content-Type: application/json
```

| Campo | Tipo | Obrigatório | Validação |
|---|---|---|---|
| `email` | string | ✅ | Formato de e-mail válido |
| `password` | string | ✅ | Mínimo 6 caracteres |

**Exemplo de body:**
```json
{
  "email": "joao@pizzaplus.com",
  "password": "senha123"
}
```

#### Response

**200 OK**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "João Silva",
  "email": "joao@pizzaplus.com",
  "role": "STAFF",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> O token tem validade de **30 dias**. Deve ser enviado no header `Authorization: Bearer <token>` nas rotas protegidas.

#### Erros

| Status | Condição | Body |
|---|---|---|
| 400 | E-mail não encontrado | `{ "error": "Email ou senha inválidos" }` |
| 400 | Senha incorreta | `{ "error": "Email ou senha inválidos" }` |
| 400 | Schema inválido | `{ "error": "Erro validação", "details": [...] }` |

---

### GET /me

Retorna os dados do usuário autenticado.

**Autenticação:** ✅ Requerida  
**Middlewares:** `isAuthenticated`  
**Controller:** `DetailUserController`  
**Service:** `DetailUserService`

#### Request

```http
GET /me
Authorization: Bearer <token>
```

Sem body ou query params.

#### Response

**200 OK**
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "João Silva",
  "email": "joao@pizzaplus.com",
  "role": "STAFF",
  "CreatedAt": "2026-03-29T15:00:00.000Z"
}
```

#### Erros

| Status | Condição | Body |
|---|---|---|
| 401 | Token ausente ou inválido | `{ "error": "Unauthorized" }` |

---

## Categorias

### POST /category

Cria uma nova categoria. Requer permissão de **ADMIN**.

**Autenticação:** ✅ Requerida  
**Permissão:** ADMIN  
**Middlewares:** `isAuthenticated`, `isAdmin`, `validateSchema(createCategorySchema)`  
**Controller:** `CreateCategoryController`  
**Service:** `CreateCategoryService`

#### Request

```http
POST /category
Authorization: Bearer <token>
Content-Type: application/json
```

| Campo | Tipo | Obrigatório | Validação |
|---|---|---|---|
| `name` | string | ✅ | Mínimo 2 caracteres |

**Exemplo de body:**
```json
{
  "name": "Pizzas Tradicionais"
}
```

#### Response

**200 OK**
```json
{
  "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "name": "Pizzas Tradicionais",
  "CreatedAt": "2026-03-29T15:30:00.000Z"
}
```

#### Erros

| Status | Condição | Body |
|---|---|---|
| 401 | Token ausente ou inválido | `{ "error": "Unauthorized" }` |
| 401 | Usuário não é ADMIN | `{ "error": "Acesso negado" }` |
| 400 | Schema inválido | `{ "error": "Erro validação", "details": [...] }` |

---

### GET /category

Lista todas as categorias cadastradas, ordenadas por nome.

**Autenticação:** ✅ Requerida  
**Middlewares:** `isAuthenticated`  
**Controller:** `ListCategoryController`  
**Service:** `ListCategoryService`

#### Request

```http
GET /category
Authorization: Bearer <token>
```

Sem body ou query params.

#### Response

**200 OK**
```json
[
  {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "name": "Bebidas",
    "CreatedAt": "2026-03-20T10:00:00.000Z"
  },
  {
    "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "name": "Pizzas Tradicionais",
    "CreatedAt": "2026-03-29T15:30:00.000Z"
  }
]
```

#### Erros

| Status | Condição | Body |
|---|---|---|
| 401 | Token ausente ou inválido | `{ "error": "Unauthorized" }` |

---

## Produtos

### POST /product

Cria um novo produto com upload de imagem para o Cloudinary. Requer permissão de **ADMIN**.

**Autenticação:** ✅ Requerida  
**Permissão:** ADMIN  
**Middlewares:** `isAuthenticated`, `isAdmin`, `upload.single("file")`, `validateSchema(createProductSchema)`  
**Controller:** `CreateProductController`  
**Service:** `CreateProductService`  
**Content-Type:** `multipart/form-data`

#### Request

```http
POST /product
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `name` | string | ✅ | Nome do produto (mín. 1 caractere) |
| `price` | string | ✅ | Preço em centavos, apenas dígitos (ex: `"2990"` = R$ 29,90) |
| `description` | string | ✅ | Descrição do produto |
| `category_id` | string (UUID) | ✅ | ID da categoria |
| `file` | arquivo de imagem | ✅ | Imagem do produto |

**Exemplo de body (form-data):**
```
name        = "Pizza Margherita"
price       = "3590"
description = "Molho de tomate, mussarela e manjericão"
category_id = "c3d4e5f6-a7b8-9012-cdef-123456789012"
file        = [arquivo de imagem]
```

#### Response

**200 OK**
```json
{
  "id": "d4e5f6a7-b8c9-0123-defa-234567890123",
  "name": "Pizza Margherita",
  "price": 3590,
  "description": "Molho de tomate, mussarela e manjericão",
  "banner": "https://res.cloudinary.com/sua-cloud/image/upload/v.../products/arquivo.jpg",
  "category_id": "c3d4e5f6-a7b8-9012-cdef-123456789012"
}
```

> O campo `price` é enviado como string no formulário e convertido para `Int` (centavos) com `parseInt()` no service.  
> O campo `banner` é a URL pública retornada pelo Cloudinary após o upload.

#### Erros

| Status | Condição | Body |
|---|---|---|
| 401 | Token ausente ou inválido | `{ "error": "Unauthorized" }` |
| 401 | Usuário não é ADMIN | `{ "error": "Acesso negado" }` |
| 400 | Arquivo de imagem não enviado | `{ "error": "Arquivo de imagem é obrigatório" }` |
| 400 | Categoria inválida | `{ "error": "Categoria não encontrada" }` |
| 400 | Schema inválido | `{ "error": "Erro validação", "details": [...] }` |

---

### GET /products

Lista produtos filtrados pelo campo `disabled`.

**Autenticação:** ✅ Requerida  
**Middlewares:** `isAuthenticated`, `validateSchema(listProductSchema)`  
**Controller:** `ListProductController`  
**Service:** `ListProductService`

#### Request

```http
GET /products?disabled=false
Authorization: Bearer <token>
```

| Query Param | Tipo | Obrigatório | Valores válidos | Padrão |
|---|---|---|---|---|
| `disabled` | string | ❌ | `"true"` ou `"false"` | `"false"` |

**Exemplos de chamada:**
```
GET /products              → lista produtos ativos (disabled = false)
GET /products?disabled=false → lista produtos ativos
GET /products?disabled=true  → lista produtos desativados
```

#### Response

**200 OK**
```json
[
  {
    "id": "d4e5f6a7-b8c9-0123-defa-234567890123",
    "name": "Pizza Margherita",
    "price": 3590,
    "description": "Molho de tomate, mussarela e manjericão",
    "banner": "https://res.cloudinary.com/...",
    "disabled": false,
    "category_id": "c3d4e5f6-a7b8-9012-cdef-123456789012"
  }
]
```

#### Erros

| Status | Condição | Body |
|---|---|---|
| 401 | Token ausente ou inválido | `{ "error": "Unauthorized" }` |
| 400 | Valor de `disabled` inválido | `{ "error": "Erro validação", "details": [...] }` |

---

### DELETE /product

Remove um produto pelo `product_id`. Requer permissão de **ADMIN**.

**Autenticação:** ✅ Requerida  
**Permissão:** ADMIN  
**Middlewares:** `isAuthenticated`, `isAdmin`  
**Controller:** `DeleteProductController`  
**Service:** `DeleteProductService`

#### Request

```http
DELETE /product?product_id=d4e5f6a7-b8c9-0123-defa-234567890123
Authorization: Bearer <token>
```

| Query Param | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `product_id` | string (UUID) | ✅ | ID do produto a ser removido |

#### Response

**200 OK**
```json
{
  "message": "Produto deletado com sucesso"
}
```

#### Erros

| Status | Condição | Body |
|---|---|---|
| 401 | Token ausente ou inválido | `{ "error": "Unauthorized" }` |
| 401 | Usuário não é ADMIN | `{ "error": "Acesso negado" }` |
| 400 | Produto não encontrado | `{ "error": "Produto não encontrado" }` |

---

### GET /category/product

Lista todos os produtos de uma categoria específica.

**Autenticação:** ✅ Requerida  
**Middlewares:** `isAuthenticated`, `validateSchema(listProductByCategorySchema)`  
**Controller:** `ListProductByCategoryController`  
**Service:** `ListProductByCategoryService`

#### Request

```http
GET /category/product?category_id=c3d4e5f6-a7b8-9012-cdef-123456789012
Authorization: Bearer <token>
```

| Query Param | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `category_id` | string (UUID) | ✅ | ID da categoria |

#### Response

**200 OK**
```json
[
  {
    "id": "d4e5f6a7-b8c9-0123-defa-234567890123",
    "name": "Pizza Margherita",
    "price": 3590,
    "description": "Molho de tomate, mussarela e manjericão",
    "banner": "https://res.cloudinary.com/...",
    "disabled": false,
    "category_id": "c3d4e5f6-a7b8-9012-cdef-123456789012"
  }
]
```

#### Erros

| Status | Condição | Body |
|---|---|---|
| 401 | Token ausente ou inválido | `{ "error": "Unauthorized" }` |
| 400 | `category_id` ausente ou inválido | `{ "error": "Erro validação", "details": [...] }` |

---

## Pedidos

### POST /order

Cria um novo pedido em modo **rascunho** (`draft: true`, `status: false`).

**Autenticação:** ✅ Requerida  
**Middlewares:** `isAuthenticated`, `validateSchema(createOrderSchema)`  
**Controller:** `CreateOrderController`  
**Service:** `CreateOrderService`

#### Request

```http
POST /order
Authorization: Bearer <token>
Content-Type: application/json
```

| Campo | Tipo | Obrigatório | Validação |
|---|---|---|---|
| `table` | number (int) | ✅ | Inteiro positivo |
| `name` | string | ❌ | Nome do cliente |

**Exemplo de body:**
```json
{
  "table": 5,
  "name": "Maria"
}
```

#### Response

**200 OK**
```json
{
  "id": "e5f6a7b8-c9d0-1234-efab-345678901234",
  "table": 5,
  "name": "Maria",
  "status": false,
  "draft": true,
  "CreatedAt": "2026-03-29T16:00:00.000Z"
}
```

#### Erros

| Status | Condição | Body |
|---|---|---|
| 401 | Token ausente ou inválido | `{ "error": "Unauthorized" }` |
| 400 | Schema inválido | `{ "error": "Erro validação", "details": [...] }` |
| 400 | Erro ao criar pedido | `{ "error": "Erro ao criar pedido" }` |

---

### GET /orders

Lista todos os pedidos. Filtra por `draft` (rascunho ou enviados para produção).

**Autenticação:** ✅ Requerida  
**Middlewares:** `isAuthenticated`  
**Controller:** `ListOrdersController`  
**Service:** `ListOrdersService`

#### Request

```http
GET /orders?draft=false
Authorization: Bearer <token>
```

| Query Param | Tipo | Obrigatório | Valores | Padrão |
|---|---|---|---|---|
| `draft` | string | ❌ | `"true"` ou `"false"` | `"false"` |

**Exemplos de chamada:**
```
GET /orders              → pedidos enviados para produção (draft = false)
GET /orders?draft=true   → pedidos em rascunho
GET /orders?draft=false  → pedidos enviados para produção
```

#### Response

**200 OK**
```json
[
  {
    "id": "e5f6a7b8-c9d0-1234-efab-345678901234",
    "table": 5,
    "name": "Maria",
    "status": false,
    "draft": false,
    "CreatedAt": "2026-03-29T16:00:00.000Z",
    "items": [
      {
        "id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
        "amount": 2,
        "product": {
          "id": "d4e5f6a7-b8c9-0123-defa-234567890123",
          "name": "Pizza Margherita",
          "price": 3590,
          "description": "Molho de tomate, mussarela e manjericão",
          "banner": "https://res.cloudinary.com/..."
        }
      }
    ]
  }
]
```

> Pedidos são ordenados por `CreatedAt` decrescente (mais recentes primeiro).

#### Erros

| Status | Condição | Body |
|---|---|---|
| 401 | Token ausente ou inválido | `{ "error": "Unauthorized" }` |

---

### POST /order/add

Adiciona um item (produto) a um pedido existente.

**Autenticação:** ✅ Requerida  
**Middlewares:** `isAuthenticated`, `validateSchema(addItemSchema)`  
**Controller:** `AddItemController`  
**Service:** `AddItemOrderService`

#### Request

```http
POST /order/add
Authorization: Bearer <token>
Content-Type: application/json
```

| Campo | Tipo | Obrigatório | Validação |
|---|---|---|---|
| `order_id` | string (UUID) | ✅ | Mínimo 1 caractere |
| `product_id` | string (UUID) | ✅ | Mínimo 1 caractere |
| `amount` | number (int) | ✅ | Inteiro positivo |

**Exemplo de body:**
```json
{
  "order_id": "e5f6a7b8-c9d0-1234-efab-345678901234",
  "product_id": "d4e5f6a7-b8c9-0123-defa-234567890123",
  "amount": 2
}
```

#### Response

**200 OK**
```json
{
  "id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
  "order_id": "e5f6a7b8-c9d0-1234-efab-345678901234",
  "product_id": "d4e5f6a7-b8c9-0123-defa-234567890123",
  "amount": 2,
  "CreatedAt": "2026-03-29T16:05:00.000Z",
  "product": {
    "id": "d4e5f6a7-b8c9-0123-defa-234567890123",
    "name": "Pizza Margherita",
    "price": 3590,
    "banner": "https://res.cloudinary.com/...",
    "description": "Molho de tomate, mussarela e manjericão"
  }
}
```

#### Erros

| Status | Condição | Body |
|---|---|---|
| 401 | Token ausente ou inválido | `{ "error": "Unauthorized" }` |
| 400 | Pedido não encontrado | `{ "error": "Erro ao adicionar item ao pedido" }` |
| 400 | Produto não encontrado | `{ "error": "Erro ao adicionar item ao pedido" }` |
| 400 | Schema inválido | `{ "error": "Erro validação", "details": [...] }` |

---

### DELETE /order/remove

Remove um item específico de um pedido.

**Autenticação:** ✅ Requerida  
**Middlewares:** `isAuthenticated`, `validateSchema(removeItemSchema)`  
**Controller:** `RemoveItemController`  
**Service:** `RemoveItemOrderService`

#### Request

```http
DELETE /order/remove?item_id=f6a7b8c9-d0e1-2345-fabc-456789012345
Authorization: Bearer <token>
```

| Query Param | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `item_id` | string (UUID) | ✅ | ID do item a ser removido |

#### Response

**200 OK**
```json
{
  "message": "Item removido com sucesso"
}
```

#### Erros

| Status | Condição | Body |
|---|---|---|
| 401 | Token ausente ou inválido | `{ "error": "Unauthorized" }` |
| 400 | Item não encontrado | `{ "error": "Erro ao remover item" }` |
| 400 | Schema inválido | `{ "error": "Erro validação", "details": [...] }` |

---

### GET /order/detail

Retorna todos os detalhes de um pedido específico, incluindo seus itens e produtos.

**Autenticação:** ✅ Requerida  
**Middlewares:** `isAuthenticated`, `validateSchema(detailOrderSchema)`  
**Controller:** `DetailOrderController`  
**Service:** `DetailOrderService`

#### Request

```http
GET /order/detail?order_id=e5f6a7b8-c9d0-1234-efab-345678901234
Authorization: Bearer <token>
```

| Query Param | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `order_id` | string (UUID) | ✅ | ID do pedido |

#### Response

**200 OK**
```json
{
  "id": "e5f6a7b8-c9d0-1234-efab-345678901234",
  "table": 5,
  "name": "Maria",
  "status": false,
  "draft": false,
  "CreatedAt": "2026-03-29T16:00:00.000Z",
  "updatedAt": "2026-03-29T16:10:00.000Z",
  "items": [
    {
      "id": "f6a7b8c9-d0e1-2345-fabc-456789012345",
      "amount": 2,
      "CreatedAt": "2026-03-29T16:05:00.000Z",
      "product": {
        "id": "d4e5f6a7-b8c9-0123-defa-234567890123",
        "name": "Pizza Margherita",
        "price": 3590,
        "description": "Molho de tomate, mussarela e manjericão",
        "banner": "https://res.cloudinary.com/..."
      }
    }
  ]
}
```

#### Erros

| Status | Condição | Body |
|---|---|---|
| 401 | Token ausente ou inválido | `{ "error": "Unauthorized" }` |
| 400 | Pedido não encontrado | `{ "error": "Pedido não encontrado" }` |
| 400 | Schema inválido | `{ "error": "Erro validação", "details": [...] }` |

---

### PUT /order/send

Envia o pedido para produção (altera `draft` de `true` para `false`) e associa o nome do cliente.

**Autenticação:** ✅ Requerida  
**Middlewares:** `isAuthenticated`, `validateSchema(sendOrderSchema)`  
**Controller:** `SendOrderController`  
**Service:** `SendOrderService`

#### Request

```http
PUT /order/send
Authorization: Bearer <token>
Content-Type: application/json
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `order_id` | string (UUID) | ✅ | ID do pedido |
| `name` | string | ✅ | Nome do cliente |

**Exemplo de body:**
```json
{
  "order_id": "e5f6a7b8-c9d0-1234-efab-345678901234",
  "name": "Maria"
}
```

#### Response

**200 OK**
```json
{
  "id": "e5f6a7b8-c9d0-1234-efab-345678901234",
  "table": 5,
  "name": "Maria",
  "draft": false,
  "status": false,
  "CreatedAt": "2026-03-29T16:00:00.000Z"
}
```

> Após este endpoint, o pedido aparece na fila de produção (`draft: false`).

#### Erros

| Status | Condição | Body |
|---|---|---|
| 401 | Token ausente ou inválido | `{ "error": "Unauthorized" }` |
| 400 | Pedido não encontrado | `{ "error": "falha ao enviar o pedido" }` |
| 400 | Schema inválido | `{ "error": "Erro validação", "details": [...] }` |

---

### PUT /order/finish

Finaliza o pedido (altera `status` de `false` para `true`), indicando que está pronto.

**Autenticação:** ✅ Requerida  
**Middlewares:** `isAuthenticated`, `validateSchema(finishOrderSchema)`  
**Controller:** `FinishOrderController`  
**Service:** `FinishOrderService`

#### Request

```http
PUT /order/finish
Authorization: Bearer <token>
Content-Type: application/json
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `order_id` | string (UUID) | ✅ | ID do pedido |

**Exemplo de body:**
```json
{
  "order_id": "e5f6a7b8-c9d0-1234-efab-345678901234"
}
```

#### Response

**200 OK**
```json
{
  "id": "e5f6a7b8-c9d0-1234-efab-345678901234",
  "table": 5,
  "name": "Maria",
  "draft": false,
  "status": true,
  "CreatedAt": "2026-03-29T16:00:00.000Z"
}
```

> `status: true` significa que o pedido está **pronto para ser entregue**.

#### Erros

| Status | Condição | Body |
|---|---|---|
| 401 | Token ausente ou inválido | `{ "error": "Unauthorized" }` |
| 400 | Pedido não encontrado | `{ "error": "falha ao finalizar o pedido" }` |
| 400 | Schema inválido | `{ "error": "Erro validação", "details": [...] }` |

---

### DELETE /order

Remove completamente um pedido do sistema.

**Autenticação:** ✅ Requerida  
**Middlewares:** `isAuthenticated`, `validateSchema(deleteOrderSchema)`  
**Controller:** `DeleteOrderController`  
**Service:** `DeleteOrderService`

#### Request

```http
DELETE /order?order_id=e5f6a7b8-c9d0-1234-efab-345678901234
Authorization: Bearer <token>
```

| Query Param | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `order_id` | string (UUID) | ✅ | ID do pedido a ser removido |

#### Response

**200 OK**
```json
{
  "message": "Pedido deletado com sucesso"
}
```

#### Erros

| Status | Condição | Body |
|---|---|---|
| 401 | Token ausente ou inválido | `{ "error": "Unauthorized" }` |
| 400 | Pedido não encontrado | `{ "error": "falha ao deletar o pedido" }` |
| 400 | Schema inválido | `{ "error": "Erro validação", "details": [...] }` |

---

## Fluxo Completo de um Pedido

```
1. POST /order          → Cria pedido (draft: true, status: false)
2. POST /order/add      → Adiciona itens ao pedido (repita para cada item)
3. DELETE /order/remove → Remove item específico (se necessário)
4. GET /order/detail    → Consulta detalhes e itens do pedido
5. PUT /order/send      → Envia para produção (draft: false)
6. PUT /order/finish    → Finaliza pedido (status: true)
7. DELETE /order        → Remove o pedido (limpeza)
```

---

## Tabela Rápida de Referência

| Método | Rota | Auth | Admin | Body/Query | Controller |
|---|---|---|---|---|---|
| POST | `/users` | ❌ | ❌ | body | CreateUserController |
| POST | `/session` | ❌ | ❌ | body | AuthUserController |
| GET | `/me` | ✅ | ❌ | — | DetailUserController |
| POST | `/category` | ✅ | ✅ | body | CreateCategoryController |
| GET | `/category` | ✅ | ❌ | — | ListCategoryController |
| POST | `/product` | ✅ | ✅ | form-data | CreateProductController |
| GET | `/products` | ✅ | ❌ | query: `disabled` | ListProductController |
| DELETE | `/product` | ✅ | ✅ | query: `product_id` | DeleteProductController |
| GET | `/category/product` | ✅ | ❌ | query: `category_id` | ListProductByCategoryController |
| POST | `/order` | ✅ | ❌ | body | CreateOrderController |
| GET | `/orders` | ✅ | ❌ | query: `draft` | ListOrdersController |
| POST | `/order/add` | ✅ | ❌ | body | AddItemController |
| DELETE | `/order/remove` | ✅ | ❌ | query: `item_id` | RemoveItemController |
| GET | `/order/detail` | ✅ | ❌ | query: `order_id` | DetailOrderController |
| PUT | `/order/send` | ✅ | ❌ | body | SendOrderController |
| PUT | `/order/finish` | ✅ | ❌ | body | FinishOrderController |
| DELETE | `/order` | ✅ | ❌ | query: `order_id` | DeleteOrderController |

---

*Última atualização: Março 2026*
