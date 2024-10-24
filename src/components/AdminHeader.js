import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';

const tabs = [
  { id: 'users', label: 'Utilisateurs' },
  { id: 'stats', label: 'Statistiques' },
  { id: 'create-event', label: 'Créer un programme' },
  { id: 'calendar', label: 'Calendrier' },
];

export default function AdminHeader({ activeTab, setActiveTab }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Admin</h1>
          <Button onClick={handleLogout}>Déconnexion</Button>
        </div>
        <nav className="mt-4">
          <ul className="flex space-x-4">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
