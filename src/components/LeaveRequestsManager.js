import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';

export default function LeaveRequestsManager() {
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch('/api/admin/leave-requests', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setLeaveRequests(data.requests);
      } else {
        throw new Error('Erreur lors de la récupération des demandes');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Impossible de charger les demandes de permissions');
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      const response = await fetch(`/api/admin/leave-requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: action })
      });

      if (response.ok) {
        toast.success(`Demande ${action === 'approved' ? 'approuvée' : 'refusée'}`);
        fetchLeaveRequests();
      } else {
        throw new Error('Erreur lors du traitement de la demande');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Impossible de traiter la demande');
    }
  };

  return (
    <div className="max-h-[60vh] overflow-y-auto">
      {leaveRequests.length === 0 ? (
        <p>Aucune demande de permission en attente.</p>
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
                <Button 
                  onClick={() => handleRequestAction(request._id, 'approved')}
                  variant="success"
                >
                  Approuver
                </Button>
                <Button 
                  onClick={() => handleRequestAction(request._id, 'rejected')}
                  variant="destructive"
                >
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
