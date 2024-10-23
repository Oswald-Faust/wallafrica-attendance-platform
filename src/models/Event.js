import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  allDay: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: '#3174ad',
  },
  description: String,
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
