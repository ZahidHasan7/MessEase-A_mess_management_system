import React from 'react';
import { useNavigate } from 'react-router-dom';
import GradientButton from '../components/GradientButton.jsx';

const LandingPage = () => {
    // 1. Get the navigate function from the hook
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <header className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-tr from-[#fe5b56] to-[#f9d423] rounded-full"></div>
                    <span>MessEase</span>
                </div>
                <nav className="hidden md:flex items-center gap-8">
                    <a href="#features" className="hover:text-[#fe5b56] transition-colors">Features</a>
                    <a href="#about" className="hover:text-[#fe5b56] transition-colors">About</a>
                    {/* 2. Use navigate to go to the /login route */}
                    <GradientButton onClick={() => navigate('/login')}>Login Now</GradientButton>
                </nav>
                <div className="md:hidden">
                    <GradientButton onClick={() => navigate('/login')}>Login</GradientButton>
                </div>
            </header>

            {/* Hero Section */}
            <main className="container mx-auto px-6 pt-24 pb-12 text-center flex flex-col items-center">
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                    Mess Management, <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#fe5b56] to-[#f3aaa9]">
                        Effortlessly Decentralized.
                    </span>
                </h1>
                <p className="mt-6 text-lg text-gray-400 max-w-2xl">
                    MessEase simplifies meal and expense tracking for shared living. A manager-centric system where managers handle entries, and members view transparent reports. No paperwork, no hassle.
                </p>
                <div className="mt-8">
                    {/* 3. Use navigate to go to the /register route */}
                    <GradientButton onClick={() => navigate('/register')} className="px-8 py-4 text-lg">Get Started for Free</GradientButton>
                </div>

                {/* Phone Mockup */}
                <div className="mt-16 relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#fe5b56] to-[#f3aaa9] rounded-full opacity-20 blur-3xl"></div>
                    <div className="relative w-72 h-auto bg-gray-800 rounded-3xl p-4 border-4 border-gray-700 shadow-2xl">
                        <div className="bg-gray-900 rounded-2xl h-96 flex flex-col p-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold">Dashboard</span>
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="h-10 bg-gray-700/50 rounded-lg"></div>
                                <div className="h-10 bg-gray-700/50 rounded-lg"></div>
                                <div className="h-10 bg-gray-700/50 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section id="features" className="py-20 bg-gray-800/50">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold">Why Choose MessEase?</h2>
                    <p className="text-gray-400 mt-2">A smarter way to manage your mess.</p>
                    <div className="mt-12 grid md:grid-cols-3 gap-8 text-left">
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                            <h3 className="text-xl font-bold text-[#fe5b56]">Manager-Centric Entry</h3>
                            <p className="text-gray-400 mt-2">Managers input all meals and expenses, ensuring data consistency and reducing member effort.</p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                            <h3 className="text-xl font-bold text-[#fe5b56]">Transparent Reports</h3>
                            <p className="text-gray-400 mt-2">Automated monthly reports give every member a clear view of meal counts, expenses, and dues.</p>
                        </div>
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                            <h3 className="text-xl font-bold text-[#fe5b56]">Flexible Role Assignment</h3>
                            <p className="text-gray-400 mt-2">Any user can be promoted to a manager. No fixed admin role means more flexibility for your community.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
