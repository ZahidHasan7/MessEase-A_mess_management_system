// src/pages/ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService.js';
import ThemedInput from '../components/ThemedInput.jsx';
import GradientButton from '../components/GradientButton.jsx';

const ProfilePage = () => {
    const { user, setAuthData } = useAuth();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setPhone(user.profile?.phone || '');
        }
    }, [user]);

    const handleSave = async () => {
        setError('');
        setSuccess('');
        try {
            const updatedUserData = await apiService.editProfile({ name, phone });
            // Update the global user state via the context function
            setAuthData(updatedUserData, localStorage.getItem('token'));
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError("Failed to update profile: " + err.message);
        }
    };
    
    if (!user) {
        return <div>Loading profile...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 max-w-lg mx-auto">
                <div className="space-y-4">
                    <div>
                        <label className="text-gray-400">Name</label>
                        {isEditing ? (
                            <ThemedInput type="text" value={name} onChange={e => setName(e.target.value)} />
                        ) : (
                            <p className="text-xl font-semibold">{user.name}</p>
                        )}
                    </div>
                    <div>
                        <label className="text-gray-400">Email</label>
                        <p className="text-xl font-semibold text-gray-300">{user.email}</p>
                    </div>
                    <div>
                        <label className="text-gray-400">Phone</label>
                        {isEditing ? (
                            <ThemedInput type="text" value={phone} placeholder="Not set" onChange={e => setPhone(e.target.value)} />
                        ) : (
                            <p className="text-xl font-semibold">{user.profile?.phone || 'Not set'}</p>
                        )}
                    </div>
                    <div>
                        <label className="text-gray-400">Role</label>
                        <p className="text-xl font-semibold capitalize">{user.role}</p>
                    </div>

                    {success && <p className="text-green-400">{success}</p>}
                    {error && <p className="text-red-400">{error}</p>}

                    <div className="pt-4">
                        {isEditing ? (
                            <div className="flex gap-4">
                                <GradientButton onClick={handleSave}>Save Changes</GradientButton>
                                <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-lg text-gray-300 bg-gray-600 hover:bg-gray-500">Cancel</button>
                            </div>
                        ) : (
                            <GradientButton onClick={() => setIsEditing(true)}>Edit Profile</GradientButton>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;