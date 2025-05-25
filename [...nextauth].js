import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();

        // Verificar email e senha
        const user = await User.findOne({ email: credentials.email }).select('+password');
        
        if (!user) {
          throw new Error('Email não encontrado');
        }

        // Verificar senha
        const isMatch = await bcrypt.compare(credentials.password, user.password);
        
        if (!isMatch) {
          throw new Error('Senha incorreta');
        }

        // Retornar objeto de usuário sem a senha
        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          isAdvertiser: user.isAdvertiser
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.isAdvertiser = user.isAdvertiser;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.isAdvertiser = token.isAdvertiser;
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
