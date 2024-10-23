import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'react-hot-toast';

export default function CreateEventForm({ onEventCreated }) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [color, setColor] = useState('#3174ad');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title,
          startDate,
          endDate,
          allDay,
          color,
          description
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Événement créé avec succès');
        if (onEventCreated) {
          onEventCreated(result.event);
        }
        // Réinitialiser le formulaire
        setTitle('');
        setStartDate('');
        setEndDate('');
        setAllDay(false);
        setColor('#3174ad');
        setDescription('');
      } else {
        const error = await response.json();
        toast.error(`Erreur: ${error.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
      toast.error('Une erreur est survenue');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titre de l'événement"
        required
      />
      <Input
        type="datetime-local"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
      />
      <Input
        type="datetime-local"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        required
      />
      <div className="flex items-center">
        <Checkbox
          id="allDay"
          checked={allDay}
          onCheckedChange={setAllDay}
        />
        <label htmlFor="allDay" className="ml-2">Toute la journée</label>
      </div>
      <Input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full p-2 border rounded"
      />
      <Button type="submit">Créer l'événement</Button>
    </form>
  );
}
