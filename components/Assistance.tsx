import React, { useState } from 'react';
import { FinancialAssistanceRequest, AssistanceRequestStatus } from '../types';
import { MEMBERS } from '../constants';
import Modal from './Modal';

interface AssistanceProps {
    requests: FinancialAssistanceRequest[];
    onAddRequest: (amount: number, purpose: string) => void;
    onVote: (requestId: number, vote: 'for' | 'against') => void;
}

const statusColorMap: { [key in AssistanceRequestStatus]: string } = {
    [AssistanceRequestStatus.PENDING]: 'border-blue-500',
    [AssistanceRequestStatus.APPROVED]: 'border-green-500',
    [AssistanceRequestStatus.REJECTED]: 'border-red-500',
};

const statusTextColorMap: { [key in AssistanceRequestStatus]: string } = {
    [AssistanceRequestStatus.PENDING]: 'text-blue-400',
    [AssistanceRequestStatus.APPROVED]: 'text-green-400',
    [AssistanceRequestStatus.REJECTED]: 'text-red-400',
};

const AssistanceRequestCard: React.FC<{ request: FinancialAssistanceRequest; onVote: (requestId: number, vote: 'for' | 'against') => void; }> = ({ request, onVote }) => {
    const requester = MEMBERS.find(m => m.id === request.requesterId);
    const totalVotes = request.votesFor + request.votesAgainst;
    const forPercentage = totalVotes > 0 ? (request.votesFor / totalVotes) * 100 : 0;
    const againstPercentage = totalVotes > 0 ? (request.votesAgainst / totalVotes) * 100 : 0;
    const currentUserVoted = request.votedIds.includes(1); // Assuming current user has id 1

    return (
        <div className={`bg-gray-800 rounded-lg shadow-lg border-l-4 ${statusColorMap[request.status]} p-6`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-white">Request for ${request.amount.toLocaleString()}</h3>
                    <div className="flex items-center text-sm text-gray-400 mt-2">
                        <img src={requester?.avatarUrl} alt={requester?.name} className="w-6 h-6 rounded-full mr-2" />
                        <span>Requested by {requester?.name || 'Unknown'} on {request.requestDate}</span>
                    </div>
                </div>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${statusTextColorMap[request.status].replace('text-','bg-').replace('-400','/20')}`}>
                    {request.status}
                </span>
            </div>
            <p className="text-gray-300 mt-4 italic">"{request.purpose}"</p>
            
            <div className="mt-6">
                 <div className="flex justify-between items-center text-sm text-gray-300 mb-2">
                    <span className="font-semibold text-green-400">For: {request.votesFor} ({forPercentage.toFixed(0)}%)</span>
                    <span className="font-semibold text-red-400">Against: {request.votesAgainst} ({againstPercentage.toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 flex overflow-hidden">
                    <div className="bg-green-500 transition-all duration-500 ease-in-out" style={{ width: `${forPercentage}%` }}></div>
                    <div className="bg-red-500 transition-all duration-500 ease-in-out" style={{ width: `${againstPercentage}%` }}></div>
                </div>
            </div>

            {request.status === AssistanceRequestStatus.PENDING && (
                <div className="mt-6 flex justify-end items-center space-x-4">
                    {currentUserVoted && <p className="text-sm text-indigo-400">You have voted.</p>}
                    <button onClick={() => onVote(request.id, 'against')} disabled={currentUserVoted} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
                        Vote Against
                    </button>
                    <button onClick={() => onVote(request.id, 'for')} disabled={currentUserVoted} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
                        Vote For
                    </button>
                </div>
            )}
        </div>
    );
};

const Assistance: React.FC<AssistanceProps> = ({ requests, onAddRequest, onVote }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRequest, setNewRequest] = useState({ amount: '', purpose: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewRequest(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const amount = parseFloat(newRequest.amount);
        if (isNaN(amount) || amount <= 0 || !newRequest.purpose) {
            alert('Please enter a valid amount and purpose.');
            return;
        }
        onAddRequest(amount, newRequest.purpose);
        setIsModalOpen(false);
        setNewRequest({ amount: '', purpose: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-white">Financial Assistance Requests</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                    Request Assistance
                </button>
            </div>

            {requests.map(req => (
                <AssistanceRequestCard key={req.id} request={req} onVote={onVote} />
            ))}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h3 className="text-lg font-bold text-white mb-4">Request Financial Assistance</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-300">Amount Needed ($)</label>
                        <input type="number" name="amount" id="amount" value={newRequest.amount} onChange={handleInputChange} className="mt-1 w-full bg-gray-700 text-white rounded-md p-2" placeholder="e.g., 500" />
                    </div>
                    <div>
                        <label htmlFor="purpose" className="block text-sm font-medium text-gray-300">Purpose of Request</label>
                        <textarea name="purpose" id="purpose" value={newRequest.purpose} onChange={handleInputChange} rows={4} className="mt-1 w-full bg-gray-700 text-white rounded-md p-2" placeholder="Briefly explain why you need the funds."></textarea>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <button onClick={() => setIsModalOpen(false)} className="py-2 px-4 rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500 transition">Cancel</button>
                    <button onClick={handleSubmit} className="py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition">Submit Request</button>
                </div>
            </Modal>
        </div>
    );
};

export default Assistance;