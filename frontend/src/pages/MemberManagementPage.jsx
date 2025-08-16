import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext'; // 1. Import the useAuth hook
import { apiService } from '../services/apiService.js';
import Spinner from '../components/Spinner.jsx';

const MemberManagementPage = () => {
    // 2. Get the token from the AuthContext
    const { token } = useAuth();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            // apiService sends the token automatically
            const data = await apiService.getAllUsers();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []); // No longer depends on the token prop
    
    useEffect(() => {
        // 3. Add a guard clause to ensure token exists before fetching
        if (!token) {
            setLoading(false);
            return;
        }

        if (token.startsWith('fake-')) {
            setUsers([
                { _id: 'manager123', name: 'Demo Manager', email: 'manager@demo.com', role: 'manager' },
                { _id: 'member123', name: 'Demo Member', email: 'member@demo.com', role: 'member' },
            ]);
            setLoading(false);
        } else {
            fetchUsers();
        }
    }, [fetchUsers, token]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            // No need to pass token here
            await apiService.updateUserRole(userId, newRole);
            fetchUsers(); // Refresh list
        } catch (err) {
            setError("Failed to update role: " + err.message);
            console.error("Failed to update role:", err);
        }
    };

    if (loading) return <Spinner />;
    if (error) return <p className="text-red-400">Error: {error}</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Member Management</h1>
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-700 bg-gray-800">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} className="border-b border-gray-700 last:border-b-0">
                                    <td className="p-4 font-medium">{user.name}</td>
                                    <td className="p-4 text-gray-400">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'manager' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {user.role === 'member' ? (
                                            <button onClick={() => handleRoleChange(user._id, 'manager')} className="text-green-400 hover:underline text-sm font-semibold">Promote to Manager</button>
                                        ) : (
                                            <button onClick={() => handleRoleChange(user._id, 'member')} className="text-yellow-400 hover:underline text-sm font-semibold">Demote to Member</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MemberManagementPage;
