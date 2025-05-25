import dbConnect from '../../../lib/mongodb';
import Property from '../../../models/Property';
import Job from '../../../models/Job';

// Função para calcular a distância entre dois pontos usando a fórmula de Haversine
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distância em km
  return distance;
}

export default async function handler(req, res) {
  const { method, query } = req;
  
  await dbConnect();

  if (method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Método não permitido' });
  }

  try {
    const { property_id, job_id } = query;

    if (!property_id || !job_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'IDs de imóvel e vaga são obrigatórios' 
      });
    }

    // Buscar imóvel e vaga
    const property = await Property.findById(property_id);
    const job = await Job.findById(job_id);

    if (!property || !job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Imóvel ou vaga não encontrados' 
      });
    }

    // Verificar se ambos têm coordenadas
    if (!property.location?.coordinates || !job.location?.coordinates) {
      return res.status(400).json({ 
        success: false, 
        message: 'Dados de localização ausentes para imóvel ou vaga' 
      });
    }

    // Calcular distância
    const propertyLat = property.location.coordinates[1]; // latitude
    const propertyLon = property.location.coordinates[0]; // longitude
    const jobLat = job.location.coordinates[1]; // latitude
    const jobLon = job.location.coordinates[0]; // longitude

    const distanceKm = calculateDistance(propertyLat, propertyLon, jobLat, jobLon);

    // Estimar tempo (velocidade média de 30 km/h)
    const avgSpeedKmh = 30;
    const timeHours = distanceKm / avgSpeedKmh;
    const timeMinutes = timeHours * 60;

    // Calcular pontuação de gamificação (menor é melhor)
    const score = distanceKm + (timeMinutes / 10); // Ponderação arbitrária

    // Calcular economia estimada
    // Assumindo R$ 0,70 por km, 22 dias úteis por mês, ida e volta
    const annualSavings = distanceKm * 2 * 0.70 * 22 * 12;
    // Economia de tempo anual em horas
    const annualTimeSavings = timeMinutes * 2 * 22 * 12 / 60;

    res.status(200).json({
      success: true,
      data: {
        property_title: property.title,
        job_title: job.title,
        distance_km: parseFloat(distanceKm.toFixed(2)),
        estimated_time_minutes: Math.round(timeMinutes),
        commute_score: parseFloat(score.toFixed(1)),
        annual_savings: parseFloat(annualSavings.toFixed(2)),
        annual_time_savings: Math.round(annualTimeSavings)
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}
