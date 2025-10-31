import React from 'react';
import StatCard from './StatCard';
import ActivityFeed from './ActivityFeed';
import GeminiInsight from './GeminiInsight';
import { INVESTMENTS, CONTRIBUTIONS, CURRENT_USER, MEMBERS, FUND_USAGE } from '../constants';
import { FundUsage } from '../types';

interface DashboardProps {
    isReminderSet: boolean;
    setIsReminderSet: (value: boolean) => void;
}

const FundUsageIcon: React.FC<{ type: FundUsage['type'] }> = ({ type }) => {
    const isInvestment = type === 'Investment';
    return (
        <div className={`rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 ${isInvestment ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'}`}>
            {isInvestment ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
            )}
        </div>
    );
}


const Dashboard: React.FC<DashboardProps> = ({ isReminderSet, setIsReminderSet }) => {
    // --- Calculations ---
    const totalInvested = INVESTMENTS.reduce((acc, inv) => acc + inv.amountInvested, 0);
    const currentValue = INVESTMENTS.reduce((acc, inv) => acc + inv.currentValue, 0);
    const communityProfit = currentValue - totalInvested;
    const isProfitPositive = communityProfit >= 0;

    const totalContributions = CONTRIBUTIONS.reduce((acc, c) => acc + c.amount, 0);
    const myTotalContribution = CONTRIBUTIONS.filter(c => c.memberId === CURRENT_USER.id).reduce((acc, c) => acc + c.amount, 0);
    
    const myProfitShare = totalContributions > 0 ? (myTotalContribution / totalContributions) * communityProfit : 0;
    const myWithdrawnProfit = CURRENT_USER.withdrawnProfit;

    const memberOfTheMonth = MEMBERS.find(m => m.id === 2); // Static for now

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Dashboard</h2>
                    <p className="text-gray-400 mt-1">Welcome back, {CURRENT_USER.name}. Here's a snapshot of your club's performance.</p>
                </div>
                <button 
                    onClick={() => setIsReminderSet(!isReminderSet)}
                    className={`font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 ${
                        isReminderSet 
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                        : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                    }`}
                >
                    {isReminderSet ? 'Disable Contribution Reminder' : 'Set Monthly Contribution Reminder'}
                </button>
            </div>
            
            {isReminderSet && (
                <div className="bg-yellow-500/20 text-yellow-300 p-4 rounded-lg flex items-center space-x-3">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    <p className="font-semibold">Monthly contribution reminder is active.</p>
                </div>
            )}

            {/* My Analytics */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">My Analytics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title="My Total Contribution" value={`$${myTotalContribution.toLocaleString()}`} />
                    <StatCard title="My Total Profit" value={`$${myProfitShare.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} isPositive={myProfitShare >= 0} />
                    <StatCard title="My Withdrawn Profit" value={`$${myWithdrawnProfit.toLocaleString()}`} />
                </div>
            </div>

            {/* Community Analytics */}
            <div className="space-y-4">
                 <h3 className="text-xl font-semibold text-white">Community Analytics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                     <StatCard 
                        title="Total Portfolio Value" 
                        value={`$${currentValue.toLocaleString()}`} 
                    />
                    <StatCard 
                        title="Total Contributions" 
                        value={`$${totalContributions.toLocaleString()}`}
                    />
                    <StatCard
                        title="Community Profit"
                        value={`${isProfitPositive ? '+' : ''}$${communityProfit.toLocaleString()}`}
                        isPositive={isProfitPositive}
                    />
                </div>
            </div>

            {/* Member of the Month & Fund Usage */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full flex flex-col items-center justify-center text-center">
                        <h3 className="text-lg font-semibold text-white mb-4">Member of the Month</h3>
                        <img src={memberOfTheMonth?.avatarUrl} alt={memberOfTheMonth?.name} className="w-20 h-20 rounded-full border-4 border-indigo-500 shadow-lg"/>
                        <p className="text-xl font-bold text-white mt-4">{memberOfTheMonth?.name}</p>
                        <p className="text-sm text-indigo-400">For outstanding participation</p>
                    </div>
                </div>
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Fund Usage</h3>
                    <ul className="space-y-3">
                        {FUND_USAGE.slice(0, 4).map(usage => (
                            <li key={usage.id} className="flex items-center space-x-4">
                               <FundUsageIcon type={usage.type} />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-200">{usage.description}</p>
                                    <p className="text-xs text-gray-500">{usage.date}</p>
                                </div>
                                <span className={`text-sm font-semibold ${usage.type === 'Investment' ? 'text-purple-400' : 'text-green-400'}`}>
                                    ${usage.amount.toLocaleString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>


            {/* Activity Feed & AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <ActivityFeed />
                </div>
                <div className="lg:col-span-1">
                    <GeminiInsight />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;