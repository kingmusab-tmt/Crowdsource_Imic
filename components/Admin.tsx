import React, { useState } from 'react';
import { BusinessListing, BusinessStatus, Event, EventStatus, View, Investment } from '../types';
import AdminDashboard from './AdminDashboard';
import Modal from './Modal';
import { MEMBERS, CONTRIBUTIONS } from '../constants';

interface AdminProps {
    businessListings: BusinessListing[];
    setBusinessListings: React.Dispatch<React.SetStateAction<BusinessListing[]>>;
    events: Event[];
    onEventApproval: (eventId: number, status: EventStatus) => void;
    investments: Investment[];
    onUpdateInvestment: (investment: Investment) => void;
    setCurrentView: (view: View) => void;
}

const Admin: React.FC<AdminProps> = ({ 
    businessListings, 
    setBusinessListings, 
    events, 
    onEventApproval, 
    investments,
    onUpdateInvestment,
    setCurrentView 
}) => {
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
    
    const handleBusinessApproval = (id: number, status: BusinessStatus) => {
        setBusinessListings(prev => 
            prev.map(listing => 
                listing.id === id ? { ...listing, status } : listing
            )
        );
    };

    const handleOpenEditModal = (investment: Investment) => {
        setEditingInvestment({ ...investment });
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingInvestment(null);
    };

    const handleInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editingInvestment) return;
        const { name, value } = e.target;
        setEditingInvestment({
            ...editingInvestment,
            [name]: parseFloat(value) || value,
        });
    };
    
    const handleSaveChanges = () => {
        if (editingInvestment) {
            onUpdateInvestment(editingInvestment);
            handleCloseEditModal();
        }
    };

    const getMemberName = (id: number) => MEMBERS.find(m => m.id === id)?.name || 'Unknown';

    const pendingListings = businessListings.filter(l => l.status === BusinessStatus.PENDING);
    const pendingEvents = events.filter(e => e.status === EventStatus.PENDING);

    return (
        <div className="space-y-8">
            <AdminDashboard setCurrentView={setCurrentView} />

            {/* Business Listing Approvals */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                 <h3 className="text-xl font-bold text-white mb-6">Pending Business Approvals</h3>
                 {pendingListings.length > 0 ? (
                    <div className="space-y-4">
                        {pendingListings.map(listing => (
                            <div key={listing.id} className="bg-gray-700/50 p-4 rounded-lg flex flex-wrap justify-between items-center gap-4">
                                <div>
                                    <p className="font-semibold text-white">{listing.name}</p>
                                    <p className="text-sm text-gray-300">{listing.description}</p>
                                    <p className="text-xs text-indigo-400 mt-1">{listing.contact}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button 
                                        onClick={() => handleBusinessApproval(listing.id, BusinessStatus.REJECTED)}
                                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition"
                                    >
                                        Reject
                                    </button>
                                     <button 
                                        onClick={() => handleBusinessApproval(listing.id, BusinessStatus.APPROVED)}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition"
                                    >
                                        Approve
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                 ) : (
                    <p className="text-gray-400">No pending business listings to review.</p>
                 )}
            </div>

            {/* Event Approvals */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                 <h3 className="text-xl font-bold text-white mb-6">Pending Event Approvals</h3>
                 {pendingEvents.length > 0 ? (
                    <div className="space-y-4">
                        {pendingEvents.map(event => (
                            <div key={event.id} className="bg-gray-700/50 p-4 rounded-lg flex flex-wrap justify-between items-center gap-4">
                                <div>
                                    <p className="font-semibold text-white">{event.title}</p>
                                    <p className="text-sm text-gray-300">{event.description}</p>
                                    <p className="text-xs text-gray-400 mt-1">Submitted by: {getMemberName(event.submittedBy)}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button 
                                        onClick={() => onEventApproval(event.id, EventStatus.REJECTED)}
                                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition"
                                    >
                                        Reject
                                    </button>
                                     <button 
                                        onClick={() => onEventApproval(event.id, EventStatus.APPROVED)}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition"
                                    >
                                        Approve
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                 ) : (
                    <p className="text-gray-400">No pending events to review.</p>
                 )}
            </div>
            
            {/* Update Investment Details */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-white mb-6">Update Investment Details</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 text-white">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Asset</th>
                                <th className="text-right py-3 px-4 uppercase font-semibold text-sm">Current Value</th>
                                <th className="text-right py-3 px-4 uppercase font-semibold text-sm">Shares</th>
                                <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300">
                            {investments.map(inv => (
                                <tr key={inv.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="py-3 px-4">{inv.asset} ({inv.ticker})</td>
                                    <td className="text-right py-3 px-4">${inv.currentValue.toLocaleString()}</td>
                                    <td className="text-right py-3 px-4">{inv.shares}</td>
                                    <td className="text-center py-3 px-4">
                                        <button 
                                            onClick={() => handleOpenEditModal(inv)}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1 px-3 rounded-lg transition"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Contribution History */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-white mb-6">Contribution History</h3>
                 <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 text-white">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Member</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Amount</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300">
                            {CONTRIBUTIONS.map(c => (
                                <tr key={c.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="py-3 px-4">{getMemberName(c.memberId)}</td>
                                    <td className="py-3 px-4">${c.amount.toLocaleString()}</td>
                                    <td className="py-3 px-4">{c.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal}>
                <h3 className="text-lg font-bold text-white mb-4">Edit Investment: {editingInvestment?.ticker}</h3>
                {editingInvestment && (
                    <div className="space-y-4">
                         <div>
                            <label htmlFor="asset" className="block text-sm font-medium text-gray-300">Asset Name</label>
                            <input type="text" name="asset" id="asset" value={editingInvestment.asset} onChange={handleInvestmentChange} className="mt-1 w-full bg-gray-700 text-white rounded-md p-2" />
                        </div>
                        <div>
                            <label htmlFor="amountInvested" className="block text-sm font-medium text-gray-300">Amount Invested ($)</label>
                            <input type="number" name="amountInvested" id="amountInvested" value={editingInvestment.amountInvested} onChange={handleInvestmentChange} className="mt-1 w-full bg-gray-700 text-white rounded-md p-2" />
                        </div>
                        <div>
                            <label htmlFor="currentValue" className="block text-sm font-medium text-gray-300">Current Value ($)</label>
                            <input type="number" name="currentValue" id="currentValue" value={editingInvestment.currentValue} onChange={handleInvestmentChange} className="mt-1 w-full bg-gray-700 text-white rounded-md p-2" />
                        </div>
                        <div>
                            <label htmlFor="shares" className="block text-sm font-medium text-gray-300">Shares</label>
                            <input type="number" name="shares" id="shares" step="0.01" value={editingInvestment.shares} onChange={handleInvestmentChange} className="mt-1 w-full bg-gray-700 text-white rounded-md p-2" />
                        </div>
                    </div>
                )}
                <div className="mt-6 flex justify-end space-x-4">
                     <button onClick={handleCloseEditModal} className="py-2 px-4 rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500 transition">Cancel</button>
                    <button onClick={handleSaveChanges} className="py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition">Save Changes</button>
                </div>
            </Modal>
        </div>
    );
};

export default Admin;