import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Por favor, informe um título para o imóvel'],
    trim: true,
    maxlength: [140, 'Título não pode ter mais de 140 caracteres']
  },
  description: {
    type: String,
    required: [true, 'Por favor, informe uma descrição'],
    trim: true
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
  price: {
    type: Number,
    required: [true, 'Por favor, informe o preço do aluguel']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Por favor, informe o número de quartos']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Por favor, informe o número de banheiros']
  },
  area: {
    type: Number,
    required: [true, 'Por favor, informe a área em m²']
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
PropertySchema.index({ location: '2dsphere' });

// Evita que o modelo seja compilado múltiplas vezes durante hot reloads
export default mongoose.models.Property || mongoose.model('Property', PropertySchema);
