import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService.js';
import Spinner from '../components/Spinner.jsx';
import StatCard from '../components/StatCard.jsx';
import Modal from '../components/Modal.jsx';
import GradientButton from '../components/GradientButton.jsx';
import { MealIcon, ExpenseIcon, ReportIcon, ProfileIcon } from '../components/icons.jsx';

const DashboardPage = () => {
    const { user, token } = useAuth();
    const [summary, setSummary] = useState(null);
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const [settlementData, scheduleData] = await Promise.all([
                    apiService.getSettlement(),
                    apiService.getSchedule() 
                ]);

                const userReport = settlementData.report.find(r => r.email === user.email);
                setSummary({ ...settlementData, userReport });
                setSchedule(scheduleData);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchDashboardData();
        }
    }, [user, token]);

    const handleStartNewMonth = async () => {
        try {
            await apiService.startNewMonth();
            setIsConfirmModalOpen(false);
            window.location.reload();
        } catch (err) {
            console.error("Failed to start new month:", err);
        }
    };

    if (loading || !user) return <Spinner />;
    if (error) return <p className="text-red-400">Error loading dashboard: {error}</p>;
    if (!summary) return <div className="text-center p-10">No summary data available.</div>;

    const MemberDashboard = () => (
        <>
            <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="My Total Meals" value={summary?.userReport?.meals || 0} icon={<MealIcon className="w-6 h-6"/>} color="blue" currency=""/>
                <StatCard title="My Meal Cost" value={summary?.userReport?.mealCost?.toFixed(2) || '0.00'} icon={<ExpenseIcon className="w-6 h-6"/>} color="red"/>
                <StatCard title="My Bazar Expense" value={summary?.userReport?.expense?.toFixed(2) || '0.00'} icon={<ExpenseIcon className="w-6 h-6"/>} color="green"/>
                <StatCard title="My Balance" value={summary?.userReport?.balance?.toFixed(2) || '0.00'} icon={<ProfileIcon className="w-6 h-6"/>} color="yellow"/>
            </div>

            <div className="mt-8 w-full lg:w-3/5">
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    <h2 className="text-xl font-bold p-4 text-white" style={{ backgroundColor: '#bf95df' }}>This Month's Bazar Schedule</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-gray-700">
                                <tr>
                                    <th className="p-4 text-gray-300 font-semibold">Date</th>
                                    <th className="p-4 text-gray-300 font-semibold">Assigned To</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedule.length > 0 ? (
                                    schedule.map((item, index) => (
                                        // ✅ UPDATED: Added hover effect and transition
                                        <tr key={item._id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50 transition-colors">
                                            <td className="p-4 text-gray-300">{new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                            <td className="p-4 font-medium text-white">{item.userId?.name || 'N/A'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="p-4 text-center text-gray-500">No bazar has been scheduled for this month.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );

    const ManagerDashboard = () => (
        <>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Manager Dashboard</h1>
                </div>
                <GradientButton onClick={() => setIsConfirmModalOpen(true)}>
                    Start New Month
                </GradientButton>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Mess Total Meals" value={summary?.totalMeals || 0} icon={<MealIcon className="w-6 h-6"/>} color="blue" currency=""/>
                <StatCard title="Mess Total Expenses" value={summary?.totalExpenses?.toFixed(2) || '0.00'} icon={<ExpenseIcon className="w-6 h-6"/>} color="green"/>
                <StatCard title="Current Meal Rate" value={summary?.mealRate?.toFixed(2) || '0.00'} icon={<ReportIcon className="w-6 h-6"/>} color="red"/>
                <StatCard title="My Balance" value={summary?.userReport?.balance?.toFixed(2) || '0.00'} icon={<ProfileIcon className="w-6 h-6"/>} color="yellow"/>
            </div>
        </>
    );

    return (
        <div>
            <h1 className="text-xl font-semibold mb-2 text-gray-400">Welcome back, <span className="text-white font-bold">{user.name}!</span></h1>
            {user.role === 'manager' ? <ManagerDashboard /> : <MemberDashboard />}

            <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} title="Start a New Month?">
                <div>
                    <p className="text-gray-300 mb-6">
                        This will permanently delete all existing meal, expense, and bazar schedule data. Are you sure you want to proceed?
                    </p>
                    <div className="flex justify-end gap-4">
                        <button onClick={() => setIsConfirmModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-300 bg-gray-600 hover:bg-gray-500 font-semibold">
                            Cancel
                        </button>
                        <GradientButton onClick={handleStartNewMonth} className="bg-red-600 hover:bg-red-700">
                            Sure
                        </GradientButton>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default DashboardPage;
