import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Clock, Calendar, CheckCircle, XCircle } from 'lucide-react';
import Header from '@/components/Header';
import { useRouter } from 'next/router';
import EmployeeCalendar from '@/components/EmployeeCalendar';

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('presence');
  const [presenceStatus, setPresenceStatus] = useState('absent'); // 'absent', 'present', 'departed'
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeString, setTimeString] = useState('');
  const [arrivalTime, setArrivalTime] = useState(null);
  const [departureTime, setDepartureTime] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    checkAuth();
    fetchTodayPresence();
    const authInterval = setInterval(checkAuth, 5 * 60 * 1000);
    const timer = setInterval(updateTime, 1000);
    return () => {
      clearInterval(authInterval);
      clearInterval(timer);
    };
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  };

  const updateTime = () => {
    const now = new Date();
    setCurrentTime(now);
    setTimeString(now.toLocaleTimeString('fr-FR'));
  };

  const fetchTodayPresence = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/presence/today', {
        headers: { 
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.presence) {
          setPresenceStatus(data.presence.departureTime ? 'departed' : 'present');
          setArrivalTime(data.presence.arrivalTime);
          setDepartureTime(data.presence.departureTime);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la présence:', error);
    }
  };

  const handlePresence = async (action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/presence', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action,
          time: timeString,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (action === 'arrival') {
          setPresenceStatus('present');
          setArrivalTime(timeString);
          toast.success('Présence marquée avec succès !');
        } else {
          setPresenceStatus('departed');
          setDepartureTime(timeString);
          toast.success('Départ enregistré avec succès !');
        }
      } else {
        const errorData = await response.json();
        toast.error(`Erreur lors de l'enregistrement : ${errorData.error}`);
      }
    } catch (error) {
      console.error('Erreur serveur :', error);
      toast.error('Erreur serveur. Veuillez réessayer plus tard.');
    }
  };
  
  const formattedDate = currentTime.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'presence' && (
          <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Gestion de Présence</h2>
              <div className="flex items-center justify-center space-x-6 bg-gray-50 p-6 rounded-xl mb-6">
                <Clock className="w-16 h-16 text-blue-500" />
                <div>
                  <p className="text-4xl font-bold text-gray-800">{timeString}</p>
                  <p className="text-xl mt-2 flex items-center text-gray-600">
                    <Calendar className="mr-2 h-5 w-5" /> {formattedDate}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <Button 
                  onClick={() => handlePresence('arrival')} 
                  className="w-full py-4 text-lg font-semibold bg-green-500 hover:bg-green-600 text-white transition-colors rounded-lg"
                  disabled={presenceStatus !== 'absent'}
                >
                  Marquer la présence
                </Button>
                <Button 
                  onClick={() => handlePresence('departure')} 
                  className="w-full py-4 text-lg font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors rounded-lg"
                  disabled={presenceStatus !== 'present'}
                >
                  Marquer le départ
                </Button>
              </div>
              <div className="text-center text-xl mt-6 flex flex-col items-center justify-center">
                <p className="text-gray-700">Statut : </p>
                <span className={`font-bold mt-2 flex items-center ${
                  presenceStatus === 'present' ? 'text-green-500' : 
                  presenceStatus === 'departed' ? 'text-blue-500' : 'text-red-500'
                }`}>
                  {presenceStatus === 'present' ? (
                    <>
                      <CheckCircle className="mr-2 h-6 w-6" /> Présent
                    </>
                  ) : presenceStatus === 'departed' ? (
                    <>
                      <XCircle className="mr-2 h-6 w-6" /> Parti
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-6 w-6" /> Absent
                    </>
                  )}
                </span>
                {arrivalTime && (
                  <p className="text-sm text-gray-600 mt-2">Arrivée : {arrivalTime}</p>
                )}
                {departureTime && (
                  <p className="text-sm text-gray-600 mt-1">Départ : {departureTime}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        {activeTab === 'planning' && (
          <EmployeeCalendar userId={userId} />
        )}
        {/* Ajoutez d'autres contenus pour les autres onglets ici */}
      </main>
    </div>
  );
}
