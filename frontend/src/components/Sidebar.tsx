"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  HelpCircle,
  TerminalSquare,
  Settings,
  User as UserIcon,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roadmap", label: "Roadmaps", icon: Map },
  { href: "/quiz", label: "Quizzes", icon: HelpCircle },
  { href: "/developer", label: "Dev Mode", icon: TerminalSquare },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col border-r border-aura-border bg-white z-40">
      {/* Top User Profile matching reference image */}
      <div className="flex flex-col items-center gap-3 px-5 py-8 border-b border-aura-border">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
          {/* Avatar placeholder */}
          <UserIcon size={32} className="text-blue-500" />
        </div>
        <div className="text-center">
          <div className="text-base font-bold text-aura-text">Priyanshux106</div>
          <div className="text-xs text-aura-primary font-medium mt-1">Level 12 Developer</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href}>
              <div
                className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${active
                    ? "bg-blue-500 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span>{label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
