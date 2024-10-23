import { adminMiddleware } from '@/middleware/auth';
import LeaveRequest from '@/models/LeaveRequest';

async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const { status } = req.body;
      const updatedRequest = await LeaveRequest.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updatedRequest) {
        return res.status(404).json({ message: 'Demande non trouvée' });
      }

      res.status(200).json({ message: 'Demande mise à jour avec succès', request: updatedRequest });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la demande:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  } else {
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}

export default adminMiddleware(handler);
