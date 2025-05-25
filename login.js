import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { signIn } from 'next-auth/react';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password
      });

      if (result.error) {
        setError(result.error);
      } else {
        router.push('/');
      }
    } catch (error) {
      setError('Ocorreu um erro ao tentar fazer login. Tente novamente.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Login - Imóveis & Empregos</title>
        <meta name="description" content="Faça login na plataforma Imóveis & Empregos" />
      </Head>

      <Navbar />

      <main className="container py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-6">Entrar na sua conta</h1>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="card">
            <div className="mb-4">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="form-label">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            
            <button
              type="submit"
              className="btn w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          
          <p className="mt-4 text-center text-gray-600">
            Não tem uma conta?{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              Registre-se
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
