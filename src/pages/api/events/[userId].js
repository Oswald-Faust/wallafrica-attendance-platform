import { authMiddleware } from '@/middleware/auth';
import Event from '@/models/Event';

async function handler(req, res) {
  const { userId } = req.query;

  try {
    const events = await Event.find({
      $or: [
        { assignedTo: userId },
        { isGlobal: true }
      ]
    });
    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des événements' });
  }
}

export default authMiddleware(handler);
