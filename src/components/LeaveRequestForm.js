import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function LeaveRequestForm() {
  const [userId, setUserId] = useState('');
  const [type, setType] = useState('congé');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [urgency, setUrgency] = useState('basse');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Demande de congé</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type de demande</label>
              <Select id="type" value={type} onChange={(e) => setType(e.target.value)} className="w-full">
                <option value="congé">Congé</option>
                <option value="permission">Permission</option>
                <option value="absence">Absence</option>
              </Select>
            </div>
            <div>
              <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-1">Urgence</label>
              <Select id="urgency" value={urgency} onChange={(e) => setUrgency(e.target.value)} className="w-full">
                <option value="basse">Basse</option>
                <option value="moyenne">Moyenne</option>
                <option value="haute">Haute</option>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="w-full"
              />
            </div>
          </div>
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">Raison</label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full h-32"
              placeholder="Veuillez expliquer la raison de votre demande..."
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="w-full sm:w-auto">Soumettre la demande</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
