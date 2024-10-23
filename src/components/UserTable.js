import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import UserPresenceHistory from './UserPresenceHistory';

export default function UserTable({ users }) {
  const [selectedUser, setSelectedUser] = useState(null);

  const openHistoryModal = (user) => {
    setSelectedUser(user);
  };

  const closeHistoryModal = () => {
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
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button onClick={() => openHistoryModal(user)}>Voir l'historique</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedUser && (
        <UserPresenceHistory
          userId={selectedUser._id}
          userName={selectedUser.fullName}
          isOpen={!!selectedUser}
          onClose={closeHistoryModal}
        />
      )}
    </div>
  );
}
