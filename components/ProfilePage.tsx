import React, { useState, useEffect } from 'react';
import { Member } from '../types';

interface ProfilePageProps {
    currentUser: Member;
    onUpdateUser: (updatedUser: Member) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, onUpdateUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Member>(currentUser);

    useEffect(() => {
        setFormData(currentUser);
    }, [currentUser]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = () => {
        onUpdateUser(formData);
        setIsEditing(false);
    };
    
    const handleCancelEdit = () => {
        setFormData(currentUser);
        setIsEditing(false);
    };

    const ProfileField: React.FC<{ label: string; value: string; name?: keyof Member; isEditing?: boolean; type?: string; rows?: number; }> = 
    ({ label, value, name, isEditing, type = "text", rows }) => (
        <div>
            <label className="block text-sm font-medium text-gray-400">{label}</label>
            {isEditing && name ? (
                rows ? (
                     <textarea
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        rows={rows}
                        className="mt-1 w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                ) : (
                    <input
                        type={type}
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        className="mt-1 w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                )
            ) : (
                <p className="mt-1 text-white text-lg">{value}</p>
            )}
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h2 className="text-3xl font-bold text-white">My Profile</h2>
                {!isEditing ? (
                     <button onClick={() => setIsEditing(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition">
                        Edit Profile
                    </button>
                ) : (
                    <div className="flex space-x-4">
                        <button onClick={handleCancelEdit} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition">
                            Cancel
                        </button>
                        <button onClick={handleSaveChanges} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition">
                            Save Changes
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
                    <div className="flex-shrink-0 mb-6 md:mb-0">
                        <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-32 h-32 rounded-full border-4 border-indigo-500" />
                    </div>
                    <div className="space-y-6 w-full">
                        <ProfileField label="Full Name" name="name" value={formData.name} isEditing={isEditing} />
                        <ProfileField label="Club Role" value={currentUser.role} />
                        <ProfileField label="Email Address" name="email" value={formData.email} isEditing={isEditing} type="email" />
                        <ProfileField label="Phone Number" name="phone" value={formData.phone} isEditing={isEditing} type="tel" />
                        <ProfileField label="Bio" name="bio" value={formData.bio} isEditing={isEditing} rows={4} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;