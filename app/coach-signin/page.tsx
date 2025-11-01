'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

export default function CoachSignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/coach-signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store auth token or session
        if (data.token) {
          localStorage.setItem('coachAuthToken', data.token);
        }
        // Redirect to coach dashboard
        router.push('/coach-dashboard');
      } else {
        setError(data.error || 'Sign in failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

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
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-[#22d3ee] hover:text-[#34d399] transition-colors font-semibold"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen flex items-center justify-center px-6 pt-24 pb-16">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#22d3ee]/10 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />

        <div className="max-w-md w-full relative z-10">
          {/* Sign In Card */}
          <div className="bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl rounded-3xl p-10 border border-[#22d3ee]/20 shadow-2xl">
            {/* Icon & Title */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🧭</div>
              <h1 className="text-3xl font-extrabold mb-2">
                <span className="bg-gradient-to-r from-[#22d3ee] via-[#34d399] to-[#facc15] bg-clip-text text-transparent">
                  Coach Portal
                </span>
              </h1>
              <p className="text-gray-400 text-sm">
                Sign in to access your coaching dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#22d3ee] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="text-gray-500" size={20} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="coach@hōmi.com"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-[#0f172a]/50 border border-[#22d3ee]/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#22d3ee] focus:bg-[#0f172a]/80 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[#22d3ee] mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="text-gray-500" size={20} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-12 py-3.5 bg-[#0f172a]/50 border border-[#22d3ee]/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#22d3ee] focus:bg-[#0f172a]/80 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-[#22d3ee] transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link
                  href="/coach-forgot-password"
                  className="text-sm text-[#22d3ee] hover:text-[#34d399] transition-colors font-semibold"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#22d3ee] to-[#34d399] text-gray-900 px-8 py-4 rounded-xl font-extrabold text-lg hover:shadow-2xl hover:shadow-[#22d3ee]/40 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#22d3ee]/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#1e293b]/80 text-gray-400">New coach?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-3">
                Don't have an account yet?
              </p>
              <Link
                href="/coach-signup"
                className="inline-block border-2 border-[#22d3ee] text-[#22d3ee] px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#22d3ee]/10 transition-all hover:scale-105"
              >
                Create Coach Account
              </Link>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Need help? <Link href="/support" className="text-[#22d3ee] hover:text-[#34d399] font-semibold">Contact Support</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
