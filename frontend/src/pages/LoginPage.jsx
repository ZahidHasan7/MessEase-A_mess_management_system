// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService.js';
import GradientButton from '../components/GradientButton.jsx';
import ThemedInput from '../components/ThemedInput.jsx';

const LoginPage = () => {
    const navigate = useNavigate();
    const { setAuthData } = useAuth();

    // ✅ 1. Add state for the messName
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [messName, setMessName] = useState('');
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // ✅ 2. Pass all three credentials to the login service
            const data = await apiService.login({ email, password, messName });
            
            setAuthData(data.user, data.token);
            navigate('/dashboard');

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
                    <h1 className="text-4xl font-bold text-white">Welcome Back!</h1>
                    <p className="text-gray-400">Log in to your MessEase account.</p>
                </div>
                <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
                            <ThemedInput id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
                            <ThemedInput id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>

                        {/* ✅ 3. Add the Mess Name input field */}
                        <div className="mb-6">
                            <label className="block text-gray-400 mb-2" htmlFor="messName">Mess Name</label>
                            <ThemedInput id="messName" type="text" placeholder="e.g., Blue House" value={messName} onChange={(e) => setMessName(e.target.value)} required />
                        </div>

                        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
                        
                        <GradientButton type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </GradientButton>
                    </form>
                    <p className="text-center text-gray-400 mt-6">
                        Don't have an account? <button onClick={() => navigate('/register')} className="font-semibold text-[#fe5b56] hover:underline">Register here</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;