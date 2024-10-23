import { adminMiddleware } from '@/middleware/auth';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const { fullName, email, password, role, isVisitor } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer le nouvel utilisateur
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
      isVisitor
    });

    await newUser.save();

    // Retourner l'utilisateur créé (sans le mot de passe)
    const userToReturn = newUser.toObject();
    delete userToReturn.password;

    res.status(201).json(userToReturn);
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
}

export default adminMiddleware(handler);
