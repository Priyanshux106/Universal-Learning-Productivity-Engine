"use client";

import { Flame, Zap, BookOpen, Code2, Trophy, TrendingUp, Clock, Map, Brain, HelpCircle, BarChart2 } from "lucide-react";
import Link from "next/link";

const stats = [
  { icon: Zap, label: "Total XP", value: "2,450", sub: "+120 today", color: "text-aura-primary" },
  { icon: Flame, label: "Day Streak", value: "14", sub: "🔥 Keep it up!", color: "text-orange-400" },
  { icon: BookOpen, label: "Concepts Learned", value: "87", sub: "+5 this week", color: "text-green-400" },
  { icon: Trophy, label: "Quizzes Aced", value: "32", sub: "83% accuracy", color: "text-amber-400" },
];

const recentActivity = [
  { icon: Brain, label: "Simplified: Binary Trees", time: "2h ago", xp: "+15 XP", color: "text-purple-400" },
  { icon: Code2, label: "Analyzed: merge_sort.py", time: "5h ago", xp: "+25 XP", color: "text-green-400" },
  { icon: HelpCircle, label: "Quiz: JavaScript Async", time: "Yesterday", xp: "+40 XP", color: "text-blue-400" },
  { icon: Map, label: "Roadmap: React Mastery", time: "2d ago", xp: "+10 XP", color: "text-aura-primary" },
];

const quickActions = [
  { href: "/roadmap", icon: Map, label: "Generate Roadmap", desc: "AI-personalized path" },
  { href: "/concept", icon: Brain, label: "Simplify Concept", desc: "Instant explanations" },
  { href: "/quiz", icon: HelpCircle, label: "Start Quiz", desc: "Spaced repetition" },
  { href: "/developer", icon: Code2, label: "Analyze Code", desc: "AI + Judge0 feedback" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-aura-text">Good evening, Priyanshux 👋</h1>
          <p className="text-aura-muted mt-1 text-sm">You&apos;re on a <span className="text-orange-400 font-semibold">14-day streak</span>. Don&apos;t break it!</p>
        </div>
        <div className="card px-4 py-2 flex items-center gap-2">
          <Clock size={14} className="text-aura-muted" />
          <span className="text-xs text-aura-muted">Studied <span className="text-aura-text font-semibold">3h 20m</span> today</span>
        </div>
      </div>

      {/* Level progress */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs text-aura-muted font-medium">CURRENT LEVEL</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-black gradient-text">Level 12</span>
              <span className="badge-primary px-2 py-0.5 rounded-full text-xs">Intermediate</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-aura-muted">XP to next level</span>
            <div className="text-xl font-black text-aura-text mt-0.5">550 XP</div>
          </div>
        </div>
        <div className="xp-bar">
          <div className="progress-fill" style={{ width: "72%" }} />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-aura-muted">2,450 / 3,000 XP</span>
          <span className="text-xs text-aura-primary font-medium">Level 13 → Senior Learner</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, sub, color }) => (
          <div key={label} className="card-hover p-5">
            <div className={`mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            <div className="text-2xl font-black text-aura-text">{value}</div>
            <div className="text-xs text-aura-muted mt-0.5">{label}</div>
            <div className={`text-xs mt-1 font-medium ${color}`}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card p-6 space-y-4">
          <h2 className="section-title text-lg">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(({ href, icon: Icon, label, desc }) => (
              <Link key={href} href={href}>
                <div className="card-hover p-4 text-center cursor-pointer group">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(124,106,247,0.15)", border: "1px solid rgba(124,106,247,0.2)" }}>
                    <Icon size={18} className="text-aura-primary" />
                  </div>
                  <div className="text-sm font-semibold text-aura-text">{label}</div>
                  <div className="text-xs text-aura-muted mt-0.5">{desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="section-title text-lg">Recent Activity</h2>
            <button className="text-xs text-aura-primary hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {recentActivity.map(({ icon: Icon, label, time, xp, color }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-xl hover:bg-aura-border/30 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-aura-border/50 flex-shrink-0">
                  <Icon size={15} className={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-aura-text truncate">{label}</div>
                  <div className="text-xs text-aura-muted">{time}</div>
                </div>
                <span className="text-xs font-semibold text-green-400 flex-shrink-0">{xp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart placeholder */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title text-lg">Weekly Progress</h2>
          <div className="flex items-center gap-1 text-green-400 text-xs font-medium">
            <TrendingUp size={13} /> +18% vs last week
          </div>
        </div>
        <div className="flex items-end gap-3 h-24">
          {[40, 65, 50, 80, 70, 90, 72].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-lg transition-all duration-700"
                style={{ height: `${h}%`, background: i === 6 ? "linear-gradient(180deg, #7c6af7, #5b5af0)" : "rgba(124,106,247,0.2)" }} />
              <span className="text-[10px] text-aura-muted">
                {["M", "T", "W", "T", "F", "S", "S"][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
