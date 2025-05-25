# Guia de Deploy na Vercel - Plataforma Imóveis & Empregos

Este guia fornece instruções detalhadas para realizar o deploy da plataforma Imóveis & Empregos na Vercel.

## Pré-requisitos

1. Conta na [Vercel](https://vercel.com)
2. Conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (tier gratuito é suficiente)
3. Node.js e npm instalados localmente

## Configuração do MongoDB Atlas

1. Crie uma conta ou faça login no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie um novo cluster (o tier gratuito é suficiente para o MVP)
3. Configure um usuário de banco de dados com permissões de leitura/escrita
4. Configure o Network Access para permitir conexões de qualquer lugar (0.0.0.0/0)
5. Obtenha a string de conexão, que será semelhante a:
   ```
   mongodb+srv://username:password@cluster0.mongodb.net/imoveis_empregos?retryWrites=true&w=majority
   ```

## Preparação do Projeto para Deploy

1. Certifique-se de que o arquivo `next.config.js` está configurado corretamente
2. Verifique se todas as dependências estão listadas no `package.json`
3. Certifique-se de que o projeto está funcionando localmente com `npm run dev`

## Deploy na Vercel via Interface Web

1. Faça login na [Vercel](https://vercel.com)
2. Clique em "New Project"
3. Importe o repositório do GitHub (ou faça upload do diretório `frontend`)
4. Configure as variáveis de ambiente:
   - `MONGODB_URI`: String de conexão do MongoDB Atlas
   - `NEXTAUTH_URL`: URL do seu site na Vercel (pode deixar em branco durante o primeiro deploy)
   - `NEXTAUTH_SECRET`: Uma string aleatória e segura para criptografia
5. Clique em "Deploy"
6. Após o deploy inicial, atualize a variável `NEXTAUTH_URL` com a URL gerada pela Vercel

## Deploy via Vercel CLI

1. Instale a Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Faça login na Vercel:
   ```bash
   vercel login
   ```

3. Navegue até o diretório `frontend` e execute:
   ```bash
   vercel
   ```

4. Siga as instruções interativas para configurar o projeto
5. Configure as variáveis de ambiente quando solicitado
6. Após o deploy inicial, atualize a variável `NEXTAUTH_URL` com:
   ```bash
   vercel env add NEXTAUTH_URL
   ```

## Verificação Pós-Deploy

1. Acesse a URL fornecida pela Vercel
2. Verifique se a página inicial carrega corretamente
3. Teste o fluxo de registro e login
4. Verifique se os imóveis e vagas estão sendo exibidos
5. Teste a criação de novos anúncios
6. Verifique se a gamificação está funcionando corretamente

## Solução de Problemas Comuns

### Erro de Conexão com MongoDB
- Verifique se a string de conexão está correta
- Confirme se o IP está liberado no Network Access do MongoDB Atlas

### Problemas com Autenticação
- Verifique se `NEXTAUTH_URL` está configurado corretamente
- Confirme se `NEXTAUTH_SECRET` está definido

### Erros nas API Routes
- Verifique os logs na dashboard da Vercel
- Teste as rotas localmente com `vercel dev`

## Manutenção e Atualizações

Para atualizar a aplicação após modificações:

1. Faça as alterações necessárias no código
2. Teste localmente com `npm run dev` ou `vercel dev`
3. Faça o deploy das atualizações:
   ```bash
   vercel --prod
   ```

## Recursos Adicionais

- [Documentação da Vercel](https://vercel.com/docs)
- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Documentação do NextAuth.js](https://next-auth.js.org/)
