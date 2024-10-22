import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { fullName, email, password, role } = req.body;

    console.log('Received registration data:', { fullName, email, role }); // Log des données reçues

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('User already exists'); // Log pour utilisateur existant
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hachage du mot de passe avant de sauvegarder
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    try {
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error saving user:', error); // Log de l'erreur
      res.status(500).json({ message: 'Error registering user', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
