// src/pages/api/login.js

import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../../config/admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    await dbConnect();

    const { email, password } = req.body;

    if (email === ADMIN_EMAIL) {
      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ message: 'Email ou mot de passe invalide' });
      }
      const token = jwt.sign(
        { userId: 'admin', email: ADMIN_EMAIL },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      return res.status(200).json({ token, isAdmin: true });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, isAdmin: false });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
}
