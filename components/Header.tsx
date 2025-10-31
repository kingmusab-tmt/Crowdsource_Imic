import React, { useState, useEffect, useRef } from 'react';
import { MEMBERS } from '../constants';
import { Notification, View } from '../types';

interface HeaderProps {
  toggleSidebar: () => void;
  notifications: Notification[];
  onMarkViewed: () => void;
  setCurrentView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, notifications, onMarkViewed, setCurrentView }) => {
  const currentUser = MEMBERS.find(m => m.id === 1); // Assuming current user is Admin
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(n => !n.viewed).length;

  const handleToggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
    if (!isDropdownOpen && unreadCount > 0) {
      onMarkViewed();
    }
  };

  const handleViewAll = () => {
    setIsDropdownOpen(false);
    setCurrentView(View.NOTIFICATIONS);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center sticky top-0 z-20">
      <button onClick={toggleSidebar} className="text-gray-400 hover:text-white md:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      <div className="hidden md:block">
        <h1 className="text-xl font-semibold text-white">Investment Club Dashboard</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative" ref={dropdownRef}>
            <button onClick={handleToggleDropdown} className="text-gray-400 hover:text-white relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 justify-center items-center text-xs text-white">{unreadCount}</span>
                    </span>
                )}
            </button>
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-700 rounded-lg shadow-xl z-20">
                    <div className="p-4 border-b border-gray-600">
                        <h4 className="font-semibold text-white">Notifications</h4>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {notifications.slice(0, 5).map(n => (
                            <div key={n.id} className="p-4 border-b border-gray-600 hover:bg-gray-600">
                                <p className="text-sm text-gray-200">{n.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{n.timestamp}</p>
                            </div>
                        ))}
                    </div>
                    <div className="p-2">
                        <button onClick={handleViewAll} className="w-full text-center text-sm text-indigo-400 hover:text-indigo-300 font-medium py-2 rounded-md">
                            View All Notifications
                        </button>
                    </div>
                </div>
            )}
        </div>

        <span className="text-white font-medium hidden sm:block">{currentUser?.name}</span>
        <img src={currentUser?.avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-indigo-500" />
      </div>
    </header>
  );
};

export default Header;