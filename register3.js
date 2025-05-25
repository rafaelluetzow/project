import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  const { method } = req;
  
  await dbConnect();

  switch (method) {
    case 'POST':
      try {
        const { username, email, password, isAdvertiser } = req.body;

        // Verificar se o usuário já existe
        const existingUser = await User.findOne({ 
          $or: [{ email }, { username }] 
        });

        if (existingUser) {
          return res.status(400).json({ 
            success: false, 
            message: 'Email ou nome de usuário já cadastrado' 
          });
        }

        // Criptografar a senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Criar o usuário
        const user = await User.create({
          username,
          email,
          password: hashedPassword,
          isAdvertiser: !!isAdvertiser
        });

        // Remover a senha do objeto retornado
        const userResponse = {
          _id: user._id,
          username: user.username,
          email: user.email,
          isAdvertiser: user.isAdvertiser,
          createdAt: user.createdAt
        };

        res.status(201).json({ success: true, data: userResponse });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(405).json({ success: false, message: 'Método não permitido' });
      break;
  }
}
