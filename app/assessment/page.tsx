"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, TrendingUp, Target, Heart, Clock, Check,
} from "lucide-react";
import ThresholdCompass from "@/components/ThresholdCompass";

interface AssessmentData {
  income: number;
  savings: number;
  monthlyDebt: number;
  creditScore: string;
  targetPrice: number;
  confidence: number;
  jobStability: string;
  lifeStability: string;
  location: string;
  timeline: string;
}

interface Question {
  id: keyof AssessmentData;
  label: string;
  type: 'number' | 'text' | 'select' | 'slider';
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const questions: Question[] = [
  { id: "income", label: "Annual Household Income", type: "number", placeholder: "75000", icon: TrendingUp },
  { id: "savings", label: "Total Savings", type: "number", placeholder: "50000", icon: Target },
  { id: "monthlyDebt", label: "Monthly Debt Payments", type: "number", placeholder: "800", icon: TrendingUp },
  { id: "creditScore", label: "Credit Score Range", type: "select", options: ["300-579","580-669","670-739","740-799","800-850"], icon: Target },
  { id: "targetPrice", label: "Target Home Price", type: "number", placeholder: "450000", icon: Target },
  { id: "confidence", label: "Confidence About Buying (1-10)", type: "slider", min: 1, max: 10, icon: Heart },
  { id: "jobStability", label: "Job Stability", type: "select", options: ["Very Unstable","Unstable","Stable","Very Stable"], icon: TrendingUp },
  { id: "lifeStability", label: "Life Stability", type: "select", options: ["In Flux","Somewhat Stable","Stable","Very Stable"], icon: Heart },
  { id: "location", label: "Target Location", type: "text", placeholder: "Miami, FL", icon: Target },
  { id: "timeline", label: "Buying Timeline", type: "select", options: ["1-3 months","3-6 months","6-12 months","12+ months"], icon: Clock },
];

export default function AssessmentPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Partial<AssessmentData>>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const q = questions[step];
  const IconComponent = q.icon;

  const update = (id: keyof AssessmentData, value: any) => setForm({ ...form, [id]: value });

  const next = () => step < questions.length - 1 && setStep(step + 1);
  const back = () => step > 0 && setStep(step - 1);

  const submit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses: form }),
      });
      const data = await res.json();
      setResult(data.score);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <main className="min-h-screen bg-homi-graphite flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl w-full"
        >
          <h1 className="text-4xl font-bold text-homi-cyan mb-4">Your HōMI Score</h1>

          <div className="flex justify-center mb-6">
            <ThresholdCompass score={result.total} />
          </div>

          <p className="mt-4 text-homi-emerald text-xl font-semibold">{result.message}</p>

          <div className="mt-6 grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
            <div className="bg-slate-800/60 px-6 py-4 rounded-xl border border-slate-700">
              <p className="text-slate-400 text-sm">Financial</p>
              <p className="text-3xl font-bold text-white">{Math.round(result.financial)}</p>
            </div>
            <div className="bg-slate-800/60 px-6 py-4 rounded-xl border border-slate-700">
              <p className="text-slate-400 text-sm">Emotional</p>
              <p className="text-3xl font-bold text-white">{Math.round(result.emotional)}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <h3 className="text-xl font-semibold text-white mb-4">Recommendations</h3>
            {result.recommendations.map((r: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-slate-800/60 px-6 py-3 rounded-xl border text-left ${
                  r.priority === 'high' ? 'border-red-500/50' :
                  r.priority === 'action' ? 'border-green-500/50' :
                  'border-slate-700'
                }`}
              >
                <span className={`${
                  r.priority === 'high' ? 'text-red-400' :
                  r.priority === 'action' ? 'text-green-400' :
                  'text-slate-200'
                }`}>
                  • {r.text}
                </span>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => { setResult(null); setStep(0); setForm({}); }}
            className="mt-10 bg-homi-cyan text-homi-graphite font-bold px-8 py-3 rounded-xl hover:bg-homi-emerald transition-all transform hover:scale-105"
          >
            Retake Assessment
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-homi-graphite flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-slate-900/60 border border-slate-700 rounded-2xl p-8 shadow-xl">
        <div className="flex justify-between mb-6 text-slate-400">
          <span>Question {step + 1} / {questions.length}</span>
          <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <IconComponent size={24} className="text-homi-cyan" />
              <label className="block text-2xl font-semibold text-homi-cyan">
                {q.label}
              </label>
            </div>

            {q.type === "number" && (
              <input
                type="number"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-homi-cyan focus:outline-none transition-colors"
                placeholder={q.placeholder}
                value={form[q.id] || ""}
                onChange={(e) => update(q.id, Number(e.target.value))}
              />
            )}

            {q.type === "text" && (
              <input
                type="text"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-homi-cyan focus:outline-none transition-colors"
                placeholder={q.placeholder}
                value={form[q.id] || ""}
                onChange={(e) => update(q.id, e.target.value)}
              />
            )}

            {q.type === "select" && (
              <select
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-homi-cyan focus:outline-none transition-colors"
                value={form[q.id] || ""}
                onChange={(e) => update(q.id, e.target.value)}
              >
                <option value="">Select…</option>
                {q.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}

            {q.type === "slider" && (
              <div>
                <input
                  type="range"
                  min={q.min}
                  max={q.max}
                  value={form[q.id] || q.min}
                  onChange={(e) => update(q.id, Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-homi-emerald"
                />
                <div className="flex justify-between mt-2 text-sm text-slate-400">
                  <span>Low ({q.min})</span>
                  <span className="text-homi-cyan font-bold">{form[q.id] || q.min}</span>
                  <span>High ({q.max})</span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <button
            onClick={back}
            disabled={step === 0}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft size={18} />Back
          </button>

          {step < questions.length - 1 ? (
            <button
              onClick={next}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-homi-emerald text-homi-graphite font-semibold hover:bg-homi-cyan transition-all transform hover:scale-105"
            >
              Next<ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-homi-cyan text-homi-graphite font-semibold hover:bg-homi-emerald transition-all transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? "Calculating…" : "Get My Score"}
              <Check size={18} />
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
