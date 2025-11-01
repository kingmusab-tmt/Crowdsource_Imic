import React from 'react';
import { Transaction, TransactionStatus, Member } from '../types';

const statusColorMap = {
    [TransactionStatus.COMPLETED]: 'bg-green-500/20 text-green-300',
    [TransactionStatus.PENDING]: 'bg-yellow-500/20 text-yellow-300',
    [TransactionStatus.FAILED]: 'bg-red-500/20 text-red-300',
};

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const isPositive = transaction.amount >= 0;
    const amountPrefix = isPositive ? '+' : '';
    const amountColor = isPositive ? 'text-green-400' : 'text-red-400';
    
    return (
        <tr className="border-b border-gray-700 hover:bg-gray-700/50">
            <td className="py-3 px-4">{transaction.description}</td>
            <td className="py-3 px-4">{transaction.type}</td>
            <td className="py-3 px-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColorMap[transaction.status]}`}>
                    {transaction.status}
                </span>
            </td>
            <td className="py-3 px-4">{transaction.date}</td>
            <td className={`py-3 px-4 text-right font-mono ${amountColor}`}>
                {amountPrefix}${Math.abs(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
        </tr>
    );
};

interface TransactionsProps {
    transactions: Transaction[];
    currentUser: Member;
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, currentUser }) => {
    const userTransactions = transactions.filter(tx => tx.memberId === currentUser.id);
    
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white">My Transactions</h2>
                <p className="text-gray-400 mt-1">A complete history of your financial activities.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-white mb-6">Transaction History</h3>
                 <p className="text-sm text-gray-400 mb-6">An overview of all your deposits, withdrawals, and investments.</p>
                 <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800 text-white">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Description</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Type</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Status</th>
                                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
                                <th className="text-right py-3 px-4 uppercase font-semibold text-sm">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300">
                            {userTransactions.map(tx => (
                                <TransactionRow key={tx.id} transaction={tx} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Transactions;