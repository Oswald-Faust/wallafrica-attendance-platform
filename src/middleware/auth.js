import jwt from 'jsonwebtoken';
import User from '../models/User';
import { ADMIN_EMAIL } from '../config/admin';

export function authMiddleware(handler) {
  return async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      req.isAdmin = decoded.email === ADMIN_EMAIL;
      return handler(req, res);
    } catch (error) {
      res.status(401).json({ message: 'Non authentifié' });
    }
  };
}

export function adminMiddleware(handler) {
  return async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.email !== ADMIN_EMAIL) {
        return res.status(403).json({ message: 'Accès non autorisé' });
      }
      req.userId = decoded.userId;
      req.isAdmin = true;
      return handler(req, res);
    } catch (error) {
      res.status(401).json({ message: 'Non authentifié' });
    }
  };
}
