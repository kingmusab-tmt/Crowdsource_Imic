import React, { useState } from 'react';
import { Event, EventStatus, Member, CommentableItemType, Role } from '../types';
import Modal from './Modal';
import { Comments } from './Proposals';

interface EventsProps {
    events: Event[];
    onEventSubmit: (event: Omit<Event, 'id' | 'status' | 'submittedBy' | 'comments'>) => void;
    onUpdateEvent: (event: Event) => void;
    onDeleteEvent: (eventId: number) => void;
    currentUser: Member;
    onAddComment: (itemId: number, itemType: CommentableItemType, content: string) => void;
    onDeleteComment: (commentId: number, itemId: number, itemType: CommentableItemType) => void;
}

const EventCard: React.FC<{ 
    event: Event; 
    currentUser: Member; 
    onAddComment: (content: string) => void; 
    onDeleteComment: (commentId: number) => void;
    onUpdate: (event: Event) => void;
    onDelete: (eventId: number) => void;
}> = ({ event, currentUser, onAddComment, onDeleteComment, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        description: event.description,
        type: event.type
    });

    const handleUpdate = () => {
        onUpdate({ ...event, ...editData });
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            onDelete(event.id);
        }
    };
    
    return (
        <>
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 relative">
                 {currentUser.role === Role.ADMIN && (
                    <div className="absolute top-4 right-4 flex space-x-2">
                        <button onClick={() => setIsEditing(true)} className="p-1.5 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-full transition">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                        </button>
                        <button onClick={handleDelete} className="p-1.5 text-gray-400 hover:text-white bg-gray-700 hover:bg-red-500/50 rounded-full transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                )}
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
                <Comments
                    comments={event.comments}
                    onAddComment={onAddComment}
                    onDeleteComment={onDeleteComment}
                    currentUser={currentUser}
                />
            </div>
             <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
                <h3 className="text-lg font-bold text-white mb-4">Edit Event</h3>
                <div className="space-y-4">
                    <input type="text" value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})} className="w-full bg-gray-700 text-white rounded-md p-2" />
                    <input type="date" value={editData.date} onChange={e => setEditData({...editData, date: e.target.value})} className="w-full bg-gray-700 text-white rounded-md p-2" />
                    <input type="time" value={editData.time} onChange={e => setEditData({...editData, time: e.target.value})} className="w-full bg-gray-700 text-white rounded-md p-2" />
                    <input type="text" value={editData.location} onChange={e => setEditData({...editData, location: e.target.value})} className="w-full bg-gray-700 text-white rounded-md p-2" />
                    <textarea value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})} className="w-full bg-gray-700 text-white rounded-md p-2" />
                    <select value={editData.type} onChange={e => setEditData({...editData, type: e.target.value as 'In-Person' | 'Online'})} className="w-full bg-gray-700 text-white rounded-md p-2">
                        <option value="In-Person">In-Person</option>
                        <option value="Online">Online</option>
                    </select>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <button onClick={() => setIsEditing(false)} className="py-2 px-4 rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500 transition">Cancel</button>
                    <button onClick={handleUpdate} className="py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition">Save Changes</button>
                </div>
            </Modal>
        </>
    );
};

const Events: React.FC<EventsProps> = ({ events, onEventSubmit, onUpdateEvent, onDeleteEvent, currentUser, onAddComment, onDeleteComment }) => {
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

    const eventsToShow = currentUser.role === Role.ADMIN ? events : events.filter(e => e.status === EventStatus.APPROVED);

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
            {eventsToShow.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {eventsToShow.map(event => (
                    <EventCard 
                        key={event.id} 
                        event={event}
                        currentUser={currentUser}
                        onAddComment={(content) => onAddComment(event.id, CommentableItemType.EVENT, content)}
                        onDeleteComment={(commentId) => onDeleteComment(commentId, event.id, CommentableItemType.EVENT)}
                        onUpdate={onUpdateEvent}
                        onDelete={onDeleteEvent}
                     />
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