import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Popup from 'reactjs-popup';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'reactjs-popup/dist/index.css';
import './../styles/App.css';

const localizer = momentLocalizer(moment);

const App = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setTitle('');
    setLocation('');
    setIsCreateOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setTitle(event.title);
    setLocation(event.location || '');
    setIsEditOpen(true);
  };

  const handleCreateEvent = () => {
    if (!title) return;
    const newEvent = {
      id: Date.now() + Math.random(),
      title,
      location,
      start: selectedSlot.start,
      end: selectedSlot.end || selectedSlot.start,
    };

    setEvents([...events, newEvent]);
    setIsCreateOpen(false);
  };

  const handleUpdateEvent = () => {
    if (!title) return;
    const updatedEvents = events.map((ev) => {
      if (ev.id === selectedEvent.id) {
        return { ...ev, title, location };
      }
      return ev;
    });
    setEvents(updatedEvents);
    setIsEditOpen(false);
  };

  const handleDeleteEvent = () => {
    const updatedEvents = events.filter((ev) => ev.id !== selectedEvent.id);
    setEvents(updatedEvents);
    setIsEditOpen(false);
  };

  const filteredEvents = events.filter((ev) => {
    const isPast = moment(ev.start).isBefore(moment(), 'day');
    if (filter === 'past') return isPast;
    if (filter === 'upcoming') return !isPast;
    return true;
  });

  const eventStyleGetter = (event) => {
    const isPast = moment(event.start).isBefore(moment(), 'day');
    const backgroundColor = isPast ? 'rgb(222, 105, 135)' : 'rgb(140, 189, 76)';
    return {
      style: { backgroundColor }
    };
  };

  return (
    <div className="app-container" style={{ padding: '20px' }}>
      <h1>Event Tracker Calendar</h1>

      <div className="filter-buttons" style={{ marginBottom: '15px' }}>
        <button className="btn" onClick={() => setFilter('all')}>All</button>
        <button className="btn" onClick={() => setFilter('past')}>Past</button>
        <button className="btn" onClick={() => setFilter('upcoming')}>Upcoming</button>
      </div>

      <div style={{ height: '500px' }}>
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
        />
      </div>

      <Popup open={isCreateOpen} onClose={() => setIsCreateOpen(false)} modal>
        {(close) => (
          <div className="modal" style={{ padding: '20px', background: '#fff' }}>
            <h3>Create Event</h3>
            <div>
              <input 
                type="text" 
                placeholder="Event Title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>
            <div>
              <input 
                type="text" 
                placeholder="Event Location" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
              />
            </div>
            <div className="mm-popup__box__footer__right-space" style={{ marginTop: '10px' }}>
              <button className="mm-popup__btn" onClick={handleCreateEvent}>Save</button>
              <button className="mm-popup__btn" onClick={close} style={{ marginLeft: '10px' }}>Cancel</button>
            </div>
          </div>
        )}
      </Popup>

      <Popup open={isEditOpen} onClose={() => setIsEditOpen(false)} modal>
        {(close) => (
          <div className="modal" style={{ padding: '20px', background: '#fff' }}>
            <h3>Edit / Delete Event</h3>
            <div>
              <input 
                type="text" 
                placeholder="Event Title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>
            <div>
              <input 
                type="text" 
                placeholder="Event Location" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
              />
            </div>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button className="mm-popup__btn mm-popup__btn--info" onClick={handleUpdateEvent}>Save</button>
              <button className="mm-popup__btn mm-popup__btn--danger" onClick={handleDeleteEvent}>Delete</button>
              <button className="mm-popup__btn" onClick={close}>Cancel</button>
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default App;
