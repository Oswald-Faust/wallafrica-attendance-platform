import { authMiddleware } from '@/middleware/auth';
import Event from '@/models/Event';

async function handler(req, res) {
  const { userId } = req.query;

  if (req.method === 'GET') {
    try {
      const events = await Event.find({ userId }).lean();
      res.status(200).json({ events });
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  } else {
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}

export default authMiddleware(handler);
