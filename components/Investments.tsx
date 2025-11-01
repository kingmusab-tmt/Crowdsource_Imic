import React, { useState } from 'react';
import { INVESTMENT_HISTORY } from '../constants';
import { Investment } from '../types';
import Modal from './Modal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface InvestmentsProps {
    investments: Investment[];
    onAddInvestment: (investment: Omit<Investment, 'id'>) => void;
}

const Investments: React.FC<InvestmentsProps> = ({ investments, onAddInvestment }) => {
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const initialFormState = {
        asset: '',
        ticker: '',
        amountInvested: 0,
        currentValue: 0,
        shares: 0,
    };
    const [newInvestmentData, setNewInvestmentData] = useState<Omit<Investment, 'id'>>(initialFormState);


    const handleViewHistory = (investment: Investment) => {
        setSelectedInvestment(investment);
        setIsHistoryModalOpen(true);
    };

    const handleCloseHistoryModal = () => {
        setIsHistoryModalOpen(false);
        setSelectedInvestment(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const isNumeric = ['amountInvested', 'currentValue', 'shares'].includes(name);
        setNewInvestmentData(prev => ({
            ...prev,
            [name]: isNumeric ? parseFloat(value) || 0 : value,
        }));
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newInvestmentData.asset || !newInvestmentData.ticker) {
            alert('Please fill in at least the Asset Name and Ticker.');
            return;
        }
        onAddInvestment(newInvestmentData);
        setIsAddModalOpen(false);
        setNewInvestmentData(initialFormState);
    };

    const historyData = selectedInvestment ? INVESTMENT_HISTORY[selectedInvestment.ticker] : [];

    return (
        <>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                 <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-white">Investment Portfolio</h2>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Add New Investment
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 text-white">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Asset</th>
                                <th className="text-right py-3 px-4 uppercase font-semibold text-sm">Amount Invested</th>
                                <th className="text-right py-3 px-4 uppercase font-semibold text-sm">Current Value</th>
                                <th className="text-right py-3 px-4 uppercase font-semibold text-sm">Gain / Loss</th>
                                <th className="text-right py-3 px-4 uppercase font-semibold text-sm">% Gain / Loss</th>
                                <th className="text-right py-3 px-4 uppercase font-semibold text-sm">Shares</th>
                                <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300">
                            {investments.map(inv => {
                                const gainLoss = inv.currentValue - inv.amountInvested;
                                const isPositive = gainLoss >= 0;
                                const percentageGainLoss = inv.amountInvested !== 0 ? (gainLoss / inv.amountInvested) * 100 : 0;
                                return (
                                    <tr key={inv.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                        <td className="py-3 px-4">
                                            <div className='font-bold'>{inv.ticker}</div>
                                            <div className='text-xs text-gray-400'>{inv.asset}</div>
                                        </td>
                                        <td className="text-right py-3 px-4">${inv.amountInvested.toLocaleString()}</td>
                                        <td className="text-right py-3 px-4">${inv.currentValue.toLocaleString()}</td>
                                        <td className={`text-right py-3 px-4 font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                            {isPositive ? '+' : ''}${gainLoss.toLocaleString()}
                                        </td>
                                        <td className={`text-right py-3 px-4 font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                            {isPositive ? '+' : ''}{percentageGainLoss.toFixed(2)}%
                                        </td>
                                        <td className="text-right py-3 px-4">{inv.shares}</td>
                                        <td className="text-center py-3 px-4">
                                            <button 
                                                onClick={() => handleViewHistory(inv)}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1 px-3 rounded-lg transition"
                                            >
                                                View History
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isHistoryModalOpen} onClose={handleCloseHistoryModal}>
                <h3 className="text-lg font-bold text-white mb-4">
                    Historical Performance for {selectedInvestment?.ticker}
                </h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                            <XAxis dataKey="date" tick={{ fill: '#a0aec0', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#a0aec0', fontSize: 12 }} domain={['dataMin - 50', 'dataMax + 50']} />
                            <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: 'none' }} />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-6 flex justify-end">
                    <button onClick={handleCloseHistoryModal} className="py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition">Close</button>
                </div>
            </Modal>
            
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <form onSubmit={handleAddSubmit}>
                    <h3 className="text-lg font-bold text-white mb-4">Add New Investment</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="asset" className="block text-sm font-medium text-gray-300">Asset Name</label>
                            <input type="text" name="asset" id="asset" value={newInvestmentData.asset} onChange={handleInputChange} className="mt-1 w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500" required />
                        </div>
                        <div>
                            <label htmlFor="ticker" className="block text-sm font-medium text-gray-300">Ticker Symbol</label>
                            <input type="text" name="ticker" id="ticker" value={newInvestmentData.ticker} onChange={handleInputChange} className="mt-1 w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500" required />
                        </div>
                        <div>
                            <label htmlFor="amountInvested" className="block text-sm font-medium text-gray-300">Amount Invested ($)</label>
                            <input type="number" name="amountInvested" id="amountInvested" value={newInvestmentData.amountInvested} onChange={handleInputChange} className="mt-1 w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500" step="0.01" />
                        </div>
                        <div>
                            <label htmlFor="currentValue" className="block text-sm font-medium text-gray-300">Current Value ($)</label>
                            <input type="number" name="currentValue" id="currentValue" value={newInvestmentData.currentValue} onChange={handleInputChange} className="mt-1 w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500" step="0.01" />
                        </div>
                        <div>
                            <label htmlFor="shares" className="block text-sm font-medium text-gray-300">Shares</label>
                            <input type="number" name="shares" id="shares" value={newInvestmentData.shares} onChange={handleInputChange} className="mt-1 w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500" step="0.01" />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="py-2 px-4 rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500 transition">Cancel</button>
                        <button type="submit" className="py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition">Add Investment</button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default Investments;