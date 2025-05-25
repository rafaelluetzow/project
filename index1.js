import { getSession } from 'next-auth/react';
import dbConnect from '../../../lib/mongodb';
import Job from '../../../models/Job';

export default async function handler(req, res) {
  const { method } = req;
  const session = await getSession({ req });
  
  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const jobs = await Job.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: jobs });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case 'POST':
      // Verificar autenticação
      if (!session) {
        return res.status(401).json({ success: false, message: 'Não autorizado' });
      }
      
      // Verificar se é anunciante
      if (!session.user.isAdvertiser) {
        return res.status(403).json({ 
          success: false, 
          message: 'Apenas anunciantes podem criar vagas' 
        });
      }

      try {
        const { 
          title, description, company, address, 
          latitude, longitude, salaryRange, requirements 
        } = req.body;

        const job = await Job.create({
          title,
          description,
          company,
          address,
          location: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          salaryRange,
          requirements,
          userId: session.user.id
        });

        res.status(201).json({ success: true, data: job });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(405).json({ success: false, message: 'Método não permitido' });
      break;
  }
}
