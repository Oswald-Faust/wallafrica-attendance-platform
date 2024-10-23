import { adminMiddleware } from '@/middleware/auth';
import Presence from '@/models/Presence';

async function handler(req, res) {
  const { userId } = req.query;

  try {
    const presenceHistory = await Presence.find({ userId })
      .sort({ date: -1 })
      .limit(30); // Limite à 30 jours pour l'exemple, ajustez selon vos besoins

    res.status(200).json({ presenceHistory });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique de présence:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

export default adminMiddleware(handler);
