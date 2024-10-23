import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UserProfile from './UserProfile';
import CreateUserForm from './CreateUserForm';
import Modal from './Modal';
import { PlusCircle, Search } from 'lucide-react';

export default function UserTable({ initialUsers = [] }) {
  const [users, setUsers] = useState(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialUsers.length);
  const [todayPresences, setTodayPresences] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!initialUsers.length) {
      fetchUsers();
    }
    fetchTodayPresences();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        console.error('Erreur lors de la récupération des utilisateurs');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTodayPresences = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/today-presences', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTodayPresences(data.presences);
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

  const openCreateUserModal = () => {
    setIsCreateUserModalOpen(true);
  };

  const closeCreateUserModal = () => {
    setIsCreateUserModalOpen(false);
  };

  const handleUserCreated = (newUser) => {
    setUsers([...users, newUser]);
    closeCreateUserModal();
  };

  const sortUsersByArrivalTime = (a, b) => {
    const timeA = todayPresences[a._id]?.arrivalTime || '99:99';
    const timeB = todayPresences[b._id]?.arrivalTime || '99:99';
    return timeA > timeB ? -1 : 1;
  };

  if (isLoading) {
    return <div>Chargement des utilisateurs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button 
          onClick={openCreateUserModal} 
          className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transform transition duration-200 hover:scale-105"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Créer un utilisateur
        </Button>

        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-full border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </div>

      {filteredUsers.length > 0 ? (
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
            {filteredUsers.sort(sortUsersByArrivalTime).map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{todayPresences[user._id]?.arrivalTime || 'Non enregistré'}</TableCell>
                <TableCell>{todayPresences[user._id]?.departureTime || 'Non enregistré'}</TableCell>
                <TableCell>
                  <Button 
                    onClick={() => openUserProfile(user)}
                    className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-medium py-1 px-3 rounded-md transition duration-150 ease-in-out"
                  >
                    Voir profil
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center text-gray-500">Aucun utilisateur trouvé.</div>
      )}

      <Modal isOpen={!!selectedUser} onClose={closeUserProfile}>
        {selectedUser && (
          <UserProfile user={selectedUser} onClose={closeUserProfile} />
        )}
      </Modal>

      <Modal isOpen={isCreateUserModalOpen} onClose={closeCreateUserModal}>
        <CreateUserForm onUserCreated={handleUserCreated} onClose={closeCreateUserModal} />
      </Modal>
    </div>
  );
}
