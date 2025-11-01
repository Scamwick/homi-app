'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const [financial, setFinancial] = useState(70);
  const [emotional, setEmotional] = useState(70);
  const [timing, setTiming] = useState(70);
  const [email, setEmail] = useState('');
  const [decision, setDecision] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Calculate total score
  const totalScore = Math.round((financial * 0.5) + (emotional * 0.3) + (timing * 0.2));

  // Get status based on score
  const getStatus = (score: number) => {
    if (score >= 80) return { text: '✓ Ready to Buy — Start House Hunting', color: '#facc15', bg: 'rgba(250, 204, 21, 0.15)' };
    if (score >= 70) return { text: '↗ Almost There — A Few Improvements Needed', color: '#34d399', bg: 'rgba(52, 211, 153, 0.1)' };
    if (score >= 50) return { text: '→ Not Quite Ready — Focus on Building Readiness', color: '#22d3ee', bg: 'rgba(34, 211, 238, 0.1)' };
    return { text: '○ Hold Off For Now — Build Your Foundation First', color: '#22d3ee', bg: 'rgba(34, 211, 238, 0.05)' };
  };

  const status = getStatus(totalScore);
  const showKey = totalScore >= 80;

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, decision, score: totalScore }),
      });

      if (response.ok) {
        setShowSuccess(true);
        setEmail('');
        setDecision('');
        setTimeout(() => setShowSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Waitlist signup error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1128] via-[#0f172a] to-[#0A1128] text-white">
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0A1128]/95 backdrop-blur-lg py-4' : 'bg-[#0A1128]/90 backdrop-blur-md py-6'
      } border-b border-[#22d3ee]/10`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-extrabold tracking-wider">
            <span className="text-[#22d3ee]">H</span>
            <span className="text-[#34d399]">ō</span>
            <span className="text-[#facc15]">M</span>
            <span className="text-[#22d3ee]">I</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline-block px-4 py-2 bg-gradient-to-r from-[#22d3ee]/15 to-[#34d399]/15 border border-[#22d3ee]/30 rounded-full text-[#22d3ee] font-semibold text-sm tracking-wider">
              THE THRESHOLD COMPASS
            </span>
            <a
              href="#waitlist"
              className="bg-gradient-to-r from-[#22d3ee] to-[#34d399] text-gray-900 px-6 py-2.5 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-[#22d3ee]/30 transition-all hover:scale-105"
            >
              Join the Waitlist
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen grid md:grid-cols-2 items-center gap-16 px-6 md:px-12 pt-32 pb-16 max-w-7xl mx-auto relative">
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#22d3ee]/20 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />

        <div className="relative z-10 opacity-0 animate-fade-in-up">
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-[#22d3ee]/20 to-[#34d399]/20 border border-[#22d3ee]/30 rounded-full mb-8 text-[#22d3ee] font-bold text-sm tracking-widest">
            ✦ THE THRESHOLD COMPASS
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
            Your biggest decision<br />
            deserves more than <span className="bg-gradient-to-r from-[#22d3ee] via-[#34d399] to-[#facc15] bg-clip-text text-transparent">gut feeling</span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 leading-relaxed">
            Cold feet or red flags? Most people can't tell the difference—and that's dangerous.
            HōMI gives you the truth in three words: YES, NO, or NOT YET.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="#score"
              className="bg-gradient-to-r from-[#22d3ee] to-[#34d399] text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-[#22d3ee]/40 transition-all hover:scale-105 text-center"
            >
              See If You're Ready →
            </Link>
            <Link
              href="/assessment"
              className="border-2 border-[#22d3ee] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#22d3ee]/10 transition-all hover:scale-105 text-center"
            >
              Get Your Full Report
            </Link>
          </div>
        </div>

        {/* Animated Compass - Classic Rotating Rings */}
        <div className="relative z-10 flex items-center justify-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <svg className="w-full max-w-md" viewBox="0 0 200 200">
            <defs>
              <radialGradient id="centerGlow">
                <stop offset="0%" stopColor="#facc15" stopOpacity={showKey ? "0.8" : "0"} />
                <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
              </radialGradient>

              <filter id="ringGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Outer Ring (Cyan - Financial) - Rotates Clockwise 20s */}
            <g className="compass-outer-ring">
              <circle cx="100" cy="100" r="85" fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.6" filter="url(#ringGlow)" />
              <circle cx="100" cy="15" r="3" fill="#22d3ee" />
              <circle cx="185" cy="100" r="3" fill="#22d3ee" />
              <circle cx="100" cy="185" r="3" fill="#22d3ee" />
              <circle cx="15" cy="100" r="3" fill="#22d3ee" />
            </g>

            {/* Middle Ring (Emerald - Emotional) - Rotates Counter-Clockwise 15s */}
            <g className="compass-middle-ring">
              <circle cx="100" cy="100" r="60" fill="none" stroke="#34d399" strokeWidth="2.5" opacity="0.7" filter="url(#ringGlow)" />
              <circle cx="100" cy="40" r="2.5" fill="#34d399" />
              <circle cx="160" cy="100" r="2.5" fill="#34d399" />
              <circle cx="100" cy="160" r="2.5" fill="#34d399" />
              <circle cx="40" cy="100" r="2.5" fill="#34d399" />
            </g>

            {/* Inner Ring (Yellow - Timing/Readiness) - Rotates Clockwise 10s */}
            <g className="compass-inner-ring">
              <circle cx="100" cy="100" r="35" fill="none" stroke="#facc15" strokeWidth="3" opacity="0.8" filter="url(#ringGlow)" />
            </g>

            {/* Center Glow */}
            <circle cx="100" cy="100" r="50" fill="url(#centerGlow)" opacity="0.3" style={{ transition: 'all 0.5s ease' }} />

            {/* Keyhole (Pulsing) */}
            <g className="compass-keyhole">
              <circle cx="100" cy="92" r="12" fill="none" stroke={showKey ? "#facc15" : "#34d399"} strokeWidth="3" opacity={showKey ? "1" : "0.6"} style={{ transition: 'all 0.5s ease' }} />
              <rect x="95" y="100" width="10" height="15" fill="none" stroke={showKey ? "#facc15" : "#34d399"} strokeWidth="3" rx="2" opacity={showKey ? "1" : "0.6"} style={{ transition: 'all 0.5s ease' }} />
            </g>

            {/* Key Appears at 80% */}
            {showKey && (
              <g style={{ transition: 'opacity 0.5s ease' }}>
                <circle cx="100" cy="92" r="4" fill="#facc15" />
                <rect x="98.5" y="92" width="3" height="12" fill="#facc15" />
              </g>
            )}
          </svg>
        </div>
      </section>

      {/* Interactive Score Section */}
      <section id="score" className="px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Know Exactly <span className="bg-gradient-to-r from-[#22d3ee] via-[#34d399] to-[#facc15] bg-clip-text text-transparent">Where You Stand</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Three scores. One answer. Your HōMI Score reveals if you're financially ready (50%), emotionally prepared (30%), and buying at the right time (20%).
            <strong className="text-white"> When all three align, the compass becomes a key.</strong>
          </p>

          {/* Decision Type Selector */}
          <div className="text-center mb-12">
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              <button className="px-6 py-3 bg-gradient-to-r from-[#22d3ee] to-[#34d399] text-gray-900 rounded-full font-bold text-sm hover:shadow-lg transition-all">
                🏡 Home Buying
              </button>
            </div>
            <p className="text-sm text-gray-500 italic">Cars, investments, and career moves coming soon.</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-[#22d3ee]/20 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Sliders */}
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="flex items-center gap-3 text-lg font-bold">
                    <span className="text-2xl">💰</span>
                    <span>Financial Strength</span>
                  </span>
                  <span className="text-2xl font-extrabold px-3 py-1 rounded-lg bg-[#22d3ee]/10 text-[#22d3ee]">
                    {financial}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={financial}
                  onChange={(e) => setFinancial(Number(e.target.value))}
                  className="w-full h-2.5 rounded-full appearance-none cursor-pointer bg-[#1e293b]"
                  style={{
                    background: `linear-gradient(to right, #22d3ee 0%, #22d3ee ${financial}%, #1e293b ${financial}%, #1e293b 100%)`
                  }}
                />
                <p className="text-sm text-gray-500 mt-2">Your income, savings, debt, and credit score</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="flex items-center gap-3 text-lg font-bold">
                    <span className="text-2xl">🎯</span>
                    <span>Emotional Readiness</span>
                  </span>
                  <span className="text-2xl font-extrabold px-3 py-1 rounded-lg bg-[#34d399]/10 text-[#34d399]">
                    {emotional}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={emotional}
                  onChange={(e) => setEmotional(Number(e.target.value))}
                  className="w-full h-2.5 rounded-full appearance-none cursor-pointer bg-[#1e293b]"
                  style={{
                    background: `linear-gradient(to right, #34d399 0%, #34d399 ${emotional}%, #1e293b ${emotional}%, #1e293b 100%)`
                  }}
                />
                <p className="text-sm text-gray-500 mt-2">How confident and stable you actually feel</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="flex items-center gap-3 text-lg font-bold">
                    <span className="text-2xl">📈</span>
                    <span>Market Timing</span>
                  </span>
                  <span className="text-2xl font-extrabold px-3 py-1 rounded-lg bg-[#facc15]/10 text-[#facc15]">
                    {timing}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={timing}
                  onChange={(e) => setTiming(Number(e.target.value))}
                  className="w-full h-2.5 rounded-full appearance-none cursor-pointer bg-[#1e293b]"
                  style={{
                    background: `linear-gradient(to right, #facc15 0%, #facc15 ${timing}%, #1e293b ${timing}%, #1e293b 100%)`
                  }}
                />
                <p className="text-sm text-gray-500 mt-2">Whether now is actually the right time</p>
              </div>
            </div>

            {/* Score Display - Classic Rotating Rings */}
            <div className="flex flex-col items-center">
              <div className="relative w-80 h-80">
                <svg width="100%" height="100%" viewBox="0 0 200 200">
                  <defs>
                    <radialGradient id="scoreGlow">
                      <stop offset="0%" stopColor="#facc15" stopOpacity={showKey ? "0.8" : "0"} />
                      <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
                    </radialGradient>

                    <filter id="scoreRingGlow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Outer Ring (Cyan - Financial) - Rotates Clockwise 20s */}
                  <g className="compass-outer-ring">
                    <circle cx="100" cy="100" r="85" fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.6" filter="url(#scoreRingGlow)" />
                    <circle cx="100" cy="15" r="3" fill="#22d3ee" />
                    <circle cx="185" cy="100" r="3" fill="#22d3ee" />
                    <circle cx="100" cy="185" r="3" fill="#22d3ee" />
                    <circle cx="15" cy="100" r="3" fill="#22d3ee" />
                  </g>

                  {/* Middle Ring (Emerald - Emotional) - Rotates Counter-Clockwise 15s */}
                  <g className="compass-middle-ring">
                    <circle cx="100" cy="100" r="60" fill="none" stroke="#34d399" strokeWidth="2.5" opacity="0.7" filter="url(#scoreRingGlow)" />
                    <circle cx="100" cy="40" r="2.5" fill="#34d399" />
                    <circle cx="160" cy="100" r="2.5" fill="#34d399" />
                    <circle cx="100" cy="160" r="2.5" fill="#34d399" />
                    <circle cx="40" cy="100" r="2.5" fill="#34d399" />
                  </g>

                  {/* Inner Ring (Yellow - Timing/Readiness) - Rotates Clockwise 10s */}
                  <g className="compass-inner-ring">
                    <circle cx="100" cy="100" r="35" fill="none" stroke="#facc15" strokeWidth="3" opacity="0.8" filter="url(#scoreRingGlow)" />
                  </g>

                  {/* Center Glow */}
                  <circle cx="100" cy="100" r="50" fill="url(#scoreGlow)" opacity="0.3" style={{ transition: 'all 0.5s ease' }} />

                  {/* Keyhole (Pulsing) */}
                  <g className="compass-keyhole">
                    <circle cx="100" cy="92" r="12" fill="none" stroke={showKey ? "#facc15" : status.color} strokeWidth="3" opacity={showKey ? "1" : "0.6"} style={{ transition: 'all 0.5s ease' }} />
                    <rect x="95" y="100" width="10" height="15" fill="none" stroke={showKey ? "#facc15" : status.color} strokeWidth="3" rx="2" opacity={showKey ? "1" : "0.6"} style={{ transition: 'all 0.5s ease' }} />
                  </g>

                  {/* Key Appears at 80% */}
                  {showKey && (
                    <g style={{ transition: 'opacity 0.5s ease' }}>
                      <circle cx="100" cy="92" r="4" fill="#facc15" />
                      <rect x="98.5" y="92" width="3" height="12" fill="#facc15" />
                    </g>
                  )}
                </svg>
              </div>

              {/* Score Number Below Compass */}
              <div className="mt-4 mb-4">
                <div
                  className="text-6xl font-extrabold transition-colors duration-500"
                  style={{ color: status.color }}
                >
                  {totalScore}
                </div>
              </div>

              <div className="text-center space-y-4 w-full">
                <div
                  className="px-6 py-3 rounded-2xl border text-lg font-semibold transition-all duration-500"
                  style={{
                    background: status.bg,
                    borderColor: `${status.color}50`,
                    color: status.color
                  }}
                >
                  {status.text}
                </div>

                <div className="space-y-2 w-full">
                  <div className="flex justify-between items-center px-6 py-3 bg-[#22d3ee]/5 border border-[#22d3ee]/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-[#22d3ee] shadow-lg shadow-[#22d3ee]/50" />
                      <span className="font-semibold">Financial</span>
                    </div>
                    <span className="text-xl font-extrabold text-[#22d3ee]">{financial}%</span>
                  </div>

                  <div className="flex justify-between items-center px-6 py-3 bg-[#34d399]/5 border border-[#34d399]/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-[#34d399] shadow-lg shadow-[#34d399]/50" />
                      <span className="font-semibold">Emotional</span>
                    </div>
                    <span className="text-xl font-extrabold text-[#34d399]">{emotional}%</span>
                  </div>

                  <div className="flex justify-between items-center px-6 py-3 bg-[#facc15]/5 border border-[#facc15]/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-[#facc15] shadow-lg shadow-[#facc15]/50" />
                      <span className="font-semibold">Timing</span>
                    </div>
                    <span className="text-xl font-extrabold text-[#facc15]">{timing}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Myth Line */}
        <div className="mt-16 text-center px-8 py-12 bg-gradient-to-r from-[#22d3ee]/5 to-[#34d399]/5 border border-[#22d3ee]/20 rounded-3xl">
          <div className="text-sm font-bold tracking-widest text-[#22d3ee] mb-6">✦ THE MYTH LINE</div>
          <blockquote className="text-3xl md:text-4xl font-light italic text-gray-100 leading-relaxed max-w-3xl mx-auto">
            "The compass that becomes a key<br />when you're finally ready to turn it."
          </blockquote>
        </div>
      </section>

      {/* Companions Section */}
      <section id="companions" className="px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Pick the Coach <span className="bg-gradient-to-r from-[#22d3ee] via-[#34d399] to-[#facc15] bg-clip-text text-transparent">That Gets You</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Big decisions need the right voice in your corner. Choose the AI companion that matches how you think—and what you need to hear right now.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Pragmatist */}
          <div className="bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 backdrop-blur-lg rounded-2xl p-8 border border-[#34d399]/20 hover:border-[#34d399] hover:shadow-2xl hover:shadow-[#34d399]/30 transition-all duration-300 hover:-translate-y-2 cursor-pointer">
            <div className="text-6xl mb-6">📊</div>
            <h3 className="text-2xl font-extrabold text-[#34d399] mb-3">The Analyst</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Pure numbers. Hard data. Zero fluff. Shows you the scenarios, runs the math, and tells you what the numbers actually say.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-2 bg-[#22d3ee]/10 text-[#22d3ee] rounded-full text-sm font-semibold border border-[#22d3ee]/20">Data-driven</span>
              <span className="px-4 py-2 bg-[#22d3ee]/10 text-[#22d3ee] rounded-full text-sm font-semibold border border-[#22d3ee]/20">Direct</span>
              <span className="px-4 py-2 bg-[#22d3ee]/10 text-[#22d3ee] rounded-full text-sm font-semibold border border-[#22d3ee]/20">Risk-focused</span>
            </div>
          </div>

          {/* Optimist */}
          <div className="bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 backdrop-blur-lg rounded-2xl p-8 border border-[#34d399]/20 hover:border-[#34d399] hover:shadow-2xl hover:shadow-[#34d399]/30 transition-all duration-300 hover:-translate-y-2 cursor-pointer">
            <div className="text-6xl mb-6">✨</div>
            <h3 className="text-2xl font-extrabold text-[#34d399] mb-3">The Optimist</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Sees what's possible, not just what's wrong. Builds your confidence, spots creative solutions, and reminds you why you can do this.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-2 bg-[#22d3ee]/10 text-[#22d3ee] rounded-full text-sm font-semibold border border-[#22d3ee]/20">Encouraging</span>
              <span className="px-4 py-2 bg-[#22d3ee]/10 text-[#22d3ee] rounded-full text-sm font-semibold border border-[#22d3ee]/20">Creative</span>
              <span className="px-4 py-2 bg-[#22d3ee]/10 text-[#22d3ee] rounded-full text-sm font-semibold border border-[#22d3ee]/20">Growth-minded</span>
            </div>
          </div>

          {/* Navigator */}
          <div className="bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 backdrop-blur-lg rounded-2xl p-8 border border-[#34d399]/20 hover:border-[#34d399] hover:shadow-2xl hover:shadow-[#34d399]/30 transition-all duration-300 hover:-translate-y-2 cursor-pointer">
            <div className="text-6xl mb-6">🧭</div>
            <h3 className="text-2xl font-extrabold text-[#34d399] mb-3">The Navigator</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Breaks down the overwhelm. Builds you a step-by-step roadmap with clear milestones, realistic timelines, and no surprises.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-2 bg-[#22d3ee]/10 text-[#22d3ee] rounded-full text-sm font-semibold border border-[#22d3ee]/20">Methodical</span>
              <span className="px-4 py-2 bg-[#22d3ee]/10 text-[#22d3ee] rounded-full text-sm font-semibold border border-[#22d3ee]/20">Structured</span>
              <span className="px-4 py-2 bg-[#22d3ee]/10 text-[#22d3ee] rounded-full text-sm font-semibold border border-[#22d3ee]/20">Patient</span>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="px-6 py-24 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 backdrop-blur-xl rounded-3xl p-12 border border-[#22d3ee]/30 shadow-2xl text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Join the <span className="bg-gradient-to-r from-[#22d3ee] via-[#34d399] to-[#facc15] bg-clip-text text-transparent">First 1,000</span>
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            HōMI launches 2025. First access goes to our first 1,000 members. We start with home buying, then expand to cars, investments, and career moves. No pitch. No pressure. Just honest answers when you need them most.
          </p>

          <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
            <div className="text-left">
              <label htmlFor="email" className="block font-bold text-[#22d3ee] mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-6 py-4 rounded-2xl border-2 border-[#22d3ee]/20 bg-[#0f172a]/50 text-white focus:outline-none focus:border-[#22d3ee] focus:bg-[#0f172a]/80 transition-all"
              />
            </div>

            <div className="text-left">
              <label htmlFor="decision" className="block font-bold text-[#22d3ee] mb-2">What decision are you facing? (Optional)</label>
              <textarea
                id="decision"
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                placeholder="Buying a home, changing careers, making a big investment..."
                rows={4}
                className="w-full px-6 py-4 rounded-2xl border-2 border-[#22d3ee]/20 bg-[#0f172a]/50 text-white focus:outline-none focus:border-[#22d3ee] focus:bg-[#0f172a]/80 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#22d3ee] to-[#34d399] text-gray-900 px-8 py-4 rounded-full font-extrabold text-lg hover:shadow-2xl hover:shadow-[#22d3ee]/40 transition-all hover:scale-105"
            >
              Get First Access →
            </button>

            {showSuccess && (
              <div className="bg-[#34d399]/10 text-[#34d399] px-6 py-4 rounded-2xl border border-[#34d399] animate-[slideIn_0.5s_ease]">
                <strong>✓ You're on the list!</strong><br />
                We'll reach out when we're ready for you. Check your email for a welcome from the HōMI team.
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center px-6 py-12 border-t border-[#22d3ee]/10 text-gray-500">
        <p className="mb-2"><strong>© 2025 HōMI Technologies LLC.</strong> Building AI companions for life's biggest decisions.</p>
        <p className="text-sm text-gray-600">
          Not therapy. Not productivity. Not sales. Your honest guide when everything's on the line.
        </p>
      </footer>
    </div>
  );
}
