import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Navbar from '../../components/Navbar';

export default function NewProperty() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirecionar se não estiver autenticado ou não for anunciante
  if (status === 'loading') {
    return <p>Carregando...</p>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (session && !session.user.isAdvertiser) {
    router.push('/');
    return null;
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar imóvel');
      }

      router.push(`/properties/${data.data._id}`);
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
        <title>Anunciar Imóvel - Imóveis & Empregos</title>
        <meta name="description" content="Anuncie seu imóvel para locação" />
      </Head>

      <Navbar />

      <main className="container py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Anunciar Imóvel</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label htmlFor="title" className="form-label">Título do Imóvel</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="form-input"
                  maxLength={140}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="address" className="form-label">Endereço Completo</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="form-input"
                  maxLength={200}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="latitude" className="form-label">Latitude</label>
                  <input
                    type="number"
                    id="latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    required
                    step="any"
                    className="form-input"
                  />
                </div>
                <div>
                  <label htmlFor="longitude" className="form-label">Longitude</label>
                  <input
                    type="number"
                    id="longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    required
                    step="any"
                    className="form-input"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Dica: Use o Google Maps para encontrar as coordenadas. Clique com o botão direito no mapa e selecione "O que há aqui?".
              </p>
              
              <div className="mb-4">
                <label htmlFor="price" className="form-label">Preço (R$ / mês)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="any"
                  className="form-input"
                />
              </div>
            </div>
            
            <div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="bedrooms" className="form-label">Quartos</label>
                  <input
                    type="number"
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    required
                    min="0"
                    className="form-input"
                  />
                </div>
                <div>
                  <label htmlFor="bathrooms" className="form-label">Banheiros</label>
                  <input
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    required
                    min="0"
                    className="form-input"
                  />
                </div>
                <div>
                  <label htmlFor="area" className="form-label">Área (m²)</label>
                  <input
                    type="number"
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    required
                    min="0"
                    step="any"
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="form-label">Descrição</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="8"
                  className="form-input"
                ></textarea>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              className="btn w-full md:w-auto"
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Anunciar Imóvel'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
