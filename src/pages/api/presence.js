import dbConnect from '@/lib/dbConnect';
import Presence from '@/models/Presence';
import { authMiddleware } from '@/middleware/auth';

async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { action, time } = req.body;
      const today = new Date().toISOString().split('T')[0];

      let presence = await Presence.findOne({ userId: req.userId, date: today });

      if (action === 'arrival') {
        if (presence) {
          return res.status(400).json({ success: false, error: 'Présence déjà marquée aujourd\'hui' });
        }
        presence = new Presence({
          userId: req.userId,
          date: today,
          arrivalTime: time,
        });
      } else if (action === 'departure') {
        if (!presence) {
          return res.status(400).json({ success: false, error: 'Aucune arrivée marquée aujourd\'hui' });
        }
        if (presence.departureTime) {
          return res.status(400).json({ success: false, error: 'Départ déjà marqué aujourd\'hui' });
        }
        presence.departureTime = time;
      }

      await presence.save();
      res.status(200).json({ success: true, data: presence });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la présence:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Méthode non autorisée' });
  }
}

export default authMiddleware(handler);
