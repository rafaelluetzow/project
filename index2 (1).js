import { getSession } from 'next-auth/react';
import dbConnect from '../../../lib/mongodb';
import Property from '../../../models/Property';

export default async function handler(req, res) {
  const { method } = req;
  const session = await getSession({ req });
  
  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const properties = await Property.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: properties });
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
          message: 'Apenas anunciantes podem criar imóveis' 
        });
      }

      try {
        const { 
          title, description, address, 
          latitude, longitude, price, 
          bedrooms, bathrooms, area 
        } = req.body;

        const property = await Property.create({
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
          area: parseFloat(area),
          userId: session.user.id
        });

        res.status(201).json({ success: true, data: property });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(405).json({ success: false, message: 'Método não permitido' });
      break;
  }
}
