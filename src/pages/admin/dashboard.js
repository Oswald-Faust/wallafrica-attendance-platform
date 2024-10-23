import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminHeader from '@/components/AdminHeader';
import UserTable from '@/components/UserTable';
import Statistics from '@/components/Statistics';
import CreateUserForm from '@/components/CreateUserForm';
import CreateEventForm from '@/components/CreateEventForm';
import EmployeeCalendar from '@/components/EmployeeCalendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminCalendar from '@/components/AdminCalendar';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import LeaveRequestsManager from '@/components/LeaveRequestsManager';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [showLeaveRequests, setShowLeaveRequests] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateUser, setShowCreateUser] = useState(false);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      const res = await fetch('/api/admin/check-auth', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        throw new Error('Not authorized');
      }
      
      await fetchUsers();
      await fetchStats();
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur de vérification d\'authentification:', error);
      setError('Vous n\'êtes pas autorisé à accéder à cette page.');
      setIsLoading(false);
      // Optionnel : rediriger après un court délai
      // setTimeout(() => router.push('/dashboard'), 3000);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
    setActiveTab('calendar');
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Tableau de bord administrateur</h1>
        
        {activeTab === 'users' && <UserTable users={users} onUserSelect={handleUserSelect} />}
        {activeTab === 'stats' && <Statistics stats={stats} />}
        {activeTab === 'create-user' && <CreateUserForm onUserCreated={fetchUsers} />}
        {activeTab === 'create-event' && <CreateEventForm onEventCreated={() => {}} />}
        {activeTab === 'calendar' && <AdminCalendar />}
        {activeTab === 'leave-requests' && <AdminLeaveRequests />}
        
        <div className="flex space-x-4 mb-6">
          <Button onClick={() => setShowLeaveRequests(true)}>Voir les permissions</Button>
        </div>

        <Modal isOpen={showLeaveRequests} onClose={() => setShowLeaveRequests(false)}>
          <h2 className="text-2xl font-bold mb-4">Demandes de permissions</h2>
          <LeaveRequestsManager />
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setShowLeaveRequests(false)}>Fermer</Button>
          </div>
        </Modal>
      </main>
    </div>
  );
}
