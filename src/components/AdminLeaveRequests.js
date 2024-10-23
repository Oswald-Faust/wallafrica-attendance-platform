import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

export default function AdminLeaveRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/leave-requests', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      const res = await fetch(`/api/leave-requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: action }),
      });

      if (res.ok) {
        toast.success(`Demande ${action === 'approuvé' ? 'approuvée' : 'refusée'}`);
        fetchRequests();
      } else {
        toast.error('Erreur lors du traitement de la demande');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Une erreur est survenue');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Demandes en attente</h2>
      {requests.map((request) => (
        <div key={request._id} className="border p-4 rounded">
          <p><strong>Employé:</strong> {request.userId.fullName}</p>
          <p><strong>Type:</strong> {request.type}</p>
          <p><strong>Dates:</strong> Du {new Date(request.startDate).toLocaleDateString()} au {new Date(request.endDate).toLocaleDateString()}</p>
          <p><strong>Raison:</strong> {request.reason}</p>
          <p><strong>Urgence:</strong> {request.urgency}</p>
          <div className="mt-2 space-x-2">
            <Button onClick={() => handleRequestAction(request._id, 'approuvé')}>Approuver</Button>
            <Button onClick={() => handleRequestAction(request._id, 'refusé')} variant="destructive">Refuser</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
