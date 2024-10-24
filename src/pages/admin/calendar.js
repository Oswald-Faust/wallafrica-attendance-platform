import { useState, useEffect } from 'react';
import { Calendar } from 'react-big-calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

export default function AdminCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [presences, setPresences] = useState({});

  useEffect(() => {
    fetchUsers();
    if (selectedUser) {
      fetchPresences(selectedUser);
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        if (data.users.length > 0) {
          setSelectedUser(data.users[0]._id);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      toast.error('Erreur lors de la récupération des utilisateurs');
    }
  };

  const fetchPresences = async (userId) => {
    try {
      const response = await fetch(`/api/admin/user-presences/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setPresences(data.presences);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des présences:', error);
      toast.error('Erreur lors de la récupération des présences');
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const handlePresenceToggle = async () => {
    const dateString = selectedDate.toISOString().split('T')[0];
    const currentPresence = presences[dateString];

    try {
      const response = await fetch('/api/admin/toggle-presence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser,
          date: dateString,
          isPresent: !currentPresence,
        }),
      });

      if (response.ok) {
        setPresences(prev => ({
          ...prev,
          [dateString]: !currentPresence
        }));
        toast.success('Présence mise à jour avec succès');
      } else {
        toast.error('Erreur lors de la mise à jour de la présence');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la présence:', error);
      toast.error('Erreur lors de la mise à jour de la présence');
    }
  };
}
