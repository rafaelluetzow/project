import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

export default function Home() {
  const { data: session } = useSession();
  const { data: propertiesData } = useSWR('/api/properties?limit=5');
  const { data: jobsData } = useSWR('/api/jobs?limit=5');

  const properties = propertiesData?.data || [];
  const jobs = jobsData?.data || [];

  return (
    <div>
      <Head>
        <title>Imóveis & Empregos - Encontre o equilíbrio perfeito</title>
        <meta name="description" content="Plataforma que conecta pessoas interessadas em imóveis para locação e vagas de emprego" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="container py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Encontre o equilíbrio perfeito entre moradia e trabalho
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubra imóveis próximos às melhores oportunidades de emprego e economize tempo e dinheiro no seu dia a dia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Procurando onde morar?</h2>
            <p className="text-gray-600 mb-6">
              Encontre o imóvel ideal próximo ao seu trabalho ou às melhores oportunidades de emprego da região.
            </p>
            <Link href="/properties" className="btn">
              Ver imóveis disponíveis
            </Link>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Buscando emprego?</h2>
            <p className="text-gray-600 mb-6">
              Descubra vagas de emprego próximas à sua residência e economize tempo e dinheiro no deslocamento.
            </p>
            <Link href="/jobs" className="btn">
              Ver vagas disponíveis
            </Link>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Últimos imóveis anunciados</h2>
          {properties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div key={property._id} className="card">
                  <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
                  <p className="text-gray-600 mb-2">R$ {property.price.toFixed(2)}/mês</p>
                  <p className="text-gray-600 mb-4">{property.address}</p>
                  <Link href={`/properties/${property._id}`} className="text-blue-600 hover:underline">
                    Ver detalhes
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Nenhum imóvel disponível no momento.</p>
          )}
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Últimas vagas anunciadas</h2>
          {jobs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div key={job._id} className="card">
                  <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-2">{job.company}</p>
                  <p className="text-gray-600 mb-4">{job.address}</p>
                  <Link href={`/jobs/${job._id}`} className="text-blue-600 hover:underline">
                    Ver detalhes
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Nenhuma vaga disponível no momento.</p>
          )}
        </div>

        <div className="bg-blue-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como funciona nossa gamificação?</h2>
          <p className="text-gray-600 mb-6">
            Nossa plataforma calcula a distância e o tempo de deslocamento entre imóveis e locais de trabalho, 
            mostrando quanto você pode economizar em tempo e dinheiro ao escolher a combinação ideal.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-white rounded-lg shadow">
              <div className="text-3xl font-bold text-blue-600 mb-2">30%</div>
              <p className="text-gray-600">Economia média de tempo no deslocamento</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <div className="text-3xl font-bold text-blue-600 mb-2">R$ 3.600</div>
              <p className="text-gray-600">Economia média anual em transporte</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <div className="text-3xl font-bold text-blue-600 mb-2">240h</div>
              <p className="text-gray-600">Tempo médio anual economizado</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} Imóveis & Empregos. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
