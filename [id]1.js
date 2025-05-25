import { getSession } from 'next-auth/react';
import dbConnect from '../../../lib/mongodb';
import Job from '../../../models/Job';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  const { method } = req;
  const session = await getSession({ req });
  
  await dbConnect();
  
  // Obter o ID da vaga da URL
  const { id } = req.query;
  
  // Verificar se o ID é válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'ID inválido' });
  }

  switch (method) {
    case 'GET':
      try {
        const job = await Job.findById(id);
        
        if (!job) {
          return res.status(404).json({ success: false, message: 'Vaga não encontrada' });
        }
        
        res.status(200).json({ success: true, data: job });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    case 'PUT':
      // Verificar autenticação
      if (!session) {
        return res.status(401).json({ success: false, message: 'Não autorizado' });
      }
      
      try {
        // Verificar se a vaga existe e pertence ao usuário
        const job = await Job.findById(id);
        
        if (!job) {
          return res.status(404).json({ success: false, message: 'Vaga não encontrada' });
        }
        
        // Verificar se o usuário é o proprietário
        if (job.userId.toString() !== session.user.id) {
          return res.status(403).json({ 
            success: false, 
            message: 'Você não tem permissão para editar esta vaga' 
          });
        }
        
        const { 
          title, description, company, address, 
          latitude, longitude, salaryRange, requirements 
        } = req.body;
        
        const updatedJob = await Job.findByIdAndUpdate(
          id,
          {
            title,
            description,
            company,
            address,
            location: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            salaryRange,
            requirements
          },
          { new: true, runValidators: true }
        );
        
        res.status(200).json({ success: true, data: updatedJob });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    case 'DELETE':
      // Verificar autenticação
      if (!session) {
        return res.status(401).json({ success: false, message: 'Não autorizado' });
      }
      
      try {
        // Verificar se a vaga existe e pertence ao usuário
        const job = await Job.findById(id);
        
        if (!job) {
          return res.status(404).json({ success: false, message: 'Vaga não encontrada' });
        }
        
        // Verificar se o usuário é o proprietário
        if (job.userId.toString() !== session.user.id) {
          return res.status(403).json({ 
            success: false, 
            message: 'Você não tem permissão para excluir esta vaga' 
          });
        }
        
        await Job.findByIdAndDelete(id);
        
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
      
    default:
      res.status(405).json({ success: false, message: 'Método não permitido' });
      break;
  }
}
