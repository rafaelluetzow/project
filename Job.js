import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Por favor, informe um título para a vaga'],
    trim: true,
    maxlength: [140, 'Título não pode ter mais de 140 caracteres']
  },
  description: {
    type: String,
    required: [true, 'Por favor, informe uma descrição'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Por favor, informe o nome da empresa'],
    trim: true,
    maxlength: [100, 'Nome da empresa não pode ter mais de 100 caracteres']
  },
  address: {
    type: String,
    required: [true, 'Por favor, informe um endereço'],
    trim: true,
    maxlength: [200, 'Endereço não pode ter mais de 200 caracteres']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Por favor, informe as coordenadas']
    }
  },
  salaryRange: {
    type: String,
    trim: true,
    maxlength: [50, 'Faixa salarial não pode ter mais de 50 caracteres']
  },
  requirements: {
    type: String,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// Criar índice geoespacial
JobSchema.index({ location: '2dsphere' });

// Evita que o modelo seja compilado múltiplas vezes durante hot reloads
export default mongoose.models.Job || mongoose.model('Job', JobSchema);
