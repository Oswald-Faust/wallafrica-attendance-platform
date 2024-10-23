import { authMiddleware } from '@/middleware/auth';
import LeaveRequest from '@/models/LeaveRequest';

async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { userId, type, startDate, endDate, reason, urgency } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: 'UserId est requis' });
      }

      const newRequest = new LeaveRequest({
        userId,
        type,
        startDate,
        endDate,
        reason,
        urgency
      });

      await newRequest.save();
      res.status(201).json({ message: 'Demande créée avec succès', request: newRequest });
    } catch (error) {
      console.error('Erreur lors de la création de la demande:', error);
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const requests = await LeaveRequest.find().populate('userId', 'fullName email');
      res.status(200).json({ requests });
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  } else {
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}

export default authMiddleware(handler);
