import { adminMiddleware } from '@/middleware/auth';
import Event from '@/models/Event';
import User from '@/models/User';

async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { title, start, end, description, assignedTo, isGlobal } = req.body;
      
      let assignedUsers = [];
      if (isGlobal) {
        assignedUsers = await User.find({}).select('_id');
      } else if (assignedTo && assignedTo.length > 0) {
        assignedUsers = assignedTo;
      }

      const newEvent = new Event({
        title,
        start: new Date(start),
        end: new Date(end),
        description,
        assignedTo: assignedUsers.map(user => user._id),
        isGlobal
      });
      
      await newEvent.save();
      res.status(201).json({ message: 'Événement créé avec succès', event: newEvent });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la création de l\'événement' });
    }
  } else if (req.method === 'GET') {
    try {
      const events = await Event.find({}).populate('assignedTo', 'fullName email');
      res.status(200).json({ events });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des événements' });
    }
  } else {
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}

export default adminMiddleware(handler);
