# Guia de Testes para Plataforma Imóveis & Empregos (Vercel)

## Testes Locais

### Configuração do Ambiente
1. Instalar dependências:
   ```bash
   cd frontend
   npm install
   ```

2. Configurar variáveis de ambiente:
   Criar arquivo `.env.local` na pasta `frontend` com:
   ```
   MONGODB_URI=mongodb+srv://[seu-usuario]:[sua-senha]@cluster0.mongodb.net/imoveis_empregos?retryWrites=true&w=majority
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=sua-chave-secreta-muito-segura
   ```

3. Iniciar servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Fluxos de Teste

### 1. Autenticação
- [x] Registro de novo usuário (comum)
- [x] Registro de novo usuário (anunciante)
- [x] Login com credenciais válidas
- [x] Login com credenciais inválidas
- [x] Logout
- [x] Acesso a rotas protegidas sem autenticação
- [x] Acesso a rotas de anunciante por usuário comum

### 2. Imóveis
- [x] Listagem de imóveis
- [x] Visualização de detalhes de imóvel
- [x] Criação de novo imóvel (anunciante)
- [x] Busca de imóveis por título/endereço
- [x] Visualização de vagas próximas a um imóvel

### 3. Vagas
- [x] Listagem de vagas
- [x] Visualização de detalhes de vaga
- [x] Criação de nova vaga (anunciante)
- [x] Busca de vagas por título/empresa/local
- [x] Visualização de imóveis próximos a uma vaga

### 4. Gamificação
- [x] Cálculo de distância entre imóvel e vaga
- [x] Exibição de economia de tempo e dinheiro
- [x] Pontuação de deslocamento
- [x] Comparação entre diferentes combinações

### 5. Responsividade
- [x] Layout em desktop (>1024px)
- [x] Layout em tablet (768px-1024px)
- [x] Layout em mobile (<768px)
- [x] Navegação em diferentes dispositivos

## Testes no Ambiente Vercel

### Configuração do Ambiente
1. Instalar Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login na Vercel:
   ```bash
   vercel login
   ```

3. Testar localmente com ambiente Vercel:
   ```bash
   vercel dev
   ```

4. Deploy para ambiente de preview:
   ```bash
   vercel
   ```

### Verificações Adicionais
- [x] Funcionamento das APIs serverless
- [x] Integração com MongoDB Atlas
- [x] Autenticação NextAuth
- [x] Performance e tempo de carregamento
- [x] Cold starts em funções serverless

## Notas de Teste
- Todos os fluxos principais estão funcionando conforme esperado
- A integração com MongoDB Atlas está estável
- A gamificação está calculando corretamente as distâncias e economias
- A responsividade está adequada em todos os dispositivos testados
- O deploy no ambiente Vercel foi bem-sucedido
