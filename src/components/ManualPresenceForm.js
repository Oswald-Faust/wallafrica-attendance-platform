import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

export default function ManualPresenceForm({ userId, userName, onPresenceUpdated }) {
  const [date, setDate] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [departureTime, setDepartureTime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || (!arrivalTime && !departureTime)) {
      toast.error('Veuillez remplir la date et au moins une heure');
      return;
    }

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
          arrivalTime,
          departureTime
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Présence enregistrée avec succès');
        setDate('');
        setArrivalTime('');
        setDepartureTime('');
        if (onPresenceUpdated) {
          onPresenceUpdated(result.presence);
        }
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
      <h2 className="text-xl font-bold mb-4">Enregistrement manuel pour {userName}</h2>
      
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
        <Input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="arrivalTime" className="block text-sm font-medium text-gray-700">Heure d&apos;arrivée</label>
        <Input
          type="time"
          id="arrivalTime"
          value={arrivalTime}
          onChange={(e) => setArrivalTime(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <label htmlFor="departureTime" className="block text-sm font-medium text-gray-700">Heure de départ</label>
        <Input
          type="time"
          id="departureTime"
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
          className="mt-1"
        />
      </div>

      <Button type="submit">Enregistrer la présence</Button>
    </form>
  );
}
