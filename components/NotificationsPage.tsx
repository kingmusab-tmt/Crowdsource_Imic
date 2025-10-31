import React, { useState } from 'react';
import { Notification, NotificationType } from '../types';
import Modal from './Modal';

interface NotificationsPageProps {
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const NotificationIcon: React.FC<{ type: NotificationType }> = ({ type }) => {
    let icon;
    let styles;
    switch (type) {
        case NotificationType.EVENT:
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
            styles = 'bg-green-500/20 text-green-400';
            break;
        case NotificationType.PROPOSAL:
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>;
            styles = 'bg-blue-500/20 text-blue-400';
            break;
        default:
            icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;
            styles = 'bg-yellow-500/20 text-yellow-400';
    }
    return <div className={`rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 ${styles}`}>{icon}</div>;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications, setNotifications }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

    const handleViewDetails = (notification: Notification) => {
        setNotifications(prev => 
            prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
        );
        setSelectedNotification(notification);
        setIsModalOpen(true);
    };

    const handleToggleReadStatus = (notificationId: number, e: React.MouseEvent) => {
        e.stopPropagation(); // prevent card click
        setNotifications(prev => 
            prev.map(n => n.id === notificationId ? { ...n, read: !n.read } : n)
        );
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6">Notifications</h2>
            <div className="space-y-4">
                {notifications.map(n => (
                    <div 
                        key={n.id} 
                        className={`p-4 rounded-lg flex items-start space-x-4 transition-colors duration-200 cursor-pointer ${
                            n.read ? 'bg-gray-900/50 hover:bg-gray-700/50' : 'bg-indigo-900/30 hover:bg-indigo-900/50 border-l-2 border-indigo-500'
                        }`}
                        onClick={() => handleViewDetails(n)}
                    >
                        <NotificationIcon type={n.type} />
                        <div className="flex-1">
                            <p className="text-gray-200">{n.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{n.timestamp}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                             <button 
                                onClick={(e) => handleToggleReadStatus(n.id, e)}
                                className={`text-xs font-semibold py-1 px-3 rounded-full transition ${
                                    n.read ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                }`}
                            >
                                {n.read ? 'Mark as Unread' : 'Mark as Read'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h3 className="text-lg font-bold text-white mb-4">Notification Details</h3>
                {selectedNotification && (
                    <div>
                        <p className="text-gray-300">{selectedNotification.message}</p>
                        <p className="text-xs text-gray-500 mt-4">Received: {selectedNotification.timestamp}</p>
                    </div>
                )}
                 <div className="mt-6 flex justify-end">
                    <button onClick={() => setIsModalOpen(false)} className="py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition">Close</button>
                </div>
            </Modal>
        </div>
    );
};

export default NotificationsPage;