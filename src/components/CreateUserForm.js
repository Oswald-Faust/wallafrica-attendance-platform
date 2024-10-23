import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

export default function CreateUserForm({ onUserCreated, onClose }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isVisitor, setIsVisitor] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Formulaire soumis');
    console.log({ fullName, email, password, role, isVisitor });

    // Si c'est un visiteur, on force le rôle à 'Visiteur'
    const userRole = isVisitor ? 'Visiteur' : role;

    if (!isVisitor && !role) {
      toast.error('Veuillez sélectionner un rôle pour l\'employé');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Token récupéré:', token);

      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fullName, email, password, role: userRole, isVisitor }),
      });

      console.log('Réponse reçue:', response.status);

      if (response.ok) {
        const newUser = await response.json();
        console.log('Nouvel utilisateur créé:', newUser);
        toast.success('Utilisateur créé avec succès');
        onUserCreated(newUser);
        onClose();
      } else {
        const error = await response.json();
        console.error('Erreur de création:', error);
        toast.error(`Erreur: ${error.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      toast.error('Une erreur est survenue');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Créer un nouvel utilisateur</h2>
      
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
        <Input
          type="text"
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <Input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
        <Input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isVisitor"
          checked={isVisitor}
          onChange={(e) => setIsVisitor(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="isVisitor" className="ml-2 block text-sm text-gray-900">
          Visiteur
        </label>
      </div>

      {!isVisitor && (
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Sélectionnez un rôle</option>
            <option value="Designer">Designer</option>
            <option value="Développeur">Développeur</option>
            <option value="Manager">Manager</option>
            <option value="RH">RH</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" onClick={onClose} variant="outline" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          Annuler
        </Button>
        <Button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          Créer l'utilisateur
        </Button>
      </div>
    </form>
  );
}
