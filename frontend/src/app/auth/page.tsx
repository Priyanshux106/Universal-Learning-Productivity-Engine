"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Mail, Lock, User, Github, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="min-h-screen bg-aura-bg flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #0d0e1a, #08090c)" }}>
        <div className="absolute inset-0 opacity-20"
          style={{ background: "radial-gradient(ellipse at 30% 30%, rgba(124,106,247,0.5), transparent 60%)" }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c6af7, #5b5af0)" }}>
            <BookOpen size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg text-aura-text">StuddyBuddy AI</span>
        </div>

        {/* Center Content */}
        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 badge-primary px-3 py-1.5 rounded-full text-xs">
            <Sparkles size={11} /> AI-Powered Learning Platform
          </div>
          <h2 className="text-5xl font-black text-aura-text leading-tight">
            Learn. Code.<br />
            <span className="gradient-text">Level Up.</span>
          </h2>
          <p className="text-aura-muted leading-relaxed max-w-sm">
            AWS Bedrock generates personalized paths, Judge0 executes your code, and DynamoDB tracks every XP earned.
          </p>

          <div className="space-y-3">
            {[
              "Personalized AI roadmaps with Claude 3 Sonnet",
              "Real-time code execution via Judge0",
              "Adaptive spaced-repetition quizzes",
              "Serverless — scales to zero instantly",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-2.5 text-sm text-aura-text">
                <div className="w-5 h-5 rounded-full bg-aura-primary/20 border border-aura-primary/30 flex items-center justify-center flex-shrink-0">
                  <ArrowRight size={10} className="text-aura-primary" />
                </div>
                {feat}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 card p-5">
          <p className="text-sm text-aura-text italic leading-relaxed">
            &quot;StuddyBuddy AI turned my chaotic learning into a structured journey. Level 24 in 3 months!&quot;
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-7 h-7 rounded-full bg-aura-primary/30 flex items-center justify-center text-xs font-bold text-aura-primary">A</div>
            <div>
              <div className="text-xs font-semibold text-aura-text">Aarav M.</div>
              <div className="text-[10px] text-aura-muted">Full-Stack Dev</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c6af7, #5b5af0)" }}>
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="font-bold text-aura-text">StuddyBuddy AI</span>
          </div>

          {/* Tabs */}
          <div className="flex bg-aura-surface border border-aura-border rounded-xl p-1 mb-8">
            {[
              { key: "signin" as const, label: "Sign In" },
              { key: "signup" as const, label: "Create Account" },
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setMode(key)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === key ? "btn-primary" : "text-aura-muted hover:text-aura-text"
                }`}>
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs font-medium text-aura-muted mb-1.5 block">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aura-muted" />
                  <input type="text" placeholder="Your full name" className="input pl-10" />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-aura-muted mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aura-muted" />
                <input type="email" placeholder="you@example.com" className="input pl-10" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-aura-muted mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-aura-muted" />
                <input type={showPass ? "text" : "password"} placeholder="••••••••" className="input pl-10 pr-10" />
                <button onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-aura-muted hover:text-aura-text transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {mode === "signin" && (
              <div className="flex justify-end">
                <a href="#" className="text-xs text-aura-primary hover:underline">Forgot password?</a>
              </div>
            )}

            <Link href="/dashboard">
              <button className="btn-primary w-full py-3 justify-center mt-2">
                {mode === "signin" ? "Sign In" : "Create Account"}
                <ArrowRight size={16} />
              </button>
            </Link>

            <div className="relative flex items-center gap-3 my-2">
              <div className="flex-1 divider" />
              <span className="text-xs text-aura-muted">or continue with</span>
              <div className="flex-1 divider" />
            </div>

            <button className="btn-secondary w-full py-3 justify-center gap-2">
              <Github size={17} /> Continue with GitHub
            </button>
          </div>

          <p className="text-xs text-aura-muted text-center mt-6">
            By continuing, you agree to our{" "}
            <a href="#" className="text-aura-primary hover:underline">Terms</a> and{" "}
            <a href="#" className="text-aura-primary hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
