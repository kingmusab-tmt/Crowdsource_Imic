import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Investments from './components/Investments';
import Proposals from './components/Proposals';
import Contributions from './components/Contributions';
import Marketplace from './components/Marketplace';
import Events from './components/Events';
import Directory from './components/Directory';
import NotificationsPage from './components/NotificationsPage';
import ProfilePage from './components/ProfilePage';
import Assistance from './components/Assistance';
import Admin from './components/Admin';
import Deposit from './components/Deposit';
import Withdrawal from './components/Withdrawal';
import Transactions from './components/Transactions';
import LoginPage from './components/LoginPage';
import { View, Member, Role, Proposal, ProposalStatus, Investment, Notification, NotificationType, Event, EventStatus, BusinessListing, BusinessStatus, FinancialAssistanceRequest, AssistanceRequestStatus, CommentableItemType, Comment, Transaction, TransactionType, TransactionStatus, WithdrawalRequest, WithdrawalStatus, Announcement, AnnouncementType, ContributionGoal } from './types';
import { MEMBERS, PROPOSALS as initialProposals, INVESTMENTS as initialInvestments, NOTIFICATIONS as initialNotifications, EVENTS as initialEvents, BUSINESS_LISTINGS as initialBusinessListings, FINANCIAL_ASSISTANCE_REQUESTS as initialAssistanceRequests, TRANSACTIONS as initialTransactions, INITIAL_WITHDRAWAL_REQUESTS, INITIAL_ANNOUNCEMENTS, CONTRIBUTION_GOAL } from './constants';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<Member | null>(null);
    const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- State Management ---
    const [members, setMembers] = useState<Member[]>(MEMBERS);
    const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
    const [investments, setInvestments] = useState<Investment[]>(initialInvestments);
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [events, setEvents] = useState<Event[]>(initialEvents);
    const [businessListings, setBusinessListings] = useState<BusinessListing[]>(initialBusinessListings);
    const [assistanceRequests, setAssistanceRequests] = useState<FinancialAssistanceRequest[]>(initialAssistanceRequests);
    const [isReminderSet, setIsReminderSet] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>(INITIAL_WITHDRAWAL_REQUESTS);
    const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
    const [contributionGoal, setContributionGoal] = useState<ContributionGoal>(CONTRIBUTION_GOAL);


    // --- Login/Logout ---
    useEffect(() => {
        // Simulate checking for a logged-in user
        const loggedInUser = members.find(m => m.id === 1); // Default to Admin User
        if (loggedInUser) {
            setCurrentUser(loggedInUser);
            setIsAuthenticated(true);
        }
    }, [members]);

    const handleLogin = () => {
        const user = members.find(m => m.id === 1); // Simulate login as Admin User
        if (user) {
            setCurrentUser(user);
            setIsAuthenticated(true);
            setCurrentView(View.DASHBOARD);
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setIsAuthenticated(false);
    };
    
    // --- Handlers for Data Mutation ---
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
            comments: []
        };
        setProposals(prev => [newProposal, ...prev]);
    };

    const handleUpdateProposal = (updatedProposal: Proposal) => {
        setProposals(prev => prev.map(p => p.id === updatedProposal.id ? updatedProposal : p));
    };
    const handleDeleteProposal = (proposalId: number) => {
        setProposals(prev => prev.filter(p => p.id !== proposalId));
    };
    
    const handleUpdateProposalStatus = (proposalId: number, newStatus: ProposalStatus) => {
        setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: newStatus } : p));
    };

    const handleAddInvestment = (investment: Omit<Investment, 'id'>) => {
        const newInvestment: Investment = {
            id: investments.length + 1,
            ...investment
        };
        setInvestments(prev => [...prev, newInvestment]);
    };
    
    const handleAddBusiness = (newListingData: Omit<BusinessListing, 'id' | 'ownerId' | 'status' | 'comments'>) => {
        if (!currentUser) return;
        const newListing: BusinessListing = {
            id: businessListings.length + 1,
            ownerId: currentUser.id,
            status: BusinessStatus.PENDING,
            comments: [],
            ...newListingData,
        };
        setBusinessListings(prev => [newListing, ...prev]);
        // Also create a notification for admin
        setNotifications(prev => [{ id: prev.length + 1, message: `New business listing "${newListing.name}" submitted for approval.`, timestamp: 'Just now', read: false, viewed: false, type: NotificationType.GENERAL }, ...prev]);
    };
    const handleUpdateBusinessListing = (updatedListing: BusinessListing) => {
        setBusinessListings(prev => prev.map(l => l.id === updatedListing.id ? updatedListing : l));
    };
    const handleDeleteBusinessListing = (listingId: number) => {
        setBusinessListings(prev => prev.filter(l => l.id !== listingId));
    };
    
    const handleEventSubmit = (newEventData: Omit<Event, 'id' | 'status' | 'submittedBy' | 'comments'>) => {
        if (!currentUser) return;
        const newEvent: Event = {
            id: events.length + 1,
            submittedBy: currentUser.id,
            status: EventStatus.PENDING,
            comments: [],
            ...newEventData
        };
        setEvents(prev => [newEvent, ...prev]);
         setNotifications(prev => [{ id: prev.length + 1, message: `New event "${newEvent.title}" submitted for approval.`, timestamp: 'Just now', read: false, viewed: false, type: NotificationType.EVENT }, ...prev]);
    };
    const handleUpdateEvent = (updatedEvent: Event) => {
        setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    };
    const handleDeleteEvent = (eventId: number) => {
        setEvents(prev => prev.filter(e => e.id !== eventId));
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
            comments: []
        };
        setAssistanceRequests(prev => [newRequest, ...prev]);
    };
    
    const handleAddWithdrawalRequest = (newRequestData: Omit<WithdrawalRequest, 'id' | 'status' | 'date' | 'memberId'>) => {
        if (!currentUser) return;
        const newRequest: WithdrawalRequest = {
            id: withdrawalRequests.length > 0 ? Math.max(...withdrawalRequests.map(r => r.id)) + 1 : 1,
            memberId: currentUser.id,
            date: new Date().toISOString().split('T')[0],
            status: WithdrawalStatus.PENDING,
            ...newRequestData,
        };
        setWithdrawalRequests(prev => [newRequest, ...prev]);
    };

    const handleAddTransaction = (newTransactionData: Omit<Transaction, 'id'>) => {
        const newTransaction: Transaction = {
            id: transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1,
            ...newTransactionData,
        };
        setTransactions(prev => [newTransaction, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };

    const handleAssistanceVote = (requestId: number, vote: 'for' | 'against') => {
        if (!currentUser) return;
        setAssistanceRequests(prevRequests => 
            prevRequests.map(r => {
                if (r.id === requestId && !r.votedIds.includes(currentUser.id)) {
                    return {
                        ...r,
                        votesFor: vote === 'for' ? r.votesFor + 1 : r.votesFor,
                        votesAgainst: vote === 'against' ? r.votesAgainst + 1 : r.votesAgainst,
                        votedIds: [...r.votedIds, currentUser.id]
                    };
                }
                return r;
            })
        );
    };

    const handleUpdateUser = (updatedUser: Member) => {
        setCurrentUser(updatedUser);
        setMembers(prev => prev.map(m => m.id === updatedUser.id ? updatedUser : m));
    };
    
    const handleUpdateRequestStatus = (id: number, type: 'withdrawal' | 'assistance', newStatus: WithdrawalStatus | AssistanceRequestStatus) => {
        if (type === 'withdrawal') {
            const request = withdrawalRequests.find(r => r.id === id);
            if (!request || !request.memberId) return;

            setWithdrawalRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus as WithdrawalStatus } : r));
            
            if (newStatus === WithdrawalStatus.COMPLETED) {
                handleAddTransaction({
                    memberId: request.memberId,
                    description: `Withdrawal to ${request.bankName} (...${request.accountNumber})`,
                    type: TransactionType.WITHDRAWAL,
                    status: TransactionStatus.COMPLETED,
                    date: new Date().toISOString().split('T')[0],
                    amount: -request.amount
                });
                // Update member's profit balances
                setMembers(prevMembers => prevMembers.map(member => {
                    if (member.id === request.memberId) {
                        return {
                            ...member,
                            availableProfit: member.availableProfit - request.amount,
                            withdrawnProfit: member.withdrawnProfit + request.amount,
                        };
                    }
                    return member;
                }));
            }
        } else if (type === 'assistance') {
            const request = assistanceRequests.find(r => r.id === id);
            if (!request) return;

            setAssistanceRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus as AssistanceRequestStatus } : r));

            if (newStatus === AssistanceRequestStatus.APPROVED) {
                 handleAddTransaction({
                    memberId: request.requesterId,
                    description: `Financial Assistance Payout`,
                    type: TransactionType.EXPENSE,
                    status: TransactionStatus.COMPLETED,
                    date: new Date().toISOString().split('T')[0],
                    amount: -request.amount
                });
            }
        }
    };

    const handleDistributeProfits = () => {
        const totalProfit = investments.reduce((acc, inv) => acc + (inv.currentValue - inv.amountInvested), 0);
        const totalWithdrawn = members.reduce((acc, mem) => acc + mem.withdrawnProfit, 0);
        const totalAssistance = assistanceRequests
            .filter(r => r.status === AssistanceRequestStatus.APPROVED)
            .reduce((acc, req) => acc + req.amount, 0);

        const distributableProfit = totalProfit - totalWithdrawn - totalAssistance;

        if (distributableProfit <= 0) {
            alert("No distributable profits available at this time.");
            return;
        }

        const sharePerMember = distributableProfit / members.length;
        
        setMembers(prevMembers => prevMembers.map(member => ({
            ...member,
            availableProfit: member.availableProfit + sharePerMember
        })));

        // Create a notification for all members
        const message = `A profit of $${distributableProfit.toFixed(2)} has been distributed. $${sharePerMember.toFixed(2)} has been allocated to your account.`;
        setNotifications(prev => [{ id: prev.length + 1, message, timestamp: 'Just now', read: false, viewed: false, type: NotificationType.GENERAL }, ...prev]);
    };

    const handleAddAnnouncement = (message: string, type: AnnouncementType) => {
        const newAnnouncement: Announcement = {
            id: announcements.length > 0 ? Math.max(...announcements.map(a => a.id)) + 1 : 1,
            message,
            type,
            timestamp: new Date().toLocaleString(),
        };
        setAnnouncements(prev => [newAnnouncement, ...prev]);
    };

    const handleDeleteAnnouncement = (announcementId: number) => {
        setAnnouncements(prev => prev.filter(a => a.id !== announcementId));
    };

    const onAddComment = useCallback((itemId: number, itemType: CommentableItemType, content: string) => {
        if (!currentUser) return;
        
        const newComment: Comment = {
            id: Date.now(), // simple unique id
            authorId: currentUser.id,
            content,
            timestamp: 'Just now'
        };

        const updateComments = (items: any[]) => {
            return items.map(item => {
                if (item.id === itemId) {
                    return { ...item, comments: [...item.comments, newComment] };
                }
                return item;
            });
        };

        switch (itemType) {
            case CommentableItemType.PROPOSAL:
                setProposals(updateComments);
                break;
            case CommentableItemType.BUSINESS_LISTING:
                setBusinessListings(updateComments);
                break;
            case CommentableItemType.EVENT:
                setEvents(updateComments);
                break;
            case CommentableItemType.ASSISTANCE_REQUEST:
                setAssistanceRequests(updateComments);
                break;
        }
    }, [currentUser]);
    
    const handleDeleteComment = (commentId: number, itemId: number, itemType: CommentableItemType) => {
        const updateComments = (items: any[]) => {
            return items.map(item => {
                if (item.id === itemId) {
                    return { ...item, comments: item.comments.filter((c: Comment) => c.id !== commentId) };
                }
                return item;
            });
        };

        switch (itemType) {
            case CommentableItemType.PROPOSAL:
                setProposals(updateComments);
                break;
            case CommentableItemType.BUSINESS_LISTING:
                setBusinessListings(updateComments);
                break;
            case CommentableItemType.EVENT:
                setEvents(updateComments);
                break;
            case CommentableItemType.ASSISTANCE_REQUEST:
                setAssistanceRequests(updateComments);
                break;
        }
    };

    const renderView = () => {
        if (!currentUser) return null;
        switch (currentView) {
            case View.DASHBOARD:
                return <Dashboard currentUser={currentUser} investments={investments} isReminderSet={isReminderSet} announcements={announcements} contributionGoal={contributionGoal} transactions={transactions} members={members} />;
            case View.INVESTMENTS:
                return <Investments investments={investments} onAddInvestment={handleAddInvestment} />;
            case View.PROPOSALS:
                return <Proposals currentUser={currentUser} proposals={proposals} setProposals={setProposals} onAddProposal={handleAddProposal} onUpdateProposal={handleUpdateProposal} onDeleteProposal={handleDeleteProposal} onUpdateProposalStatus={handleUpdateProposalStatus} onAddComment={onAddComment} onDeleteComment={handleDeleteComment} />;
            case View.DEPOSIT:
                return <Deposit />;
            case View.WITHDRAWAL:
                return <Withdrawal currentUser={currentUser} withdrawalRequests={withdrawalRequests} onAddWithdrawalRequest={handleAddWithdrawalRequest} />;
            case View.TRANSACTIONS:
                return <Transactions transactions={transactions} currentUser={currentUser} />;
            case View.ASSISTANCE:
                return <Assistance currentUser={currentUser} requests={assistanceRequests} onAddRequest={handleAddAssistanceRequest} onVote={handleAssistanceVote} onAddComment={onAddComment} onDeleteComment={handleDeleteComment} />;
            case View.MARKETPLACE:
                return <Marketplace businessListings={businessListings} onAddBusiness={handleAddBusiness} currentUser={currentUser} onAddComment={onAddComment} onUpdateBusinessListing={handleUpdateBusinessListing} onDeleteBusinessListing={handleDeleteBusinessListing} onDeleteComment={handleDeleteComment} />;
            case View.EVENTS:
                return <Events events={events} onEventSubmit={handleEventSubmit} currentUser={currentUser} onAddComment={onAddComment} onUpdateEvent={handleUpdateEvent} onDeleteEvent={handleDeleteEvent} onDeleteComment={handleDeleteComment}/>;
            case View.DIRECTORY:
                return <Directory members={members} />;
            case View.NOTIFICATIONS:
                return <NotificationsPage notifications={notifications} setNotifications={setNotifications} />;
            case View.PROFILE:
                return <ProfilePage currentUser={currentUser} onUpdateUser={handleUpdateUser} />;
            case View.ADMIN:
                return currentUser.role === Role.ADMIN ? <Admin 
                    setCurrentView={setCurrentView} 
                    businessListings={businessListings} 
                    setBusinessListings={setBusinessListings} 
                    members={members}
                    investments={investments}
                    transactions={transactions}
                    onAddTransaction={handleAddTransaction}
                    assistanceRequests={assistanceRequests}
                    withdrawalRequests={withdrawalRequests}
                    onUpdateRequestStatus={handleUpdateRequestStatus}
                    onDistributeProfits={handleDistributeProfits}
                    announcements={announcements}
                    onAddAnnouncement={handleAddAnnouncement}
                    onDeleteAnnouncement={handleDeleteAnnouncement}
                /> : <div>Access Denied</div>;
            default:
                return <Dashboard currentUser={currentUser} investments={investments} isReminderSet={isReminderSet} announcements={announcements} contributionGoal={contributionGoal} transactions={transactions} members={members} />;
        }
    };
    
    if (!isAuthenticated || !currentUser) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100">
            <Sidebar
                currentUser={currentUser}
                currentView={currentView}
                setCurrentView={setCurrentView}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                onLogout={handleLogout}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    currentUser={currentUser}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    notifications={notifications}
                    onMarkViewed={() => setNotifications(notifications.map(n => ({...n, viewed: true})))}
                    setCurrentView={setCurrentView}
                    onLogout={handleLogout}
                    // For global search
                    members={members}
                    proposals={proposals}
                    investments={investments}
                    businessListings={businessListings}
                    events={events}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6 md:p-8">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

export default App;
