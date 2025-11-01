import React, { useState } from 'react';
import { BusinessListing, BusinessStatus, Member, CommentableItemType, Role } from '../types';
import { MEMBERS } from '../constants';
import Modal from './Modal';
import { Comments } from './Proposals';

interface MarketplaceProps {
    businessListings: BusinessListing[];
    onAddBusiness: (newListing: Omit<BusinessListing, 'id' | 'ownerId' | 'status' | 'comments'>) => void;
    onUpdateBusinessListing: (listing: BusinessListing) => void;
    onDeleteBusinessListing: (listingId: number) => void;
    currentUser: Member;
    onAddComment: (itemId: number, itemType: CommentableItemType, content: string) => void;
    onDeleteComment: (commentId: number, itemId: number, itemType: CommentableItemType) => void;
}

const BusinessCard: React.FC<{ 
    listing: BusinessListing; 
    currentUser: Member; 
    onAddComment: (content: string) => void;
    onDeleteComment: (commentId: number) => void;
    onUpdate: (listing: BusinessListing) => void;
    onDelete: (listingId: number) => void;
}> = ({ listing, currentUser, onAddComment, onDeleteComment, onUpdate, onDelete }) => {
    const owner = MEMBERS.find(m => m.id === listing.ownerId);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        name: listing.name,
        description: listing.description,
        website: listing.website || '',
        contact: listing.contact
    });

    const handleUpdate = () => {
        onUpdate({ ...listing, ...editData });
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this business listing?')) {
            onDelete(listing.id);
        }
    };

    return (
        <>
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col justify-between relative">
                {currentUser.role === Role.ADMIN && (
                    <div className="absolute top-4 right-4 flex space-x-2">
                        <button onClick={() => setIsEditing(true)} className="p-1.5 text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-full transition">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                        </button>
                        <button onClick={handleDelete} className="p-1.5 text-gray-400 hover:text-white bg-gray-700 hover:bg-red-500/50 rounded-full transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                )}
                <div>
                    <h3 className="text-xl font-bold text-white">{listing.name}</h3>
                    <div className="flex items-center mt-2 mb-4">
                        <img src={owner?.avatarUrl} alt={owner?.name} className="w-8 h-8 rounded-full mr-3" />
                        <span className="text-sm text-gray-400">{owner?.name || 'Unknown Member'}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{listing.description}</p>
                </div>
                <div className="mt-6 flex justify-end items-center space-x-4">
                    {listing.website && (
                        <a href={listing.website} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition">
                            Website
                        </a>
                    )}
                    <a href={`mailto:${listing.contact}`} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition">
                        Contact
                    </a>
                </div>
                <Comments
                    comments={listing.comments}
                    onAddComment={onAddComment}
                    onDeleteComment={onDeleteComment}
                    currentUser={currentUser}
                />
            </div>
            <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
                <h3 className="text-lg font-bold text-white mb-4">Edit Business Listing</h3>
                <div className="space-y-4">
                    <input type="text" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="w-full bg-gray-700 text-white rounded-md p-2" />
                    <textarea rows={3} value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})} className="w-full bg-gray-700 text-white rounded-md p-2" />
                    <input type="text" value={editData.website} onChange={e => setEditData({...editData, website: e.target.value})} className="w-full bg-gray-700 text-white rounded-md p-2" />
                    <input type="email" value={editData.contact} onChange={e => setEditData({...editData, contact: e.target.value})} className="w-full bg-gray-700 text-white rounded-md p-2" />
                </div>
                 <div className="mt-6 flex justify-end space-x-4">
                     <button onClick={() => setIsEditing(false)} className="py-2 px-4 rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500 transition">Cancel</button>
                    <button onClick={handleUpdate} className="py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition">Save Changes</button>
                </div>
            </Modal>
        </>
    );
}

const Marketplace: React.FC<MarketplaceProps> = ({ businessListings, onAddBusiness, onUpdateBusinessListing, onDeleteBusinessListing, currentUser, onAddComment, onDeleteComment }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newListing, setNewListing] = useState({ name: '', description: '', website: '', contact: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewListing(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = () => {
        if (!newListing.name || !newListing.description || !newListing.contact) {
            alert('Please fill in all required fields.');
            return;
        }
        onAddBusiness(newListing);
        setIsModalOpen(false);
        setNewListing({ name: '', description: '', website: '', contact: '' });
    };

    const listingsToShow = currentUser.role === Role.ADMIN ? businessListings : businessListings.filter(l => l.status === BusinessStatus.APPROVED);

    return (
        <div>
             <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-white">Member Marketplace</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                    Submit Your Business
                </button>
            </div>
            {listingsToShow.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listingsToShow.map(listing => (
                        <BusinessCard 
                            key={listing.id} 
                            listing={listing}
                            currentUser={currentUser}
                            onAddComment={(content) => onAddComment(listing.id, CommentableItemType.BUSINESS_LISTING, content)}
                            onDeleteComment={(commentId) => onDeleteComment(commentId, listing.id, CommentableItemType.BUSINESS_LISTING)}
                            onUpdate={onUpdateBusinessListing}
                            onDelete={onDeleteBusinessListing}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-800 rounded-lg">
                    <h3 className="text-xl font-semibold text-white">The Marketplace is Empty</h3>
                    <p className="text-gray-400 mt-2">Be the first to list your business!</p>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h3 className="text-lg font-bold text-white mb-4">Submit Your Business</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Business Name</label>
                        <input type="text" name="name" id="name" value={newListing.name} onChange={handleInputChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-600 bg-gray-700 rounded-md py-2 px-3 text-white" />
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                        <textarea name="description" id="description" value={newListing.description} onChange={handleInputChange} rows={3} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-600 bg-gray-700 rounded-md py-2 px-3 text-white"></textarea>
                    </div>
                     <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-300">Website (Optional)</label>
                        <input type="text" name="website" id="website" value={newListing.website} onChange={handleInputChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-600 bg-gray-700 rounded-md py-2 px-3 text-white" />
                    </div>
                     <div>
                        <label htmlFor="contact" className="block text-sm font-medium text-gray-300">Contact Email</label>
                        <input type="email" name="contact" id="contact" value={newListing.contact} onChange={handleInputChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-600 bg-gray-700 rounded-md py-2 px-3 text-white" />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                     <button onClick={() => setIsModalOpen(false)} className="py-2 px-4 rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500 transition">Cancel</button>
                    <button onClick={handleSubmit} className="py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition">Submit for Approval</button>
                </div>
            </Modal>
        </div>
    );
};

export default Marketplace;