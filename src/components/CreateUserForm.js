import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { toast } from 'sonner';

export default function CreateUserForm({ onUserCreated }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Developer');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fullName, email, password, role }),
      });

      if (res.ok) {
        toast.success('Utilisateur créé avec succès');
        setFullName('');
        setEmail('');
        setPassword('');
        setRole('Developer');
        onUserCreated();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Erreur lors de la création de l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      toast.error('Erreur lors de la création de l\'utilisateur');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Nom complet"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="Developer">Développeur</option>
        <option value="UI/UX Designer">Designer UI/UX</option>
        <option value="Graphic Designer">Designer Graphique</option>
        <option value="Illustrator">Illustrateur</option>
        <option value="HR">RH</option>
      </Select>
      <Button type="submit">Créer l&apos;utilisateur</Button>
    </form>
  );
}
