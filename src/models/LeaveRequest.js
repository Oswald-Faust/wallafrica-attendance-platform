import mongoose from 'mongoose';

const LeaveRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['congé', 'permission', 'absence'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  urgency: { type: String, enum: ['basse', 'moyenne', 'haute'], default: 'basse' },
  status: { type: String, enum: ['en attente', 'approuvé', 'refusé'], default: 'en attente' },
  adminComment: { type: String },
}, { timestamps: true });

export default mongoose.models.LeaveRequest || mongoose.model('LeaveRequest', LeaveRequestSchema);
