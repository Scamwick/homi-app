"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Send, CheckCircle2, Target, TrendingUp, Calendar, MessageSquare
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ActionItem {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  priority: "high" | "medium" | "low";
  dueDate?: string;
}

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [companion, setCompanion] = useState<string>("navigator");
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load data from sessionStorage or URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const companionParam = params.get("companion");
    const scoreParam = params.get("score");

    if (companionParam) {
      setCompanion(companionParam);
    }

    // Try to get assessment data from sessionStorage
    const storedData = sessionStorage.getItem("assessmentResult");
    if (storedData) {
      const data = JSON.parse(storedData);
      setAssessmentData(data);
      generateActionPlan(data);

      // Send initial welcome message
      const welcomeMessage = getWelcomeMessage(companionParam || companion, data);
      setMessages([{
        role: "assistant",
        content: welcomeMessage,
        timestamp: new Date()
      }]);
    } else if (scoreParam) {
      // Fallback if no stored data
      setMessages([{
        role: "assistant",
        content: `Welcome! I'm your ${getCompanionName(companionParam || companion)}. Let's work together to help you reach your home buying goals. What would you like to focus on first?`,
        timestamp: new Date()
      }]);
    }
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getCompanionName = (comp: string) => {
    const names: Record<string, string> = {
      analyst: "Analyst",
      optimist: "Optimist",
      navigator: "Navigator"
    };
    return names[comp] || "Navigator";
  };

  const getCompanionIcon = (comp: string) => {
    const icons: Record<string, string> = {
      analyst: "📊",
      optimist: "✨",
      navigator: "🧭"
    };
    return icons[comp] || "🧭";
  };

  const getWelcomeMessage = (comp: string, data: any) => {
    const score = data?.total || 0;
    const financial = data?.financial || 0;
    const emotional = data?.emotional || 0;

    if (comp === "analyst") {
      return `Hey there! I'm your Analyst. I've reviewed your HōMI Score of ${score}. Here's what the data tells me:\n\n• Financial Score: ${Math.round(financial)}/100\n• Emotional Score: ${Math.round(emotional)}/100\n\nLet's focus on the numbers and create a concrete plan to improve these metrics. What specific area would you like to tackle first?`;
    } else if (comp === "optimist") {
      return `Hello! I'm your Optimist coach, and I'm excited to work with you! 🌟\n\nYour HōMI Score of ${score} shows real potential. You've already taken the biggest step - deciding to pursue homeownership and seeking guidance. That takes courage!\n\nI see opportunities for growth in your financial (${Math.round(financial)}) and emotional readiness (${Math.round(emotional)}). Together, we'll turn these numbers into strengths. What goals inspire you most?`;
    } else {
      return `Welcome! I'm your Navigator. I've mapped out your journey based on your HōMI Score of ${score}.\n\nHere's where we stand:\n• Financial Readiness: ${Math.round(financial)}/100\n• Emotional Readiness: ${Math.round(emotional)}/100\n\nI've created a step-by-step action plan below. We'll work through this methodically, one milestone at a time. Ready to start navigating your path to homeownership?`;
    }
  };

  const generateActionPlan = (data: any) => {
    const items: ActionItem[] = [];
    const recs = data?.recommendations || [];

    // Convert recommendations to action items
    recs.forEach((rec: any, index: number) => {
      const priority = rec.priority === "high" ? "high" : rec.priority === "action" ? "high" : "medium";
      items.push({
        id: `action-${index}`,
        title: rec.text || rec,
        description: "Click to mark as complete",
        status: "pending",
        priority: priority,
        dueDate: undefined
      });
    });

    // Add some default action items if needed
    if (items.length < 3) {
      items.push({
        id: "action-default-1",
        title: "Review monthly budget and expenses",
        description: "Track spending for 30 days to identify savings opportunities",
        status: "pending",
        priority: "high"
      });
      items.push({
        id: "action-default-2",
        title: "Research mortgage pre-approval process",
        description: "Understand requirements and gather necessary documents",
        status: "pending",
        priority: "medium"
      });
    }

    setActionItems(items);
  };

  const toggleActionItem = (id: string) => {
    setActionItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: item.status === "completed" ? "pending" : item.status === "pending" ? "in_progress" : "completed"
        };
      }
      return item;
    }));
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          companion,
          assessmentData
        })
      });

      const data = await res.json();

      if (data.response) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const completedCount = actionItems.filter(item => item.status === "completed").length;
  const progressPercent = actionItems.length > 0 ? Math.round((completedCount / actionItems.length) * 100) : 0;

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
      <div className="pt-24 pb-8 px-4 max-w-7xl mx-auto">
        {/* Coach Header */}
        <div className="mb-8 text-center">
          <div className="text-6xl mb-4">{getCompanionIcon(companion)}</div>
          <h1 className="text-4xl font-extrabold mb-2">
            Your <span className="bg-gradient-to-r from-[#22d3ee] via-[#34d399] to-[#facc15] bg-clip-text text-transparent">{getCompanionName(companion)}</span> Coach
          </h1>
          <p className="text-gray-400">Let's work together to reach your home buying goals</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Action Plan & Progress */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress Card */}
            <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="text-homi-cyan" size={24} />
                <h2 className="text-xl font-bold">Your Progress</h2>
              </div>

              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Action Items</span>
                  <span className="text-sm font-bold text-homi-emerald">{completedCount} / {actionItems.length}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-homi-cyan to-homi-emerald h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {assessmentData && (
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between items-center p-3 bg-slate-800/60 rounded-lg">
                    <span className="text-sm">HōMI Score</span>
                    <span className="text-xl font-bold text-homi-cyan">{assessmentData.total || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-800/60 rounded-lg">
                    <span className="text-sm">Financial</span>
                    <span className="text-lg font-bold text-homi-emerald">{Math.round(assessmentData.financial || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-800/60 rounded-lg">
                    <span className="text-sm">Emotional</span>
                    <span className="text-lg font-bold text-homi-emerald">{Math.round(assessmentData.emotional || 0)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Items */}
            <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="text-homi-emerald" size={24} />
                <h2 className="text-xl font-bold">Action Plan</h2>
              </div>

              <div className="space-y-3">
                {actionItems.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => toggleActionItem(item.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      item.status === "completed"
                        ? "bg-homi-emerald/10 border-homi-emerald/30"
                        : item.status === "in_progress"
                        ? "bg-homi-cyan/10 border-homi-cyan/30"
                        : "bg-slate-800/60 border-slate-700 hover:border-slate-600"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {item.status === "completed" ? (
                          <CheckCircle2 className="text-homi-emerald" size={20} />
                        ) : (
                          <div className={`w-5 h-5 rounded-full border-2 ${
                            item.status === "in_progress" ? "border-homi-cyan bg-homi-cyan/20" : "border-slate-600"
                          }`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-semibold ${
                            item.status === "completed" ? "line-through text-gray-400" : "text-white"
                          }`}>
                            {item.title}
                          </p>
                          {item.priority === "high" && item.status !== "completed" && (
                            <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs font-bold">HIGH</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/60 border border-slate-700 rounded-2xl h-[calc(100vh-16rem)] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <MessageSquare className="text-homi-cyan" size={24} />
                  <div>
                    <h3 className="font-bold">Chat with Your Coach</h3>
                    <p className="text-xs text-gray-400">Ask questions, get advice, and work through your plan</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence>
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-homi-cyan to-homi-emerald text-gray-900"
                          : "bg-slate-800 text-white border border-slate-700"
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p className={`text-xs mt-2 ${
                          msg.role === "user" ? "text-gray-700" : "text-gray-500"
                        }`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-homi-cyan rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-homi-cyan rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-homi-cyan rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-slate-700">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask your coach anything..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-homi-cyan transition-colors"
                    disabled={loading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="bg-gradient-to-r from-homi-cyan to-homi-emerald text-gray-900 px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
