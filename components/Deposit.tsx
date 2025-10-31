import React, { useState } from 'react';

const TabButton = ({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${
            isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'
        }`}
    >
        {label}
    </button>
);

const BankTransfer: React.FC = () => {
    const accountNumber = '1234567890';
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(accountNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Your Dedicated Account</h3>
            <p className="text-sm text-gray-400 mb-6">Transfer funds to this account, and it will be automatically credited to your contribution wallet within a few minutes.</p>
            <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-md">
                    <span className="text-gray-400">Bank Name:</span>
                    <span className="font-mono text-white">Club Trust Bank</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-md">
                    <span className="text-gray-400">Beneficiary Name:</span>
                    <span className="font-mono text-white">Admin User - ClubApp</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-md">
                    <span className="text-gray-400">Account Number:</span>
                    <div className="flex items-center space-x-3">
                        <span className="font-mono text-white">{accountNumber}</span>
                        <button onClick={handleCopy} className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold">
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CardPayment: React.FC = () => {
    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Pay with Card</h3>
            <p className="text-sm text-gray-400 mb-6">Securely make a one-time deposit using your credit or debit card.</p>
            <form className="space-y-4">
                <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300">Card Number</label>
                    <input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" className="mt-1 w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-300">Expiry Date</label>
                        <input type="text" id="expiryDate" placeholder="MM / YY" className="mt-1 w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="cvc" className="block text-sm font-medium text-gray-300">CVC</label>
                        <input type="text" id="cvc" placeholder="123" className="mt-1 w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                </div>
                 <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-300">Amount ($)</label>
                    <input type="number" id="amount" placeholder="100" className="mt-1 w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
                    Pay Now
                </button>
            </form>
        </div>
    );
};

const AutomatedDeposit: React.FC = () => {
    const [automation, setAutomation] = useState({ amount: 100, frequency: 'monthly', day: 1 });
    const [status, setStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');

    const handleConnect = () => {
        setStatus('connecting');
        setTimeout(() => {
            setStatus('connected');
        }, 2500); // Simulate API call and redirect
    };

    const renderContent = () => {
        switch (status) {
            case 'connecting':
                return (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto"></div>
                        <p className="mt-4 text-white font-semibold">Connecting to Monnify...</p>
                        <p className="text-sm text-gray-400">You are being redirected to their secure portal to complete the setup.</p>
                    </div>
                );
            case 'connected':
                return (
                    <div className="bg-gray-900/50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p className="text-green-400 font-semibold">Automation Active via Monnify</p>
                        </div>
                        <p className="text-gray-300 mt-2">
                            We will automatically deposit <span className="font-bold text-white">${automation.amount}</span> on the <span className="font-bold text-white">{automation.day}st</span> of every month.
                        </p>
                        <button onClick={() => setStatus('idle')} className="text-sm text-indigo-400 hover:text-indigo-300 mt-3">
                            Edit Settings
                        </button>
                    </div>
                );
            case 'idle':
            default:
                return (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="auto-amount" className="block text-sm font-medium text-gray-300">Amount per deposit ($)</label>
                            <input type="number" id="auto-amount" value={automation.amount} onChange={e => setAutomation({...automation, amount: parseInt(e.target.value)})} className="mt-1 w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600" />
                        </div>
                        <div>
                            <label htmlFor="auto-frequency" className="block text-sm font-medium text-gray-300">Frequency</label>
                            <select id="auto-frequency" value={automation.frequency} onChange={e => setAutomation({...automation, frequency: e.target.value})} className="mt-1 w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600">
                                <option value="monthly">Monthly</option>
                                <option value="weekly">Weekly</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="auto-day" className="block text-sm font-medium text-gray-300">Day of the Month</label>
                            <select id="auto-day" value={automation.day} onChange={e => setAutomation({...automation, day: parseInt(e.target.value)})} className="mt-1 w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600">
                               {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                                   <option key={day} value={day}>{day}</option>
                               ))}
                            </select>
                        </div>
                         <button onClick={handleConnect} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center space-x-2">
                            <span>Setup with Monnify</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Automated Deposits & Reminders</h3>
            <p className="text-sm text-gray-400 mb-6">Set up recurring contributions to ensure you never miss a payment. Connect your account via Monnify to handle deposits automatically.</p>
            {renderContent()}
        </div>
    );
};


const Deposit: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'manual' | 'automated'>('manual');
    const [activeManualTab, setActiveManualTab] = useState<'transfer' | 'card'>('transfer');

    return (
        <div className="space-y-6">
             <h2 className="text-2xl font-bold text-white">Deposit Funds</h2>
             <div className="bg-gray-800 p-2 rounded-lg shadow-lg flex space-x-2">
                <TabButton label="Manual Deposit" isActive={activeTab === 'manual'} onClick={() => setActiveTab('manual')} />
                <TabButton label="Automated Deposit Setup" isActive={activeTab === 'automated'} onClick={() => setActiveTab('automated')} />
             </div>

             {activeTab === 'manual' && (
                <div className="bg-gray-900/50 p-6 rounded-lg">
                    <div className="flex space-x-2 border-b border-gray-700 mb-6">
                        <button onClick={() => setActiveManualTab('transfer')} className={`pb-2 px-1 text-sm font-medium transition-colors ${activeManualTab === 'transfer' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}>Bank Transfer</button>
                        <button onClick={() => setActiveManualTab('card')} className={`pb-2 px-1 text-sm font-medium transition-colors ${activeManualTab === 'card' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}>Card Payment</button>
                    </div>
                    {activeManualTab === 'transfer' && <BankTransfer />}
                    {activeManualTab === 'card' && <CardPayment />}
                </div>
             )}

             {activeTab === 'automated' && (
                <div className="bg-gray-900/50 p-6 rounded-lg">
                    <AutomatedDeposit />
                </div>
             )}
        </div>
    );
};

export default Deposit;