import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Por favor, informe um nome de usuário'],
    unique: true,
    trim: true,
    maxlength: [64, 'Nome de usuário não pode ter mais de 64 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Por favor, informe um email'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, informe um email válido']
  },
  password: {
    type: String,
    required: [true, 'Por favor, informe uma senha'],
    minlength: [6, 'Senha deve ter pelo menos 6 caracteres'],
    select: false // Não retorna a senha nas consultas
  },
  isAdvertiser: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Evita que o modelo seja compilado múltiplas vezes durante hot reloads
export default mongoose.models.User || mongoose.model('User', UserSchema);
