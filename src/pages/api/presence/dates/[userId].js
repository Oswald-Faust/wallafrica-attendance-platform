import { authMiddleware } from '@/middleware/auth';
import Presence from '@/models/Presence';

async function handler(req, res) {
  const { userId } = req.query;

  if (req.method === 'GET') {
    try {
      const presences = await Presence.find({ userId }).distinct('date');
      res.status(200).json({ dates: presences });
    } catch (error) {
      console.error('Erreur lors de la récupération des dates de présence:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  } else {
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}

export default authMiddleware(handler);
