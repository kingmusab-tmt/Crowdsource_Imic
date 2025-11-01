import React, { useState } from 'react';
import { MEMBERS } from '../constants';
import { Proposal, ProposalStatus, Member, Comment, CommentableItemType, Role } from '../types';
import Modal from './Modal';

// --- REUSABLE COMMENTS COMPONENT ---
interface CommentsProps {
    comments: Comment[];
    onAddComment: (content: string) => void;
    onDeleteComment?: (commentId: number) => void;
    currentUser: Member;
}

export const Comments: React.FC<CommentsProps> = ({ comments, onAddComment, onDeleteComment, currentUser }) => {
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            onAddComment(newComment.trim());
            setNewComment('');
        }
    };

    const findAuthor = (authorId: number) => {
        return MEMBERS.find(m => m.id === authorId);
    };

    return (
        <div className="mt-6 border-t border-gray-700 pt-4">
            <h4 className="text-md font-semibold text-gray-300 mb-4">Comments ({comments.length})</h4>
            <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                {comments.length > 0 ? comments.map(comment => {
                    const author = findAuthor(comment.authorId);
                    return (
                        <div key={comment.id} className="flex items-start space-x-3 group">
                            <img src={author?.avatarUrl} alt={author?.name} className="w-8 h-8 rounded-full flex-shrink-0" />
                            <div className="bg-gray-700 p-3 rounded-lg w-full relative">
                                <div className="flex items-baseline space-x-2">
                                    <p className="font-semibold text-white text-sm">{author?.name}</p>
                                    <p className="text-xs text-gray-400">{comment.timestamp}</p>
                                </div>
                                <p className="text-gray-300 text-sm mt-1">{comment.content}</p>
                                {currentUser.role === Role.ADMIN && onDeleteComment && (
                                    <button onClick={() => onDeleteComment(comment.id)} className="absolute top-2 right-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition p-1 rounded-full hover:bg-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                }) : <p className="text-sm text-gray-500">No comments yet. Be the first to say something!</p>}
            </div>
            <form onSubmit={handleSubmit} className="mt-4 flex items-start space-x-3">
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full flex-shrink-0" />
                <div className="w-full">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        rows={2}
                        className="w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                    <button type="submit" className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition duration-300 disabled:opacity-50" disabled={!newComment.trim()}>
                        Post Comment
                    </button>
                </div>
            </form>
        </div>
    );
};


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
    onAddComment: (content: string) => void;
    onDeleteComment: (commentId: number) => void;
    onUpdateProposal: (proposal: Proposal) => void;
    onDeleteProposal: (proposalId: number) => void;
    onUpdateStatus: (proposalId: number, newStatus: ProposalStatus) => void;
}> = ({ proposal, onVote, currentUser, onAddComment, onDeleteComment, onUpdateProposal, onDeleteProposal, onUpdateStatus }) => {
    const proposer = MEMBERS.find(m => m.id === proposal.proposedBy);
    const totalVotes = proposal.votesFor + proposal.votesAgainst;
    const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
    const againstPercentage = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;
    const currentUserVoted = proposal.votedIds.includes(currentUser.id);

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ title: proposal.title, description: proposal.description });
    
    const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
    const [overrideAction, setOverrideAction] = useState<'pass' | 'fail' | null>(null);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this proposal? This action cannot be undone.')) {
            onDeleteProposal(proposal.id);
        }
    };

    const handleUpdate = () => {
        onUpdateProposal({ ...proposal, ...editData });
        setIsEditing(false);
    };

    const handleOpenOverrideModal = (action: 'pass' | 'fail') => {
        setOverrideAction(action);
        setIsOverrideModalOpen(true);
    };
    
    const handleConfirmOverride = () => {
        if (overrideAction) {
            const newStatus = overrideAction === 'pass' ? ProposalStatus.PASSED : ProposalStatus.FAILED;
            onUpdateStatus(proposal.id, newStatus);
        }
        setIsOverrideModalOpen(false);
        setOverrideAction(null);
    };

    return (
        <div className={`bg-gray-800 rounded-lg shadow-lg border-l-4 ${statusColorMap[proposal.status]} p-6 relative`}>
             {currentUser.role === Role.ADMIN && (
                <div className="absolute top-4 right-4 flex space-x-2">
                    <button onClick={() => setIsEditing(true)} className="p-1.5 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-full transition" title="Edit Proposal">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                    </button>
                    <button onClick={handleDelete} className="p-1.5 text-gray-400 hover:text-white bg-gray-700 hover:bg-red-500/50 rounded-full transition" title="Delete Proposal">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    </button>
                </div>
            )}
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
                    <div className="bg-green-500 transition-all duration-500 ease-in-out" style={{ width: `${forPercentage}%` }}></div>
                    <div className="bg-red-500 transition-all duration-500 ease-in-out" style={{ width: `${againstPercentage}%` }}></div>
                </div>
            </div>

            {proposal.status === ProposalStatus.OPEN && (
                 <div className="mt-6 flex flex-wrap justify-end items-center gap-4">
                     {currentUser.role === Role.ADMIN && (
                         <div className="flex items-center gap-2 mr-auto">
                            <span className="text-xs font-semibold text-gray-400">ADMIN:</span>
                             <button onClick={() => handleOpenOverrideModal('pass')} className="bg-green-800/50 hover:bg-green-700/50 text-green-300 font-bold py-1 px-3 rounded-lg text-xs transition">
                                Manually Pass
                            </button>
                             <button onClick={() => handleOpenOverrideModal('fail')} className="bg-red-800/50 hover:bg-red-700/50 text-red-300 font-bold py-1 px-3 rounded-lg text-xs transition">
                                Manually Fail
                            </button>
                         </div>
                     )}
                    {currentUserVoted && <p className="text-sm text-indigo-400">You have voted.</p>}
                    <button onClick={() => onVote(proposal.id, 'against')} disabled={currentUserVoted} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                        Vote Against
                    </button>
                    <button onClick={() => onVote(proposal.id, 'for')} disabled={currentUserVoted} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                        Vote For
                    </button>
                </div>
            )}
            <Comments 
                comments={proposal.comments} 
                onAddComment={onAddComment}
                onDeleteComment={onDeleteComment}
                currentUser={currentUser}
            />

            <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
                <h3 className="text-lg font-bold text-white mb-4">Edit Proposal</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="title-edit" className="block text-sm font-medium text-gray-300">Title</label>
                        <input type="text" id="title-edit" value={editData.title} onChange={(e) => setEditData(prev => ({...prev, title: e.target.value}))} className="mt-1 w-full bg-gray-700 text-white rounded-md p-2" />
                    </div>
                    <div>
                        <label htmlFor="description-edit" className="block text-sm font-medium text-gray-300">Description</label>
                        <textarea id="description-edit" rows={4} value={editData.description} onChange={(e) => setEditData(prev => ({...prev, description: e.target.value}))} className="mt-1 w-full bg-gray-700 text-white rounded-md p-2" />
                    </div>
                </div>
                 <div className="mt-6 flex justify-end space-x-4">
                    <button onClick={() => setIsEditing(false)} className="py-2 px-4 rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500 transition">Cancel</button>
                    <button onClick={handleUpdate} className="py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition">Save Changes</button>
                </div>
            </Modal>
            
            <Modal isOpen={isOverrideModalOpen} onClose={() => setIsOverrideModalOpen(false)}>
                <h3 className="text-lg font-bold text-white mb-4">Confirm Override</h3>
                <p className="text-gray-300 mb-6">
                    Are you sure you want to manually <span className={`font-bold ${overrideAction === 'pass' ? 'text-green-400' : 'text-red-400'}`}>{overrideAction}</span> this proposal? This action will close voting and cannot be undone.
                </p>
                <div className="mt-6 flex justify-end space-x-4">
                    <button onClick={() => setIsOverrideModalOpen(false)} className="py-2 px-4 rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500 transition">Cancel</button>
                    <button onClick={handleConfirmOverride} className={`py-2 px-4 rounded-md text-white ${overrideAction === 'pass' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} transition`}>
                        Confirm
                    </button>
                </div>
            </Modal>
        </div>
    );
};

interface ProposalsProps {
    currentUser: Member;
    proposals: Proposal[];
    setProposals: React.Dispatch<React.SetStateAction<Proposal[]>>;
    onAddProposal: (title: string, description: string) => void;
    onUpdateProposal: (proposal: Proposal) => void;
    onDeleteProposal: (proposalId: number) => void;
    onUpdateProposalStatus: (proposalId: number, newStatus: ProposalStatus) => void;
    onAddComment: (itemId: number, itemType: CommentableItemType, content: string) => void;
    onDeleteComment: (commentId: number, itemId: number, itemType: CommentableItemType) => void;
}

const Proposals: React.FC<ProposalsProps> = ({ currentUser, proposals, setProposals, onAddProposal, onUpdateProposal, onDeleteProposal, onUpdateProposalStatus, onAddComment, onDeleteComment }) => {
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
                <ProposalCard 
                    key={p.id} 
                    proposal={p} 
                    onVote={handleVote} 
                    currentUser={currentUser} 
                    onAddComment={(content) => onAddComment(p.id, CommentableItemType.PROPOSAL, content)}
                    onDeleteComment={(commentId) => onDeleteComment(commentId, p.id, CommentableItemType.PROPOSAL)}
                    onUpdateProposal={onUpdateProposal}
                    onDeleteProposal={onDeleteProposal}
                    onUpdateStatus={onUpdateProposalStatus}
                />
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
