import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Modal from './Modal';

export default function UserPresenceHistory({ userId, userName, isOpen, onClose }) {
  const [presenceHistory, setPresenceHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchPresenceHistory();
    }
  }, [isOpen, userId]);

  const fetchPresenceHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Historique de présence de {userName}</h2>
      {isLoading ? (
        <p>Chargement de l'historique...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Heure d'arrivée</TableHead>
              <TableHead>Heure de départ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {presenceHistory.map((presence) => (
              <TableRow key={presence._id}>
                <TableCell>{format(new Date(presence.date), 'dd MMMM yyyy', { locale: fr })}</TableCell>
                <TableCell>{presence.arrivalTime}</TableCell>
                <TableCell>{presence.departureTime || 'Non enregistré'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Button onClick={onClose} className="mt-4">Fermer</Button>
    </Modal>
  );
}
