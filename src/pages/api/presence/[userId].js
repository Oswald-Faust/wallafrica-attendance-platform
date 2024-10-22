// pages/api/presence/[userId].js
import dbConnect from '@/lib/dbConnect';
import Presence from '@/models/Presence';

export default async function handler(req, res) {
  await dbConnect();

  const { userId } = req.query;

  try {
    const presences = await Presence.find({ userId }).sort({ date: -1 });
    res.status(200).json(presences);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la récupération des présences.' });
  }
}
