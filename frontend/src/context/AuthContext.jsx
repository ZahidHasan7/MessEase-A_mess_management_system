// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUserState] = useState(() => JSON.parse(localStorage.getItem('user')));
    const [token, setTokenState] = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const setAuthData = (newUser, newToken) => {
        if (newUser && newToken) {
            localStorage.setItem('user', JSON.stringify(newUser));
            localStorage.setItem('token', newToken);
            setUserState(newUser);
            setTokenState(newToken);
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setUserState(null);
            setTokenState(null);
        }
    };
    
    // Check for user on initial load
    useEffect(() => {
        setLoading(false);
    }, []);

    const value = {
        user,
        token,
        loading,
        setAuthData,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context easily
export const useAuth = () => {
    return useContext(AuthContext);
};