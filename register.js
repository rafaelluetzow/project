import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    isAdvertiser: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validação básica
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          isAdvertiser: formData.isAdvertiser
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao registrar usuário');
      }

      // Redirecionar para login após registro bem-sucedido
      router.push('/login?registered=true');
    } catch (error) {
      setError(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Registrar - Imóveis & Empregos</title>
        <meta name="description" content="Crie sua conta na plataforma Imóveis & Empregos" />
      </Head>

      <Navbar />

      <main className="container py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-6">Criar uma nova conta</h1>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="card">
            <div className="mb-4">
              <label htmlFor="username" className="form-label">Nome de usuário</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            
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
            
            <div className="mb-4">
              <label htmlFor="password" className="form-label">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="form-input"
              />
              <p className="text-xs text-gray-500 mt-1">Mínimo de 6 caracteres</p>
            </div>
            
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label">Confirmar senha</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
            
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isAdvertiser"
                  checked={formData.isAdvertiser}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Sou um anunciante (imóveis/vagas)</span>
              </label>
            </div>
            
            <button
              type="submit"
              className="btn w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Registrar'}
            </button>
          </form>
          
          <p className="mt-4 text-center text-gray-600">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
