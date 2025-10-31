import React, { useState } from 'react';
import { MEMBERS } from '../constants';
import { Proposal, ProposalStatus, Member } from '../types';
import Modal from './Modal';

const statusColorMap: { [key in ProposalStatus]: string } = {
  [ProposalStatus.OPEN]: 'border-blue-500',
  [ProposalStatus.PASSED]: 'border-green-500',
  [ProposalStatus.FAILED]: 'border-red-500',
};

const statusTextColorMap: { [key in ProposalStatus]: string } = {
    [ProposalStatus.OPEN]: 'text-blue-400',
    [ProposalStatus.PASSED]: 'text-green-400',
    [ProposalStatus.FAILED]: 'text-red-400',
};

const ProposalCard: React.FC<{
    proposal: Proposal;
    onVote: (proposalId: number, vote: 'for' | 'against') => void;
    currentUser: Member;
}> = ({ proposal, onVote, currentUser }) => {
    const proposer = MEMBERS.find(m => m.id === proposal.proposedBy);
    const totalVotes = proposal.votesFor + proposal.votesAgainst;
    const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
    const againstPercentage = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;
    const currentUserVoted = proposal.votedIds.includes(currentUser.id);

    return (
        <div className={`bg-gray-800 rounded-lg shadow-lg border-l-4 ${statusColorMap[proposal.status]} p-6`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-white">{proposal.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">Proposed by {proposer?.name || 'Unknown'}</p>
                </div>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${statusTextColorMap[proposal.status].replace('text-','bg-').replace('-400','/20')}`}>
                    {proposal.status}
                </span>
            </div>
            <p className="text-gray-300 mt-4">{proposal.description}</p>
            
            <div className="mt-6">
                <div className="flex justify-between items-center text-sm text-gray-300 mb-2">
                    <span className="font-semibold text-green-400">For: {proposal.votesFor} ({forPercentage.toFixed(0)}%)</span>
                    <span className="font-semibold text-red-400">Against: {proposal.votesAgainst} ({againstPercentage.toFixed(0)}%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 flex overflow-hidden" title={`Votes: ${proposal.votesFor} For, ${proposal.votesAgainst} Against`}>
                    <div
                        className="bg-green-500 transition-all duration-500 ease-in-out"
                        style={{ width: `${forPercentage}%` }}
                    ></div>
                    <div
                        className="bg-red-500 transition-all duration-500 ease-in-out"
                        style={{ width: `${againstPercentage}%` }}
                    ></div>
                </div>
            </div>

            {proposal.status === ProposalStatus.OPEN && (
                <div className="mt-6 flex justify-end items-center space-x-4">
                    {currentUserVoted && <p className="text-sm text-indigo-400">You have voted.</p>}
                    <button
                        onClick={() => onVote(proposal.id, 'against')}
                        disabled={currentUserVoted}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                        Vote Against
                    </button>
                    <button
                        onClick={() => onVote(proposal.id, 'for')}
                        disabled={currentUserVoted}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                        Vote For
                    </button>
                </div>
            )}
        </div>
    );
};

interface ProposalsProps {
    currentUser: Member;
    proposals: Proposal[];
    setProposals: React.Dispatch<React.SetStateAction<Proposal[]>>;
    onAddProposal: (title: string, description: string) => void;
}

const Proposals: React.FC<ProposalsProps> = ({ currentUser, proposals, setProposals, onAddProposal }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProposal, setNewProposal] = useState({ title: '', description: '' });
    
    const handleVote = (proposalId: number, vote: 'for' | 'against') => {
        setProposals(prevProposals => 
            prevProposals.map(p => {
                if (p.id === proposalId && !p.votedIds.includes(currentUser.id)) {
                    return {
                        ...p,
                        votesFor: vote === 'for' ? p.votesFor + 1 : p.votesFor,
                        votesAgainst: vote === 'against' ? p.votesAgainst + 1 : p.votesAgainst,
                        votedIds: [...p.votedIds, currentUser.id]
                    };
                }
                return p;
            })
        );
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewProposal(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!newProposal.title || !newProposal.description) {
            alert('Please fill in both title and description.');
            return;
        }
        onAddProposal(newProposal.title, newProposal.description);
        setIsModalOpen(false);
        setNewProposal({ title: '', description: '' });
    };

    return (
        <div className="space-y-6">
             <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-white">Group Proposals</h2>
                 <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                    Create New Proposal
                </button>
            </div>
            {proposals.map(p => (
                <ProposalCard key={p.id} proposal={p} onVote={handleVote} currentUser={currentUser} />
            ))}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h3 className="text-lg font-bold text-white mb-4">Create New Proposal</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
                        <input type="text" name="title" id="title" value={newProposal.title} onChange={handleInputChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-600 bg-gray-700 rounded-md py-2 px-3 text-white" />
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                        <textarea name="description" id="description" value={newProposal.description} onChange={handleInputChange} rows={4} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-600 bg-gray-700 rounded-md py-2 px-3 text-white"></textarea>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                     <button onClick={() => setIsModalOpen(false)} className="py-2 px-4 rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500 transition">Cancel</button>
                    <button onClick={handleSubmit} className="py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition">Submit Proposal</button>
                </div>
            </Modal>
        </div>
    );
};

export default Proposals;