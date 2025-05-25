import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import useSWR from 'swr';

export default function PropertyDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { data: propertyData, error: propertyError } = useSWR(
    id ? `/api/properties/${id}` : null
  );
  const { data: jobsData, error: jobsError } = useSWR(
    id ? `/api/jobs` : null
  );

  const [selectedJobId, setSelectedJobId] = useState(null);
  const [commuteData, setCommuteData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const property = propertyData?.data;
  const jobs = jobsData?.data || [];
  const isLoading = (!propertyData && !propertyError) || (!jobsData && !jobsError);

  // Calcular distância entre o imóvel e cada vaga
  const nearbyJobs = jobs.map(job => {
    if (property?.location?.coordinates && job?.location?.coordinates) {
      // Cálculo simplificado de distância (Haversine)
      const R = 6371; // Raio da Terra em km
      const dLat = (job.location.coordinates[1] - property.location.coordinates[1]) * Math.PI / 180;
      const dLon = (job.location.coordinates[0] - property.location.coordinates[0]) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(property.location.coordinates[1] * Math.PI / 180) * Math.cos(job.location.coordinates[1] * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c; // Distância em km
      
      return {
        ...job,
        distance: parseFloat(distance.toFixed(1))
      };
    }
    return job;
  }).filter(job => job.distance !== undefined)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5); // Mostrar apenas os 5 mais próximos

  const calculateCommute = async (jobId) => {
    if (!id || !jobId) return;
    
    setIsCalculating(true);
    setSelectedJobId(jobId);
    
    try {
      const response = await fetch(`/api/commute/calculate?property_id=${id}&job_id=${jobId}`);
      const data = await response.json();
      
      if (data.success) {
        setCommuteData(data.data);
      } else {
        console.error('Erro ao calcular deslocamento:', data.message);
      }
    } catch (error) {
      console.error('Erro ao calcular deslocamento:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <main className="container py-8">
          <p className="text-center">Carregando...</p>
        </main>
      </div>
    );
  }

  if (propertyError || !property) {
    return (
      <div>
        <Navbar />
        <main className="container py-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-md">
            Erro ao carregar detalhes do imóvel. Por favor, tente novamente.
          </div>
          <div className="mt-4">
            <Link href="/properties" className="text-blue-600 hover:underline">
              Voltar para lista de imóveis
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>{property.title} - Imóveis & Empregos</title>
        <meta name="description" content={`Detalhes do imóvel: ${property.title}`} />
      </Head>

      <Navbar />

      <main className="container py-8">
        <div className="mb-6">
          <Link href="/properties" className="text-blue-600 hover:underline">
            &larr; Voltar para lista de imóveis
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.title}</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-2xl font-semibold text-blue-600 mb-4">
                R$ {property.price.toFixed(2)}/mês
              </p>
              
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Endereço</h2>
                <p className="text-gray-700">{property.address}</p>
              </div>
              
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Detalhes</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-600">Quartos</p>
                    <p className="text-lg font-medium">{property.bedrooms}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Banheiros</p>
                    <p className="text-lg font-medium">{property.bathrooms}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Área</p>
                    <p className="text-lg font-medium">{property.area} m²</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-2">Descrição</h2>
              <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Vagas de Emprego Próximas</h2>
          
          {nearbyJobs.length > 0 ? (
            <div className="space-y-6">
              {nearbyJobs.map((job) => (
                <div key={job._id} className="border-b pb-6 last:border-b-0 last:pb-0">
                  <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                  <p className="text-gray-700 mb-2"><strong>Empresa:</strong> {job.company}</p>
                  <p className="text-gray-700 mb-2"><strong>Local:</strong> {job.address}</p>
                  <p className="text-gray-700 mb-4"><strong>Distância:</strong> {job.distance} km</p>
                  
                  <div className="flex flex-wrap gap-3">
                    <Link 
                      href={`/jobs/${job._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Ver detalhes da vaga
                    </Link>
                    
                    <button
                      onClick={() => calculateCommute(job._id)}
                      className="text-green-600 hover:underline"
                      disabled={isCalculating && selectedJobId === job._id}
                    >
                      {isCalculating && selectedJobId === job._id 
                        ? 'Calculando...' 
                        : 'Calcular economia'}
                    </button>
                  </div>
                  
                  {commuteData && selectedJobId === job._id && (
                    <div className="mt-4 bg-blue-50 p-4 rounded-md">
                      <h4 className="font-semibold text-blue-800 mb-2">Análise de Deslocamento</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-700"><strong>Distância:</strong> {commuteData.distance_km} km</p>
                          <p className="text-gray-700"><strong>Tempo estimado:</strong> {commuteData.estimated_time_minutes} minutos</p>
                          <p className="text-gray-700"><strong>Pontuação:</strong> {commuteData.commute_score} (quanto menor, melhor)</p>
                        </div>
                        <div>
                          <p className="text-gray-700"><strong>Economia anual estimada:</strong> R$ {commuteData.annual_savings.toFixed(2)}</p>
                          <p className="text-gray-700"><strong>Economia de tempo anual:</strong> {commuteData.annual_time_savings} horas</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Não há vagas de emprego próximas cadastradas.</p>
          )}
        </div>
      </main>
    </div>
  );
}
