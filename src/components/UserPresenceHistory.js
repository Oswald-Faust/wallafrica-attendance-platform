import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function UserPresenceHistory({ userId }) {
  const [presenceHistory, setPresenceHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPresenceHistory();
  }, [userId]);

  const fetchPresenceHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/user-presence/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setPresenceHistory(data.presenceHistory);
      } else {
        console.error('Erreur lors de la récupération de l\'historique de présence');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <p>Chargement de l&apos;historique...</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Heure d&apos;arrivée</TableHead>
          <TableHead>Heure de départ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {presenceHistory.map((presence) => (
          <TableRow key={presence._id}>
            <TableCell>{format(new Date(presence.date), 'dd MMMM yyyy', { locale: fr })}</TableCell>
            <TableCell>{presence.arrivalTime || 'Non enregistré'}</TableCell>
            <TableCell>{presence.departureTime || 'Non enregistré'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
