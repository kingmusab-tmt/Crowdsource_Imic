
import React from 'react';
import { Activity } from '../types';

const ContributionIcon = () => (
    <div className="bg-green-500/20 text-green-400 rounded-full h-8 w-8 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
      </svg>
    </div>
  );
  
  const ProposalIcon = () => (
    <div className="bg-blue-500/20 text-blue-400 rounded-full h-8 w-8 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15v4a1 1 0 001 1h12a1 1 0 001-1v-4a1 1 0 00-.293-.707L16 11.586V8a6 6 0 00-6-6zM8 18h4v-2H8v2zm-2 0v-2H4v2h2zm10 0v-2h-2v2h2z" />
      </svg>
    </div>
  );
  
  const InvestmentIcon = () => (
    <div className="bg-purple-500/20 text-purple-400 rounded-full h-8 w-8 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 11h16v2H2z" />
        <path fillRule="evenodd" d="M4.158 4.158A6.002 6.002 0 0110 2a6 6 0 015.842 4.158l-1.292.517A4.002 4.002 0 0010 4a4 4 0 00-4.55 3.322L4.158 4.158zM15.842 15.842A6.002 6.002 0 0110 18a6 6 0 01-5.842-4.158l1.292-.517A4.002 4.002 0 0010 16a4 4 0 004.55-3.322l1.292-3.232z" clipRule="evenodd" />
      </svg>
    </div>
  );

const activities: Activity[] = [
    { id: 1, description: "Alice Johnson contributed $100.", timestamp: "2 hours ago", icon: <ContributionIcon /> },
    { id: 2, description: "New proposal to invest in AAPL.", timestamp: "5 hours ago", icon: <ProposalIcon /> },
    { id: 3, description: "Executed investment of $800 in QQQ.", timestamp: "1 day ago", icon: <InvestmentIcon /> },
    { id: 4, description: "Proposal for monthly contribution increase has PASSED.", timestamp: "2 days ago", icon: <ProposalIcon /> },
    { id: 5, description: "Bob Williams contributed $100.", timestamp: "3 days ago", icon: <ContributionIcon /> },
];

const ActivityFeed: React.FC = () => {
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <ul className="space-y-4">
                {activities.map(activity => (
                    <li key={activity.id} className="flex items-start space-x-4">
                        <div>{activity.icon}</div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-200">{activity.description}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActivityFeed;
