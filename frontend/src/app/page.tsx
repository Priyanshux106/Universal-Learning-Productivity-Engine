"use client";

import Link from "next/link";
import { ArrowRight, Brain, Code2, BookOpen, Map, Zap, CheckCircle2, Terminal, User } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f4f7fb] font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#f4f7fb]/80 backdrop-blur-md border-b border-transparent">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <Zap size={16} fill="currentColor" />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">LEARNAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {["Courses", "Roadmaps", "Quizzes", "Pricing"].map(item => (
              <a key={item} href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">{item}</a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth" className="text-sm font-medium text-slate-600 hover:text-slate-900">Log In</Link>
            <Link href="/auth" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors shadow-sm shadow-blue-600/20">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="lg:w-1/2">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full mb-6 text-xs font-bold tracking-wider uppercase">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Next-Gen Education
          </div>

          <h1 className="text-5xl md:text-[56px] font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
            Master Any<br />Subject with <span className="text-blue-600">AI<br />Precision</span>
          </h1>

          <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
            Generate custom roadmaps, practice with active recall, and debug code like a pro. All in one place.
          </p>

          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white text-base font-medium px-6 py-3.5 rounded-full transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 group">
              Start Learning <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/developer" className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-base font-medium px-6 py-3.5 rounded-full transition-colors">
              Try Developer Mode
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#f4f7fb] bg-slate-300 overflow-hidden flex items-center justify-center">
                  <User size={20} className="text-slate-500" />
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-600">
              Joined by <span className="font-bold text-slate-900">50K+</span> active learners
            </p>
          </div>
        </div>

        {/* Hero Mockup */}
        <div className="lg:w-1/2 w-full max-w-2xl">
          <div className="rounded-2xl bg-[#0f172a] shadow-2xl overflow-hidden border border-slate-800 max-h-[400px]">
            {/* Window header */}
            <div className="flex items-center px-4 py-3 border-b border-slate-800/60 bg-[#1e293b]/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="mx-auto text-xs text-slate-400 font-mono -ml-6">AI ROADMAP GENERATION ENGINE</div>
            </div>
            {/* Window body */}
            <div className="p-6">
              <div className="flex gap-4 mb-6">
                {['STEP 1', 'STEP 2', 'STEP 3'].map((step, i) => (
                  <div key={step} className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex flex-col items-center justify-center gap-2">
                    {i === 0 && <BookOpen size={20} className="text-blue-400" />}
                    {i === 1 && <Map size={20} className="text-blue-400" />}
                    {i === 2 && <Code2 size={20} className="text-blue-400" />}
                    <span className="text-[10px] font-bold text-slate-400">{step}</span>
                  </div>
                ))}
              </div>
              <div className="font-mono text-sm space-y-2">
                <div className="text-green-400">&gt; Initializing AI model...</div>
                <div className="text-green-400">&gt; Analyzing learner profile...</div>
                <div className="text-blue-400 font-bold">&gt; Success: Personalized Roadmap Generated.</div>
                <div className="text-slate-500 animate-pulse">_</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section className="py-10 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Students", value: "50k+" },
            { label: "Courses Generated", value: "1.2M" },
            { label: "Success Rate", value: "98%" },
            { label: "AI Models", value: "GPT-4o" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-100">
              <div className="text-xs text-slate-500 font-medium mb-1">{stat.label}</div>
              <div className="text-3xl font-black text-slate-900">{stat.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Advanced AI Features */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Advanced AI Features</h2>
          <p className="text-slate-600 leading-relaxed">
            Our platform uses cutting-edge models to ensure you learn faster, retain more, and solve problems in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Map,
              title: "AI Roadmaps",
              desc: "Personalized learning paths generated in seconds based on your specific goals, background, and available time.",
              checks: ["Dynamic adjustments", "Prerequisite analysis"],
            },
            {
              icon: Brain,
              title: "Active Recall Quizzes",
              desc: "Retention-focused testing for any topic. AI generates questions that challenge your understanding and lock in knowledge.",
              checks: ["Spaced repetition tech", "Instant feedback loop"],
            },
            {
              icon: Terminal,
              title: "Code Debug Assistant",
              desc: "Real-time technical help and error resolution. Paste your code and get instant explanations and optimized fixes.",
              checks: ["Multi-language support", "Context-aware solutions"],
            },
          ].map((feature) => (
            <div key={feature.title} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
                <feature.icon size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-1">
                {feature.desc}
              </p>
              <ul className="space-y-3 mt-auto">
                {feature.checks.map((check) => (
                  <li key={check} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <CheckCircle2 size={14} className="text-blue-600" />
                    {check}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="bg-blue-600 rounded-[2.5rem] p-16 text-center text-white shadow-2xl relative overflow-hidden">
          {/* Subtle pattern or gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Ready to upgrade your<br />learning process?
            </h2>
            <p className="text-blue-100 text-lg mb-10 leading-relaxed max-w-xl mx-auto">
              Join thousands of developers and students who are scaling their skills faster than ever before with LearnAI.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth" className="bg-white text-blue-600 hover:bg-slate-50 text-base font-bold px-8 py-4 rounded-full transition-colors shadow-lg">
                Start for Free
              </Link>
              <Link href="/pricing" className="bg-blue-700/50 hover:bg-blue-700 text-white text-base font-bold px-8 py-4 rounded-full transition-colors backdrop-blur-sm border border-blue-500/30">
                View Pricing Plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 px-6 mt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <Zap size={12} fill="currentColor" />
              </div>
              <span className="font-bold text-slate-900 text-sm tracking-tight">LEARNAI</span>
            </div>
            <p className="text-xs text-slate-500 max-w-xs">
              The world's first AI-native education platform designed for the modern era of rapid learning and development.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-4">Platform</h4>
            <ul className="space-y-2">
              {["Course Library", "Developer Tools", "Roadmap Generator", "Enterprise"].map(link => (
                <li key={link}><a href="#" className="text-xs text-slate-500 hover:text-blue-600 transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-4">Company</h4>
            <ul className="space-y-2">
              {["About Us", "Careers", "Blog", "Contact"].map(link => (
                <li key={link}><a href="#" className="text-xs text-slate-500 hover:text-blue-600 transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-4">Newsletter</h4>
            <p className="text-xs text-slate-500 mb-3">Stay updated with the latest AI learning trends.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email address" className="bg-slate-50 border border-slate-200 text-sm rounded-full px-4 py-2 w-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              <button className="bg-blue-600 text-white rounded-full w-10 flex items-center justify-center flex-shrink-0 hover:bg-blue-700 transition-colors">
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-100">
          <div className="text-xs text-slate-400">© 2024 LearnAI Inc. All rights reserved.</div>
          <div className="flex gap-6 mt-4 md:mt-0">
            {["Privacy Policy", "Terms of Service", "Cookie Settings"].map(item => (
              <a key={item} href="#" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
