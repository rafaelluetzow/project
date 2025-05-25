import { getSession } from 'next-auth/react';
import dbConnect from '../../../lib/mongodb';
import Property from '../../../models/Property';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  const { method } = req;
  const session = await getSession({ req });
  
  await dbConnect();
  
  // Obter o ID do imóvel da URL
  const { id } = req.query;
  
  // Verificar se o ID é válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'ID inválido' });
  }

  switch (method) {
    case 'GET':
      try {
        const property = await Property.findById(id);
        
        if (!property) {
          return res.status(404).json({ success: false, message: 'Imóvel não encontrado' });
        }
        
        res.status(200).json({ success: true, data: property });
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
        // Verificar se o imóvel existe e pertence ao usuário
        const property = await Property.findById(id);
        
        if (!property) {
          return res.status(404).json({ success: false, message: 'Imóvel não encontrado' });
        }
        
        // Verificar se o usuário é o proprietário
        if (property.userId.toString() !== session.user.id) {
          return res.status(403).json({ 
            success: false, 
            message: 'Você não tem permissão para editar este imóvel' 
          });
        }
        
        const { 
          title, description, address, 
          latitude, longitude, price, 
          bedrooms, bathrooms, area 
        } = req.body;
        
        const updatedProperty = await Property.findByIdAndUpdate(
          id,
          {
            title,
            description,
            address,
            location: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            price: parseFloat(price),
            bedrooms: parseInt(bedrooms),
            bathrooms: parseInt(bathrooms),
            area: parseFloat(area)
          },
          { new: true, runValidators: true }
        );
        
        res.status(200).json({ success: true, data: updatedProperty });
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
        // Verificar se o imóvel existe e pertence ao usuário
        const property = await Property.findById(id);
        
        if (!property) {
          return res.status(404).json({ success: false, message: 'Imóvel não encontrado' });
        }
        
        // Verificar se o usuário é o proprietário
        if (property.userId.toString() !== session.user.id) {
          return res.status(403).json({ 
            success: false, 
            message: 'Você não tem permissão para excluir este imóvel' 
          });
        }
        
        await Property.findByIdAndDelete(id);
        
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
