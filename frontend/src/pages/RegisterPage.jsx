// src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService.js';
import GradientButton from '../components/GradientButton.jsx';
import ThemedInput from '../components/ThemedInput.jsx';

const RegisterPage = () => {
    const navigate = useNavigate();
    
    // ✅ 1. State to track registration type (manager or member)
    const [registerType, setRegisterType] = useState('manager'); 

    // Form state now includes messName
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [messName, setMessName] = useState('');
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const userData = { name, email, password, messName };

            // ✅ 2. Call the correct API based on the selected registration type
            if (registerType === 'manager') {
                await apiService.registerManager(userData);
            } else {
                await apiService.registerMember(userData);
            }

            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white">Create Your Account</h1>
                    <p className="text-gray-400">Join or create a mess community on MessEase.</p>
                </div>
                <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
                    
                    {/* ✅ 3. Toggle buttons to select registration type */}
                    <div className="grid grid-cols-2 gap-2 mb-6 bg-gray-900 p-1 rounded-lg">
                        <button
                            onClick={() => setRegisterType('manager')}
                            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${registerType === 'manager' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                        >
                            Register as Manager
                        </button>
                        <button
                            onClick={() => setRegisterType('member')}
                            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${registerType === 'member' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
                        >
                            Register as Member
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-2" htmlFor="name">Full Name</label>
                            <ThemedInput id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
                            <ThemedInput id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
                            <ThemedInput id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        
                        {/* ✅ 4. Mess Name input field */}
                        <div className="mb-6">
                            <label className="block text-gray-400 mb-2" htmlFor="messName">
                                {registerType === 'manager' ? 'New Mess Name' : 'Existing Mess Name'}
                            </label>
                            <ThemedInput 
                                id="messName" 
                                type="text" 
                                placeholder={registerType === 'manager' ? 'e.g., Blue House' : 'Enter the exact mess name'}
                                value={messName} 
                                onChange={(e) => setMessName(e.target.value)} 
                                required 
                            />
                        </div>

                        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
                        {success && <p className="text-green-400 text-center mb-4">{success}</p>}
                        
                        <GradientButton type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Registering...' : 'Create Account'}
                        </GradientButton>
                    </form>
                    <p className="text-center text-gray-400 mt-6">
                        Already have an account? <button onClick={() => navigate('/login')} className="font-semibold text-[#fe5b56] hover:underline">Login here</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;