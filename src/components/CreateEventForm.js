import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select } from '@/components/ui/select';
import { toast } from 'sonner';

export default function CreateEventForm({ onEventCreated }) {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [description, setDescription] = useState('');
  const [isGlobal, setIsGlobal] = useState(false);
  const [assignedTo, setAssignedTo] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title, start, end, description, assignedTo, isGlobal }),
      });

      if (res.ok) {
        toast.success('Événement créé avec succès');
        setTitle('');
        setStart('');
        setEnd('');
        setDescription('');
        setIsGlobal(false);
        setAssignedTo([]);
        if (onEventCreated) onEventCreated();
      } else {
        toast.error('Erreur lors de la création de l\'événement');
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
      toast.error('Erreur lors de la création de l\'événement');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Titre de l'événement"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Input
        type="datetime-local"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        required
      />
      <Input
        type="datetime-local"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isGlobal"
          checked={isGlobal}
          onCheckedChange={setIsGlobal}
        />
        <label htmlFor="isGlobal">Événement global</label>
      </div>
      <Select
        placeholder="Utilisateurs assignés"
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
        options={users.map(user => ({ value: user._id, label: user.fullName }))}
      />
      <Button type="submit">Créer un événement</Button>
    </form>
  );
}
