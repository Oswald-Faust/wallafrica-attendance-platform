import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { useRouter } from 'next/router';

const tabs = [
  { id: 'presence', label: 'Présence' },
  { id: 'planning', label: 'Planning' },
  { id: 'conges', label: 'Congés' },
];

export default function Header({ activeTab, setActiveTab }) {
  const router = useRouter();

  const handleLogout = () => {
    // Supprimer le token du localStorage
    localStorage.removeItem('token');
    // Rediriger vers la page de connexion
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10 bg-blue-500">
              <AvatarFallback>
                <User className="h-6 w-6 text-white" />
              </AvatarFallback>
            </Avatar>
            <Button 
              variant="outline" 
              className="text-gray-600 hover:text-gray-800"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Déconnexion
            </Button>
          </div>
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
