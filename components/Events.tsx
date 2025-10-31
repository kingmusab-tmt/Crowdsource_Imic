import React, { useState } from 'react';
import { Event, EventStatus } from '../types';
import Modal from './Modal';

interface EventsProps {
    events: Event[];
    onEventSubmit: (event: Omit<Event, 'id' | 'status' | 'submittedBy'>) => void;
}

const EventCard: React.FC<{ event: Event }> = ({ event }) => (
  <div className="bg-gray-800 rounded-lg shadow-lg p-6">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-semibold text-indigo-400">{event.date} @ {event.time}</p>
        <h3 className="text-xl font-bold text-white mt-1">{event.title}</h3>
      </div>
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${event.type === 'Online' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'}`}>
        {event.type}
      </span>
    </div>
    <p className="text-gray-400 mt-2">{event.location}</p>
    <p className="text-gray-300 mt-4">{event.description}</p>
  </div>
);

const Events: React.FC<EventsProps> = ({ events, onEventSubmit }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '', date: '', time: '', location: '', description: '', type: 'In-Person' as 'In-Person' | 'Online'
    });
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewEvent(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location || !newEvent.description) {
            alert('Please fill out all fields.');
            return;
        }
        onEventSubmit(newEvent);
        setIsModalOpen(false);
        setNewEvent({ title: '', date: '', time: '', location: '', description: '', type: 'In-Person' });
    };

    const approvedEvents = events.filter(e => e.status === EventStatus.APPROVED);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                    Submit New Event
                </button>
            </div>
            {approvedEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {approvedEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-800 rounded-lg">
                    <h3 className="text-xl font-semibold text-white">No Upcoming Events</h3>
                    <p className="text-gray-400 mt-2">Check back later or submit a new event!</p>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                 <h3 className="text-lg font-bold text-white mb-4">Submit a New Event</h3>
                 <div className="space-y-4">
                    <input type="text" name="title" placeholder="Event Title" value={newEvent.title} onChange={handleInputChange} className="w-full bg-gray-700 text-white rounded-md p-2" />
                    <input type="date" name="date" value={newEvent.date} onChange={handleInputChange} className="w-full bg-gray-700 text-white rounded-md p-2" />
                    <input type="time" name="time" value={newEvent.time} onChange={handleInputChange} className="w-full bg-gray-700 text-white rounded-md p-2" />
                    <input type="text" name="location" placeholder="Location or URL" value={newEvent.location} onChange={handleInputChange} className="w-full bg-gray-700 text-white rounded-md p-2" />
                    <textarea name="description" placeholder="Description" value={newEvent.description} onChange={handleInputChange} className="w-full bg-gray-700 text-white rounded-md p-2" />
                    <select name="type" value={newEvent.type} onChange={handleInputChange} className="w-full bg-gray-700 text-white rounded-md p-2">
                        <option value="In-Person">In-Person</option>
                        <option value="Online">Online</option>
                    </select>
                </div>
                 <div className="mt-6 flex justify-end space-x-4">
                     <button onClick={() => setIsModalOpen(false)} className="py-2 px-4 rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500 transition">Cancel</button>
                    <button onClick={handleSubmit} className="py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition">Submit for Review</button>
                </div>
            </Modal>
        </div>
    );
};

export default Events;