import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService.js';
import Spinner from '../components/Spinner.jsx';
import ThemedInput from '../components/ThemedInput.jsx';
import GradientButton from '../components/GradientButton.jsx';

const DailyMealEntryPage = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [meals, setMeals] = useState({}); // { userId: mealCount }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSaving, setIsSaving] = useState(false); // ✅ State for button color change

    // ✅ NEW: Fetches existing meals for a selected date to populate the inputs
    const fetchMealsForDate = useCallback(async (selectedDate) => {
        try {
            const allMeals = await apiService.getAllMeals();
            const mealsForDate = allMeals.filter(m => new Date(m.date).toISOString().split('T')[0] === selectedDate);
            
            const mealsMap = {};
            mealsForDate.forEach(mealEntry => {
                // Assuming mealEntry.meals is an array like [{ userId, mealCount }]
                if(mealEntry.userId && mealEntry.mealCount) {
                     mealsMap[mealEntry.userId._id] = mealEntry.mealCount;
                }
            });
            setMeals(mealsMap);
        } catch (err) {
            setError("Could not fetch existing meals for this date.");
        }
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const usersData = await apiService.getAllUsers();
                setUsers(usersData);
                await fetchMealsForDate(date); // Fetch meals for the initial date
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        if (token) {
            fetchUsers();
        }
    }, [token, date, fetchMealsForDate]);

    const handleMealChange = (userId, count) => {
        setMeals(prev => ({ ...prev, [userId]: count }));
    };

    // ✅ UPDATED: This function now saves ALL meals at once
    const handleSaveAll = async () => {
        setError('');
        setSuccess('');
        setIsSaving(true); // Change button color

        try {
            const mealsToSave = users.map(user => ({
                userId: user._id,
                mealCount: Number(meals[user._id]) || 0, // Ensure meal count is a number, default to 0
            }));

            // This needs a new apiService function: saveDailyMeals
            await apiService.saveDailyMeals({ date, meals: mealsToSave });
            
            setSuccess(`All meals for ${date} have been saved!`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            // Change color back after 1 second
            setTimeout(() => setIsSaving(false), 1000);
        }
    };
    
    if (loading) return <Spinner />;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Daily Meal Entry</h1>
            <div className="mb-6 max-w-xs">
                <label htmlFor="meal-date" className="block text-gray-400 mb-2">Select Date</label>
                <ThemedInput id="meal-date" type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            {error && <p className="text-red-400 mb-4">{error}</p>}
            {success && <p className="text-green-400 mb-4">{success}</p>}
            <div className="bg-gray-800 rounded-xl border border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-700">
                            <tr>
                                <th className="p-4">Member Name</th>
                                <th className="p-4">Meal Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} className="border-b border-gray-600 last:border-b-0">
                                    <td className="p-4 font-medium">{user.name}</td>
                                    <td className="p-4">
                                        <ThemedInput
                                            type="number"
                                            min="0"
                                            placeholder="e.g., 2"
                                            value={meals[user._id] || ''}
                                            onChange={e => handleMealChange(user._id, e.target.value)}
                                            className="w-24"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* ✅ NEW: Single save button at the bottom right */}
            <div className="flex justify-end mt-6">
                <button
                    onClick={handleSaveAll}
                    disabled={isSaving}
                    className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
                        isSaving 
                        ? 'bg-gradient-to-r from-[#fe5b56] to-[#f9d423]' // Current GradientButton color
                        : 'bg-[#18be73] hover:opacity-90' // New green color
                    }`}
                >
                    {isSaving ? 'Saving...' : 'Save All Meals'}
                </button>
            </div>
        </div>
    );
};

export default DailyMealEntryPage;
