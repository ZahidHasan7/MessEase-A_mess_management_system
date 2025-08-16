import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService.js';
import Spinner from '../components/Spinner.jsx';
import GradientButton from '../components/GradientButton.jsx';
import { User, Shield } from 'lucide-react';

const NoticeBoardPage = () => {
    const { user } = useAuth();
    const [notices, setNotices] = useState([]);
    const [newNotice, setNewNotice] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                setLoading(true);
                const data = await apiService.getNotices();
                setNotices(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchNotices();
    }, []);

    const handlePostNotice = async (e) => {
        e.preventDefault();
        if (!newNotice.trim()) return;

        try {
            const postedNotice = await apiService.postNotice(newNotice);
            setNotices(prevNotices => [postedNotice, ...prevNotices]);
            setNewNotice('');
        } catch (err) {
            setError('Failed to post notice: ' + err.message);
        }
    };

    if (loading) return <Spinner />;
    if (error) return <p className="text-red-400">Error: {error}</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Notice Board</h1>

            {user.role === 'manager' && (
                <form onSubmit={handlePostNotice} className="mb-8 bg-gray-800 p-4 rounded-xl border border-gray-700">
                    <textarea
                        value={newNotice}
                        onChange={(e) => setNewNotice(e.target.value)}
                        placeholder="Write a new notice..."
                        className="w-full bg-gray-700 p-3 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#fe5b56] focus:outline-none"
                        rows="3"
                    ></textarea>
                    <div className="flex justify-end mt-2">
                        <GradientButton type="submit">Post Notice</GradientButton>
                    </div>
                </form>
            )}

            <div className="space-y-4">
                {notices.length > 0 ? (
                    notices.map(notice => (
                        <div key={notice._id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                            <div className="flex items-center mb-2">
                                {notice.author.role === 'manager' ? (
                                    <Shield className="w-5 h-5 text-yellow-400 mr-2" />
                                ) : (
                                    <User className="w-5 h-5 text-blue-400 mr-2" />
                                )}
                                <span className={`font-bold ${notice.author.role === 'manager' ? 'text-yellow-400' : 'text-blue-400'}`}>
                                    {notice.author.role === 'manager' ? 'Manager' : notice.author.name}
                                </span>
                                <span className="text-xs text-gray-500 ml-auto">
                                    {new Date(notice.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <p className="text-gray-300 whitespace-pre-wrap">{notice.content}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-8">No notices have been posted yet.</p>
                )}
            </div>
        </div>
    );
};

export default NoticeBoardPage;