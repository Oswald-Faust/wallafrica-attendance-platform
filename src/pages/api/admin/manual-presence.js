import { adminMiddleware } from '@/middleware/auth';
import Presence from '@/models/Presence';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const { userId, date, arrivalTime, departureTime } = req.body;

    if (!userId || !date) {
      return res.status(400).json({ message: 'UserId et date sont requis' });
    }

    let presence = await Presence.findOne({ userId, date });

    if (!presence) {
      presence = new Presence({ userId, date });
    }

    if (arrivalTime) {
      presence.arrivalTime = arrivalTime;
    }

    if (departureTime) {
      presence.departureTime = departureTime;
    }

    await presence.save();

    res.status(200).json({ message: 'Présence enregistrée avec succès', presence });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement manuel de la présence:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

export default adminMiddleware(handler);
