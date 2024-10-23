import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import UserProfile from './UserProfile';
import Modal from './Modal';

export default function UserTable({ users }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPresences, setUserPresences] = useState({});

  useEffect(() => {
    fetchTodayPresences();
  }, []);

  const fetchTodayPresences = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/today-presences', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUserPresences(data.presences);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des présences:', error);
    }
  };

  const openUserProfile = (user) => {
    setSelectedUser(user);
  };

  const closeUserProfile = () => {
    setSelectedUser(null);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Heure d'arrivée</TableHead>
            <TableHead>Heure de départ</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{userPresences[user._id]?.arrivalTime || 'Non enregistré'}</TableCell>
              <TableCell>{userPresences[user._id]?.departureTime || 'Non enregistré'}</TableCell>
              <TableCell>
                <Button onClick={() => openUserProfile(user)}>Voir profil</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal isOpen={!!selectedUser} onClose={closeUserProfile}>
        {selectedUser && (
          <UserProfile user={selectedUser} onClose={closeUserProfile} />
        )}
      </Modal>
    </div>
  );
}
