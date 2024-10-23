import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { toast } from 'react-hot-toast';

export default function ManualPresenceForm({ userId, userName, onClose }) {
  const [date, setDate] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [action, setAction] = useState('arrival');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/manual-presence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          date,
          action,
          time: action === 'arrival' ? arrivalTime : departureTime
        }),
      });

      if (response.ok) {
        toast.success('Présence enregistrée avec succès');
        onClose();
      } else {
        const error = await response.json();
        toast.error(`Erreur: ${error.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la présence:', error);
      toast.error('Une erreur est survenue');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Enregistrer la présence pour {userName}</h2>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
        <Input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="action" className="block text-sm font-medium text-gray-700">Action</label>
        <Select
          id="action"
          value={action}
          onChange={(e) => setAction(e.target.value)}
        >
          <option value="arrival">Arrivée</option>
          <option value="departure">Départ</option>
        </Select>
      </div>
      {action === 'arrival' ? (
        <div>
          <label htmlFor="arrivalTime" className="block text-sm font-medium text-gray-700">Heure d'arrivée</label>
          <Input
            type="time"
            id="arrivalTime"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
            required
          />
        </div>
      ) : (
        <div>
          <label htmlFor="departureTime" className="block text-sm font-medium text-gray-700">Heure de départ</label>
          <Input
            type="time"
            id="departureTime"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            required
          />
        </div>
      )}
      <Button type="submit">Enregistrer</Button>
    </form>
  );
}
