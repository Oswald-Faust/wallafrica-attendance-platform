import { adminMiddleware } from '@/middleware/auth';

async function handler(req, res) {
  // Si l'adminMiddleware passe, cela signifie que l'utilisateur est un admin
  res.status(200).json({ message: 'Authentification admin réussie' });
}

export default adminMiddleware(handler);
