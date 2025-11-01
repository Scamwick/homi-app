'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, LogOut, Users, TrendingUp, MessageSquare,
  Calendar, Target, Bell, Settings
} from 'lucide-react';

interface CoachData {
  id: string;
  email: string;
  name: string;
}

export default function CoachDashboardPage() {
  const router = useRouter();
  const [coach, setCoach] = useState<CoachData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('coachAuthToken');
    if (!token) {
      router.push('/coach-signin');
      return;
    }

    // TODO: Validate token with API and fetch coach data
    // For now, use mock data
    setCoach({
      id: 'demo-coach-1',
      email: 'demo@coach.com',
      name: 'Demo Coach'
    });
    setLoading(false);
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('coachAuthToken');
    router.push('/coach-signin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A1128] via-[#0f172a] to-[#0A1128] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#22d3ee] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1128] via-[#0f172a] to-[#0A1128] text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0A1128]/95 backdrop-blur-lg py-4 border-b border-[#22d3ee]/10">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-extrabold tracking-wider hover:opacity-80 transition-opacity">
            <span className="text-[#22d3ee]">H</span>
            <span className="text-[#34d399]">ō</span>
            <span className="text-[#facc15]">M</span>
            <span className="text-[#22d3ee]">I</span>
            <span className="ml-3 text-sm text-gray-400 font-normal">Coach Portal</span>
          </Link>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-[#22d3ee]/10 rounded-lg transition-colors relative">
              <Bell className="text-gray-400 hover:text-[#22d3ee]" size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#34d399] rounded-full"></span>
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-[#22d3ee] hover:text-[#34d399] transition-colors font-semibold px-4 py-2 rounded-lg hover:bg-[#22d3ee]/10"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold mb-2">
            Welcome back, <span className="bg-gradient-to-r from-[#22d3ee] via-[#34d399] to-[#facc15] bg-clip-text text-transparent">{coach?.name}</span>
          </h1>
          <p className="text-gray-400">Here's your coaching overview for today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Active Clients */}
          <div className="bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 backdrop-blur-lg rounded-2xl p-6 border border-[#22d3ee]/20 hover:border-[#22d3ee]/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <Users className="text-[#22d3ee]" size={32} />
              <span className="text-xs text-[#34d399] font-semibold px-2 py-1 bg-[#34d399]/10 rounded-full">+12%</span>
            </div>
            <p className="text-3xl font-extrabold text-white mb-1">24</p>
            <p className="text-sm text-gray-400">Active Clients</p>
          </div>

          {/* Sessions This Week */}
          <div className="bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 backdrop-blur-lg rounded-2xl p-6 border border-[#34d399]/20 hover:border-[#34d399]/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <MessageSquare className="text-[#34d399]" size={32} />
              <span className="text-xs text-[#34d399] font-semibold px-2 py-1 bg-[#34d399]/10 rounded-full">+5</span>
            </div>
            <p className="text-3xl font-extrabold text-white mb-1">18</p>
            <p className="text-sm text-gray-400">Sessions This Week</p>
          </div>

          {/* Avg Score Improvement */}
          <div className="bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 backdrop-blur-lg rounded-2xl p-6 border border-[#facc15]/20 hover:border-[#facc15]/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="text-[#facc15]" size={32} />
              <span className="text-xs text-[#34d399] font-semibold px-2 py-1 bg-[#34d399]/10 rounded-full">+8pts</span>
            </div>
            <p className="text-3xl font-extrabold text-white mb-1">+15</p>
            <p className="text-sm text-gray-400">Avg Score Improvement</p>
          </div>

          {/* Goals Achieved */}
          <div className="bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 backdrop-blur-lg rounded-2xl p-6 border border-[#34d399]/20 hover:border-[#34d399]/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <Target className="text-[#34d399]" size={32} />
              <span className="text-xs text-[#34d399] font-semibold px-2 py-1 bg-[#34d399]/10 rounded-full">87%</span>
            </div>
            <p className="text-3xl font-extrabold text-white mb-1">42</p>
            <p className="text-sm text-gray-400">Goals Achieved</p>
          </div>
        </div>

        {/* Quick Actions & Recent Activity Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 backdrop-blur-lg rounded-2xl p-6 border border-[#22d3ee]/20">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Settings className="text-[#22d3ee]" size={24} />
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-[#22d3ee]/10 hover:bg-[#22d3ee]/20 border border-[#22d3ee]/30 rounded-xl text-white font-semibold transition-all hover:scale-105">
                  + Add New Client
                </button>
                <button className="w-full text-left px-4 py-3 bg-[#34d399]/10 hover:bg-[#34d399]/20 border border-[#34d399]/30 rounded-xl text-white font-semibold transition-all hover:scale-105">
                  📅 Schedule Session
                </button>
                <button className="w-full text-left px-4 py-3 bg-[#facc15]/10 hover:bg-[#facc15]/20 border border-[#facc15]/30 rounded-xl text-white font-semibold transition-all hover:scale-105">
                  📊 View Reports
                </button>
                <button className="w-full text-left px-4 py-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 rounded-xl text-white font-semibold transition-all hover:scale-105">
                  ⚙️ Settings
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 backdrop-blur-lg rounded-2xl p-6 border border-[#22d3ee]/20">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="text-[#22d3ee]" size={24} />
                Recent Activity
              </h2>
              <div className="space-y-4">
                {/* Activity Item */}
                <div className="flex items-start gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700">
                  <div className="w-10 h-10 bg-[#22d3ee]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="text-[#22d3ee]" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold mb-1">Sarah Johnson improved her HōMI Score</p>
                    <p className="text-sm text-gray-400">Financial score increased from 65 to 78</p>
                    <p className="text-xs text-gray-500 mt-2">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700">
                  <div className="w-10 h-10 bg-[#34d399]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="text-[#34d399]" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold mb-1">New message from Mike Chen</p>
                    <p className="text-sm text-gray-400">"Can we schedule a session this week?"</p>
                    <p className="text-xs text-gray-500 mt-2">5 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700">
                  <div className="w-10 h-10 bg-[#facc15]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="text-[#facc15]" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold mb-1">Emma Davis completed her action plan</p>
                    <p className="text-sm text-gray-400">All 8 financial goals achieved this month</p>
                    <p className="text-xs text-gray-500 mt-2">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-12 bg-gradient-to-r from-[#22d3ee]/10 to-[#34d399]/10 border border-[#22d3ee]/30 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            More Features Coming Soon
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We're building advanced tools for client management, detailed analytics, automated action plans, and more.
            This dashboard is currently in development.
          </p>
        </div>
      </main>
    </div>
  );
}
