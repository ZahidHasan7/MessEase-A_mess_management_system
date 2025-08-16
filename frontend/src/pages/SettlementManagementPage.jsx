// src/pages/SettlementManagementPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService.js';
import Spinner from '../components/Spinner.jsx';
import GradientButton from '../components/GradientButton.jsx';
import MonthlyReportPage from './MonthlyReportPage.jsx';
import Modal from '../components/Modal.jsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const SettlementManagementPage = () => {
    const { user, token } = useAuth();
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    
    const [settlement, setSettlement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchSettlement = async () => {
        try {
            setLoading(true);
            const data = await apiService.getSettlement();
            setSettlement(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchSettlement();
        }
    }, [token]);


    const handleStartNewMonth = async () => {
        try {
            await apiService.startNewMonth();
            setIsConfirmModalOpen(false);
            fetchSettlement();
        } catch (err) {
            console.error("Failed to start new month:", err);
        }
    };

    const handleDownloadPdf = () => {
        if (!settlement) return;

        const doc = new jsPDF();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const currentMonth = monthNames[new Date().getMonth()];
        const currentYear = new Date().getFullYear();

        doc.setFontSize(20);
        doc.text(`Monthly Settlement Report - ${currentMonth} ${currentYear}`, 14, 22);

        doc.setFontSize(12);
        doc.text(`Total Expenses: ৳${settlement.totalExpenses.toFixed(2)}`, 14, 40);
        doc.text(`Total Meals: ${settlement.totalMeals}`, 90, 40);
        doc.text(`Meal Rate: ৳${settlement.mealRate.toFixed(2)}`, 140, 40);

        autoTable(doc, {
            startY: 50,
            head: [['Member', 'Meals', 'Meal Cost (tk)', 'Bazar Expense (tk)', 'Balance (tk)']],
            body: settlement.report.map(item => [
                item.name,
                item.meals,
                item.mealCost.toFixed(2),
                item.expense.toFixed(2),
                item.balance.toFixed(2)
            ]),
            theme: 'grid',
            headStyles: { fillColor: [22, 160, 133] },
        });

        doc.save(`Settlement-Report-${currentMonth}-${currentYear}.pdf`);
    };

    if (!user) return <Spinner />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Settlement</h1>
                <GradientButton onClick={() => setIsConfirmModalOpen(true)}>For New Month</GradientButton>
            </div>
            
            <MonthlyReportPage 
                isEditable={true} 
                settlementData={settlement}
                loading={loading}
                error={error}
                refetch={fetchSettlement}
            />

            <div className="flex justify-end mt-6">
                {/* ✅ CORRECTED: Replaced GradientButton with a standard button for custom styling */}
                <button 
                    onClick={handleDownloadPdf} 
                    disabled={!settlement}
                    className="px-6 py-3 rounded-lg font-semibold text-white transition-colors bg-[#18be73] hover:bg-[#14a362] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Download Info
                </button>
            </div>

            <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} title="Start a New Month?">
                <div>
                    <p className="text-gray-300 mb-6">
                        This will permanently delete all existing meal and expense data. Are you sure you want to proceed?
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

export default SettlementManagementPage;
