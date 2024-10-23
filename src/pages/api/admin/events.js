import { authMiddleware } from '@/middleware/auth';
import Event from '@/models/Event';

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const events = await Event.find().lean();
      res.status(200).json({ events });
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  } else if (req.method === 'POST') {
    // Ici, nous pouvons garder la vérification d'admin pour la création d'événements
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    try {
      const { title, startDate, endDate, allDay, color, description } = req.body;
      
      const newEvent = new Event({
        title,
        startDate,
        endDate,
        allDay,
        color,
        description
      });

      await newEvent.save();

      res.status(201).json({ message: 'Événement créé avec succès', event: newEvent });
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  } else {
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}

export default authMiddleware(handler);
