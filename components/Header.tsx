import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Notification, View, Member, Proposal, Investment, BusinessListing, Event, SearchResult, SearchResultType } from '../types';
import { MEMBERS } from '../constants';


interface HeaderProps {
  currentUser: Member;
  toggleSidebar: () => void;
  notifications: Notification[];
  onMarkViewed: () => void;
  setCurrentView: (view: View) => void;
  onLogout: () => void;
  // Props for Global Search
  members: Member[];
  proposals: Proposal[];
  investments: Investment[];
  businessListings: BusinessListing[];
  events: Event[];
}

const Header: React.FC<HeaderProps> = ({ 
    currentUser, toggleSidebar, notifications, onMarkViewed, setCurrentView, onLogout,
    members, proposals, investments, businessListings, events 
}) => {
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const notificationDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(n => !n.viewed).length;

  useEffect(() => {
    if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
    }

    const handler = setTimeout(() => {
        const query = searchQuery.toLowerCase();
        const newResults: SearchResult[] = [];

        // Search Members
        members.filter(m => m.name.toLowerCase().includes(query))
            .forEach(m => newResults.push({ id: m.id, title: m.name, subtitle: m.role, type: SearchResultType.MEMBER, view: View.DIRECTORY }));

        // Search Proposals
        proposals.filter(p => p.title.toLowerCase().includes(query))
            .forEach(p => newResults.push({ id: p.id, title: p.title, subtitle: `Status: ${p.status}`, type: SearchResultType.PROPOSAL, view: View.PROPOSALS }));

        // Search Investments
        investments.filter(i => i.asset.toLowerCase().includes(query) || i.ticker.toLowerCase().includes(query))
            .forEach(i => newResults.push({ id: i.id, title: `${i.asset} (${i.ticker})`, subtitle: `Value: $${i.currentValue.toLocaleString()}`, type: SearchResultType.INVESTMENT, view: View.INVESTMENTS }));
        
        // Search Business Listings
        businessListings.filter(b => b.name.toLowerCase().includes(query))
            .forEach(b => newResults.push({ id: b.id, title: b.name, subtitle: `Owner: ${MEMBERS.find(m => m.id === b.ownerId)?.name || 'Unknown'}`, type: SearchResultType.BUSINESS, view: View.MARKETPLACE }));
            
        // Search Events
        events.filter(e => e.title.toLowerCase().includes(query))
            .forEach(e => newResults.push({ id: e.id, title: e.title, subtitle: `Date: ${e.date}`, type: SearchResultType.EVENT, view: View.EVENTS }));

        setSearchResults(newResults);
    }, 300); // 300ms debounce

    return () => clearTimeout(handler);
  }, [searchQuery, members, proposals, investments, businessListings, events]);

  const groupedResults = useMemo(() => {
    return searchResults.reduce((acc, result) => {
        (acc[result.type] = acc[result.type] || []).push(result);
        return acc;
    }, {} as Record<SearchResultType, SearchResult[]>);
  }, [searchResults]);

  const handleToggleNotificationDropdown = () => {
    setIsNotificationDropdownOpen(prev => !prev);
    if (!isNotificationDropdownOpen && unreadCount > 0) {
      onMarkViewed();
    }
  };

  const handleViewAllNotifications = () => {
    setIsNotificationDropdownOpen(false);
    setCurrentView(View.NOTIFICATIONS);
  };
  
  const handleViewProfile = () => {
    setIsUserDropdownOpen(false);
    setCurrentView(View.PROFILE);
  };

  const handleResultClick = (result: SearchResult) => {
    setCurrentView(result.view);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setIsNotificationDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center sticky top-0 z-20 gap-4">
      {/* Mobile Menu Button & App Title */}
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="text-gray-400 hover:text-white md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
        </button>
        <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-white">Investment Club</h1>
        </div>
      </div>

       {/* Global Search Bar */}
      <div className="relative flex-1 max-w-lg" ref={searchRef}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
        </div>
        <input 
            type="text"
            placeholder="Search for members, proposals, investments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full bg-gray-700 text-white rounded-md py-2 pl-10 pr-4 border border-transparent focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
        {isSearchFocused && searchQuery && (
            <div className="absolute mt-2 w-full bg-gray-700 rounded-lg shadow-xl z-30 max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                    Object.entries(groupedResults).map(([type, results]) => (
                        <div key={type}>
                            <h4 className="text-xs uppercase font-bold text-gray-400 p-3 border-b border-gray-600">{type}</h4>
                            <ul>
                                {results.map(result => (
                                    <li key={`${result.type}-${result.id}`}>
                                        <button onClick={() => handleResultClick(result)} className="w-full text-left p-3 hover:bg-gray-600 transition">
                                            <p className="font-semibold text-white">{result.title}</p>
                                            <p className="text-sm text-gray-300">{result.subtitle}</p>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <div className="p-4 text-center text-gray-400">No results found for "{searchQuery}"</div>
                )}
            </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* Notification Dropdown */}
        <div className="relative" ref={notificationDropdownRef}>
            <button onClick={handleToggleNotificationDropdown} className="text-gray-400 hover:text-white relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 justify-center items-center text-xs text-white">{unreadCount}</span>
                    </span>
                )}
            </button>
            {isNotificationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-700 rounded-lg shadow-xl z-20">
                    <div className="p-4 border-b border-gray-600"><h4 className="font-semibold text-white">Notifications</h4></div>
                    <div className="max-h-64 overflow-y-auto">
                        {notifications.slice(0, 5).map(n => (
                            <div key={n.id} className="p-4 border-b border-gray-600 hover:bg-gray-600"><p className="text-sm text-gray-200">{n.message}</p><p className="text-xs text-gray-400 mt-1">{n.timestamp}</p></div>
                        ))}
                    </div>
                    <div className="p-2"><button onClick={handleViewAllNotifications} className="w-full text-center text-sm text-indigo-400 hover:text-indigo-300 font-medium py-2 rounded-md">View All Notifications</button></div>
                </div>
            )}
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={userDropdownRef}>
            <button onClick={() => setIsUserDropdownOpen(prev => !prev)} className="flex items-center space-x-2">
                <span className="text-white font-medium hidden sm:block">{currentUser?.name}</span>
                <img src={currentUser?.avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-indigo-500" />
            </button>
            {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-xl z-20">
                    <button onClick={handleViewProfile} className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">Profile</button>
                    <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">Logout</button>
                </div>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;