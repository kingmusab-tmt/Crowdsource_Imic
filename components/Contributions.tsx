import React, { useState } from 'react';
import { CONTRIBUTIONS, MEMBERS } from '../constants';
import Modal from './Modal';
import { Contribution } from '../types';

interface ContributionsProps {
    isReminderSet: boolean;
    setIsReminderSet: (value: boolean) => void;
}

const Contributions: React.FC<ContributionsProps> = ({ isReminderSet, setIsReminderSet }) => {
    const [contributions, setContributions] = useState<Contribution[]>(CONTRIBUTIONS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newContributionAmount, setNewContributionAmount] = useState(100);

    const getMemberName = (memberId: number) => {
        return MEMBERS.find(m => m.id === memberId)?.name || 'Unknown Member';
    };

    const handleAddContribution = () => {
        const newContribution: Contribution = {
            id: contributions.length + 1,
            memberId: 1, // Assuming logged-in user is Admin User (id: 1)
            amount: newContributionAmount,
            date: new Date().toISOString().split('T')[0],
        };
        setContributions([newContribution, ...contributions]);
        setIsModalOpen(false);
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-white">Contribution History</h2>
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => setIsReminderSet(!isReminderSet)}
                        className={`font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 ${
                            isReminderSet 
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                            : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                        }`}
                    >
                        {isReminderSet ? 'Disable Reminder' : 'Set Monthly Reminder'}
                    </button>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Log My Contribution
                    </button>
                </div>
            </div>
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
                        {contributions.map(c => (
                            <tr key={c.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="py-3 px-4">{getMemberName(c.memberId)}</td>
                                <td className="py-3 px-4">${c.amount.toLocaleString()}</td>
                                <td className="py-3 px-4">{c.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h3 className="text-lg font-bold text-white mb-4">Log New Contribution</h3>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300">Amount</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                            type="number"
                            name="amount"
                            id="amount"
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-600 bg-gray-700 rounded-md py-2 text-white"
                            placeholder="100.00"
                            value={newContributionAmount}
                            onChange={(e) => setNewContributionAmount(parseFloat(e.target.value))}
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                     <button onClick={() => setIsModalOpen(false)} className="py-2 px-4 rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500 transition">Cancel</button>
                    <button onClick={handleAddContribution} className="py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition">Confirm</button>
                </div>
            </Modal>
        </div>
    );
};

export default Contributions;