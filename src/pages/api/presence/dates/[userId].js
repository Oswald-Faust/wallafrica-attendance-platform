import { authMiddleware } from '@/middleware/auth';
import Presence from '@/models/Presence';

async function handler(req, res) {
  const { userId } = req.query;

  try {
    const presences = await Presence.find({ userId });
    const dates = presences.map(p => p.date.toISOString().split('T')[0]);
    res.status(200).json({ dates });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des dates de présence' });
  }
}

export default authMiddleware(handler);
