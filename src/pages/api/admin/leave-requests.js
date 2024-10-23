import { adminMiddleware } from '@/middleware/auth';
import LeaveRequest from '@/models/LeaveRequest';

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const requests = await LeaveRequest.find().populate('userId', 'fullName email');
      res.status(200).json({ requests });
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes de congés:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  } else {
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}

export default adminMiddleware(handler);
