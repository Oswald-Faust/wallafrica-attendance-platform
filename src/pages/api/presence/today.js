import dbConnect from '@/lib/dbConnect';
import Presence from '@/models/Presence';
import { authMiddleware } from '@/middleware/auth';

async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const today = new Date().toISOString().split('T')[0];
      const presence = await Presence.findOne({ userId: req.userId, date: today });
      
      res.status(200).json({ success: true, presence });
    } catch (error) {
      console.error('Erreur lors de la récupération de la présence:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Méthode non autorisée' });
  }
}

export default authMiddleware(handler);
