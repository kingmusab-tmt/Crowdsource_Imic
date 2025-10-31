
import React, { useState } from 'react';
import { BusinessListing, BusinessStatus } from '../types';
import { MEMBERS } from '../constants';
import Modal from './Modal';

interface MarketplaceProps {
    businessListings: BusinessListing[];
    setBusinessListings: React.Dispatch<React.SetStateAction<BusinessListing[]>>;
}

const BusinessCard: React.FC<{ listing: BusinessListing }> = ({ listing }) => {
    const owner = MEMBERS.find(m => m.id === listing.ownerId);
    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col justify-between">
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
        </div>
    );
}

const Marketplace: React.FC<MarketplaceProps> = ({ businessListings, setBusinessListings }) => {
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
        const newBusiness: BusinessListing = {
            id: Date.now(),
            ...newListing,
            ownerId: 1, // Assume Admin user is submitting
            status: BusinessStatus.PENDING,
        };
        setBusinessListings(prev => [...prev, newBusiness]);
        setIsModalOpen(false);
        setNewListing({ name: '', description: '', website: '', contact: '' });
    };

    const approvedListings = businessListings.filter(l => l.status === BusinessStatus.APPROVED);

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
            {approvedListings.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {approvedListings.map(listing => (
                        <BusinessCard key={listing.id} listing={listing} />
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
