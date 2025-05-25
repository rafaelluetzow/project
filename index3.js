import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import useSWR from 'swr';

export default function Properties() {
  const router = useRouter();
  const { data, error } = useSWR('/api/properties');
  const [searchTerm, setSearchTerm] = useState('');
  
  const properties = data?.data || [];
  const isLoading = !data && !error;
  
  // Filtrar propriedades com base no termo de busca
  const filteredProperties = properties.filter(property => 
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Head>
        <title>Imóveis para Locação - Imóveis & Empregos</title>
        <meta name="description" content="Encontre imóveis para locação próximos às melhores oportunidades de emprego" />
      </Head>

      <Navbar />

      <main className="container py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Imóveis para Locação</h1>
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Buscar por título ou endereço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input w-full"
              />
            </div>
            <Link href="/properties/new" className="btn">
              Anunciar Imóvel
            </Link>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Carregando imóveis...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-md">
            Erro ao carregar imóveis. Por favor, tente novamente.
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div key={property._id} className="card hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold mb-2">{property.title}</h2>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">R$ {property.price.toFixed(2)}</span> /mês
                </p>
                <p className="text-gray-600 mb-2">{property.address}</p>
                <div className="flex items-center text-gray-600 mb-4">
                  <span className="mr-4">{property.bedrooms} quarto(s)</span>
                  <span className="mr-4">{property.bathrooms} banheiro(s)</span>
                  <span>{property.area} m²</span>
                </div>
                <Link 
                  href={`/properties/${property._id}`}
                  className="text-blue-600 hover:underline"
                >
                  Ver detalhes
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Nenhum imóvel encontrado.</p>
          </div>
        )}
      </main>
    </div>
  );
}
