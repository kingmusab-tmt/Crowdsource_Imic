import React, { useState, useEffect, useMemo } from 'react';
import StatCard from './StatCard';
import ActivityFeed from './ActivityFeed';
import GeminiInsight from './GeminiInsight';
import Contributions from './Contributions';
import { Investment, Member, Announcement, AnnouncementType, ContributionGoal, Transaction, TransactionType } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnnouncementBanner: React.FC<{ announcement: Announcement; onDismiss: (id: number) => void }> = ({ announcement, onDismiss }) => {
    const isUrgent = announcement.type === AnnouncementType.URGENT;
    
    const baseClasses = "p-4 rounded-lg flex items-start space-x-4 shadow-lg";
    const colorClasses = isUrgent 
        ? "bg-red-800/50 border border-red-600" 
        : "bg-indigo-800/50 border border-indigo-600";
    
    const icon = isUrgent ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-300 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-300 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
    );

    return (
        <div className={`${baseClasses} ${colorClasses}`}>
            <div className="flex-shrink-0">{icon}</div>
            <div className="flex-1">
                <p className={`font-bold ${isUrgent ? 'text-red-200' : 'text-indigo-200'}`}>{announcement.type}</p>
                <p className="text-sm text-gray-200 mt-1">{announcement.message}</p>
            </div>
            <button onClick={() => onDismiss(announcement.id)} className="text-gray-400 hover:text-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

const ContributionGoalTracker: React.FC<{ goal: ContributionGoal, transactions: Transaction[], members: Member[] }> = ({ goal, transactions, members }) => {
    const { targetAmount, deadline } = goal;
    
    const deadlineDate = new Date(deadline);
    const startDate = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), 1);
    
    const raisedAmount = useMemo(() => {
        return transactions
            .filter(tx => {
                const txDate = new Date(tx.date);
                return tx.type === TransactionType.DEPOSIT && txDate >= startDate && txDate <= deadlineDate;
            })
            .reduce((sum, tx) => sum + tx.amount, 0);
    }, [transactions, startDate, deadlineDate]);

    const progress = Math.min((raisedAmount / targetAmount) * 100, 100);
    const daysLeft = Math.max(0, Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
    
    const contributors = useMemo(() => {
        const contributorIds = new Set(
            transactions
                .filter(tx => {
                    const txDate = new Date(tx.date);
                    return tx.type === TransactionType.DEPOSIT && tx.memberId && txDate >= startDate && txDate <= deadlineDate;
                })
                .map(tx => tx.memberId)
        );
        return Array.from(contributorIds).map(id => members.find(m => m.id === id)).filter(Boolean) as Member[];
    }, [transactions, members, startDate, deadlineDate]);


    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-white">Monthly Contribution Goal</h3>
            <div className="flex justify-between items-baseline mt-2">
                <span className="text-3xl font-bold text-white">${raisedAmount.toLocaleString()}</span>
                <span className="text-sm text-gray-400">raised of ${targetAmount.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 my-3">
                <div className="bg-indigo-500 h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-indigo-300">{progress.toFixed(0)}% Complete</span>
                <span className="text-gray-400">{daysLeft} days remaining</span>
            </div>
            <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Contributors this month:</p>
                <div className="flex -space-x-2">
                    {contributors.slice(0, 7).map(member => (
                        <img key={member.id} src={member.avatarUrl} alt={member.name} title={member.name} className="w-8 h-8 rounded-full border-2 border-gray-800" />
                    ))}
                    {contributors.length > 7 && (
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold text-white border-2 border-gray-800">
                            +{contributors.length - 7}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

interface DashboardProps {
    currentUser: Member;
    investments: Investment[];
    isReminderSet: boolean;
    announcements: Announcement[];
    contributionGoal: ContributionGoal;
    transactions: Transaction[];
    members: Member[];
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, investments, isReminderSet, announcements, contributionGoal, transactions, members }) => {
    const [dismissedAnnouncements, setDismissedAnnouncements] = useState<number[]>([]);

    useEffect(() => {
        const storedDismissed = localStorage.getItem('dismissedAnnouncements');
        if (storedDismissed) {
            setDismissedAnnouncements(JSON.parse(storedDismissed));
        }
    }, []);
    
    const handleDismiss = (id: number) => {
        const newDismissed = [...dismissedAnnouncements, id];
        setDismissedAnnouncements(newDismissed);
        localStorage.setItem('dismissedAnnouncements', JSON.stringify(newDismissed));
    };

    const activeAnnouncements = announcements.filter(a => !dismissedAnnouncements.includes(a.id));

    const totalInvested = investments.reduce((acc, inv) => acc + inv.amountInvested, 0);
    const currentValue = investments.reduce((acc, inv) => acc + inv.currentValue, 0);
    const totalGainLoss = currentValue - totalInvested;
    const percentageGainLoss = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;
    const totalContributions = transactions.filter(tx => tx.type === 'Deposit').reduce((sum, c) => sum + c.amount, 0);

    const portfolioData = investments.map(inv => ({
        name: inv.ticker,
        value: inv.currentValue,
    }));

    return (
        <div className="space-y-8">
            {/* Announcements Section */}
            {activeAnnouncements.length > 0 && (
                <div className="space-y-4">
                    {activeAnnouncements.map(announcement => (
                        <AnnouncementBanner key={announcement.id} announcement={announcement} onDismiss={handleDismiss} />
                    ))}
                </div>
            )}
            
            <div>
                <h2 className="text-3xl font-bold text-white">Welcome back, {currentUser.name}!</h2>
                <p className="text-gray-400 mt-1">Here's a snapshot of your club's performance.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <StatCard
                            title="Total Portfolio Value"
                            value={`$${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            change={`${percentageGainLoss.toFixed(2)}%`}
                            isPositive={totalGainLoss >= 0}
                        />
                        <StatCard
                            title="Total Contributions"
                            value={`$${totalContributions.toLocaleString()}`}
                        />
                         <StatCard
                            title="Net Gain/Loss"
                            value={`$${totalGainLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            isPositive={totalGainLoss >= 0}
                        />
                        <StatCard
                            title="Your Withdrawn Profit"
                            value={`$${currentUser.withdrawnProfit.toLocaleString()}`}
                        />
                    </div>
                </div>
                <div className="lg:col-span-1">
                     <ContributionGoalTracker goal={contributionGoal} transactions={transactions} members={members} />
                </div>
            </div>
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Portfolio Overview</h3>
                     <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={portfolioData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                                <XAxis dataKey="name" tick={{ fill: '#a0aec0' }} />
                                <YAxis tick={{ fill: '#a0aec0' }} unit="$" />
                                <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568' }} />
                                <Legend />
                                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <ActivityFeed />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                     <Contributions isReminderSet={isReminderSet} setIsReminderSet={() => {}} />
                </div>
                <div className="lg:col-span-1">
                    <GeminiInsight />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
