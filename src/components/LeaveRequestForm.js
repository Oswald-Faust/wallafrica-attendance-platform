import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { toast } from 'react-hot-toast';

export default function LeaveRequestForm() {
  const [userId, setUserId] = useState('');
  const [type, setType] = useState('congé');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [urgency, setUrgency] = useState('basse');

  useEffect(() => {
    // Récupérer l'ID de l'utilisateur depuis le localStorage ou une autre source
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // Si l'ID n'est pas disponible, vous devrez peut-être le récupérer depuis le serveur
      fetchUserId();
    }
  }, []);

  const fetchUserId = async () => {
    try {
      const res = await fetch('/api/user/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUserId(data.user._id);
        localStorage.setItem('userId', data.user._id);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'ID utilisateur:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      toast.error('ID utilisateur non disponible. Veuillez vous reconnecter.');
      return;
    }
    try {
      const res = await fetch('/api/leave-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId, type, startDate, endDate, reason, urgency }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success('Demande soumise avec succès');
        // Réinitialiser le formulaire
        setType('congé');
        setStartDate('');
        setEndDate('');
        setReason('');
        setUrgency('basse');
      } else {
        const errorData = await res.json();
        toast.error(`Erreur: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Une erreur est survenue lors de la soumission de la demande');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type de demande</label>
        <Select id="type" value={type} onChange={(e) => setType(e.target.value)} className="mt-1">
          <option value="congé">Congé</option>
          <option value="permission">Permission</option>
          <option value="absence">Absence</option>
        </Select>
      </div>
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Date de début</label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Date de fin</label>
        <Input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Raison</label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          className="mt-1 w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">Urgence</label>
        <Select id="urgency" value={urgency} onChange={(e) => setUrgency(e.target.value)} className="mt-1">
          <option value="basse">Basse</option>
          <option value="moyenne">Moyenne</option>
          <option value="haute">Haute</option>
        </Select>
      </div>
      <Button type="submit">Soumettre la demande</Button>
    </form>
  );
}
