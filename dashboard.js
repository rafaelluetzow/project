import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

export default function Dashboard() {
  const { data: session } = useSession();
  const { data: propertiesData } = useSWR(
    session?.user?.id ? `/api/properties?userId=${session.user.id}` : null
  );
  const { data: jobsData } = useSWR(
    session?.user?.id ? `/api/jobs?userId=${session.user.id}` : null
  );

  const properties = propertiesData?.data || [];
  const jobs = jobsData?.data || [];

  return (
    <div>
      <Head>
        <title>Dashboard - Imóveis & Empregos</title>
        <meta name="description" content="Gerencie seus anúncios de imóveis e vagas" />
      </Head>

      <Navbar />

      <main className="container py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Meu Dashboard</h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Meus Imóveis</h2>
            {properties.length > 0 ? (
              <div className="space-y-4">
                {properties.map(property => (
                  <div key={property._id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <h3 className="text-lg font-semibold">{property.title}</h3>
                    <p className="text-gray-600">R$ {property.price.toFixed(2)}/mês</p>
                    <div className="mt-2">
                      <a href={`/properties/${property._id}`} className="text-blue-600 hover:underline">
                        Ver detalhes
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Você ainda não anunciou nenhum imóvel.</p>
            )}
            <div className="mt-6">
              <a href="/properties/new" className="btn">
                Anunciar novo imóvel
              </a>
            </div>
          </div>
          
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Minhas Vagas</h2>
            {jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map(job => (
                  <div key={job._id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <p className="text-gray-600">{job.company}</p>
                    <div className="mt-2">
                      <a href={`/jobs/${job._id}`} className="text-blue-600 hover:underline">
                        Ver detalhes
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Você ainda não anunciou nenhuma vaga.</p>
            )}
            <div className="mt-6">
              <a href="/jobs/new" className="btn">
                Anunciar nova vaga
              </a>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dicas para anunciantes</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Forneça coordenadas precisas para melhorar os cálculos de distância</li>
            <li>Inclua descrições detalhadas para atrair mais interessados</li>
            <li>Mantenha seus anúncios atualizados para melhor visibilidade</li>
            <li>Adicione informações sobre transporte público próximo aos imóveis</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
