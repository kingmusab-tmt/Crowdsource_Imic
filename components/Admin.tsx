import React, { useState, useMemo } from 'react';
import { View, BusinessListing, BusinessStatus, Transaction, Member, TransactionType, TransactionStatus, FinancialAssistanceRequest, AssistanceRequestStatus, WithdrawalRequest, WithdrawalStatus, Investment, Role, Announcement, AnnouncementType } from '../types';
import Modal from './Modal';

interface AdminProps {
    setCurrentView: (view: View) => void;
    businessListings: BusinessListing[];
    setBusinessListings: React.Dispatch<React.SetStateAction<BusinessListing[]>>;
    transactions: Transaction[];
    members: Member[];
    investments: Investment[];
    onAddTransaction: (newTransaction: Omit<Transaction, 'id'>) => void;
    assistanceRequests: FinancialAssistanceRequest[];
    withdrawalRequests: WithdrawalRequest[];
    onUpdateRequestStatus: (id: number, type: 'withdrawal' | 'assistance', newStatus: WithdrawalStatus | AssistanceRequestStatus) => void;
    onDistributeProfits: () => void;
    announcements: Announcement[];
    onAddAnnouncement: (message: string, type: AnnouncementType) => void;
    onDeleteAnnouncement: (announcementId: number) => void;
}

const businessStatusColorMap = {
    [BusinessStatus.PENDING]: 'bg-yellow-500/20 text-yellow-300',
    [BusinessStatus.APPROVED]: 'bg-green-500/20 text-green-300',
    [BusinessStatus.REJECTED]: 'bg-red-500/20 text-red-300',
};

const transactionStatusColorMap = {
    [TransactionStatus.COMPLETED]: 'bg-green-500/20 text-green-300',
    [TransactionStatus.PENDING]: 'bg-yellow-500/20 text-yellow-300',
    [TransactionStatus.FAILED]: 'bg-red-500/20 text-red-300',
};

const requestStatusColorMap = {
    ...transactionStatusColorMap,
    [AssistanceRequestStatus.REJECTED]: 'bg-red-500/20 text-red-300',
};


type SortKey = keyof Transaction | 'memberName';
type SortDirection = 'asc' | 'desc';

// --- CSV Export Helper ---
const exportToCsv = (filename: string, rows: object[]) => {
    if (!rows || rows.length === 0) {
        alert("No data available to export.");
        return;
    }
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
        keys.join(separator) +
        '\n' +
        rows.map(row => {
            return keys.map(k => {
                let cell = (row as any)[k] === null || (row as any)[k] === undefined ? '' : (row as any)[k];
                cell = String(cell).replace(/"/g, '""');
                if (String(cell).includes(separator)) {
                    cell = `"${cell}"`;
                }
                return cell;
            }).join(separator);
        }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};


const Admin: React.FC<AdminProps> = ({ 
    setCurrentView, 
    businessListings, 
    setBusinessListings, 
    transactions, 
    members, 
    investments,
    onAddTransaction,
    assistanceRequests,
    withdrawalRequests,
    onUpdateRequestStatus,
    onDistributeProfits,
    announcements,
    onAddAnnouncement,
    onDeleteAnnouncement
}) => {
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [isProfitModalOpen, setIsProfitModalOpen] = useState(false);

    const [newTransactionData, setNewTransactionData] = useState({
        memberId: '',
        description: '',
        type: TransactionType.EXPENSE,
        status: TransactionStatus.COMPLETED,
        date: new Date().toISOString().split('T')[0],
        amount: ''
    });

    const [newAnnouncement, setNewAnnouncement] = useState({
        message: '',
        type: AnnouncementType.INFO,
    });

    const [filterType, setFilterType] = useState('all');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>({ key: 'date', direction: 'desc' });
    
    // Calculations for Profit Distribution
    const totalNetProfit = useMemo(() => investments.reduce((acc, inv) => acc + (inv.currentValue - inv.amountInvested), 0), [investments]);
    const totalWithdrawn = useMemo(() => members.reduce((acc, mem) => acc + mem.withdrawnProfit, 0), [members]);
    const totalAssistance = useMemo(() => assistanceRequests.filter(r => r.status === AssistanceRequestStatus.APPROVED).reduce((acc, req) => acc + req.amount, 0), [assistanceRequests]);
    const distributableProfit = totalNetProfit - totalWithdrawn - totalAssistance;


    const getMemberName = (memberId?: number) => {
        if (!memberId) return 'N/A';
        return members.find(m => m.id === memberId)?.name || 'Unknown Member';
    };

    const handleApproval = (listingId: number, newStatus: BusinessStatus) => {
        setBusinessListings(prev => 
            prev.map(listing => 
                listing.id === listingId ? { ...listing, status: newStatus } : listing
            )
        );
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setNewTransactionData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleAnnouncementInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
        setNewAnnouncement(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAddTransactionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(newTransactionData.amount);
        if (!newTransactionData.description || isNaN(amount)) {
            alert('Please fill in a description and valid amount.');
            return;
        }

        onAddTransaction({
            ...newTransactionData,
            memberId: newTransactionData.memberId ? parseInt(newTransactionData.memberId, 10) : undefined,
            amount: amount,
        });

        setIsTransactionModalOpen(false);
        setNewTransactionData({
            memberId: '', description: '', type: TransactionType.EXPENSE, status: TransactionStatus.COMPLETED,
            date: new Date().toISOString().split('T')[0], amount: ''
        });
    };
    
    const handleAddAnnouncementSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAnnouncement.message.trim()) {
            alert('Announcement message cannot be empty.');
            return;
        }
        onAddAnnouncement(newAnnouncement.message, newAnnouncement.type);
        setNewAnnouncement({ message: '', type: AnnouncementType.INFO });
    };

    const handleConfirmDistribution = () => {
        onDistributeProfits();
        setIsProfitModalOpen(false);
    };

    const sortedAndFilteredTransactions = useMemo(() => {
        let filtered = [...transactions];
        if (filterType !== 'all') {
            filtered = filtered.filter(t => t.type === filterType);
        }

        if (sortConfig !== null) {
            filtered.sort((a, b) => {
                let aValue: any;
                let bValue: any;

                if (sortConfig.key === 'memberName') {
                    aValue = getMemberName(a.memberId).toLowerCase();
                    bValue = getMemberName(b.memberId).toLowerCase();
                } else {
                    aValue = a[sortConfig.key as keyof Transaction];
                    bValue = b[sortConfig.key as keyof Transaction];
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return filtered;
    }, [transactions, filterType, sortConfig, members]);
    
    const requestSort = (key: SortKey) => {
        let direction: SortDirection = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    
    const pendingAssistance = assistanceRequests.filter(r => r.status === AssistanceRequestStatus.PENDING);
    const pendingWithdrawals = withdrawalRequests.filter(r => r.status === WithdrawalStatus.PENDING);

    // --- Data Export Handlers ---
    const handleExportMembers = () => {
        const dataToExport = members.map(({ avatarUrl, bio, ...rest }) => rest); // Exclude some fields
        exportToCsv('club-members.csv', dataToExport);
    };
    
    const handleExportTransactions = () => {
        const dataToExport = transactions.map(tx => ({
            ...tx,
            memberName: getMemberName(tx.memberId)
        }));
        exportToCsv('club-transactions.csv', dataToExport);
    };

    const handleExportInvestments = () => {
        exportToCsv('club-investments.csv', investments);
    };


    const SortableHeader: React.FC<{ sortKey: SortKey, label: string }> = ({ sortKey, label }) => {
        const isSorted = sortConfig?.key === sortKey;
        const icon = isSorted ? (sortConfig?.direction === 'asc' ? '▲' : '▼') : '↕';
        return (
             <th className="text-left py-3 px-4 uppercase font-semibold text-sm cursor-pointer" onClick={() => requestSort(sortKey)}>
                {label} <span className="text-gray-500 ml-1">{icon}</span>
            </th>
        );
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white">Admin Panel</h2>
                <p className="text-gray-400 mt-1">Manage club operations and member submissions.</p>
            </div>

            {/* Site-Wide Announcements */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-white mb-4">Site-Wide Announcements</h3>
                <form onSubmit={handleAddAnnouncementSubmit} className="mb-6 bg-gray-900/50 p-4 rounded-lg">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="announcement-message" className="block text-sm font-medium text-gray-300">New Announcement Message</label>
                            <textarea
                                id="announcement-message"
                                name="message"
                                rows={3}
                                value={newAnnouncement.message}
                                onChange={handleAnnouncementInputChange}
                                className="mt-1 w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="e.g., Monthly contribution deadline is approaching..."
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <label htmlFor="announcement-type" className="block text-sm font-medium text-gray-300">Type</label>
                                <select
                                    id="announcement-type"
                                    name="type"
                                    value={newAnnouncement.type}
                                    onChange={handleAnnouncementInputChange}
                                    className="mt-1 bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value={AnnouncementType.INFO}>Info</option>
                                    <option value={AnnouncementType.URGENT}>Urgent</option>
                                </select>
                            </div>
                            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition self-end">
                                Post Announcement
                            </button>
                        </div>
                    </div>
                </form>
                <div>
                    <h4 className="text-lg font-semibold text-gray-300 mb-4">Existing Announcements</h4>
                     <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {announcements.map(ann => (
                            <div key={ann.id} className="bg-gray-700/50 p-3 rounded-lg flex justify-between items-start">
                                <div>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ann.type === AnnouncementType.URGENT ? 'bg-red-500/30 text-red-200' : 'bg-blue-500/30 text-blue-200'}`}>{ann.type}</span>
                                    <p className="text-sm text-gray-300 mt-2">{ann.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">{ann.timestamp}</p>
                                </div>
                                <button onClick={() => onDeleteAnnouncement(ann.id)} className="text-gray-500 hover:text-red-400 p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Data Export & Reporting */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-white mb-4">Data Export & Reporting</h3>
                <p className="text-gray-400 mb-6">Download key club data as CSV files for offline analysis and record-keeping.</p>
                <div className="flex flex-wrap gap-4">
                    <button onClick={handleExportMembers} className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm2 10a1 1 0 100 2h4a1 1 0 100-2H8zm0-3a1 1 0 000 2h4a1 1 0 100-2H8z" clipRule="evenodd" /></svg>
                        <span>Export Member List (CSV)</span>
                    </button>
                    <button onClick={handleExportTransactions} className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm2 10a1 1 0 100 2h4a1 1 0 100-2H8zm0-3a1 1 0 000 2h4a1 1 0 100-2H8z" clipRule="evenodd" /></svg>
                        <span>Export Transaction Ledger (CSV)</span>
                    </button>
                    <button onClick={handleExportInvestments} className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm2 10a1 1 0 100 2h4a1 1 0 100-2H8zm0-3a1 1 0 000 2h4a1 1 0 100-2H8z" clipRule="evenodd" /></svg>
                        <span>Export Investment Portfolio (CSV)</span>
                    </button>
                </div>
            </div>
            
            {/* Profit Distribution Management */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-white mb-4">Profit Distribution Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Total Net Profit</p>
                        <p className="text-2xl font-bold text-green-400">${totalNetProfit.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Total Withdrawn</p>
                        <p className="text-xl font-bold text-yellow-400">-${totalWithdrawn.toFixed(2)}</p>
                    </div>
                     <div className="bg-gray-700 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Assistance Paid</p>
                        <p className="text-xl font-bold text-yellow-400">-${totalAssistance.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-900/50 border border-indigo-500 p-4 rounded-lg">
                        <p className="text-sm text-indigo-300">Distributable Profit</p>
                        <p className="text-2xl font-bold text-white">${distributableProfit > 0 ? distributableProfit.toFixed(2) : '0.00'}</p>
                    </div>
                </div>
                <div className="mt-6 text-center">
                     <button 
                        onClick={() => setIsProfitModalOpen(true)} 
                        disabled={distributableProfit <= 0}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Calculate & Allocate Profit Shares
                    </button>
                </div>
            </div>

            {/* Approval Workflows */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-white mb-6">Approval Workflows</h3>
                <div className="space-y-8">
                    {/* Pending Withdrawals */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-300 mb-4">Pending Withdrawal Requests ({pendingWithdrawals.length})</h4>
                        <div className="overflow-x-auto">
                           <table className="min-w-full bg-gray-900/50 text-white rounded-lg">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Member</th>
                                        <th className="text-right py-3 px-4 uppercase font-semibold text-sm">Amount</th>
                                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
                                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Bank</th>
                                        <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-300">
                                    {pendingWithdrawals.length > 0 ? pendingWithdrawals.map(req => (
                                        <tr key={req.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                            <td className="py-3 px-4">{getMemberName(req.memberId)}</td>
                                            <td className="py-3 px-4 text-right font-mono">${req.amount.toFixed(2)}</td>
                                            <td className="py-3 px-4">{req.date}</td>
                                            <td className="py-3 px-4">{req.bankName} (...{req.accountNumber})</td>
                                            <td className="py-3 px-4 text-center">
                                                <div className="flex justify-center space-x-2">
                                                    <button onClick={() => onUpdateRequestStatus(req.id, 'withdrawal', WithdrawalStatus.COMPLETED)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-lg text-xs transition">Approve</button>
                                                    <button onClick={() => onUpdateRequestStatus(req.id, 'withdrawal', WithdrawalStatus.REJECTED)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg text-xs transition">Reject</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : <tr><td colSpan={5} className="text-center py-4 text-gray-500">No pending withdrawal requests.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                     {/* Pending Financial Assistance */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-300 mb-4">Pending Financial Assistance Requests ({pendingAssistance.length})</h4>
                        <div className="overflow-x-auto">
                           <table className="min-w-full bg-gray-900/50 text-white rounded-lg">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Member</th>
                                        <th className="text-right py-3 px-4 uppercase font-semibold text-sm">Amount</th>
                                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
                                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Purpose</th>
                                        <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-300">
                                    {pendingAssistance.length > 0 ? pendingAssistance.map(req => (
                                        <tr key={req.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                            <td className="py-3 px-4">{getMemberName(req.requesterId)}</td>
                                            <td className="py-3 px-4 text-right font-mono">${req.amount.toFixed(2)}</td>
                                            <td className="py-3 px-4">{req.requestDate}</td>
                                            <td className="py-3 px-4 text-sm italic">"{req.purpose}"</td>
                                            <td className="py-3 px-4 text-center">
                                                <div className="flex justify-center space-x-2">
                                                    <button onClick={() => onUpdateRequestStatus(req.id, 'assistance', AssistanceRequestStatus.APPROVED)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-lg text-xs transition">Approve</button>
                                                    <button onClick={() => onUpdateRequestStatus(req.id, 'assistance', AssistanceRequestStatus.REJECTED)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg text-xs transition">Reject</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : <tr><td colSpan={5} className="text-center py-4 text-gray-500">No pending assistance requests.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Business Listing Management */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-white mb-6">Business Listing Approvals</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 text-white">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Business Name</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Owner</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Status</th>
                                <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300">
                            {businessListings.map(listing => (
                                <tr key={listing.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="py-3 px-4">{listing.name}</td>
                                    <td className="py-3 px-4">{getMemberName(listing.ownerId)}</td>
                                    <td className="py-3 px-4">
                                         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${businessStatusColorMap[listing.status]}`}>
                                            {listing.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        {listing.status === BusinessStatus.PENDING && (
                                            <div className="flex justify-center space-x-2">
                                                <button 
                                                    onClick={() => handleApproval(listing.id, BusinessStatus.APPROVED)}
                                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-lg text-xs transition"
                                                >
                                                    Approve
                                                </button>
                                                <button 
                                                    onClick={() => handleApproval(listing.id, BusinessStatus.REJECTED)}
                                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg text-xs transition"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

             {/* Master Transaction Ledger */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <h3 className="text-xl font-bold text-white">Master Transaction Ledger</h3>
                    <button onClick={() => setIsTransactionModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition">
                        Add Manual Transaction
                    </button>
                </div>
                <div className="mb-4">
                    <label htmlFor="typeFilter" className="text-sm font-medium text-gray-300 mr-2">Filter by Type:</label>
                    <select id="typeFilter" value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-gray-700 text-white rounded-md p-2 border border-gray-600">
                        <option value="all">All Types</option>
                        {Object.values(TransactionType).map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 text-white">
                        <thead className="bg-gray-700">
                            <tr>
                                <SortableHeader sortKey="date" label="Date" />
                                <SortableHeader sortKey="description" label="Description" />
                                <SortableHeader sortKey="memberName" label="Member" />
                                <SortableHeader sortKey="type" label="Type" />
                                <SortableHeader sortKey="status" label="Status" />
                                <SortableHeader sortKey="amount" label="Amount" />
                            </tr>
                        </thead>
                        <tbody className="text-gray-300">
                           {sortedAndFilteredTransactions.map(tx => (
                                <tr key={tx.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="py-3 px-4">{tx.date}</td>
                                    <td className="py-3 px-4">{tx.description}</td>
                                    <td className="py-3 px-4">{getMemberName(tx.memberId)}</td>
                                    <td className="py-3 px-4">{tx.type}</td>
                                    <td className="py-3 px-4">
                                         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${transactionStatusColorMap[tx.status]}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className={`py-3 px-4 text-right font-mono ${tx.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {tx.amount >= 0 ? '+' : '-'}${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                </tr>
                           ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isTransactionModalOpen} onClose={() => setIsTransactionModalOpen(false)}>
                <form onSubmit={handleAddTransactionSubmit}>
                    <h3 className="text-lg font-bold text-white mb-6">Add Manual Transaction</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="memberId" className="block text-sm font-medium text-gray-300">Member (Optional)</label>
                            <select name="memberId" id="memberId" value={newTransactionData.memberId} onChange={handleInputChange} className="mt-1 w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600">
                                <option value="">N/A (System Transaction)</option>
                                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                            <input type="text" name="description" id="description" value={newTransactionData.description} onChange={handleInputChange} required className="mt-1 w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-300">Type</label>
                                <select name="type" id="type" value={newTransactionData.type} onChange={handleInputChange} className="mt-1 w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600">
                                    {Object.values(TransactionType).map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status</label>
                                <select name="status" id="status" value={newTransactionData.status} onChange={handleInputChange} className="mt-1 w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600">
                                    {Object.values(TransactionStatus).map(status => <option key={status} value={status}>{status}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-300">Amount</label>
                                <input type="number" step="0.01" name="amount" id="amount" value={newTransactionData.amount} onChange={handleInputChange} required placeholder="e.g., -50.00 for expense" className="mt-1 w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600" />
                            </div>
                             <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-300">Date</label>
                                <input type="date" name="date" id="date" value={newTransactionData.date} onChange={handleInputChange} required className="mt-1 w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                        <button type="button" onClick={() => setIsTransactionModalOpen(false)} className="py-2 px-4 rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500 transition">Cancel</button>
                        <button type="submit" className="py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition">Add Transaction</button>
                    </div>
                </form>
            </Modal>
            
            <Modal isOpen={isProfitModalOpen} onClose={() => setIsProfitModalOpen(false)}>
                 <h3 className="text-lg font-bold text-white mb-4">Confirm Profit Distribution</h3>
                 <p className="text-gray-300 mb-6">
                    You are about to distribute a total of <span className="font-bold text-indigo-400">${distributableProfit.toFixed(2)}</span> among <span className="font-bold text-white">{members.length}</span> members.
                    Each member will be allocated <span className="font-bold text-green-400">${(distributableProfit / members.length).toFixed(2)}</span> to their "Available for Withdrawal" balance. This action cannot be undone.
                 </p>
                 <div className="mt-6 flex justify-end space-x-4">
                    <button onClick={() => setIsProfitModalOpen(false)} className="py-2 px-4 rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500 transition">Cancel</button>
                    <button onClick={handleConfirmDistribution} className="py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition">Confirm & Allocate</button>
                </div>
            </Modal>
        </div>
    );
};

export default Admin;