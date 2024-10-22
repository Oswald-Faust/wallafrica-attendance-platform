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
  const router = useRouter();

  useEffect(() => {
    checkAdminAuth();
    fetchUsers();
    fetchStats();
  }, []);

  const checkAdminAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    try {
      const res = await fetch('/api/admin/check-auth', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Erreur de vérification d\'authentification:', error);
      router.push('/dashboard');
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
