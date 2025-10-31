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
import { View, Proposal, BusinessListing, ProposalStatus, Event, EventStatus, Notification, NotificationType, FinancialAssistanceRequest, AssistanceRequestStatus, Investment } from './types';
import { 
    PROPOSALS as initialProposals, 
    BUSINESS_LISTINGS as initialBusinessListings, 
    EVENTS as initialEvents,
    NOTIFICATIONS as initialNotifications,
    ASSISTANCE_REQUESTS as initialAssistanceRequests,
    INVESTMENTS as initialInvestments,
    MEMBERS,
} from './constants';

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
    const [businessListings, setBusinessListings] = useState<BusinessListing[]>(initialBusinessListings);
    const [events, setEvents] = useState<Event[]>(initialEvents);
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [assistanceRequests, setAssistanceRequests] = useState<FinancialAssistanceRequest[]>(initialAssistanceRequests);
    const [investments, setInvestments] = useState<Investment[]>(initialInvestments);
    const [isReminderSet, setIsReminderSet] = useState(false);

    const handleAddProposal = (title: string, description: string) => {
        const newProposal: Proposal = {
            id: proposals.length + 1,
            title,
            description,
            proposedBy: 1, // Logged in user
            status: ProposalStatus.OPEN,
            votesFor: 0,
            votesAgainst: 0,
            votedIds: [],
        };
        setProposals(prev => [newProposal, ...prev]);
    };

    const handleAddAssistanceRequest = (amount: number, purpose: string) => {
        const newRequest: FinancialAssistanceRequest = {
            id: assistanceRequests.length + 1,
            requesterId: 1, // Logged in user
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
        setAssistanceRequests(prevRequests =>
            prevRequests.map(req => {
                if (req.id === requestId && !req.votedIds.includes(1)) { // Assuming user ID is 1
                    return {
                        ...req,
                        votesFor: vote === 'for' ? req.votesFor + 1 : req.votesFor,
                        votesAgainst: vote === 'against' ? req.votesAgainst + 1 : req.votesAgainst,
                        votedIds: [...req.votedIds, 1],
                    };
                }
                return req;
            })
        );
    };

    const handleEventSubmit = (newEventData: Omit<Event, 'id' | 'status' | 'submittedBy'>) => {
        const newEvent: Event = {
            ...newEventData,
            id: events.length + 1,
            status: EventStatus.PENDING,
            submittedBy: 1, // Assume current user
        };
        setEvents(prev => [...prev, newEvent]);
    };

    const handleEventApproval = (eventId: number, status: EventStatus) => {
        setEvents(prevEvents => prevEvents.map(event => {
            if (event.id === eventId) {
                if (status === EventStatus.APPROVED) {
                    const submitterName = MEMBERS.find(m => m.id === event.submittedBy)?.name || 'A member';
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

    const renderView = () => {
        switch (currentView) {
            case View.DASHBOARD:
                return <Dashboard isReminderSet={isReminderSet} setIsReminderSet={setIsReminderSet} />;
            case View.INVESTMENTS:
                return <Investments investments={investments} />;
            case View.PROPOSALS:
                return <Proposals proposals={proposals} setProposals={setProposals} onAddProposal={handleAddProposal} />;
            case View.ASSISTANCE:
                return <Assistance requests={assistanceRequests} onAddRequest={handleAddAssistanceRequest} onVote={handleVoteOnAssistanceRequest} />;
            case View.MARKETPLACE:
                return <Marketplace businessListings={businessListings} setBusinessListings={setBusinessListings} />;
            case View.EVENTS:
                return <Events events={events} onEventSubmit={handleEventSubmit} />;
            case View.NOTIFICATIONS:
                return <NotificationsPage notifications={notifications} setNotifications={setNotifications} />;
            case View.DEPOSIT:
                return <Deposit />;
            case View.WITHDRAWAL:
                return <Withdrawal />;
            case View.TRANSACTIONS:
                return <Transactions />;
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
                return <Dashboard isReminderSet={isReminderSet} setIsReminderSet={setIsReminderSet} />;
        }
    };

    return (
        <div className="bg-gray-900 text-gray-100 min-h-screen flex">
            <Sidebar currentView={currentView} setCurrentView={setCurrentView} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col transition-all duration-300">
                <Header 
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    notifications={notifications}
                    onMarkViewed={handleMarkNotificationsViewed}
                    setCurrentView={setCurrentView}
                />
                <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

export default App;