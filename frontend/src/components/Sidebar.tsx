"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Map,
  Brain,
  HelpCircle,
  Code2,
  BarChart2,
  User,
  Zap,
  ChevronRight,
  BookOpen,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/concept", label: "Concept Simplifier", icon: Brain },
  { href: "/quiz", label: "Quiz", icon: HelpCircle },
  { href: "/developer", label: "Developer Mode", icon: Code2 },
  { href: "/productivity", label: "Productivity", icon: BarChart2 },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col border-r border-aura-border bg-aura-surface z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-aura-border">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #7c6af7, #5b5af0)" }}>
          <BookOpen size={17} className="text-white" />
        </div>
        <div>
          <div className="text-sm font-bold text-aura-text">StuddyBuddy</div>
          <div className="text-xs text-aura-primary font-medium">AI Platform</div>
        </div>
      </div>

      {/* XP Widget */}
      <div className="mx-3 mt-4 p-3 rounded-xl bg-aura-card border border-aura-border">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-aura-muted font-medium">Level 12 · Intermediate</span>
          <div className="flex items-center gap-1 text-aura-primary">
            <Zap size={11} />
            <span className="text-xs font-bold">2,450 XP</span>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: "72%" }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-aura-muted">2,450 / 3,000</span>
          <span className="text-[10px] text-aura-primary">Level 13</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="text-[10px] uppercase tracking-wider text-aura-muted font-semibold px-3 mb-2">Navigation</p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href}>
              <div className={`nav-item ${active ? "active" : ""}`}>
                <Icon size={16} />
                <span>{label}</span>
                {active && <ChevronRight size={12} className="ml-auto text-aura-primary" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-aura-border">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-aura-card transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-aura-primary/20 border border-aura-primary/30 flex items-center justify-center">
            <span className="text-xs font-bold gradient-text">PS</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-aura-text truncate">Priyanshux106</div>
            <div className="text-[10px] text-aura-muted truncate">Pro Plan</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
