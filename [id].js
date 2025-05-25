import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import useSWR from 'swr';

export default function JobDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { data: jobData, error: jobError } = useSWR(
    id ? `/api/jobs/${id}` : null
  );
  const { data: propertiesData, error: propertiesError } = useSWR(
    id ? `/api/properties` : null
  );

  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [commuteData, setCommuteData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const job = jobData?.data;
  const properties = propertiesData?.data || [];
  const isLoading = (!jobData && !jobError) || (!propertiesData && !propertiesError);

  // Calcular distância entre a vaga e cada imóvel
  const nearbyProperties = properties.map(property => {
    if (job?.location?.coordinates && property?.location?.coordinates) {
      // Cálculo simplificado de distância (Haversine)
      const R = 6371; // Raio da Terra em km
      const dLat = (property.location.coordinates[1] - job.location.coordinates[1]) * Math.PI / 180;
      const dLon = (property.location.coordinates[0] - job.location.coordinates[0]) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(job.location.coordinates[1] * Math.PI / 180) * Math.cos(property.location.coordinates[1] * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c; // Distância em km
      
      return {
        ...property,
        distance: parseFloat(distance.toFixed(1))
      };
    }
    return property;
  }).filter(property => property.distance !== undefined)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5); // Mostrar apenas os 5 mais próximos

  const calculateCommute = async (propertyId) => {
    if (!id || !propertyId) return;
    
    setIsCalculating(true);
    setSelectedPropertyId(propertyId);
    
    try {
      const response = await fetch(`/api/commute/calculate?property_id=${propertyId}&job_id=${id}`);
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

  if (jobError || !job) {
    return (
      <div>
        <Navbar />
        <main className="container py-8">
          <div className="bg-red-50 text-red-600 p-4 rounded-md">
            Erro ao carregar detalhes da vaga. Por favor, tente novamente.
          </div>
          <div className="mt-4">
            <Link href="/jobs" className="text-blue-600 hover:underline">
              Voltar para lista de vagas
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>{job.title} - Imóveis & Empregos</title>
        <meta name="description" content={`Detalhes da vaga: ${job.title} na ${job.company}`} />
      </Head>

      <Navbar />

      <main className="container py-8">
        <div className="mb-6">
          <Link href="/jobs" className="text-blue-600 hover:underline">
            &larr; Voltar para lista de vagas
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Empresa</h2>
                <p className="text-gray-700">{job.company}</p>
              </div>
              
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Local</h2>
                <p className="text-gray-700">{job.address}</p>
              </div>
              
              {job.salaryRange && (
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">Faixa Salarial</h2>
                  <p className="text-gray-700">{job.salaryRange}</p>
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-2">Descrição</h2>
              <p className="text-gray-700 whitespace-pre-line mb-4">{job.description}</p>
              
              {job.requirements && (
                <>
                  <h2 className="text-lg font-semibold mb-2">Requisitos</h2>
                  <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Imóveis Próximos</h2>
          
          {nearbyProperties.length > 0 ? (
            <div className="space-y-6">
              {nearbyProperties.map((property) => (
                <div key={property._id} className="border-b pb-6 last:border-b-0 last:pb-0">
                  <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                  <p className="text-gray-700 mb-2"><strong>Preço:</strong> R$ {property.price.toFixed(2)}/mês</p>
                  <p className="text-gray-700 mb-2"><strong>Endereço:</strong> {property.address}</p>
                  <p className="text-gray-700 mb-2">
                    <strong>Detalhes:</strong> {property.bedrooms} quarto(s), {property.bathrooms} banheiro(s), {property.area} m²
                  </p>
                  <p className="text-gray-700 mb-4"><strong>Distância:</strong> {property.distance} km</p>
                  
                  <div className="flex flex-wrap gap-3">
                    <Link 
                      href={`/properties/${property._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Ver detalhes do imóvel
                    </Link>
                    
                    <button
                      onClick={() => calculateCommute(property._id)}
                      className="text-green-600 hover:underline"
                      disabled={isCalculating && selectedPropertyId === property._id}
                    >
                      {isCalculating && selectedPropertyId === property._id 
                        ? 'Calculando...' 
                        : 'Calcular economia'}
                    </button>
                  </div>
                  
                  {commuteData && selectedPropertyId === property._id && (
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
            <p className="text-gray-600">Não há imóveis próximos cadastrados.</p>
          )}
        </div>
      </main>
    </div>
  );
}
