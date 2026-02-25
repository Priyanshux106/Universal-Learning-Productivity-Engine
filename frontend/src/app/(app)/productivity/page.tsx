"use client";

import { BarChart2, Flame, Zap, Target, Clock, BookOpen, TrendingUp, Calendar } from "lucide-react";

const weeklyData = [
  { day: "Mon", xp: 120, time: 45, concepts: 3 },
  { day: "Tue", xp: 200, time: 70, concepts: 5 },
  { day: "Wed", xp: 80, time: 30, concepts: 2 },
  { day: "Thu", xp: 310, time: 95, concepts: 8 },
  { day: "Fri", xp: 250, time: 80, concepts: 6 },
  { day: "Sat", xp: 190, time: 60, concepts: 4 },
  { day: "Sun", xp: 450, time: 120, concepts: 10 },
];

const maxXP = Math.max(...weeklyData.map(d => d.xp));

const topicMastery = [
  { topic: "JavaScript", pct: 78, color: "#f59e0b" },
  { topic: "React.js", pct: 62, color: "#7c6af7" },
  { topic: "AWS DynamoDB", pct: 45, color: "#22c55e" },
  { topic: "Python", pct: 85, color: "#3b82f6" },
  { topic: "Data Structures", pct: 55, color: "#a78bfa" },
];

const sessions = [
  { label: "Concept: Closures", duration: "12m", xp: 15, date: "Today" },
  { label: "Quiz: React Hooks", duration: "8m", xp: 40, date: "Today" },
  { label: "Code: Binary Search", duration: "25m", xp: 25, date: "Today" },
  { label: "Roadmap review", duration: "5m", xp: 10, date: "Yesterday" },
  { label: "Quiz: AWS Basics", duration: "10m", xp: 35, date: "Yesterday" },
];

export default function ProductivityPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-aura-text flex items-center gap-3">
          <BarChart2 className="text-aura-primary" size={28} /> Productivity
        </h1>
        <p className="text-aura-muted mt-1 text-sm">Track your learning consistency, XP velocity, and topic mastery.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Zap, label: "This Week", value: "1,600 XP", sub: "+34% vs last week", color: "text-aura-primary" },
          { icon: Flame, label: "Current Streak", value: "14 days", sub: "Best: 21 days", color: "text-orange-400" },
          { icon: Clock, label: "Study Time", value: "7h 20m", sub: "Avg 63 min/day", color: "text-blue-400" },
          { icon: Target, label: "Daily Goal", value: "80%", sub: "4 of 5 days hit", color: "text-green-400" },
        ].map(({ icon: Icon, label, value, sub, color }) => (
          <div key={label} className="card-hover p-5">
            <div className={`mb-3 ${color}`}><Icon size={20} /></div>
            <div className="text-2xl font-black text-aura-text">{value}</div>
            <div className="text-xs text-aura-muted">{label}</div>
            <div className={`text-xs mt-1 font-medium ${color}`}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-aura-text flex items-center gap-2">
            <TrendingUp size={16} className="text-aura-primary" /> Weekly XP
          </h2>
          <div className="flex items-center gap-2">
            <Calendar size={13} className="text-aura-muted" />
            <span className="text-xs text-aura-muted">Feb 19 – Feb 25</span>
          </div>
        </div>
        <div className="flex items-end gap-3 h-32">
          {weeklyData.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-[10px] text-aura-muted font-mono">{d.xp}</span>
              <div className="w-full rounded-t-lg transition-all duration-700 relative group"
                style={{
                  height: `${(d.xp / maxXP) * 100}%`,
                  background: d.day === "Sun" ? "linear-gradient(180deg, #7c6af7, #5b5af0)" : "rgba(124,106,247,0.25)",
                  minHeight: "4px",
                }}>
                <div className="tooltip -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block">
                  {d.xp} XP
                </div>
              </div>
              <span className="text-[10px] text-aura-muted">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Topic mastery + sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic mastery */}
        <div className="card p-6 space-y-5">
          <h2 className="font-bold text-aura-text flex items-center gap-2">
            <BookOpen size={16} className="text-aura-primary" /> Topic Mastery
          </h2>
          <div className="space-y-4">
            {topicMastery.map(({ topic, pct, color }) => (
              <div key={topic} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-aura-text font-medium">{topic}</span>
                  <span className="font-bold" style={{ color }}>{pct}%</span>
                </div>
                <div className="progress-bar">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}50` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent sessions */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-aura-text">Recent Sessions</h2>
            <button className="text-xs text-aura-primary hover:underline">View all</button>
          </div>
          <div className="space-y-2">
            {sessions.map(({ label, duration, xp, date }) => (
              <div key={label + date} className="flex items-center gap-3 p-3 rounded-xl hover:bg-aura-border/20 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-aura-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-aura-text truncate">{label}</div>
                  <div className="text-xs text-aura-muted">{date} · {duration}</div>
                </div>
                <span className="text-xs font-semibold text-green-400">+{xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
