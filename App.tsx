import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Investments from './components/Investments';
import Proposals from './components/Proposals';
import Marketplace from './components/Marketplace';
import Events from './components/Events';
import Admin from './components/Admin';
import NotificationsPage from './components/NotificationsPage';
import Assistance from './components/Assistance';
import Deposit from './components/Deposit';
import Withdrawal from './components/Withdrawal';
import Transactions from './components/Transactions';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import { View, Proposal, BusinessListing, ProposalStatus, Event, EventStatus, Notification, NotificationType, FinancialAssistanceRequest, AssistanceRequestStatus, Investment, Member, BusinessStatus } from './types';
import { 
    PROPOSALS as initialProposals, 
    BUSINESS_LISTINGS as initialBusinessListings, 
    EVENTS as initialEvents,
    NOTIFICATIONS as initialNotifications,
    ASSISTANCE_REQUESTS as initialAssistanceRequests,
    INVESTMENTS as initialInvestments,
    MEMBERS as initialMembers,
} from './constants';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<Member | null>(null);
    const [members, setMembers] = useState<Member[]>(initialMembers);
    const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
    const [businessListings, setBusinessListings] = useState<BusinessListing[]>(initialBusinessListings);
    const [events, setEvents] = useState<Event[]>(initialEvents);
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [assistanceRequests, setAssistanceRequests] = useState<FinancialAssistanceRequest[]>(initialAssistanceRequests);
    const [investments, setInvestments] = useState<Investment[]>(initialInvestments);
    const [isReminderSet, setIsReminderSet] = useState(false);

    const handleLogin = () => {
        // Simulate logging in the first user (admin)
        setCurrentUser(members[0]);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setCurrentView(View.DASHBOARD); // Reset view on logout
    };

    const handleUpdateUser = (updatedUser: Member) => {
        setMembers(prev => prev.map(m => m.id === updatedUser.id ? updatedUser : m));
        setCurrentUser(updatedUser);
    };

    const handleAddProposal = (title: string, description: string) => {
        if (!currentUser) return;
        const newProposal: Proposal = {
            id: proposals.length + 1,
            title,
            description,
            proposedBy: currentUser.id,
            status: ProposalStatus.OPEN,
            votesFor: 0,
            votesAgainst: 0,
            votedIds: [],
        };
        setProposals(prev => [newProposal, ...prev]);
    };
    
    const handleAddBusiness = (newListing: Omit<BusinessListing, 'id' | 'ownerId' | 'status'>) => {
        if(!currentUser) return;
        const newBusiness: BusinessListing = {
            id: Date.now(),
            ...newListing,
            ownerId: currentUser.id,
            status: BusinessStatus.PENDING,
        };
        setBusinessListings(prev => [...prev, newBusiness]);
    };

    const handleAddAssistanceRequest = (amount: number, purpose: string) => {
        if (!currentUser) return;
        const newRequest: FinancialAssistanceRequest = {
            id: assistanceRequests.length + 1,
            requesterId: currentUser.id,
            amount,
            purpose,
            status: AssistanceRequestStatus.PENDING,
            votesFor: 0,
            votesAgainst: 0,
            votedIds: [],
            requestDate: new Date().toISOString().split('T')[0],
        };
        setAssistanceRequests(prev => [newRequest, ...prev]);
    };

    const handleVoteOnAssistanceRequest = (requestId: number, vote: 'for' | 'against') => {
        if (!currentUser) return;
        setAssistanceRequests(prevRequests =>
            prevRequests.map(req => {
                if (req.id === requestId && !req.votedIds.includes(currentUser.id)) {
                    return {
                        ...req,
                        votesFor: vote === 'for' ? req.votesFor + 1 : req.votesFor,
                        votesAgainst: vote === 'against' ? req.votesAgainst + 1 : req.votesAgainst,
                        votedIds: [...req.votedIds, currentUser.id],
                    };
                }
                return req;
            })
        );
    };

    const handleEventSubmit = (newEventData: Omit<Event, 'id' | 'status' | 'submittedBy'>) => {
        if (!currentUser) return;
        const newEvent: Event = {
            ...newEventData,
            id: events.length + 1,
            status: EventStatus.PENDING,
            submittedBy: currentUser.id,
        };
        setEvents(prev => [...prev, newEvent]);
    };

    const handleEventApproval = (eventId: number, status: EventStatus) => {
        setEvents(prevEvents => prevEvents.map(event => {
            if (event.id === eventId) {
                if (status === EventStatus.APPROVED) {
                    const submitterName = members.find(m => m.id === event.submittedBy)?.name || 'A member';
                    const newNotification: Notification = {
                        id: notifications.length + 1,
                        message: `${submitterName} just posted a new event: "${event.title}". Check it out!`,
                        timestamp: new Date().toLocaleDateString(),
                        read: false,
                        viewed: false,
                        type: NotificationType.EVENT,
                    };
                    setNotifications(prev => [newNotification, ...prev]);
                }
                return { ...event, status };
            }
            return event;
        }));
    };

    const handleUpdateInvestment = (updatedInvestment: Investment) => {
        setInvestments(prevInvestments =>
            prevInvestments.map(inv =>
                inv.id === updatedInvestment.id ? updatedInvestment : inv
            )
        );
    };

    const handleMarkNotificationsViewed = () => {
        setNotifications(prev => prev.map(n => ({ ...n, viewed: true })));
    };

    if (!currentUser) {
        return <LoginPage onLogin={handleLogin} />;
    }

    const renderView = () => {
        switch (currentView) {
            case View.DASHBOARD:
                return <Dashboard currentUser={currentUser} isReminderSet={isReminderSet} setIsReminderSet={setIsReminderSet} />;
            case View.INVESTMENTS:
                return <Investments investments={investments} />;
            case View.PROPOSALS:
                return <Proposals currentUser={currentUser} proposals={proposals} setProposals={setProposals} onAddProposal={handleAddProposal} />;
            case View.ASSISTANCE:
                return <Assistance currentUser={currentUser} requests={assistanceRequests} onAddRequest={handleAddAssistanceRequest} onVote={handleVoteOnAssistanceRequest} />;
            case View.MARKETPLACE:
                return <Marketplace onAddBusiness={handleAddBusiness} businessListings={businessListings} />;
            case View.EVENTS:
                return <Events events={events} onEventSubmit={handleEventSubmit} />;
            case View.NOTIFICATIONS:
                return <NotificationsPage notifications={notifications} setNotifications={setNotifications} />;
            case View.DEPOSIT:
                return <Deposit />;
            case View.WITHDRAWAL:
                return <Withdrawal currentUser={currentUser} />;
            case View.TRANSACTIONS:
                return <Transactions />;
            case View.PROFILE:
                 return <ProfilePage currentUser={currentUser} onUpdateUser={handleUpdateUser} />;
            case View.ADMIN:
                return (
                    <Admin 
                        businessListings={businessListings} 
                        setBusinessListings={setBusinessListings} 
                        events={events}
                        onEventApproval={handleEventApproval}
                        investments={investments}
                        onUpdateInvestment={handleUpdateInvestment}
                        setCurrentView={setCurrentView} 
                    />
                );
            default:
                return <Dashboard currentUser={currentUser} isReminderSet={isReminderSet} setIsReminderSet={setIsReminderSet} />;
        }
    };

    return (
        <div className="bg-gray-900 text-gray-100 min-h-screen flex">
            <Sidebar currentView={currentView} setCurrentView={setCurrentView} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} onLogout={handleLogout} />
            <div className="flex-1 flex flex-col transition-all duration-300">
                <Header 
                    currentUser={currentUser}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    notifications={notifications}
                    onMarkViewed={handleMarkNotificationsViewed}
                    setCurrentView={setCurrentView}
                    onLogout={handleLogout}
                />
                <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

export default App;