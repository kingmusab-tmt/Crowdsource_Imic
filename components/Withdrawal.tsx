import React, { useState } from 'react';
import { INVESTMENTS, CONTRIBUTIONS, CURRENT_USER, BANKS } from '../constants';

const Withdrawal: React.FC = () => {
    // Calculate profit share logic, same as dashboard
    const totalInvested = INVESTMENTS.reduce((acc, inv) => acc + inv.amountInvested, 0);
    const currentValue = INVESTMENTS.reduce((acc, inv) => acc + inv.currentValue, 0);
    const communityProfit = currentValue - totalInvested;
    const totalContributions = CONTRIBUTIONS.reduce((acc, c) => acc + c.amount, 0);
    const myTotalContribution = CONTRIBUTIONS.filter(c => c.memberId === CURRENT_USER.id).reduce((acc, c) => acc + c.amount, 0);
    const myProfitShare = totalContributions > 0 ? (myTotalContribution / totalContributions) * communityProfit : 0;
    const availableProfit = myProfitShare - CURRENT_USER.withdrawnProfit;

    const [withdrawAmount, setWithdrawAmount] = useState<string>('');
    const [selectedBank, setSelectedBank] = useState<string>('');
    const [accountNumber, setAccountNumber] = useState<string>('');
    const [reinvestAmount, setReinvestAmount] = useState<string>('');

    const handleWithdrawSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!withdrawAmount || !selectedBank || !accountNumber) {
            alert('Please fill all withdrawal fields.');
            return;
        }
        if (parseFloat(withdrawAmount) > availableProfit) {
            alert('Withdrawal amount cannot exceed available profit.');
            return;
        }
        alert(`Withdrawal request for $${withdrawAmount} submitted for account ${accountNumber} at ${selectedBank}.`);
        setWithdrawAmount('');
        setSelectedBank('');
        setAccountNumber('');
    };
    
    const handleReinvestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
         if (!reinvestAmount) {
            alert('Please enter an amount to reinvest.');
            return;
        }
        if (parseFloat(reinvestAmount) > availableProfit) {
            alert('Reinvestment amount cannot exceed available profit.');
            return;
        }
        alert(`$${reinvestAmount} has been reinvested into the community fund.`);
        setReinvestAmount('');
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-white">Withdraw & Reinvest</h2>
                <p className="text-gray-400 mt-1">Manage your profits by withdrawing to your bank or reinvesting into the community fund.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Withdraw Profits Section */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6 flex flex-col">
                    <div>
                        <h3 className="text-xl font-bold text-white">Withdraw Profits</h3>
                        <p className="text-sm text-gray-400 mt-1">Request a withdrawal of your available profits to your local bank account. Requests are processed within 3-5 business days.</p>
                    </div>

                    <div className="bg-gray-900/50 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Available for Withdrawal</p>
                        <p className="text-2xl font-bold text-white">${availableProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>

                    <form onSubmit={handleWithdrawSubmit} className="space-y-4 flex-grow flex flex-col">
                        <div className="flex-grow space-y-4">
                            <div>
                                <label htmlFor="withdraw-amount" className="block text-sm font-medium text-gray-300">Amount to Withdraw (USD)</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="withdraw-amount"
                                        id="withdraw-amount"
                                        className="w-full bg-gray-700 text-white rounded-md p-2 pl-7 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder={availableProfit.toFixed(2)}
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        max={availableProfit}
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="bank-name" className="block text-sm font-medium text-gray-300">Bank Name</label>
                                <select
                                    id="bank-name"
                                    name="bank-name"
                                    className="mt-1 block w-full pl-3 pr-10 py-2 bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    value={selectedBank}
                                    onChange={(e) => setSelectedBank(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select your bank</option>
                                    {BANKS.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                                </select>
                            </div>
                            
                            <div>
                                <label htmlFor="account-number" className="block text-sm font-medium text-gray-300">Account Number</label>
                                <input
                                    type="text"
                                    name="account-number"
                                    id="account-number"
                                    className="mt-1 w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Your 10-digit account number"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    maxLength={10}
                                    pattern="\d{10}"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
                            Submit Withdrawal Request
                        </button>
                    </form>
                </div>

                {/* Reinvest Profits Section */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6 flex flex-col">
                    <div>
                        <h3 className="text-xl font-bold text-white">Reinvest Profits</h3>
                        <p className="text-sm text-gray-400 mt-1">Grow your contribution by reinvesting your profits back into the community fund.</p>
                    </div>
                     <div className="bg-gray-900/50 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Available for Reinvestment</p>
                        <p className="text-2xl font-bold text-white">${availableProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>

                     <form onSubmit={handleReinvestSubmit} className="space-y-4 flex-grow flex flex-col">
                        <div className="flex-grow space-y-4">
                            <div>
                                <label htmlFor="reinvest-amount" className="block text-sm font-medium text-gray-300">Amount to Reinvest (USD)</label>
                                 <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="reinvest-amount"
                                        id="reinvest-amount"
                                        className="w-full bg-gray-700 text-white rounded-md p-2 pl-7 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder={availableProfit.toFixed(2)}
                                        value={reinvestAmount}
                                        onChange={(e) => setReinvestAmount(e.target.value)}
                                        max={availableProfit}
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="bg-indigo-900/30 border-l-4 border-indigo-500 p-4 rounded-r-lg flex-grow flex flex-col justify-center">
                                <h4 className="font-semibold text-indigo-300">Why Reinvest?</h4>
                                <p className="text-sm text-gray-300 mt-1">Reinvesting your profits helps fund more community projects and businesses, increasing the potential for collective growth and higher future returns for all members.</p>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
                           Reinvest Now
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Withdrawal;
