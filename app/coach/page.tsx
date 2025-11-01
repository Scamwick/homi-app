'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Home, ArrowRight, ArrowLeft, Brain, Heart, MessageCircle, CheckCircle, AlertTriangle, Clock, DollarSign, Target, Sparkles, Share2, Copy, BarChart3, Zap, Lock, Shield, Eye, TrendingDown, Activity, Navigation, X, ChevronRight, Download } from 'lucide-react';

interface Notification {
  title: string;
  description: string;
  icon: string;
}

interface RealTimeData {
  checking: { balance: number; account: string };
  savings: { balance: number; account: string };
  creditCard: { balance: number; limit: number; account: string };
  monthlyIncome: number;
  monthlyExpenses: number;
  debtPayments: number;
}

interface UserData {
  name: string;
  excitement: string;
  income: string;
  savings: string;
  targetAmount: string;
  debt: string;
  plaidConnected: boolean;
  realTimeData: RealTimeData | null;
}

export default function HomiCoachBrandAligned() {
  const [view, setView] = useState('landing');
  const [selectedCategory, setSelectedCategory] = useState('homes');
  const [chatStep, setChatStep] = useState(0);
  const [userData, setUserData] = useState<UserData>({
    name: '', excitement: '', income: '', savings: '', targetAmount: '', debt: '',
    plaidConnected: false, realTimeData: null
  });
  const [conversation, setConversation] = useState([]);
  const [homiData, setHomiData] = useState(null);
  const [showShareCard, setShowShareCard] = useState(false);
  const [compassAnimation, setCompassAnimation] = useState(0);
  const [selectedPersona, setSelectedPersona] = useState('analyst');
  const [activityFeed, setActivityFeed] = useState([
    { icon: '💰', title: 'Bank Account Synced', description: 'Chase checking • Balance updated', time: 'Just now', gradient: 'from-cyan-500 to-emerald-500' },
    { icon: '📈', title: 'Score Increased', description: '+3 points from debt paydown', time: '2 hours ago', gradient: 'from-emerald-500 to-yellow-500' },
    { icon: '🏘️', title: 'Market Update', description: 'Inventory up 12% in your area', time: '5 hours ago', gradient: 'from-yellow-500 to-cyan-500' }
  ]);
  const [notification, setNotification] = useState<Notification | null>(null);

  // Animate compass on load
  useEffect(() => {
    const interval = setInterval(() => {
      setCompassAnimation(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Show notification helper
  const showNotification = (title: string, description: string, icon: string = '🎉') => {
    setNotification({ title, description, icon });
    setTimeout(() => setNotification(null), 4000);
  };

  // Add activity to feed
  const addActivityItem = (icon: string, title: string, description: string, gradient: string) => {
    setActivityFeed(prev => [
      { icon, title, description, time: 'Just now', gradient },
      ...prev.slice(0, 4)
    ]);
  };

  // Enhanced emotional analysis
  const analyzeEmotionalPatterns = (text: string) => {
    const lower = text.toLowerCase();

    const patterns = {
      fomo: {
        score: (lower.includes('everyone') ? 30 : 0) +
               (lower.includes('behind') ? 25 : 0) +
               (lower.includes('missing out') ? 35 : 0) +
               (lower.includes('friends are') ? 20 : 0),
        keywords: ['everyone', 'behind', 'missing out', 'before prices', 'last chance', 'friends are'],
        icon: AlertTriangle,
        color: '#ef4444',
        label: 'FOMO Pattern'
      },
      pressure: {
        score: (lower.includes('should') ? 20 : 0) +
               (lower.includes('need to') ? 15 : 0) +
               (lower.includes('have to') ? 25 : 0) +
               (lower.includes('expected') ? 15 : 0),
        keywords: ['should', 'need to', 'have to', 'pressure', 'pushing', 'expected'],
        icon: AlertTriangle,
        color: '#f59e0b',
        label: 'Pressure Pattern'
      },
      clarity: {
        score: (lower.includes('confused') ? -30 : 0) +
               (lower.includes('unsure') ? -20 : 0) +
               (lower.includes('clear') ? 25 : 0) +
               (lower.includes('ready') ? 20 : 0) +
               (lower.includes('confident') ? 30 : 0),
        keywords: ['confused', 'unsure', 'overwhelmed', 'clear', 'ready', 'confident'],
        icon: Eye,
        color: '#22d3ee',
        label: 'Clarity Pattern'
      },
      attachment: {
        score: (lower.includes('perfect') ? 25 : 0) +
               (lower.includes('dream') ? 30 : 0) +
               (lower.includes('love') ? 20 : 0) +
               (lower.includes('always wanted') ? 25 : 0),
        keywords: ['perfect', 'dream', 'love', 'amazing', 'incredible', 'always wanted'],
        icon: Heart,
        color: '#ec4899',
        label: 'Attachment Pattern'
      }
    };

    return patterns;
  };

  // Personas - BRAND ALIGNED (Analyst, Optimist, Navigator)
  const personas = {
    analyst: {
      name: 'The Analyst',
      title: 'Data-Driven',
      icon: '📊',
      color: '#22d3ee',
      description: 'Pure numbers. Hard data. No fluff.',
      greeting: "I'm The Analyst. I'll walk you through your financial readiness step by step. Let's look at the numbers together."
    },
    optimist: {
      name: 'The Optimist',
      title: 'Encouraging',
      icon: '✨',
      color: '#34d399',
      description: 'Helps you see possibilities and build confidence',
      greeting: "I'm The Optimist. I'll help you see the path forward and what's possible for you. Let's explore your readiness together."
    },
    navigator: {
      name: 'The Navigator',
      title: 'Step-by-Step',
      icon: '🧭',
      color: '#facc15',
      description: 'Methodical roadmap with clear milestones',
      greeting: "I'm The Navigator. I'll guide you through this decision methodically, one step at a time. Let's map out where you are."
    }
  };

  const categories = {
    homes: {
      icon: Home,
      title: 'Buying a Home',
      subtitle: 'Discover if you\'re ready to buy a home',
      color: '#22d3ee',
      available: true,
      greeting: "Let's explore your home buying readiness together. I'll ask you some questions about your financial situation and help you understand where you stand."
    }
  };

  // Predictive futures (for results view)
  const generatePredictiveFutures = (currentScore: number, financialScore: number, emotionalScore: number, timingScore: number) => {
    return [
      {
        title: 'Optimal Path',
        probability: 78,
        description: 'Pay down debt, increase savings, work through emotional concerns',
        targetScore: Math.min(95, currentScore + 16),
        timeline: '6 months',
        color: '#22d3ee'
      },
      {
        title: 'Aggressive Timeline',
        probability: 52,
        description: 'Focus all resources on down payment, accept higher emotional risk',
        targetScore: Math.min(90, currentScore + 9),
        timeline: '3 months',
        color: '#facc15'
      },
      {
        title: 'Conservative Approach',
        probability: 92,
        description: 'Build emergency fund, eliminate all debt, perfect timing',
        targetScore: Math.min(98, currentScore + 23),
        timeline: '12 months',
        color: '#34d399'
      }
    ];
  };

  // Plaid simulation
  const connectPlaidAccount = () => {
    showNotification('Connecting...', 'Bank-level security. Read-only access.', '🔐');

    setTimeout(() => {
      const mockAccountData = {
        checking: { balance: 8500, account: "****1234" },
        savings: { balance: 32000, account: "****5678" },
        creditCard: { balance: 2300, limit: 10000, account: "****9012" },
        monthlyIncome: 7200,
        monthlyExpenses: 4800,
        debtPayments: 450
      };

      setUserData({
        ...userData,
        plaidConnected: true,
        realTimeData: mockAccountData,
        income: (mockAccountData.monthlyIncome * 12).toString(),
        savings: (mockAccountData.checking.balance + mockAccountData.savings.balance).toString(),
        debt: mockAccountData.debtPayments.toString()
      });

      setConversation([
        ...conversation,
        { speaker: 'user', message: 'Connected my accounts' },
        { speaker: 'homi', message: `Perfect. I can see your real numbers now. You have $${(mockAccountData.checking.balance + mockAccountData.savings.balance).toLocaleString()} total, monthly income of $${mockAccountData.monthlyIncome.toLocaleString()}, and $${mockAccountData.debtPayments} in debt payments. Now, what price range are you looking at?` }
      ]);

      addActivityItem('💰', 'Bank Account Synced', `Total: $${(mockAccountData.checking.balance + mockAccountData.savings.balance).toLocaleString()}`, 'from-cyan-500 to-emerald-500');
      showNotification('Connected', 'Your accounts are securely connected', '✅');
      setChatStep(4);
    }, 2000);
  };

  const getHomiResponse = (step: number, userInput: string) => {
    const patterns = analyzeEmotionalPatterns(userInput || '');

    switch(step) {
      case 0:
        return `Hi ${userInput}. I'm HōMI, your AI decision companion. I'm here to help you understand your home buying readiness. What's making you think about buying a home right now?`;

      case 1:
        let emotionalMirror = "";
        if (patterns.fomo.score > 30) {
          emotionalMirror = "I notice some urgency in what you're sharing. Let's take a careful look at your situation. ";
        } else if (patterns.pressure.score > 25) {
          emotionalMirror = "It sounds like you're feeling some pressure. Let's focus on what's right for you. ";
        } else if (patterns.clarity.score < 0) {
          emotionalMirror = "I hear some uncertainty, which is completely normal with big decisions. ";
        } else {
          emotionalMirror = "It sounds like you're approaching this thoughtfully. ";
        }

        return `${emotionalMirror}To give you accurate insights, I need to understand your financial picture. You can either answer my questions manually, OR connect your bank accounts securely via Plaid. Which would you prefer?`;

      case 2:
        if (userData.plaidConnected) {
          return "Great. Let me pull your data and analyze your readiness...";
        }
        return "No problem. What's your annual income before taxes?";

      case 3:
        return "How much have you saved up for a down payment?";

      case 4:
        return "What price range are you looking at for homes?";

      case 5:
        if (userData.plaidConnected) {
          return "Thank you. I have all the information I need. Let me analyze your situation...";
        }
        return "Last question — what are your monthly debt payments? Include credit cards, student loans, car payments, etc.";

      case 6:
        return "Thank you for sharing all this information. Let me analyze your readiness...";

      default:
        return "Tell me more...";
    }
  };

  const analyzeWithAdvancedHomi = () => {
    const income = parseFloat(userData.income) || 0;
    const savings = parseFloat(userData.savings) || 0;
    const amount = parseFloat(userData.targetAmount) || 0;
    const debt = parseFloat(userData.debt) || 0;

    // Financial analysis
    const dti = income > 0 ? (debt * 12 / income) * 100 : 100;
    const downPaymentPct = amount > 0 ? (savings / amount) * 100 : 0;
    const monthlyPayment = amount * 0.005;
    const paymentToIncome = income > 0 ? (monthlyPayment * 12 / income) * 100 : 100;
    const emergencyMonths = (savings - (amount * 0.1)) / ((income/12) + debt);

    // Emotional pattern analysis
    const emotionalPatterns = analyzeEmotionalPatterns(userData.excitement || '');

    // Calculate ring scores
    let financialScore = 0;
    if (downPaymentPct >= 20) financialScore = 90;
    else if (downPaymentPct >= 10) financialScore = 70;
    else if (downPaymentPct >= 5) financialScore = 40;
    else financialScore = 15;

    if (paymentToIncome < 28) financialScore = Math.min(100, financialScore + 10);
    else if (paymentToIncome > 35) financialScore = Math.max(0, financialScore - 20);

    if (dti < 36) financialScore = Math.min(100, financialScore + 10);
    else if (dti > 43) financialScore = Math.max(0, financialScore - 15);

    let emotionalScore = 60;
    if (emotionalPatterns.fomo.score > 25) emotionalScore -= 20;
    if (emotionalPatterns.pressure.score > 20) emotionalScore -= 15;
    if (emotionalPatterns.clarity.score > 20) emotionalScore += 25;
    else if (emotionalPatterns.clarity.score < 0) emotionalScore -= 20;
    emotionalScore = Math.max(0, Math.min(100, emotionalScore));

    let timingScore = 50;
    if (emergencyMonths >= 3) timingScore = 85;
    else if (emergencyMonths >= 1) timingScore = 65;
    else if (emergencyMonths >= 0) timingScore = 40;
    else timingScore = 20;

    const overallScore = Math.round((financialScore * 0.5) + (emotionalScore * 0.3) + (timingScore * 0.2));

    let verdict, homiResponse;

    if (overallScore >= 80) {
      verdict = '✓ Ready to Buy';
      homiResponse = `${userData.name}, based on your financial situation, you're in a strong position to move forward with home buying.

Your numbers look solid: ${downPaymentPct.toFixed(1)}% down payment, your monthly payment would be about ${paymentToIncome.toFixed(1)}% of your income, and you'd have room left for other expenses.

You can confidently start looking at homes in your target price range and get pre-approved for a mortgage. 🏠`;

    } else if (overallScore >= 70) {
      verdict = '↗ Almost There';

      const waitTime = downPaymentPct < 10 ? 6 : 4;

      homiResponse = `${userData.name}, you're close to being ready, but there are a few areas to strengthen first.

${emotionalPatterns.fomo.score > 25 ? "I notice some urgency in your decision. Remember, buying a home is a major commitment — it's worth taking the time to be fully prepared.\n\n" : ""}The main considerations: ${
  downPaymentPct < 10 ? `Building up your down payment to at least 10% would give you better loan terms and lower monthly payments.` :
  paymentToIncome > 35 ? "Your monthly payment would be a significant portion of your income. Saving more or adjusting your price range would help." :
  emergencyMonths < 1 ? "Building an emergency fund would give you a safety net after purchasing." :
  "Reducing your debt-to-income ratio would strengthen your position."
}

I recommend waiting about ${waitTime} months to improve these areas, then reassessing your readiness.`;

    } else if (overallScore >= 50) {
      verdict = '→ Not Quite Ready';
      homiResponse = `${userData.name}, I want to be honest with you about where you stand.

${
  downPaymentPct < 5 ? "Your down payment is currently below the minimum needed for most mortgages. Building your savings should be your primary focus." :
  dti > 50 ? "Your debt-to-income ratio is higher than lenders typically approve. Paying down debt should be your priority." :
  paymentToIncome > 45 ? "At this price range, your monthly payment would strain your budget significantly." :
  "Your financial foundation needs strengthening before taking on a mortgage."
}

I recommend waiting 6-12 months while you work on building your financial foundation. This isn't about denying yourself a home — it's about setting yourself up for success when you do buy.`;

    } else {
      verdict = '○ Hold Off For Now';
      homiResponse = `${userData.name}, I want to give you honest guidance: now isn't the right time to buy a home.

${
  downPaymentPct < 5 ? "You'll need to build significant savings before you can qualify for a mortgage." :
  dti > 50 ? "Your current debt level needs to come down substantially before adding a mortgage payment." :
  paymentToIncome > 45 ? "The price range you're considering would create financial stress." :
  "The gap between where you are now and where you need to be is substantial."
}

${emotionalPatterns.fomo.score > 30 ? "I know it may feel like you're missing out while others are buying. But buying before you're ready can lead to years of financial stress.\n\n" : ""}I recommend focusing on building your financial foundation for 12-18 months, then reassessing. This time investment will pay off significantly when you do buy.`;
    }

    const shareableInsight = verdict === '✓ Ready to Buy'
      ? `HōMI analyzed my home buying readiness and gave me the green light! Excited to start house hunting. 🏠`
      : verdict === '↗ Almost There'
      ? `HōMI helped me see I'm almost ready to buy a home. Time to strengthen a few areas first. 💪`
      : verdict === '→ Not Quite Ready'
      ? `HōMI gave me honest feedback about my home buying readiness. Building my foundation first. 📊`
      : `HōMI helped me understand I need more time before buying a home. Grateful for the honest guidance. 🙏`;

    setHomiData({
      overallScore,
      financialScore,
      emotionalScore,
      timingScore,
      verdict,
      homiResponse,
      emotionalPatterns,
      shareableInsight,
      financialBreakdown: {
        downPayment: downPaymentPct,
        monthlyPayment: paymentToIncome,
        dti: dti,
        emergencyMonths
      },
      predictiveFutures: generatePredictiveFutures(overallScore, financialScore, emotionalScore, timingScore)
    });

    addActivityItem('📊', 'Analysis Complete', `Your readiness score: ${overallScore}`, 'from-cyan-500 via-emerald-500 to-yellow-500');
    showNotification('Analysis Complete', `Your HōMI Score: ${overallScore}`, '🎯');
    setView('results');
  };

  const handleChatInput = (value: string) => {
    if (!value.trim()) return;

    const field = ['name', 'excitement', 'income', 'savings', 'targetAmount', 'debt'][chatStep];
    setUserData({...userData, [field]: value});

    const homiResponse = getHomiResponse(chatStep, value);

    setConversation([
      ...conversation,
      { speaker: 'user', message: value },
      { speaker: 'homi', message: homiResponse }
    ]);

    if (chatStep < 5) {
      setChatStep(chatStep + 1);
    } else {
      setTimeout(analyzeWithAdvancedHomi, 2000);
    }
  };

  // Threshold Compass SVG Component
  const ThresholdCompass = ({ financial = 0, emotional = 0, timing = 0, size = 200, showKey = false, animated = false }: { financial?: number, emotional?: number, timing?: number, size?: number, showKey?: boolean, animated?: boolean }) => {
    const center = size / 2;
    const outerRadius = size * 0.42;
    const middleRadius = size * 0.32;
    const innerRadius = size * 0.22;

    const getCircumference = (r: number) => 2 * Math.PI * r;
    const getDashOffset = (circumference: number, percentage: number) => circumference * (1 - percentage / 100);

    return (
      <div className="relative inline-block">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Glow effect */}
          <defs>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style={{ stopColor: '#22d3ee', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: '#22d3ee', stopOpacity: 0 }} />
            </radialGradient>
          </defs>

          {showKey && (
            <circle cx={center} cy={center} r={size * 0.45} fill="url(#glow)" className="animate-pulse" />
          )}

          {/* Outer Ring - Financial (Cyan) */}
          <circle
            cx={center}
            cy={center}
            r={outerRadius}
            fill="none"
            stroke="rgba(34, 211, 238, 0.15)"
            strokeWidth="4"
          />
          <circle
            cx={center}
            cy={center}
            r={outerRadius}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={getCircumference(outerRadius)}
            strokeDashoffset={getDashOffset(getCircumference(outerRadius), financial)}
            transform={`rotate(-90 ${center} ${center})`}
            style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
          />

          {/* Middle Ring - Emotional (Emerald) */}
          <circle
            cx={center}
            cy={center}
            r={middleRadius}
            fill="none"
            stroke="rgba(52, 211, 153, 0.15)"
            strokeWidth="4"
          />
          <circle
            cx={center}
            cy={center}
            r={middleRadius}
            fill="none"
            stroke="#34d399"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={getCircumference(middleRadius)}
            strokeDashoffset={getDashOffset(getCircumference(middleRadius), emotional)}
            transform={`rotate(-90 ${center} ${center})`}
            style={{ transition: 'stroke-dashoffset 1.5s ease-out', transitionDelay: '0.2s' }}
          />

          {/* Inner Ring - Timing (Yellow) */}
          <circle
            cx={center}
            cy={center}
            r={innerRadius}
            fill="none"
            stroke="rgba(250, 204, 21, 0.15)"
            strokeWidth="4"
          />
          <circle
            cx={center}
            cy={center}
            r={innerRadius}
            fill="none"
            stroke="#facc15"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={getCircumference(innerRadius)}
            strokeDashoffset={getDashOffset(getCircumference(innerRadius), timing)}
            transform={`rotate(-90 ${center} ${center})`}
            style={{ transition: 'stroke-dashoffset 1.5s ease-out', transitionDelay: '0.4s' }}
          />

          {/* Center Keyhole (appears when ready) */}
          {showKey ? (
            <g>
              <circle
                cx={center}
                cy={center}
                r={size * 0.12}
                fill="#facc15"
                opacity="0.3"
                style={{ filter: 'blur(8px)' }}
                className="animate-pulse"
              />
              <circle
                cx={center}
                cy={center}
                r={size * 0.06}
                fill="#facc15"
              />
              <rect
                x={center - size * 0.015}
                y={center}
                width={size * 0.03}
                height={size * 0.08}
                fill="#facc15"
                rx={size * 0.01}
              />
            </g>
          ) : (
            <circle
              cx={center}
              cy={center}
              r={size * 0.05}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
              opacity="0.3"
            />
          )}

          {/* Compass markers */}
          {[0, 90, 180, 270].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x = center + (outerRadius + 8) * Math.cos(rad);
            const y = center + (outerRadius + 8) * Math.sin(rad);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={2.5}
                fill="#22d3ee"
                opacity="0.6"
              />
            );
          })}
        </svg>
      </div>
    );
  };

  // Share Card Modal
  const ShareCard = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-fadeIn" onClick={() => setShowShareCard(false)}>
      <div className="bg-slate-900 rounded-3xl p-8 max-w-lg w-full border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 animate-slideUp" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black">Share Your Result</h3>
          <button onClick={() => setShowShareCard(false)} className="w-10 h-10 rounded-full bg-slate-800 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/30 flex items-center justify-center transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 via-emerald-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <Heart className="w-12 h-12 text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-emerald-500 to-yellow-500 rounded-full animate-ping opacity-20"></div>
          </div>

          <div className="bg-slate-950/80 rounded-2xl p-6 mb-6 border border-slate-800">
            <p className="text-slate-200 leading-relaxed text-lg">{homiData?.shareableInsight}</p>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(`${homiData?.shareableInsight}\n\nCheck your readiness at gethomi.com`);
              showNotification('Copied!', 'Share text copied to clipboard', '📋');
            }}
            className="w-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-yellow-500 text-slate-950 py-4 rounded-xl font-bold mb-3 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
          >
            <Copy className="w-5 h-5" />
            Copy to Share
          </button>
        </div>

        <div className="text-center text-xs text-slate-500">
          Share your journey with others
        </div>
      </div>
    </div>
  );

  // Notification Component
  const Notification = () => {
    if (!notification) return null;

    return (
      <div className="fixed top-6 right-6 z-50 animate-slideInRight">
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-5 border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/30 max-w-sm">
          <div className="flex items-start gap-4">
            <div className="text-3xl">{notification.icon}</div>
            <div className="flex-1">
              <div className="font-bold text-white mb-1">{notification.title}</div>
              <div className="text-sm text-slate-300">{notification.description}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // LANDING VIEW
  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A1128] via-[#0f172a] to-[#0A1128] text-white overflow-x-hidden" style={{ fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700;800&display=swap');

          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.05); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(100px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes pulse-glow {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.4; }
          }
          .animate-float { animation: float 4s ease-in-out infinite; }
          .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
          .animate-slideUp { animation: slideUp 0.5s ease-out; }
          .animate-slideInRight { animation: slideInRight 0.4s ease-out; }
          .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        `}</style>

        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#22d3ee]/20 rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Header */}
        <header className="fixed top-0 w-full z-50 bg-[#0A1128]/90 backdrop-blur-md py-6 border-b border-[#22d3ee]/10">
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
            </div>
          </div>
        </header>

        <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">

          {/* Hero with Compass */}
          <div className="min-h-screen grid md:grid-cols-2 items-center gap-16 mb-20">
            <div className="relative z-10">
              <div className="inline-block px-6 py-3 bg-gradient-to-r from-[#22d3ee]/20 to-[#34d399]/20 border border-[#22d3ee]/30 rounded-full mb-8 text-[#22d3ee] font-bold text-sm tracking-widest">
                ✦ THE THRESHOLD COMPASS
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
                Life's biggest decisions<br />
                deserve <span className="bg-gradient-to-r from-[#22d3ee] via-[#34d399] to-[#facc15] bg-clip-text text-transparent">more than a coin flip</span>
              </h1>

              <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                You know something's off, but can't tell if it's cold feet or real warning signs.
                HōMI cuts through the noise: we analyze your readiness and tell you
                if now is the time, or if you need to wait.
              </p>

              <button
                onClick={() => {
                  showNotification('Starting Assessment', 'Let\'s discover your readiness', '🚀');
                  setTimeout(() => setView('chat'), 500);
                }}
                className="bg-gradient-to-r from-[#22d3ee] to-[#34d399] text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-[#22d3ee]/40 transition-all hover:scale-105"
              >
                Start Your Assessment →
              </button>
            </div>

            {/* Animated Compass */}
            <div className="relative z-10 flex items-center justify-center animate-float">
              <ThresholdCompass financial={70} emotional={70} timing={70} size={280} showKey={false} animated={true} />
            </div>
          </div>

          {/* Companions Section */}
          <section className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                Choose Your <span className="bg-gradient-to-r from-[#22d3ee] via-[#34d399] to-[#facc15] bg-clip-text text-transparent">Decision Companion</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Every major decision needs the right voice. Your AI companion adapts to how you think and what you need right now.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {Object.entries(personas).map(([key, persona]) => (
                <div key={key} className="bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 backdrop-blur-lg rounded-2xl p-8 border border-[#34d399]/20 hover:border-[#34d399] hover:shadow-2xl hover:shadow-[#34d399]/30 transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                  <div className="text-6xl mb-6">{persona.icon}</div>
                  <h3 className="text-2xl font-extrabold text-[#34d399] mb-3">{persona.name}</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {persona.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-2 bg-[#22d3ee]/10 text-[#22d3ee] rounded-full text-sm font-semibold border border-[#22d3ee]/20">{persona.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Waitlist Section */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 backdrop-blur-xl rounded-3xl p-12 border border-[#22d3ee]/30 shadow-2xl text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                Join the <span className="bg-gradient-to-r from-[#22d3ee] via-[#34d399] to-[#facc15] bg-clip-text text-transparent">First 1,000</span>
              </h2>
              <p className="text-xl text-gray-400 mb-10">
                HōMI launches in 2025. Get early access to AI-powered decision intelligence. Starting with home buying. More decisions coming soon. Stay tuned.
              </p>

              <button
                onClick={() => {
                  showNotification('Early Access', 'Thanks for your interest!', '🎉');
                }}
                className="bg-gradient-to-r from-[#22d3ee] to-[#34d399] text-gray-900 px-8 py-4 rounded-full font-extrabold text-lg hover:shadow-2xl hover:shadow-[#22d3ee]/40 transition-all hover:scale-105"
              >
                Get Early Access →
              </button>
            </div>
          </section>

          <div className="text-center text-slate-500 text-sm pb-8">
            <p className="flex items-center justify-center gap-3">
              <Shield className="w-5 h-5" />
              Not therapy. Not productivity. Not sales. Your honest guide for threshold moments.
            </p>
          </div>
        </div>

        <Notification />
      </div>
    );
  }

  // CHAT VIEW
  if (view === 'chat') {
    const category = categories[selectedCategory];
    const currentInput = ['name', 'excitement', 'income', 'savings', 'targetAmount', 'debt'][chatStep];
    const selectedPersonaData = personas[selectedPersona];

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A1128] via-[#0f172a] to-[#0A1128] text-white" style={{ fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif" }}>
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-[#0A1128]/95 backdrop-blur-xl border-b-2 border-[#22d3ee]/10">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setView('landing');
                  setConversation([]);
                  setChatStep(0);
                  setUserData({});
                }}
                className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors font-semibold"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </button>

              <div className="flex items-center gap-4">
                <div className="text-xl font-extrabold tracking-wider">
                  <span className="text-[#22d3ee]">H</span>
                  <span className="text-[#34d399]">ō</span>
                  <span className="text-[#facc15]">M</span>
                  <span className="text-[#22d3ee]">I</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 pt-8 pb-20">
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Main Chat Area */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 backdrop-blur-sm rounded-3xl p-8 border-2 border-[#22d3ee]/20">
                {/* Chat Header */}
                <div className="flex items-center gap-5 mb-8 pb-6 border-b-2 border-slate-800">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 via-emerald-500 to-yellow-500 rounded-full flex items-center justify-center text-2xl">
                      {selectedPersonaData.icon}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-xl">{selectedPersonaData.name}</h3>
                    <p className="text-sm text-slate-400">{selectedPersonaData.description}</p>
                  </div>
                </div>

                {/* Conversation */}
                <div className="space-y-5 mb-8 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-slate-950 pr-4">
                  {conversation.length === 0 && (
                    <div className="bg-slate-950/70 rounded-2xl p-6 border-2 border-slate-800">
                      <p className="text-slate-200 leading-relaxed">{category.greeting}</p>
                    </div>
                  )}

                  {conversation.map((msg, i) => (
                    <div key={i} className={`flex ${msg.speaker === 'homi' ? 'justify-start' : 'justify-end'} animate-slideUp`}>
                      <div className={`max-w-[85%] p-5 rounded-2xl ${
                        msg.speaker === 'homi'
                          ? 'bg-slate-950/70 text-slate-200 border-2 border-slate-800'
                          : 'bg-gradient-to-r from-cyan-500 via-emerald-500 to-yellow-500 text-slate-950 font-semibold shadow-lg'
                      }`}>
                        <p className="leading-relaxed whitespace-pre-line">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Connected Accounts Display */}
                {userData.plaidConnected && userData.realTimeData && (
                  <div className="bg-slate-950/70 rounded-2xl p-6 mb-6 border-2 border-emerald-500/30">
                    <h4 className="font-black mb-5 flex items-center gap-3 text-emerald-400">
                      <CheckCircle className="w-6 h-6" />
                      Connected Accounts
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-slate-900/70 rounded-xl p-5 border-2 border-slate-800">
                        <div className="text-slate-500 text-xs mb-2 font-semibold">Checking {userData.realTimeData.checking.account}</div>
                        <div className="font-black text-emerald-400 text-2xl">${userData.realTimeData.checking.balance.toLocaleString()}</div>
                      </div>
                      <div className="bg-slate-900/70 rounded-xl p-5 border-2 border-slate-800">
                        <div className="text-slate-500 text-xs mb-2 font-semibold">Savings {userData.realTimeData.savings.account}</div>
                        <div className="font-black text-emerald-400 text-2xl">${userData.realTimeData.savings.balance.toLocaleString()}</div>
                      </div>
                      <div className="bg-slate-900/70 rounded-xl p-5 border-2 border-slate-800">
                        <div className="text-slate-500 text-xs mb-2 font-semibold">Monthly Income</div>
                        <div className="font-black text-cyan-400 text-2xl">${userData.realTimeData.monthlyIncome.toLocaleString()}</div>
                      </div>
                      <div className="bg-slate-900/70 rounded-xl p-5 border-2 border-slate-800">
                        <div className="text-slate-500 text-xs mb-2 font-semibold">Monthly Expenses</div>
                        <div className="font-black text-yellow-400 text-2xl">${userData.realTimeData.monthlyExpenses.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
                      <Lock className="w-4 h-4" />
                      Bank-level encryption • Read-only access • Secure
                    </div>
                  </div>
                )}

                {/* Plaid Connection or Manual Input */}
                {chatStep === 2 && !userData.plaidConnected && (
                  <div className="space-y-4 mb-6">
                    <div className="bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 rounded-2xl p-7 border-2 border-cyan-500/30">
                      <h4 className="font-black mb-4 flex items-center gap-3 text-xl">
                        <Zap className="w-6 h-6 text-cyan-400" />
                        Connect Your Accounts (Recommended)
                      </h4>
                      <p className="text-sm text-slate-300 mb-5 leading-relaxed">
                        Connect your bank accounts securely via Plaid for the most accurate analysis.
                      </p>
                      <button
                        onClick={connectPlaidAccount}
                        className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 py-5 rounded-xl font-black text-lg mb-4 flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-cyan-500/40 transition-all hover:scale-105"
                      >
                        <Shield className="w-6 h-6" />
                        Connect Securely
                      </button>
                      <div className="flex items-center justify-center gap-6 text-xs text-slate-400 font-semibold">
                        <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Encrypted</span>
                        <span className="flex items-center gap-2"><Eye className="w-4 h-4" /> Read-only</span>
                      </div>
                    </div>

                    <div className="text-center">
                      <span className="text-slate-600 text-sm font-bold">or</span>
                    </div>

                    <button
                      onClick={() => {
                        setConversation([
                          ...conversation,
                          { speaker: 'user', message: 'I prefer to enter manually' },
                          { speaker: 'homi', message: getHomiResponse(2, 'manual') }
                        ]);
                        setChatStep(3);
                      }}
                      className="w-full bg-slate-800 text-white py-5 rounded-xl font-bold hover:bg-slate-700 transition-all border-2 border-slate-700 hover:border-slate-600"
                    >
                      Enter Information Manually
                    </button>
                  </div>
                )}

                {/* Input Field */}
                {chatStep !== 2 && chatStep < 6 && (
                  <div>
                    {currentInput === 'excitement' ? (
                      <textarea
                        placeholder="Tell me what's got you thinking about buying a home..."
                        className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-6 py-5 text-white resize-none focus:outline-none focus:border-cyan-500 transition-all"
                        rows="4"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (e.target.value.trim()) {
                              handleChatInput(e.target.value);
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                    ) : (
                      <input
                        type={currentInput === 'name' ? 'text' : 'number'}
                        placeholder={
                          currentInput === 'name' ? 'Your name' :
                          currentInput === 'income' ? 'Annual income ($)' :
                          currentInput === 'savings' ? 'Total savings ($)' :
                          currentInput === 'targetAmount' ? 'Target home price ($)' :
                          'Monthly debt payments ($)'
                        }
                        className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-cyan-500 transition-all text-lg"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            if (e.target.value.trim()) {
                              handleChatInput(e.target.value);
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                    )}
                    <p className="text-xs text-slate-500 mt-3 flex items-center gap-2 font-semibold">
                      <span>Press Enter to send</span>
                    </p>
                  </div>
                )}

                {/* Analyzing State */}
                {chatStep === 6 && (
                  <div className="bg-slate-950/70 rounded-2xl p-10 text-center border-2 border-slate-800">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="animate-spin">
                        <Activity className="w-7 h-7 text-cyan-400" />
                      </div>
                      <p className="text-slate-200 font-black text-lg">Analyzing your readiness...</p>
                    </div>
                    <div className="flex justify-center">
                      <ThresholdCompass financial={50} emotional={50} timing={50} size={140} animated={true} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Persona Selector & Activity */}
            <div className="space-y-6">
              {/* Persona Selector */}
              <div className="bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#22d3ee]/20">
                <h4 className="font-black mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-cyan-400" />
                  Your Companion
                </h4>
                <div className="space-y-3">
                  {Object.entries(personas).map(([key, persona]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedPersona(key);
                        showNotification(`${persona.name} Active`, persona.greeting, persona.icon);
                      }}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        selectedPersona === key
                          ? 'bg-cyan-500/10 border-cyan-500'
                          : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-2xl">{persona.icon}</div>
                        <div className="flex-1">
                          <div className="font-bold">{persona.name}</div>
                          <div className="text-xs text-slate-500">{persona.title}</div>
                        </div>
                        {selectedPersona === key && <CheckCircle className="w-5 h-5 text-cyan-400" />}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{persona.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Feed */}
              <div className="bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#22d3ee]/20">
                <h4 className="font-black mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Activity
                </h4>
                <div className="space-y-3">
                  {activityFeed.map((activity, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-slate-950/50 rounded-xl border border-slate-800 animate-slideUp">
                      <div className={`w-10 h-10 bg-gradient-to-br ${activity.gradient} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <span className="text-lg">{activity.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white mb-1">{activity.title}</div>
                        <div className="text-xs text-slate-400 mb-2">{activity.description}</div>
                        <div className="text-xs text-slate-600">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Notification />
      </div>
    );
  }

  // RESULTS VIEW
  if (view === 'results' && homiData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A1128] via-[#0f172a] to-[#0A1128] text-white" style={{ fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif" }}>
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-24">

          {/* Top Navigation */}
          <div className="flex items-center justify-between mb-12">
            <button
              onClick={() => setView('landing')}
              className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              New Assessment
            </button>
            <div className="text-2xl font-extrabold tracking-wider">
              <span className="text-[#22d3ee]">H</span>
              <span className="text-[#34d399]">ō</span>
              <span className="text-[#facc15]">M</span>
              <span className="text-[#22d3ee]">I</span>
            </div>
          </div>

          {/* Threshold Compass with Scores */}
          <div className="text-center mb-16">
            <div className="inline-block mb-8">
              <ThresholdCompass
                financial={homiData.financialScore}
                emotional={homiData.emotionalScore}
                timing={homiData.timingScore}
                size={280}
                showKey={homiData.overallScore >= 80}
                animated={true}
              />
            </div>
            <div className="mb-6">
              <div className={`inline-block px-10 py-4 rounded-full text-xl font-black mb-6 border-2 ${
                homiData.overallScore >= 80 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500' :
                homiData.overallScore >= 70 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' :
                homiData.overallScore >= 50 ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500' :
                'bg-cyan-500/20 text-cyan-400 border-cyan-500'
              }`}>
                {homiData.verdict}
              </div>
            </div>
            <div className="text-7xl font-black mb-3">
              <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-yellow-400 bg-clip-text text-transparent">
                {homiData.overallScore}
              </span>
              <span className="text-slate-700">/100</span>
            </div>
            <p className="text-xl text-slate-400 font-semibold">Your HōMI Readiness Score</p>
          </div>

          {/* Ring Breakdown */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 backdrop-blur-sm rounded-2xl p-8 border-2 border-cyan-500/30">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-black text-cyan-400 text-lg">Financial</h4>
                <DollarSign className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="text-5xl font-black text-cyan-400 mb-2">{homiData.financialScore}</div>
              <div className="text-xs text-slate-500 font-semibold">Income, savings, debt</div>
            </div>
            <div className="bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 backdrop-blur-sm rounded-2xl p-8 border-2 border-emerald-500/30">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-black text-emerald-400 text-lg">Emotional</h4>
                <Heart className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-5xl font-black text-emerald-400 mb-2">{homiData.emotionalScore}</div>
              <div className="text-xs text-slate-500 font-semibold">Confidence, stability</div>
            </div>
            <div className="bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 backdrop-blur-sm rounded-2xl p-8 border-2 border-yellow-500/30">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-black text-yellow-400 text-lg">Timing</h4>
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-5xl font-black text-yellow-400 mb-2">{homiData.timingScore}</div>
              <div className="text-xs text-slate-500 font-semibold">Emergency fund, timeline</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-16">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* HōMI's Response */}
              <div className="bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 backdrop-blur-sm rounded-3xl p-10 border-2 border-[#22d3ee]/20">
                <div className="flex items-start gap-5 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 via-emerald-500 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black mb-4">Your Assessment</h3>
                    <div className="bg-slate-950/70 rounded-2xl p-7 border-2 border-slate-800">
                      <p className="text-slate-200 whitespace-pre-line leading-relaxed text-lg">{homiData.homiResponse}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                  <button
                    onClick={() => setShowShareCard(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 via-emerald-500 to-yellow-500 text-slate-950 rounded-xl font-black hover:shadow-xl hover:shadow-cyan-500/40 transition-all hover:scale-105"
                  >
                    <Share2 className="w-5 h-5" />
                    Share Result
                  </button>
                </div>
              </div>

              {/* Emotional Pattern Analysis */}
              {Object.entries(homiData.emotionalPatterns).some(([_, data]) => data.score > 0) && (
                <div className="bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 backdrop-blur-sm rounded-2xl p-8 border-2 border-[#22d3ee]/20">
                  <h4 className="font-black text-2xl mb-6 flex items-center gap-3">
                    <Brain className="w-7 h-7 text-cyan-400" />
                    Emotional Patterns
                  </h4>
                  <div className="grid md:grid-cols-2 gap-5">
                    {Object.entries(homiData.emotionalPatterns).map(([pattern, data]) => {
                      if (data.score <= 0) return null;
                      const IconComponent = data.icon;
                      return (
                        <div
                          key={pattern}
                          className="p-6 rounded-xl border-2"
                          style={{
                            backgroundColor: `${data.color}10`,
                            borderColor: `${data.color}40`
                          }}
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <IconComponent className="w-6 h-6" style={{ color: data.color }} />
                            <h5 className="font-black text-lg">{data.label}</h5>
                          </div>
                          <div className="text-4xl font-black mb-3" style={{ color: data.color }}>
                            {data.score}/100
                          </div>
                          <div className="text-xs text-slate-400 font-semibold">
                            Detected: {data.keywords.slice(0, 3).join(', ')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Financial Breakdown */}
              <div className="bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 backdrop-blur-sm rounded-2xl p-8 border-2 border-[#22d3ee]/20">
                <h4 className="font-black text-2xl mb-6 flex items-center gap-3">
                  <BarChart3 className="w-7 h-7 text-cyan-400" />
                  Financial Details
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-5 bg-slate-950/70 rounded-xl border-2 border-slate-800">
                    <span className="text-slate-300 font-semibold">Down Payment</span>
                    <span className="font-black text-cyan-400 text-2xl">{homiData.financialBreakdown.downPayment.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between p-5 bg-slate-950/70 rounded-xl border-2 border-slate-800">
                    <span className="text-slate-300 font-semibold">Payment to Income</span>
                    <span className="font-black text-emerald-400 text-2xl">{homiData.financialBreakdown.monthlyPayment.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between p-5 bg-slate-950/70 rounded-xl border-2 border-slate-800">
                    <span className="text-slate-300 font-semibold">Debt-to-Income</span>
                    <span className="font-black text-yellow-400 text-2xl">{homiData.financialBreakdown.dti.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between p-5 bg-slate-950/70 rounded-xl border-2 border-slate-800">
                    <span className="text-slate-300 font-semibold">Emergency Fund</span>
                    <span className="font-black text-cyan-400 text-2xl">{homiData.financialBreakdown.emergencyMonths.toFixed(1)} mo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Predictive Futures */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/60 backdrop-blur-sm rounded-2xl p-7 border-2 border-[#22d3ee]/20">
                <h4 className="font-black text-xl mb-5 flex items-center gap-2">
                  <Target className="w-6 h-6 text-cyan-400" />
                  Your Paths
                </h4>
                <div className="space-y-4">
                  {homiData.predictiveFutures.map((future, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-xl border-2 bg-slate-950/50 hover:scale-105 transition-all cursor-pointer"
                      style={{ borderColor: `${future.color}40` }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-bold text-white">{future.title}</h5>
                        <div className="text-xs px-3 py-1 rounded-full font-bold" style={{
                          backgroundColor: `${future.color}20`,
                          color: future.color
                        }}>
                          {future.probability}%
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mb-4 leading-relaxed">{future.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-black" style={{ color: future.color }}>
                            {future.targetScore}
                          </div>
                          <div className="text-xs text-slate-500 font-semibold">Target</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-white">{future.timeline}</div>
                          <div className="text-xs text-slate-500 font-semibold">Timeline</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-br from-cyan-500/10 via-emerald-500/10 to-yellow-500/10 rounded-3xl p-10 border-2 border-cyan-500/30">
            <h4 className="font-black text-2xl mb-5 flex items-center gap-3">
              <MessageCircle className="w-7 h-7 text-cyan-400" />
              Next Steps
            </h4>
            <p className="text-slate-300 mb-8 leading-relaxed text-lg">
              {homiData.overallScore >= 80
                ? "You're ready to start your home buying journey. Get pre-approved and start looking at properties in your price range."
                : homiData.overallScore >= 70
                ? "You're close to being ready. Focus on the areas highlighted above, then reassess your readiness."
                : homiData.overallScore >= 50
                ? "Take time to build your financial foundation. Focus on the recommendations above."
                : "Take time to significantly strengthen your financial position before considering a home purchase."
              }
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setView('chat');
                  setChatStep(0);
                  setConversation([]);
                  setUserData({});
                  showNotification('New Assessment', 'Starting fresh', '🚀');
                }}
                className="px-8 py-5 bg-cyan-500 text-slate-950 rounded-xl font-black hover:bg-cyan-400 transition-all hover:scale-105"
              >
                Take Another Assessment
              </button>
              <button
                onClick={() => {
                  setView('landing');
                }}
                className="px-8 py-5 bg-slate-800 text-white rounded-xl font-black hover:bg-slate-700 transition-all border-2 border-slate-700 hover:border-slate-600"
              >
                Back to Home
              </button>
            </div>
          </div>

          <div className="mt-16 text-center text-slate-500 text-sm">
            <p className="flex items-center justify-center gap-3">
              <Heart className="w-5 h-5" />
              Your honest guide for life's biggest decisions
            </p>
          </div>
        </div>

        {showShareCard && <ShareCard />}
        <Notification />
      </div>
    );
  }

  return null;
}
