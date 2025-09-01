import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext'; // 1. Import the useAuth hook
import { apiService } from '../services/apiService.js';
import Spinner from '../components/Spinner.jsx';
import Modal from '../components/Modal.jsx';
import GradientButton from '../components/GradientButton.jsx';
import ThemedInput from '../components/ThemedInput.jsx';
import { PlusIcon } from '../components/icons.jsx';

const BazarSchedulePage = () => {
    // 2. Get the token from the AuthContext
    const { token } = useAuth();

    const [schedules, setSchedules] = useState([]);
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSchedule, setNewSchedule] = useState({ userId: '', date: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAllData = useCallback(async () => {
        try {
            setLoading(true);
            // apiService sends the token automatically
            const [schedulesData, usersData] = await Promise.all([
                apiService.getSchedule(),
                apiService.getAllUsers()
            ]);
            setSchedules(schedulesData);
            setUsers(usersData);
        } catch (err) {
            setError(err.message);
            console.error(err);
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
            setSchedules([
                { _id: 'sch1', date: new Date(), userId: { name: 'Demo Member' } }
            ]);
            setUsers([
                { _id: 'manager123', name: 'Demo Manager'},
                { _id: 'member123', name: 'Demo Member'},
            ]);
            setLoading(false);
        } else {
            fetchAllData();
        }
    }, [fetchAllData, token]);
    
    const handleSave = async () => {
        try {
            await apiService.createSchedule(newSchedule);
            setIsModalOpen(false);
            setNewSchedule({ userId: '', date: '' });
            fetchAllData(); // Refetch data after saving
        } catch(err) {
            setError("Failed to save schedule: " + err.message);
            console.error(err);
        }
    };

    if (loading) return <Spinner />;
    if (error) return <p className="text-red-400">Error: {error}</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Bazar Schedule</h1>
                <GradientButton onClick={() => setIsModalOpen(true)}>
                    <PlusIcon className="w-5 h-5 inline-block mr-2"/>
                    Assign Bazar Duty
                </GradientButton>
            </div>
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-700 bg-gray-800">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Assigned To</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.map(sch => (
                                <tr key={sch._id} className="border-b border-gray-700 last:border-b-0">
                                    <td className="p-4">{new Date(sch.date).toLocaleDateString()}</td>
                                    <td className="p-4 font-medium">{sch.userId?.name || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Assign Bazar Duty">
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-2">Select Member</label>
                        <select 
                            value={newSchedule.userId} 
                            onChange={e => setNewSchedule({...newSchedule, userId: e.target.value})}
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white">
                            <option value="">-- Select a member --</option>
                            {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Select Date</label>
                        <ThemedInput type="date" value={newSchedule.date} onChange={e => setNewSchedule({...newSchedule, date: e.target.value})} />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-300 bg-gray-600 hover:bg-gray-500">Cancel</button>
                        <GradientButton onClick={handleSave}>Assign</GradientButton>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default BazarSchedulePage;
