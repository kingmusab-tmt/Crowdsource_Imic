import React, { useState } from 'react';
import { INVESTMENT_HISTORY } from '../constants';
import { Investment } from '../types';
import Modal from './Modal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface InvestmentsProps {
    investments: Investment[];
}

const Investments: React.FC<InvestmentsProps> = ({ investments }) => {
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);

    const handleViewHistory = (investment: Investment) => {
        setSelectedInvestment(investment);
        setIsHistoryModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsHistoryModalOpen(false);
        setSelectedInvestment(null);
    };

    const historyData = selectedInvestment ? INVESTMENT_HISTORY[selectedInvestment.ticker] : [];

    return (
        <>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6">Investment Portfolio</h2>
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

            <Modal isOpen={isHistoryModalOpen} onClose={handleCloseModal}>
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
                    <button onClick={handleCloseModal} className="py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition">Close</button>
                </div>
            </Modal>
        </>
    );
};

export default Investments;