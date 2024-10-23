import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

export default function AdminLeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const data = await fetchWithAuth('/api/admin/leave-requests');
      setLeaveRequests(data.requests);
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes de congés:', error);
      toast.error('Impossible de charger les demandes de congés');
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      await fetchWithAuth(`/api/admin/leave-requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action }),
      });
      toast.success(`Demande ${action === 'approved' ? 'approuvée' : 'refusée'}`);
      fetchLeaveRequests();
    } catch (error) {
      console.error('Erreur lors du traitement de la demande:', error);
      toast.error('Impossible de traiter la demande');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Demandes de congés</h2>
      {leaveRequests.length === 0 ? (
        <p>Aucune demande de congé en attente.</p>
      ) : (
        leaveRequests.map((request) => (
          <div key={request._id} className="bg-white shadow rounded-lg p-4 mb-4">
            <p><strong>Employé:</strong> {request.userId.fullName}</p>
            <p><strong>Type:</strong> {request.type}</p>
            <p><strong>Du:</strong> {new Date(request.startDate).toLocaleDateString()}</p>
            <p><strong>Au:</strong> {new Date(request.endDate).toLocaleDateString()}</p>
            <p><strong>Raison:</strong> {request.reason}</p>
            <p><strong>Urgence:</strong> {request.urgency}</p>
            <p><strong>Statut:</strong> {request.status}</p>
            {request.status === 'pending' && (
              <div className="mt-2 space-x-2">
                <Button onClick={() => handleRequestAction(request._id, 'approved')} className="bg-green-500 hover:bg-green-600 text-white">
                  Approuver
                </Button>
                <Button onClick={() => handleRequestAction(request._id, 'rejected')} className="bg-red-500 hover:bg-red-600 text-white">
                  Refuser
                </Button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
