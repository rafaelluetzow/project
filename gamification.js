import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function Gamification() {
  const [propertyId, setPropertyId] = useState('');
  const [jobId, setJobId] = useState('');
  const [properties, setProperties] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [commuteData, setCommuteData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Carregar imóveis e vagas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertiesRes, jobsRes] = await Promise.all([
          fetch('/api/properties'),
          fetch('/api/jobs')
        ]);
        
        const propertiesData = await propertiesRes.json();
        const jobsData = await jobsRes.json();
        
        if (propertiesData.success) {
          setProperties(propertiesData.data);
        }
        
        if (jobsData.success) {
          setJobs(jobsData.data);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar imóveis e vagas. Por favor, tente novamente.');
      }
    };
    
    fetchData();
  }, []);

  const calculateCommute = async () => {
    if (!propertyId || !jobId) {
      setError('Por favor, selecione um imóvel e uma vaga.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setCommuteData(null);
    
    try {
      const response = await fetch(`/api/commute/calculate?property_id=${propertyId}&job_id=${jobId}`);
      const data = await response.json();
      
      if (data.success) {
        setCommuteData(data.data);
      } else {
        setError(data.message || 'Erro ao calcular deslocamento.');
      }
    } catch (error) {
      console.error('Erro ao calcular deslocamento:', error);
      setError('Erro ao calcular deslocamento. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Encontrar detalhes do imóvel e vaga selecionados
  const selectedProperty = properties.find(p => p._id === propertyId);
  const selectedJob = jobs.find(j => j._id === jobId);

  return (
    <div>
      <Head>
        <title>Calculadora de Economia - Imóveis & Empregos</title>
        <meta name="description" content="Calcule a economia de tempo e dinheiro entre imóveis e vagas" />
      </Head>

      <Navbar />

      <main className="container py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Calculadora de Economia</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="text-gray-700 mb-6">
            Selecione um imóvel e uma vaga de emprego para calcular a economia de tempo e dinheiro no seu deslocamento diário.
          </p>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
              {error}
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="property" className="form-label">Imóvel</label>
              <select
                id="property"
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="form-input"
              >
                <option value="">Selecione um imóvel</option>
                {properties.map(property => (
                  <option key={property._id} value={property._id}>
                    {property.title} - {property.address}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="job" className="form-label">Vaga de Emprego</label>
              <select
                id="job"
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                className="form-input"
              >
                <option value="">Selecione uma vaga</option>
                {jobs.map(job => (
                  <option key={job._id} value={job._id}>
                    {job.title} - {job.company}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            onClick={calculateCommute}
            className="btn"
            disabled={isLoading || !propertyId || !jobId}
          >
            {isLoading ? 'Calculando...' : 'Calcular Economia'}
          </button>
        </div>
        
        {commuteData && (
          <div className="bg-blue-50 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Resultado da Análise</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Imóvel Selecionado</h3>
                <p className="text-gray-700 mb-1"><strong>Título:</strong> {selectedProperty?.title}</p>
                <p className="text-gray-700 mb-1"><strong>Endereço:</strong> {selectedProperty?.address}</p>
                <p className="text-gray-700 mb-3"><strong>Preço:</strong> R$ {selectedProperty?.price.toFixed(2)}/mês</p>
                <Link href={`/properties/${propertyId}`} className="text-blue-600 hover:underline">
                  Ver detalhes do imóvel
                </Link>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Vaga Selecionada</h3>
                <p className="text-gray-700 mb-1"><strong>Título:</strong> {selectedJob?.title}</p>
                <p className="text-gray-700 mb-1"><strong>Empresa:</strong> {selectedJob?.company}</p>
                <p className="text-gray-700 mb-3"><strong>Local:</strong> {selectedJob?.address}</p>
                <Link href={`/jobs/${jobId}`} className="text-blue-600 hover:underline">
                  Ver detalhes da vaga
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Análise de Deslocamento</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-gray-700 mb-2"><strong>Distância:</strong> {commuteData.distance_km} km</p>
                  <p className="text-gray-700 mb-2"><strong>Tempo estimado:</strong> {commuteData.estimated_time_minutes} minutos</p>
                  <p className="text-gray-700"><strong>Pontuação:</strong> {commuteData.commute_score} (quanto menor, melhor)</p>
                </div>
                
                <div>
                  <p className="text-gray-700 mb-2"><strong>Economia anual estimada:</strong> R$ {commuteData.annual_savings.toFixed(2)}</p>
                  <p className="text-gray-700"><strong>Economia de tempo anual:</strong> {commuteData.annual_time_savings} horas</p>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-md">
                <h4 className="font-semibold text-green-800 mb-2">Impacto na Qualidade de Vida</h4>
                <p className="text-gray-700">
                  Com esta combinação de imóvel e trabalho, você economizará aproximadamente {commuteData.annual_time_savings} horas por ano em deslocamento.
                  Isso equivale a {Math.round(commuteData.annual_time_savings / 24)} dias inteiros que você pode dedicar à família, lazer ou desenvolvimento pessoal.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => {
                  setPropertyId('');
                  setJobId('');
                  setCommuteData(null);
                }}
                className="btn-secondary"
              >
                Fazer Nova Análise
              </button>
            </div>
          </div>
        )}
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como funciona a calculadora?</h2>
          <p className="text-gray-700 mb-4">
            Nossa calculadora utiliza as coordenadas geográficas dos imóveis e locais de trabalho para calcular a distância entre eles.
            Com base nessa distância, estimamos o tempo de deslocamento, considerando uma velocidade média de 30 km/h.
          </p>
          <p className="text-gray-700 mb-4">
            A economia financeira é calculada considerando um custo médio de R$ 0,70 por quilômetro, incluindo combustível, manutenção e depreciação do veículo.
            Multiplicamos pelo trajeto de ida e volta, 22 dias úteis por mês, durante 12 meses.
          </p>
          <p className="text-gray-700">
            A pontuação de deslocamento combina distância e tempo, onde valores menores indicam melhores opções.
            Esta é uma estimativa simplificada e pode variar conforme condições de trânsito e meio de transporte utilizado.
          </p>
        </div>
      </main>
    </div>
  );
}
