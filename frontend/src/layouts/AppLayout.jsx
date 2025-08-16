import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    HomeIcon, MealIcon, ExpenseIcon, ScheduleIcon, ReportIcon, UsersIcon, 
    ProfileIcon, LogoutIcon, MenuIcon, CloseIcon 
} from '../components/icons.jsx';
// ✅ CORRECTED: Import the icon from the correct library
import { MessageSquare } from 'lucide-react';

const AppLayout = ({ children }) => {
    const navigate = useNavigate();
    const { user, setAuthData } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        setAuthData(null, null);
        navigate('/login');
    };
    
    const NavLink = ({ to, icon, children }) => (
        <Link 
            to={to} 
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
        >
            {icon}
            <span className="ml-4 font-medium">{children}</span>
        </Link>
    );

    const managerLinks = [
        { path: '/daily-meal-entry', icon: <MealIcon className="w-6 h-6" />, text: 'Daily Meals' },
        { path: '/expense-management', icon: <ExpenseIcon className="w-6 h-6" />, text: 'Expenses' },
        { path: '/bazar-schedule', icon: <ScheduleIcon className="w-6 h-6" />, text: 'Bazar Schedule' },
        { path: '/member-management', icon: <UsersIcon className="w-6 h-6" />, text: 'Members' },
        { path: '/settlement', icon: <ReportIcon className="w-6 h-6" />, text: 'Settlement' },
    ];
    
    return (
        <div className="min-h-screen bg-gray-900 text-white flex">
            <aside className={`bg-gray-800 fixed inset-y-0 left-0 z-30 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
                        <div className="text-2xl font-bold flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-tr from-[#fe5b56] to-[#f9d423] rounded-full"></div>
                            <span>MessEase</span>
                        </div>
                        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                            <CloseIcon className="w-6 h-6"/>
                        </button>
                    </div>
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        <NavLink to="/dashboard" icon={<HomeIcon className="w-6 h-6" />}>Dashboard</NavLink>
                        {/* ✅ CORRECTED: Use the imported MessageSquare icon */}
                        <NavLink to="/notice-board" icon={<MessageSquare className="w-6 h-6" />}>Notice Board</NavLink>
                        <NavLink to="/profile" icon={<ProfileIcon className="w-6 h-6" />}>Profile</NavLink>
                        <NavLink to="/monthly-report" icon={<ReportIcon className="w-6 h-6" />}>Monthly Report</NavLink>
                        
                        {user?.role === 'manager' && (
                            <div className="pt-4 mt-4 border-t border-gray-700">
                                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Manager Tools</h3>
                                <div className="mt-2 space-y-2">
                                    {managerLinks.map(link => <NavLink key={link.path} to={link.path} icon={link.icon}>{link.text}</NavLink>)}
                                </div>
                            </div>
                        )}
                    </nav>
                    <div className="px-4 py-4 border-t border-gray-700">
                        <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors">
                            <LogoutIcon className="w-6 h-6" />
                            <span className="ml-4 font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
            <div className="flex-1 flex flex-col">
                <header className="bg-gray-800/50 backdrop-blur-sm md:hidden flex justify-between items-center p-4 sticky top-0 z-20">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-white">
                        <MenuIcon className="w-6 h-6" />
                    </button>
                    <span className="text-xl font-bold">MessEase</span>
                    <div className="w-6"></div>
                </header>
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
