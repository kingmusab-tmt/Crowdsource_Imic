import React from 'react';
import StatCard from './StatCard';
import { MEMBERS, PROPOSALS, BUSINESS_LISTINGS } from '../constants';
// Fix: Import Role to use it for checking member roles.
import { ProposalStatus, BusinessStatus, View, Role } from '../types';

interface AdminDashboardProps {
    setCurrentView: (view: View) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ setCurrentView }) => {
    const totalMembers = MEMBERS.length;
    const pendingProposals = PROPOSALS.filter(p => p.status === ProposalStatus.OPEN).length;
    const pendingBusinesses = BUSINESS_LISTINGS.filter(b => b.status === BusinessStatus.PENDING).length;

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white">Admin Overview</h2>
            
            {/* Admin Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Members" value={`${totalMembers}`} />
                <StatCard title="Pending Business Approvals" value={`${pendingBusinesses}`} />
                <StatCard title="Open Proposals" value={`${pendingProposals}`} />
            </div>

            {/* Quick Actions & Members List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                             <button 
                                onClick={() => setCurrentView(View.ADMIN)}
                                className="w-full text-left bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition"
                            >
                                Manage Business Listings
                            </button>
                             <button 
                                onClick={() => setCurrentView(View.ADMIN)}
                                className="w-full text-left bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition"
                            >
                                Manage Investments
                            </button>
                            <button 
                                onClick={() => setCurrentView(View.PROPOSALS)}
                                className="w-full text-left bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition"
                            >
                                Review Proposals
                            </button>
                        </div>
                    </div>
                </div>

                {/* All Members List */}
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold text-white mb-4">All Members</h3>
                     <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-800 text-white">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Member</th>
                                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Contribution Status</th>
                                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Role</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-300">
                                {MEMBERS.map(member => (
                                    <tr key={member.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                        <td className="py-3 px-4 flex items-center">
                                            <img src={member.avatarUrl} alt={member.name} className="w-8 h-8 rounded-full mr-4"/>
                                            <span>{member.name}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                member.contributionStatus === 'Paid' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                                            }`}>
                                                {member.contributionStatus}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            {/* Fix: Replaced non-existent 'isAdmin' property with 'role' property from the Member type. This also correctly displays all roles, not just Admin/Member. */}
                                            <span className={member.role === Role.ADMIN ? 'text-indigo-400 font-semibold' : ''}>
                                                {member.role}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;