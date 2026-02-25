"use client";

import { User, Zap, Flame, Trophy, BookOpen, Code2, Mail, Github, Edit3, Shield, Bell } from "lucide-react";

const badges = [
  { icon: "🔥", label: "14-Day Streak", desc: "Consistency wizard" },
  { icon: "⚡", label: "XP Grinder", desc: "Earned 1000+ XP in a week" },
  { icon: "🧩", label: "Algorithm Ace", desc: "Solved 10 DSA challenges" },
  { icon: "🌐", label: "AWS Explorer", desc: "Completed AWS module" },
  { icon: "🏆", label: "Quiz Champion", desc: "Aced 5 quizzes in a row" },
  { icon: "💡", label: "Curious Mind", desc: "Simplified 50 concepts" },
];

const stats = [
  { icon: Zap, label: "Total XP", value: "2,450", color: "text-aura-primary" },
  { icon: Flame, label: "Best Streak", value: "21 days", color: "text-orange-400" },
  { icon: Trophy, label: "Quizzes Aced", value: "32", color: "text-amber-400" },
  { icon: BookOpen, label: "Concepts Learned", value: "87", color: "text-blue-400" },
  { icon: Code2, label: "Code Analyses", value: "24", color: "text-green-400" },
];

export default function ProfilePage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-aura-text flex items-center gap-3">
          <User className="text-aura-primary" size={28} /> User Profile
        </h1>
        <p className="text-aura-muted mt-1 text-sm">Your learning identity, badges, and achievements.</p>
      </div>

      {/* Profile hero */}
      <div className="card p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-48 opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #7c6af7, transparent)" }} />

        <div className="relative flex flex-col sm:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-black"
              style={{ background: "linear-gradient(135deg, #7c6af7, #5b5af0)", boxShadow: "0 0 30px rgba(124,106,247,0.4)" }}>
              P
            </div>
            <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-aura-card border-2 border-aura-primary flex items-center justify-center">
              <span className="text-[10px] font-bold text-aura-primary">12</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-black text-aura-text">Priyanshux106</h2>
              <span className="badge-primary text-xs">Intermediate</span>
              <span className="badge-success text-xs">Pro Plan</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-aura-muted">
              <Mail size={13} /> <span>priyanshux@example.com</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-aura-muted">
              <Github size={13} /> <span>github.com/Priyanshux106</span>
            </div>
            <p className="text-sm text-aura-muted pt-2 max-w-md">
              Full-stack developer and AI enthusiast. Learning AWS architecture, system design, and advanced React patterns.
            </p>
          </div>

          <button className="btn-secondary text-sm flex-shrink-0">
            <Edit3 size={14} /> Edit Profile
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card p-4 text-center">
            <Icon size={18} className={`${color} mx-auto mb-2`} />
            <div className="text-xl font-black text-aura-text">{value}</div>
            <div className="text-[10px] text-aura-muted mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Level progress */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-sm font-semibold text-aura-text">Level 12 — Intermediate</span>
            <div className="text-xs text-aura-muted mt-0.5">2,450 / 3,000 XP · 550 XP to Level 13</div>
          </div>
          <span className="gradient-text font-bold text-lg">Level 12</span>
        </div>
        <div className="xp-bar">
          <div className="progress-fill" style={{ width: "72%" }} />
        </div>
      </div>

      {/* Badges */}
      <div className="card p-6 space-y-4">
        <h2 className="font-bold text-aura-text">Achievements & Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {badges.map(({ icon, label, desc }) => (
            <div key={label} className="card-hover p-4 text-center cursor-pointer group">
              <div className="text-3xl mb-2">{icon}</div>
              <div className="text-xs font-semibold text-aura-text">{label}</div>
              <div className="text-[10px] text-aura-muted mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity leading-tight">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-aura-text flex items-center gap-2">
            <Bell size={15} className="text-aura-primary" /> Notifications
          </h2>
          {[
            ["Daily Study Reminders", true],
            ["Streak Alerts", true],
            ["Quiz Ready (Spaced Repetition)", true],
            ["Weekly Progress Report", false],
          ].map(([label, checked]) => (
            <div key={String(label)} className="flex items-center justify-between">
              <span className="text-sm text-aura-muted">{String(label)}</span>
              <div className={`w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${
                checked ? "bg-aura-primary justify-end" : "bg-aura-border justify-start"
              }`}>
                <div className="w-4 h-4 rounded-full bg-white shadow" />
              </div>
            </div>
          ))}
        </div>

        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-aura-text flex items-center gap-2">
            <Shield size={15} className="text-aura-primary" /> Privacy & Security
          </h2>
          <div className="space-y-3 text-sm">
            <button className="btn-secondary w-full justify-start text-sm">Change Password</button>
            <button className="btn-secondary w-full justify-start text-sm">Download My Data</button>
            <button className="w-full px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
