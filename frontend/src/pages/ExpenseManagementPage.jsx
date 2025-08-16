// src/pages/ExpenseManagementPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService.js';
import Modal from '../components/Modal.jsx';
import Spinner from '../components/Spinner.jsx';
import GradientButton from '../components/GradientButton.jsx';
import ThemedInput from '../components/ThemedInput.jsx';
import { PlusIcon, EditIcon, DeleteIcon } from '../components/icons.jsx';

const ExpenseManagementPage = () => {
    const { user, token } = useAuth();
    const [users, setUsers] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [confirmingDelete, setConfirmingDelete] = useState(null);

    const fetchExpensesAndUsers = useCallback(async () => {
        try {
            setLoading(true);
            const [expensesData, usersData] = await Promise.all([
                apiService.getExpenses(),
                apiService.getAllUsers()
            ]);
            setExpenses(expensesData);
            setUsers(usersData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (token) {
            fetchExpensesAndUsers();
        }
    }, [fetchExpensesAndUsers, token]);

    const openModalForNew = () => {
        setEditingExpense({
            date: new Date().toISOString().split('T')[0],
            item: '',
            amount: '',
            addedBy: user.id,
        });
        setIsModalOpen(true);
    };

    const openModalForEdit = (expense) => {
        setEditingExpense({ 
            ...expense, 
            date: new Date(expense.date).toISOString().split('T')[0],
            addedBy: expense.addedBy?._id || expense.addedBy,
        });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editingExpense._id) {
                await apiService.updateExpense(editingExpense._id, editingExpense);
            } else {
                await apiService.addExpense(editingExpense);
            }
            setIsModalOpen(false);
            setEditingExpense(null);
            fetchExpensesAndUsers();
        } catch (err) {
            console.error("Failed to save expense:", err);
            setError("Failed to save expense: " + err.message);
        }
    };

    const handleDeleteClick = (id) => {
        setConfirmingDelete(id);
    };

    const executeDelete = async () => {
        if (!confirmingDelete) return;
        try {
            await apiService.deleteExpense(confirmingDelete);
            setConfirmingDelete(null);
            fetchExpensesAndUsers();
        } catch (err) {
            console.error("Failed to delete expense:", err);
            setError("Failed to delete expense: " + err.message);
        }
    };

    if (loading) return <Spinner />;
    if (error) return <p className="text-red-400">Error: {error}</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Expense Management</h1>
                <GradientButton onClick={openModalForNew}>
                    <PlusIcon className="w-5 h-5 inline-block mr-2"/>
                    Add Expense
                </GradientButton>
            </div>
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-700 bg-gray-800">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Item</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Added By</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map(expense => (
                                <tr key={expense._id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50 transition-colors">
                                    <td className="p-4">{new Date(expense.date).toLocaleDateString()}</td>
                                    <td className="p-4">{expense.item}</td>
                                    <td className="p-4">৳{expense.amount.toFixed(2)}</td>
                                    <td className="p-4">{expense.addedBy?.name || 'N/A'}</td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => openModalForEdit(expense)} className="text-blue-400 hover:text-blue-300"><EditIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleDeleteClick(expense._id)} className="text-red-400 hover:text-red-300"><DeleteIcon className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingExpense?._id ? "Edit Expense" : "Add Expense"}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-2">Item/Description</label>
                        <ThemedInput type="text" value={editingExpense?.item || ''} onChange={e => setEditingExpense({...editingExpense, item: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Amount</label>
                        <ThemedInput type="number" value={editingExpense?.amount || ''} onChange={e => setEditingExpense({...editingExpense, amount: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2">Date</label>
                        <ThemedInput type="date" value={editingExpense?.date || ''} onChange={e => setEditingExpense({...editingExpense, date: e.target.value})} />
                    </div>

                    {/* ✅ CORRECTED: This now uses 'addedBy' to match the backend */}
                    <div>
                        <label className="block text-gray-400 mb-2">Paid By</label>
                        <select 
                            value={editingExpense?.addedBy || ''}
                            onChange={e => setEditingExpense({...editingExpense, addedBy: e.target.value})}
                            className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                        >
                            <option value="">-- Select who paid --</option>
                            {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                        </select>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-300 bg-gray-600 hover:bg-gray-500">Cancel</button>
                        <GradientButton onClick={handleSave}>Save Expense</GradientButton>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={!!confirmingDelete} onClose={() => setConfirmingDelete(null)} title="Confirm Deletion">
                <div>
                    <p className="text-gray-300">Are you sure you want to delete this expense? This action cannot be undone.</p>
                    <div className="flex justify-end gap-4 pt-6">
                        <button onClick={() => setConfirmingDelete(null)} className="px-4 py-2 rounded-lg text-gray-300 bg-gray-600 hover:bg-gray-500 font-semibold">Cancel</button>
                        <GradientButton onClick={executeDelete} className="bg-red-600 hover:bg-red-700">Delete</GradientButton>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ExpenseManagementPage;