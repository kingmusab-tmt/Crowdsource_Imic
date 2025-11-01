import React, { useState } from 'react';
import { Member, WithdrawalRequest, WithdrawalStatus } from '../types';
import Modal from './Modal';

interface WithdrawalProps {
    currentUser: Member;
    withdrawalRequests: WithdrawalRequest[];
    onAddWithdrawalRequest: (requestData: Omit<WithdrawalRequest, 'id' | 'date' | 'status' | 'memberId'>) => void;
}

const statusColorMap: { [key in WithdrawalStatus]: string } = {
    [WithdrawalStatus.COMPLETED]: 'bg-green-500/20 text-green-300',
    [WithdrawalStatus.PENDING]: 'bg-yellow-500/20 text-yellow-300',
    [WithdrawalStatus.REJECTED]: 'bg-red-500/20 text-red-300',
};

const Withdrawal: React.FC<WithdrawalProps> = ({ currentUser, withdrawalRequests, onAddWithdrawalRequest }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRequest, setNewRequest] = useState({
        amount: '',
        bankName: 'Chase',
        accountNumber: '...6789'
    });
    
    const availableForWithdrawal = currentUser.availableProfit;
    const userWithdrawalHistory = withdrawalRequests.filter(r => r.memberId === currentUser.id);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewRequest(prev => ({...prev, [name]: value}));
    };
    
    const handleSubmitRequest = () => {
        const amount = parseFloat(newRequest.amount);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }
        if (amount > availableForWithdrawal) {
            alert('Withdrawal amount exceeds available profit.');
            return;
        }
        onAddWithdrawalRequest({
            amount,
            bankName: newRequest.bankName,
            accountNumber: newRequest.accountNumber,
        });

        setIsModalOpen(false);
        setNewRequest({ amount: '', bankName: 'Chase', accountNumber: '...6789' });
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Withdraw Funds</h2>
                    <p className="text-gray-400 mt-1">Request a withdrawal of your profits from the club.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    New Withdrawal Request
                </button>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-white mb-2">Available for Withdrawal</h3>
                <p className="text-3xl font-bold text-green-400">${availableForWithdrawal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="text-sm text-gray-400 mt-1">This is the portion of your investment profit that you can withdraw.</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-white mb-6">Withdrawal History</h3>
                 <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 text-white">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
                                <th className="text-right py-3 px-4 uppercase font-semibold text-sm">Amount</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Bank</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300">
                           {userWithdrawalHistory.map(req => (
                                <tr key={req.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="py-3 px-4">{req.date}</td>
                                    <td className="py-3 px-4 text-right font-mono">${req.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="py-3 px-4">{req.bankName} ({req.accountNumber})</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColorMap[req.status]}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                </tr>
                           ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h3 className="text-lg font-bold text-white mb-4">New Withdrawal Request</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-300">Amount ($)</label>
                        <input type="number" name="amount" id="amount" value={newRequest.amount} onChange={handleInputChange} className="mt-1 w-full bg-gray-700 text-white rounded-md p-2" placeholder={`Max $${availableForWithdrawal.toLocaleString()}`} />
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-300">Destination Account</label>
                         <div className="mt-1 bg-gray-700/50 p-3 rounded-md">
                            <p className="text-white">{newRequest.bankName}</p>
                            <p className="text-gray-400 text-sm">Account ending in {newRequest.accountNumber}</p>
                         </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                     <button onClick={() => setIsModalOpen(false)} className="py-2 px-4 rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500 transition">Cancel</button>
                    <button onClick={handleSubmitRequest} className="py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition">Submit Request</button>
                </div>
            </Modal>
        </div>
    );
};

export default Withdrawal;