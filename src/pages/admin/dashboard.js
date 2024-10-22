import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminHeader from '@/components/AdminHeader';
import UserTable from '@/components/UserTable';
import Statistics from '@/components/Statistics';
import CreateUserForm from '@/components/CreateUserForm';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

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

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'users' && <UserTable users={users} />}
        {activeTab === 'stats' && <Statistics stats={stats} />}
        {activeTab === 'create-user' && <CreateUserForm onUserCreated={fetchUsers} />}
      </main>
    </div>
  );
}
