// models/Presence.js
import mongoose from 'mongoose';

const PresenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  arrivalTime: {
    type: String,
    required: true,
  },
  departureTime: {
    type: String,
  },
});

// Supprimez tous les modèles existants pour s'assurer que le nouveau schéma est utilisé
mongoose.models = {};

export default mongoose.models.Presence || mongoose.model('Presence', PresenceSchema);
