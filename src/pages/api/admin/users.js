import { adminMiddleware } from '@/middleware/auth';
import User from '@/models/User';
import Presence from '@/models/Presence';

async function handler(req, res) {
  try {
    const users = await User.find().lean();
    const today = new Date().toISOString().split('T')[0];

    const usersWithPresence = await Promise.all(users.map(async (user) => {
      const lastPresence = await Presence.findOne({ userId: user._id }).sort({ date: -1 }).lean();
      return { ...user, lastPresence };
    }));

    res.status(200).json({ users: usersWithPresence });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

export default adminMiddleware(handler);
