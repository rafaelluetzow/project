import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import useSWR from 'swr';

export default function Jobs() {
  const router = useRouter();
  const { data, error } = useSWR('/api/jobs');
  const [searchTerm, setSearchTerm] = useState('');
  
  const jobs = data?.data || [];
  const isLoading = !data && !error;
  
  // Filtrar vagas com base no termo de busca
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Head>
        <title>Vagas de Emprego - Imóveis & Empregos</title>
        <meta name="description" content="Encontre vagas de emprego próximas à sua residência" />
      </Head>

      <Navbar />

      <main className="container py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Vagas de Emprego</h1>
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Buscar por título, empresa ou local..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input w-full"
              />
            </div>
            <Link href="/jobs/new" className="btn">
              Anunciar Vaga
            </Link>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Carregando vagas...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-md">
            Erro ao carregar vagas. Por favor, tente novamente.
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div key={job._id} className="card hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">{job.company}</span>
                </p>
                <p className="text-gray-600 mb-2">{job.address}</p>
                {job.salaryRange && (
                  <p className="text-gray-600 mb-4">
                    Faixa salarial: {job.salaryRange}
                  </p>
                )}
                <Link 
                  href={`/jobs/${job._id}`}
                  className="text-blue-600 hover:underline"
                >
                  Ver detalhes
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Nenhuma vaga encontrada.</p>
          </div>
        )}
      </main>
    </div>
  );
}
