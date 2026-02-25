"use client";

import Link from "next/link";
import { ArrowRight, Brain, Code2, BookOpen, Map, Zap, Star, ChevronRight, Sparkles } from "lucide-react";

const features = [
  { icon: Map, title: "AI Roadmap Generator", desc: "Get a personalized learning roadmap powered by AWS Bedrock (Claude 3 Sonnet)." },
  { icon: Brain, title: "Concept Simplifier", desc: "Break down complex topics into digestible explanations instantly." },
  { icon: Code2, title: "Code Analyzer", desc: "Execute code via Judge0, then get AI-powered feedback and improvements." },
  { icon: BookOpen, title: "Adaptive Quizzes", desc: "Spaced repetition quizzes that adapt to your proficiency in real-time." },
];

const stats = [
  { value: "50K+", label: "Learners" },
  { value: "200+", label: "Topics" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9★", label: "Rating" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-aura-bg">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-aura-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c6af7, #5b5af0)" }}>
              <BookOpen size={15} className="text-white" />
            </div>
            <span className="font-bold text-aura-text text-sm">StuddyBuddy AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {["Features", "Roadmap", "Pricing", "Docs"].map(item => (
              <a key={item} href="#" className="text-sm text-aura-muted hover:text-aura-text transition-colors">{item}</a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth" className="btn-ghost text-sm">Sign In</Link>
            <Link href="/auth" className="btn-primary text-sm px-4 py-2">Get Started Free</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #7c6af7, transparent)" }} />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 badge-primary px-4 py-2 rounded-full mb-8 text-sm">
            <Sparkles size={13} />
            <span>Powered by AWS Bedrock · Claude 3 Sonnet</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black text-aura-text mb-6 leading-tight tracking-tight">
            Learn Smarter with{" "}
            <span className="gradient-text">AI-Native</span>
            <br />Developer Education
          </h1>

          <p className="text-xl text-aura-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            StuddyBuddy AI generates personalized roadmaps, simplifies complex concepts, executes your code with AI feedback, and adapts to your learning pace — all serverlessly on AWS.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/auth" className="btn-primary text-base px-8 py-4">
              Start Learning Free <ArrowRight size={18} />
            </Link>
            <Link href="/dashboard" className="btn-secondary text-base px-8 py-4">
              View Demo
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-4 gap-4 max-w-lg mx-auto">
            {stats.map(({ value, label }) => (
              <div key={label} className="card p-4 text-center">
                <div className="text-2xl font-black gradient-text">{value}</div>
                <div className="text-xs text-aura-muted mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="badge-primary px-4 py-1.5 rounded-full text-xs inline-block mb-4">Core Features</div>
            <h2 className="text-4xl font-bold text-aura-text mb-3">Everything you need to level up</h2>
            <p className="text-aura-muted max-w-xl mx-auto">Serverless AI tools that grow with your skills, backed by AWS Lambda, DynamoDB, and Bedrock.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card-hover p-6 group cursor-pointer">
                <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, rgba(124,106,247,0.2), rgba(91,90,240,0.1))", border: "1px solid rgba(124,106,247,0.2)" }}>
                  <Icon size={22} className="text-aura-primary" />
                </div>
                <h3 className="font-semibold text-aura-text mb-2">{title}</h3>
                <p className="text-sm text-aura-muted leading-relaxed">{desc}</p>
                <div className="flex items-center gap-1 mt-4 text-xs text-aura-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="card p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-30"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(124,106,247,0.3), transparent 70%)" }} />
            <div className="relative z-10">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <h2 className="text-4xl font-bold text-aura-text mb-4">Ready to transform your learning?</h2>
              <p className="text-aura-muted mb-8 max-w-xl mx-auto">Join thousands of developers using AWS-powered AI to master new technologies faster.</p>
              <Link href="/auth" className="btn-primary text-base px-10 py-4 inline-flex">
                <Zap size={18} /> Get started — it&apos;s free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-aura-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-aura-muted">© 2025 StuddyBuddy AI. Built on AWS · Lambda · Bedrock · DynamoDB</div>
          <div className="flex gap-5">
            {["Privacy", "Terms", "GitHub"].map(item => (
              <a key={item} href="#" className="text-xs text-aura-muted hover:text-aura-text transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
