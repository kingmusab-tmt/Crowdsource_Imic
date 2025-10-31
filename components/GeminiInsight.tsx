
import React, { useState } from 'react';
import { getFinancialInsight } from '../services/geminiService';
import { CONTRIBUTIONS, INVESTMENTS, PROPOSALS } from '../constants';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
    </div>
);

const GeminiInsight: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [insight, setInsight] = useState('');
    const [error, setError] = useState('');

    const generatePrompt = (query: string) => {
        const context = `
        You are a helpful financial analyst for a small investment club of alumni.
        Here is the current state of our group's finances:
        - Contributions Data: ${JSON.stringify(CONTRIBUTIONS.slice(0, 5))}
        - Investment Portfolio: ${JSON.stringify(INVESTMENTS)}
        - Active Proposals: ${JSON.stringify(PROPOSALS.filter(p => p.status === 'Open'))}

        Based on this data, please answer the following user query. Be concise, insightful, and provide actionable advice where appropriate.
        User Query: "${query}"
        `;
        return context;
    };

    const handleFetchInsight = async (query: string) => {
        setIsLoading(true);
        setError('');
        setInsight('');
        const prompt = generatePrompt(query);
        const result = await getFinancialInsight(prompt);
        if (result.startsWith('An error occurred') || result.startsWith('Gemini API key is not configured')) {
            setError(result);
        } else {
            setInsight(result);
        }
        setIsLoading(false);
    };

    const presetPrompts = [
        "Summarize our financial health.",
        "Analyze our investment diversification.",
        "Suggest a new investment idea."
    ];

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-full">
            <div className="flex items-center space-x-3 mb-4">
                <div className="bg-indigo-500/20 text-indigo-400 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">AI Financial Insight</h3>
            </div>
            
            <div className="space-y-2 mb-4">
                {presetPrompts.map(prompt => (
                     <button key={prompt} onClick={() => handleFetchInsight(prompt)} disabled={isLoading} className="w-full text-left text-sm bg-gray-700 hover:bg-gray-600 text-indigo-300 font-medium py-2 px-3 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        {prompt}
                    </button>
                ))}
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg min-h-[120px]">
                {isLoading && <LoadingSpinner />}
                {error && <p className="text-sm text-red-400">{error}</p>}
                {insight && <p className="text-sm text-gray-300 whitespace-pre-wrap">{insight}</p>}
                {!isLoading && !error && !insight && <p className="text-sm text-gray-500">Select a prompt above to generate an insight.</p>}
            </div>
        </div>
    );
};

export default GeminiInsight;
