import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.locale('fr');
const localizer = momentLocalizer(moment);

export default function EmployeeCalendar({ userId }) {
  const [events, setEvents] = useState([]);
  const [presenceDates, setPresenceDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(moment().format('MMMM YYYY'));

  useEffect(() => {
    fetchEvents();
    fetchPresenceDates();
  }, [userId]);

  const fetchEvents = async () => {
    try {
      const [userEventsRes, adminEventsRes] = await Promise.all([
        userId ? fetch(`/api/events/${userId}`) : Promise.resolve({ ok: true, json: () => ({ events: [] }) }),
        fetch('/api/admin/events')
      ]);
      
      if (userEventsRes.ok && adminEventsRes.ok) {
        const userEventsData = await userEventsRes.json();
        const adminEventsData = await adminEventsRes.json();
        
        // Combiner et formater les événements
        const allEvents = [
          ...userEventsData.events.map(event => ({
            ...event,
            start: new Date(event.startDate),
            end: new Date(event.endDate),
            isUserEvent: true
          })),
          ...adminEventsData.events.map(event => ({
            ...event,
            start: new Date(event.startDate),
            end: new Date(event.endDate),
            isAdminEvent: true
          }))
        ];
        
        setEvents(allEvents);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
    }
  };

  const fetchPresenceDates = async () => {
    if (!userId) {
      setPresenceDates([]);
      return;
    }
    try {
      const res = await fetch(`/api/presence/dates/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setPresenceDates(data.dates);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des dates de présence:', error);
    }
  };

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.isAdminEvent ? '#3174ad' : '#28a745',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return { style };
  };

  const dayPropGetter = (date) => {
    if (presenceDates.includes(date.toISOString().split('T')[0])) {
      return {
        className: 'presence-day',
        style: {
          backgroundColor: 'rgba(0, 255, 0, 0.1)',
        }
      };
    }
    return {};
  };

  const onNavigate = (date) => {
    setCurrentMonth(moment(date).format('MMMM YYYY'));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">{currentMonth}</h2>
      <div style={{ height: '500px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          eventPropGetter={eventStyleGetter}
          dayPropGetter={dayPropGetter}
          onNavigate={onNavigate}
          messages={{
            next: "Suivant",
            previous: "Précédent",
            today: "Aujourd'hui",
            month: "Mois",
            week: "Semaine",
            day: "Jour"
          }}
        />
      </div>
    </div>
  );
}
