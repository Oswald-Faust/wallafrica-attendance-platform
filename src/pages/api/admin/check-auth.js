import { authMiddleware } from '@/middleware/auth';
import User from '@/models/User';

async function handler(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    res.status(200).json({ message: 'Authentification admin réussie' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

export default authMiddleware(handler);
