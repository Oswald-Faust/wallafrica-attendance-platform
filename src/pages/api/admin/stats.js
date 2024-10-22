import { authMiddleware } from '@/middleware/auth';
import User from '@/models/User';
import Presence from '@/models/Presence';

async function handler(req, res) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const totalUsers = await User.countDocuments();
    const presentToday = await Presence.countDocuments({ date: today });
    const absentToday = totalUsers - presentToday;

    const startOfMonth = new Date(today.slice(0, 7) + '-01');
    const totalWorkdays = Math.floor((new Date() - startOfMonth) / (1000 * 60 * 60 * 24)) + 1;
    const totalPresences = await Presence.countDocuments({ date: { $gte: startOfMonth } });
    const monthlyAttendanceRate = Math.round((totalPresences / (totalUsers * totalWorkdays)) * 100);

    res.status(200).json({
      stats: {
        presentToday,
        absentToday,
        monthlyAttendanceRate,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

export default authMiddleware(handler);
