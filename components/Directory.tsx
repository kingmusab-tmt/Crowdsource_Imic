import React, { useState, useMemo } from 'react';
import { Member, Role } from '../types';

const roleColorMap: { [key in Role]: string } = {
    [Role.ADMIN]: 'bg-indigo-500/20 text-indigo-300',
    [Role.TREASURER]: 'bg-purple-500/20 text-purple-300',
    [Role.MEMBER]: 'bg-gray-600/20 text-gray-300',
};

// MemberCard sub-component
const MemberCard: React.FC<{ member: Member }> = ({ member }) => (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col text-center items-center transform hover:scale-105 transition-transform duration-300">
        <img src={member.avatarUrl} alt={member.name} className="w-24 h-24 rounded-full border-4 border-indigo-500 shadow-lg mb-4" />
        <h3 className="text-xl font-bold text-white">{member.name}</h3>
        
        <span className={`mt-1 px-3 py-1 text-xs font-bold rounded-full ${roleColorMap[member.role]}`}>
            {member.role}
        </span>
        
        <p className="text-gray-400 text-sm mt-2 flex-grow">{member.bio}</p>
        
        <div className="mt-4 pt-4 border-t border-gray-700 w-full space-y-2">
             <p className="text-sm text-gray-300"><span className="font-semibold">Email:</span> <a href={`mailto:${member.email}`} className="text-indigo-400 hover:underline">{member.email}</a></p>
             <p className="text-sm text-gray-300"><span className="font-semibold">Phone:</span> {member.phone}</p>
             <div className="flex justify-center items-center">
                <span className="text-sm font-semibold text-gray-300 mr-2">Status:</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    member.contributionStatus === 'Paid' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                }`}>
                    {member.contributionStatus}
                </span>
            </div>
        </div>
    </div>
);


interface DirectoryProps {
    members: Member[];
}

const Directory: React.FC<DirectoryProps> = ({ members }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'Paid', 'Pending'

    const filteredMembers = useMemo(() => {
        return members.filter(member => {
            const nameMatch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
            const statusMatch = statusFilter === 'all' || member.contributionStatus === statusFilter;
            return nameMatch && statusMatch;
        });
    }, [members, searchTerm, statusFilter]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-white">Member Directory</h2>
                <p className="text-gray-400 mt-1">Search, filter, and connect with fellow club members.</p>
            </div>

            {/* Search and Filter Controls */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-700 text-white rounded-md p-2 pl-10 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label htmlFor="status-filter" className="sr-only">Filter by Contribution Status</label>
                    <select
                        id="status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full sm:w-auto bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="all">All Statuses</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>
            </div>

            {/* Members Grid */}
            {filteredMembers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMembers.map(member => (
                        <MemberCard key={member.id} member={member} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-800 rounded-lg">
                    <h3 className="text-xl font-semibold text-white">No Members Found</h3>
                    <p className="text-gray-400 mt-2">Try adjusting your search or filter criteria.</p>
                </div>
            )}
        </div>
    );
};

export default Directory;