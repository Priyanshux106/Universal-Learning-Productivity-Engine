"use client";

import { Flame, Zap, BookOpen, Code2, Trophy, Brain, HelpCircle, Map, Target, TerminalSquare, Search, Bell, Star, Medal, CheckCircle2, CircleDashed } from "lucide-react";
import Link from "next/link";

const stats = [
  { icon: Star, label: "Total XP", value: "12,450", sub: "+150~", subColor: "text-green-500", bg: "bg-slate-50", iconBg: "bg-slate-200", iconColor: "text-white" },
  { icon: Medal, label: "Current Level", value: "Level 24", sub: "+2 ranks today", subColor: "text-blue-600", bg: "bg-slate-50", iconBg: "bg-slate-200", iconColor: "text-white" },
  { icon: Zap, label: "Day Streak", value: "5 Days", sub: "Personal Best!", subColor: "text-orange-500", bg: "bg-slate-50", iconBg: "bg-slate-200", iconColor: "text-white" },
];

const quickActions = [
  { href: "/roadmap", icon: Map, label: "Generate Roadmap", desc: "Create a personalized path using AI.", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  { href: "/concept", icon: Brain, label: "Simplify Concept", desc: "Break down complex topics instantly.", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  { href: "/quiz", icon: HelpCircle, label: "Take Quiz", desc: "Test your knowledge and earn XP.", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  { href: "/developer", icon: TerminalSquare, label: "Open Dev Mode", desc: "Access advanced tools and API.", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Navbar area (simulating the Main Hub header from reference) */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-600 rotate-45 flex items-center justify-center">
             <div className="w-2 h-2 bg-white -rotate-45" />
          </div>
          <span className="font-bold text-slate-900 text-lg">Main Hub</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search resources..." 
              className="bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 rounded-full pl-9 pr-4 py-2 text-sm w-64 outline-none transition-all"
            />
          </div>
          <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
            <Bell size={18} />
          </button>
          <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
            <div className="w-5 h-5 rounded-full bg-slate-300 overflow-hidden" />
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 max-w-6xl w-full mx-auto space-y-10">
        {/* Welcome Header */}
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Welcome back, Priyanshux</h1>
          <p className="flex items-center gap-1.5 text-slate-600 text-base">
            <span className="text-orange-500">🔥</span> You're on a <span className="font-bold text-slate-900">5-day streak</span> ! You're in the top 5% this week.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map(({ icon: Icon, label, value, sub, subColor, bg, iconBg, iconColor }) => (
            <div key={label} className={`rounded-3xl p-6 border border-slate-100 ${bg} relative overflow-hidden flex flex-col justify-between`}>
              <div className="relative z-10">
                <div className="text-sm font-semibold text-slate-600 mb-1">{label}</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900 tracking-tight">{value}</span>
                  <span className={`text-xs font-bold ${subColor}`}>{sub}</span>
                </div>
              </div>
              <div className={`absolute top-6 right-6 w-16 h-16 rounded-full flex items-center justify-center opacity-50 ${iconBg}`}>
                 <Icon size={40} className={iconColor} strokeWidth={1.5} />
              </div>
            </div>
          ))}
        </div>

        {/* Active Goal */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Target size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Active Goal</h2>
          </div>
          
          <div className="bg-white border text-center border-slate-100 shadow-sm rounded-3xl p-8">
            <div className="flex justify-between items-start mb-8">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-slate-900 mb-1">Mastering React & Next.js</h3>
                <p className="text-slate-500 text-sm">Next milestone: Server Components Architecture</p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-3 mb-1">
                  <span className="text-3xl font-black text-blue-600 tracking-tight">65%</span>
                  <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="bg-blue-600 h-full rounded-full w-[65%]" />
                  </div>
                </div>
                <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Progress</div>
              </div>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-full border border-slate-100">
                <CheckCircle2 size={18} className="text-green-500" />
                <span className="text-sm font-medium text-slate-700">React Hooks</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-full border border-slate-100">
                <CheckCircle2 size={18} className="text-green-500" />
                <span className="text-sm font-medium text-slate-700">Custom Hooks</span>
              </div>
              <div className="flex items-center gap-3 bg-blue-50 px-4 py-3 rounded-full border border-blue-100">
                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px]">•••</div>
                <span className="text-sm font-bold text-blue-600">App Router</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-50/50 px-4 py-3 rounded-full border border-slate-50 border-dashed">
                <div className="w-4 h-4 rounded-full bg-slate-300" />
                <span className="text-sm font-medium text-slate-400">Middleware</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {quickActions.map(({ href, icon: Icon, label, desc, iconBg, iconColor }) => (
              <Link key={href} href={href}>
                <div className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-3xl p-6 h-full flex flex-col group cursor-pointer">
                  <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center mb-6`}>
                    <Icon size={24} className={iconColor} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{label}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <BookOpen size={20} />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Completed "Intro to Next.js 14"</div>
                <div className="text-xs text-slate-500 mt-0.5">2 hours ago</div>
              </div>
            </div>
            <div className="text-sm font-bold text-slate-400">+50 XP</div>
          </div>
        </div>
      </main>
    </div>
  );
}
