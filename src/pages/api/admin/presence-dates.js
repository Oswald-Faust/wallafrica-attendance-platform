import { adminMiddleware } from '@/middleware/auth';
import Presence from '@/models/Presence';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const presences = await Presence.find().distinct('date');
    res.status(200).json({ dates: presences });
  } catch (error) {
    console.error('Erreur lors de la récupération des dates de présence:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

export default adminMiddleware(handler);
