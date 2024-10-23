import { adminMiddleware } from '@/middleware/auth';
import Presence from '@/models/Presence';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const presences = await Presence.find({ date: today });

    const presenceMap = presences.reduce((acc, presence) => {
      acc[presence.userId] = {
        arrivalTime: presence.arrivalTime,
        departureTime: presence.departureTime
      };
      return acc;
    }, {});

    res.status(200).json({ presences: presenceMap });
  } catch (error) {
    console.error('Erreur lors de la récupération des présences:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

export default adminMiddleware(handler);
