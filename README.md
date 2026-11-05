# Pokédex Backend

API REST desenvolvida com **Node.js, TypeScript, Express e MongoDB**, responsável pelo gerenciamento de usuários, autenticação e armazenamento dos Pokémon capturados em uma Pokédex pessoal.

O projeto foi desenvolvido para funcionar como backend de uma aplicação Pokédex em React, permitindo que cada usuário tenha sua própria coleção de Pokémon.

## Tecnologias utilizadas

- **Node.js** — Ambiente de execução.
- **TypeScript** — Tipagem estática.
- **Express** — Construção da API REST.
- **MongoDB** — Banco de dados NoSQL.
- **Mongoose** — Modelagem e comunicação com o MongoDB.
- **JWT (JSON Web Token)** — Autenticação e autorização.
- **Bcrypt** — Criptografia de senhas.
- **Zod** — Validação dos dados recebidos pela API.

## Funcionalidades

### Usuários

- Cadastro de usuários.
- Validação de dados utilizando Zod.
- Verificação de e-mails duplicados.
- Armazenamento seguro de senhas com bcrypt.
- Login com e-mail e senha.
- Geração de tokens JWT.
- Consulta dos dados do usuário autenticado.
- Ativação do compartilhamento da Pokédex por meio de um código UUID.

### Pokémon capturados

- Adicionar Pokémon à coleção pessoal.
- Listar todos os Pokémon capturados pelo usuário.
- Consultar individualmente se determinado Pokémon foi capturado.
- Remover Pokémon da coleção.
- Suporte a Soft Delete, preservando os registros removidos.
- Reativação de registros anteriormente removidos.
- Prevenção de capturas duplicadas.
- Consulta pública de coleções compartilhadas por meio de um código UUID.

## Arquitetura do projeto

O projeto utiliza uma organização modular, separando responsabilidades entre controllers, services, models, schemas, middlewares e rotas.

```text
src/
├── config/
│   └── database.ts
│
├── modules/
│   ├── users/
│   │   ├── user.model.ts
│   │   ├── user.schema.ts
│   │   ├── user.service.ts
│   │   └── user.controller.ts
│   │
│   └── captured-pokemon/
│       ├── captured-pokemon.model.ts
│       ├── captured-pokemon.schema.ts
│       ├── captured-pokemon.service.ts
│       └── captured-pokemon.controller.ts
│
├── middlewares/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── not-found.middleware.ts
│
├── routes/
│   ├── index.ts
│   ├── public.routes.ts
│   └── private.routes.ts
│
├── utils/
│   └── api-response.ts
│
├── app.ts
└── server.ts
```

### Responsabilidades

| Camada | Responsabilidade |
|---|---|
| Models | Definição dos documentos e estruturas do MongoDB. |
| Schemas | Validação dos dados utilizando Zod. |
| Controllers | Recebimento das requisições e envio das respostas HTTP. |
| Services | Regras de negócio e operações no banco de dados. |
| Middlewares | Autenticação JWT e tratamento global de erros. |
| Routes | Organização e registro dos endpoints. |
| Config | Configuração e conexão com o banco de dados. |
| Utils | Funções reutilizáveis, como padronização de respostas. |

## Autenticação e segurança

A autenticação é realizada através de JWT.

Após realizar o login, o usuário recebe um token que deve ser enviado nas requisições protegidas utilizando o cabeçalho:

```text
Authorization: Bearer SEU_TOKEN
```

O middleware de autenticação valida o token e disponibiliza o identificador do usuário através de:

```typescript
req.user.userId
```

O identificador do usuário é obtido exclusivamente pelo token, evitando que o cliente informe ou manipule o `userId` para acessar dados de outras contas.

## Gerenciamento de Pokémon capturados

Cada captura possui os seguintes campos:

| Campo | Descrição |
|---|---|
| `userId` | Identificador do proprietário da captura. |
| `pokemonId` | Identificador do Pokémon na PokéAPI. |
| `deletedAt` | Data da remoção ou `null` quando ativo. |
| `createdAt` | Data de criação do registro. |
| `updatedAt` | Data da última atualização. |

A combinação de `userId` e `pokemonId` possui índice único, evitando registros duplicados para o mesmo usuário.

### Soft Delete

A remoção de Pokémon não exclui fisicamente o documento do banco de dados.

Em vez disso, o campo `deletedAt` recebe a data da remoção.

Caso o usuário capture novamente o mesmo Pokémon, o registro existente é reativado.

## Compartilhamento da Pokédex

O sistema permite que usuários compartilhem suas coleções pessoais com outras pessoas por meio de um código UUID gerado pelo backend.

O compartilhamento funciona da seguinte maneira:

1. O usuário autenticado solicita a ativação do compartilhamento.
2. O backend recebe o campo `active` no corpo da requisição.
3. Quando `active` é `true`, um UUID é gerado e armazenado no campo `code` do usuário.
4. Outras pessoas podem consultar a coleção utilizando esse código, sem precisar realizar autenticação.

Essa funcionalidade permite que o frontend disponibilize o compartilhamento da Pokédex por meio de links ou outros mecanismos.

## Endpoints

Todas as respostas seguem um padrão:

```json
{
    "code": 200,
    "status": "OK",
    "message": "Mensagem da operação!",
    "data": {}
}
```

### Rotas públicas

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/users` | Cadastro de usuário. |
| POST | `/api/login` | Autenticação e geração de JWT. |
| GET | `/api/captured-pokemon-code?code=UUID` | Consulta os Pokémon de uma Pokédex compartilhada. |

### Rotas privadas

Todas exigem autenticação JWT.

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/me` | Consulta o perfil autenticado. |
| POST | `/api/active-code` | Ativa o compartilhamento e gera um código UUID. |
| GET | `/api/captured-pokemon` | Lista os Pokémon capturados. |
| GET | `/api/captured-pokemon/:pokemonId` | Consulta se um Pokémon foi capturado. |
| POST | `/api/captured-pokemon` | Adiciona um Pokémon à coleção. |
| DELETE | `/api/captured-pokemon/:pokemonId` | Remove um Pokémon da coleção. |

### Exemplo de cadastro

**POST** `/api/users`

```json
{
    "name": "Ash Ketchum",
    "email": "ash@pokedex.com",
    "password": "pikachu123"
}
```

### Exemplo de captura

**POST** `/api/captured-pokemon`

```json
{
    "pokemonId": 25
}
```

### Exemplo de ativação do compartilhamento

**POST** `/api/active-code`

```json
{
    "active": true
}
```

O backend gera e armazena o código UUID associado ao usuário autenticado.

### Exemplo de consulta compartilhada

**GET** `/api/captured-pokemon-code?code=SEU_UUID`

O código é enviado pela query string. A rota retorna os Pokémon capturados pelo usuário correspondente, sem exigir autenticação.

## Como executar o projeto

### Deploy na Vercel

O arquivo `vercel.json` configura `src/api/index.ts` como uma função serverless. Na Vercel, cadastre estas variáveis em **Settings > Environment Variables** (para o ambiente desejado):

```env
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/pokedex
JWT_SECRET=uma_chave_forte_e_secreta
```

Depois do deploy, teste `https://seu-projeto.vercel.app/` e use essa URL como base da API no frontend. Também é necessário liberar o acesso de rede ao MongoDB Atlas para a Vercel (por exemplo, `0.0.0.0/0`, aplicando autenticação forte e as restrições recomendadas pelo Atlas).

### Pré-requisitos

- Node.js
- Yarn
- MongoDB

### Instalação

Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta:

```bash
cd pokedex-backend
```

Instale as dependências:

```bash
yarn install
```

### Configuração das variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/pokedex
JWT_SECRET=sua_chave_secreta
```

Utilize uma chave JWT forte em ambientes de produção.

### Executar em desenvolvimento

```bash
yarn dev
```

### Compilar o projeto

```bash
yarn build
```

### Executar versão compilada

```bash
yarn start
```

## Objetivo do projeto

Este backend foi desenvolvido para complementar uma aplicação Pokédex, oferecendo gerenciamento de usuários, autenticação, persistência das coleções individuais de Pokémon e compartilhamento público dessas coleções.

A arquitetura modular permite adicionar novas funcionalidades sem concentrar regras de negócio ou responsabilidades em uma única camada.

---

**Pokédex Backend** — Node.js | TypeScript | Express | MongoDB
