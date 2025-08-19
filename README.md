# Marketplace Backend

Backend de um marketplace desenvolvido em Node.js com PostgreSQL usando arquitetura MVC.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **Sequelize** - ORM para PostgreSQL
- **JWT** - Autenticação
- **bcryptjs** - Criptografia de senhas

## 📁 Estrutura do Projeto

```
marketplace-backend/
│
├── models/             # Modelos do banco de dados (Sequelize)
│   ├── User.js        # Modelo de usuário
│   ├── Product.js     # Modelo de produto
│   └── index.js       # Associações entre modelos
│
├── controllers/        # Controladores (lógica de negócio)
│   ├── userController.js
│   └── productController.js
│
├── routes/            # Definição das rotas
│   ├── authRoutes.js
│   └── productRoutes.js
│
├── middleware/        # Middlewares personalizados
│   └── auth.js       # Middleware de autenticação
│
├── config/            # Configurações
│   └── db.js         # Configuração do PostgreSQL
│
├── scripts/           # Scripts utilitários
│   └── database.js   # Scripts para gerenciar o banco
│
├── app.js            # Arquivo principal
├── package.json
└── .env              # Variáveis de ambiente
```

## 🛠️ Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd marketplace-backend
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o PostgreSQL

Certifique-se de que o PostgreSQL está instalado e rodando em sua máquina.

Crie um banco de dados:
```sql
CREATE DATABASE marketplace;
```

### 4. Configure as variáveis de ambiente

Edite o arquivo `.env` com suas configurações:

```env
# Configurações do Banco de Dados PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=marketplace
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui

# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Configurações de Autenticação
JWT_SECRET=sua_chave_secreta_super_segura_aqui
JWT_EXPIRES_IN=7d
```

### 5. Configure o banco de dados

Para criar as tabelas e popular com dados de exemplo:
```bash
npm run db:setup
```

### 6. Inicie o servidor

Para desenvolvimento:
```bash
npm run dev
```

Para produção:
```bash
npm start
```

## 📡 API Endpoints

### Autenticação

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/api/auth/register` | Registrar usuário | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/profile` | Obter perfil | ✅ |
| PUT | `/api/auth/profile` | Atualizar perfil | ✅ |

### Produtos

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/products` | Listar produtos | ❌ |
| GET | `/api/products/:id` | Obter produto | ❌ |
| POST | `/api/products` | Criar produto | ✅ (Seller/Admin) |
| PUT | `/api/products/:id` | Atualizar produto | ✅ (Owner/Admin) |
| DELETE | `/api/products/:id` | Deletar produto | ✅ (Owner/Admin) |
| GET | `/api/products/user/my-products` | Meus produtos | ✅ |

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Inclua o token no header:

```
Authorization: Bearer <seu-token>
```

## 🎭 Roles de Usuário

- **user**: Usuário comum (pode comprar)
- **seller**: Vendedor (pode criar/gerenciar produtos)
- **admin**: Administrador (acesso total)

## 📝 Exemplos de Uso

### Registrar usuário
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456",
  "role": "seller"
}
```

### Criar produto
```bash
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "iPhone 15",
  "description": "Smartphone Apple",
  "price": 8999.99,
  "category": "electronics",
  "stock": 10,
  "tags": ["smartphone", "apple"],
  "condition": "new"
}
```

### Buscar produtos
```bash
GET /api/products?category=electronics&minPrice=100&maxPrice=1000&search=iphone&page=1&limit=10
```

## 🗄️ Scripts do Banco

```bash
# Configurar banco com dados de exemplo
npm run db:setup

# Limpar banco de dados
npm run db:clear
```

## 📊 Dados de Teste

Após executar `npm run db:setup`, você terá:

**Usuários:**
- Admin: `admin@marketplace.com` / `admin123`
- Vendedor: `joao@vendedor.com` / `vendedor123`
- Cliente: `maria@cliente.com` / `cliente123`

**Produtos:**
- iPhone 15 Pro
- Camiseta Nike Dri-FIT
- Clean Code - Robert Martin

## 🚀 Deploy

Para produção, configure:

1. `NODE_ENV=production`
2. Configure um banco PostgreSQL em produção
3. Use variáveis de ambiente seguras
4. Configure HTTPS
5. Use um gerenciador de processos como PM2

## 📄 Licença

ISC