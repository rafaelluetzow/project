# Arquitetura Serverless para Vercel

## Estrutura do Projeto
```
imoveis_empregos_vercel/
├── frontend/                 # Aplicação Next.js
│   ├── pages/                # Páginas da aplicação
│   │   ├── api/              # API Routes (backend serverless)
│   │   ├── _app.js           # Configuração global da aplicação
│   │   ├── index.js          # Página inicial
│   │   ├── login.js          # Página de login
│   │   ├── register.js       # Página de registro
│   │   ├── properties/       # Páginas de imóveis
│   │   └── jobs/             # Páginas de vagas
│   ├── components/           # Componentes reutilizáveis
│   ├── lib/                  # Utilitários e configurações
│   │   ├── mongodb.js        # Conexão com MongoDB
│   │   ├── auth.js           # Configuração de autenticação
│   │   └── utils.js          # Funções utilitárias
│   ├── models/               # Modelos de dados
│   ├── styles/               # Estilos CSS/Tailwind
│   ├── public/               # Arquivos estáticos
│   ├── next.config.js        # Configuração do Next.js
│   └── package.json          # Dependências
└── README.md                 # Documentação
```

## Rotas de API (Backend Serverless)

### Autenticação
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login de usuário
- `GET /api/auth/session` - Informações da sessão atual
- `POST /api/auth/logout` - Logout de usuário

### Usuários
- `GET /api/users/me` - Perfil do usuário atual
- `PUT /api/users/me` - Atualizar perfil

### Imóveis
- `GET /api/properties` - Listar imóveis
- `GET /api/properties/:id` - Detalhes de um imóvel
- `POST /api/properties` - Criar imóvel
- `PUT /api/properties/:id` - Atualizar imóvel
- `DELETE /api/properties/:id` - Remover imóvel

### Vagas
- `GET /api/jobs` - Listar vagas
- `GET /api/jobs/:id` - Detalhes de uma vaga
- `POST /api/jobs` - Criar vaga
- `PUT /api/jobs/:id` - Atualizar vaga
- `DELETE /api/jobs/:id` - Remover vaga

### Gamificação
- `GET /api/commute/calculate` - Calcular distância/tempo entre imóvel e vaga

## Páginas do Frontend (Next.js)

### Públicas
- `/` - Página inicial
- `/login` - Login
- `/register` - Registro
- `/properties` - Listagem de imóveis
- `/properties/[id]` - Detalhes de imóvel
- `/jobs` - Listagem de vagas
- `/jobs/[id]` - Detalhes de vaga

### Protegidas (requer autenticação)
- `/dashboard` - Dashboard do usuário
- `/properties/new` - Criar imóvel
- `/properties/edit/[id]` - Editar imóvel
- `/jobs/new` - Criar vaga
- `/jobs/edit/[id]` - Editar vaga

## Estratégia de Autenticação
- Utilizar NextAuth.js para gerenciamento de autenticação
- Implementar autenticação baseada em JWT
- Armazenar tokens em cookies HTTP-only
- Proteger rotas no frontend e backend

## Esquema do Banco de Dados (MongoDB)

### Coleção: users
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String, // Hash da senha
  isAdvertiser: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Coleção: properties
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  address: String,
  location: {
    type: "Point",
    coordinates: [Number, Number] // [longitude, latitude]
  },
  price: Number,
  bedrooms: Number,
  bathrooms: Number,
  area: Number,
  userId: ObjectId, // Referência ao anunciante
  createdAt: Date,
  updatedAt: Date
}
```

### Coleção: jobs
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  company: String,
  address: String,
  location: {
    type: "Point",
    coordinates: [Number, Number] // [longitude, latitude]
  },
  salaryRange: String,
  requirements: String,
  userId: ObjectId, // Referência ao anunciante
  createdAt: Date,
  updatedAt: Date
}
```

## Índices Geoespaciais
- Criar índices 2dsphere nas coleções properties e jobs para consultas de proximidade:
```javascript
db.properties.createIndex({ location: "2dsphere" })
db.jobs.createIndex({ location: "2dsphere" })
```

## Comunicação Frontend-Backend
- Utilizar SWR para fetching de dados e cache
- Implementar interceptors para tratamento de erros
- Usar Context API para gerenciamento de estado global
