import mongoose from 'mongoose';
import { ADMIN_EMAIL } from '../config/admin';

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Veuillez fournir un nom complet'],
  },
  email: {
    type: String,
    required: [true, 'Veuillez fournir une adresse email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Veuillez fournir un mot de passe'],
  },
  role: {
    type: String,
    enum: ['Developer', 'UI/UX Designer', 'Graphic Designer', 'Illustrator', 'HR'],
    default: 'Developer',
  },
}, { timestamps: true });

UserSchema.statics.isAdmin = function(email) {
  return email === ADMIN_EMAIL;
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
