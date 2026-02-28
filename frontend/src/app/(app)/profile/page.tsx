"use client";

import { useState } from "react";
import { User, Mail, Briefcase, Target, Clock, Bell, Settings, Save, Sparkles, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("general");
  const [reminders, setReminders] = useState(true);
  const [reports, setReports] = useState(false);

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] bg-slate-50">
      
      {/* Top Header Background */}
      <div className="bg-white border-b border-slate-200 px-8 py-10 md:py-16">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-8">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl shadow-blue-900/10 overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <span className="text-4xl md:text-5xl font-black text-blue-600">P</span>
            </div>
            <button className="absolute bottom-0 right-0 md:bottom-2 md:right-2 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white hover:bg-blue-700 transition-colors">
               <Sparkles size={14} />
            </button>
          </div>
          
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Priyanshux106</h1>
            <p className="text-slate-500 font-medium flex items-center gap-2 justify-center md:justify-start">
              <Mail size={16} /> priyanshux@example.com
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-6 py-8 flex-1">
        
        {/* Tabs */}
        <div className="flex items-center gap-4 border-b border-slate-200 mb-8 overflow-x-auto pb-[1px]">
          {[
            { id: "general", label: "General Settings", icon: Settings },
            { id: "learning", label: "Learning Preferences", icon: Target },
            { id: "subscription", label: "Subscription", icon: ShieldCheck },
          ].map((tab) => {
             const Icon = tab.icon;
             const isActive = activeTab === tab.id;
             return (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-2 py-4 px-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap
                   ${isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
               >
                 <Icon size={16} /> {tab.label}
               </button>
             );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Personal Information Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="text-sm font-bold text-slate-700 mb-2 block">Full Name</label>
                 <div className="relative">
                   <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input type="text" defaultValue="Priyanshux106" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-500 transition-colors" />
                 </div>
              </div>
              <div>
                 <label className="text-sm font-bold text-slate-700 mb-2 block">Email Address</label>
                 <div className="relative">
                   <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input type="email" defaultValue="priyanshux@example.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-500 transition-colors" />
                 </div>
              </div>
              <div className="md:col-span-2">
                 <label className="text-sm font-bold text-slate-700 mb-2 block">Role or Target Career</label>
                 <div className="relative">
                   <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   <select className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-500 transition-colors appearance-none">
                     <option>Full-Stack Developer</option>
                     <option>Frontend Engineer</option>
                     <option>Backend Developer</option>
                     <option>Data Scientist</option>
                     <option>Student</option>
                   </select>
                 </div>
              </div>
            </div>
          </div>

          {/* Learning Goals Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Learning Goals</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="text-sm font-bold text-slate-700 mb-2 block">Weekly Goal (Hours)</label>
                 <div className="relative">
                   <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input type="number" defaultValue="15" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-500 transition-colors" />
                 </div>
              </div>
              <div>
                 <label className="text-sm font-bold text-slate-700 mb-2 block">Primary Focus Area</label>
                 <div className="relative">
                   <Target size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input type="text" defaultValue="React & Next.js Ecosystem" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-500 transition-colors" />
                 </div>
              </div>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Bell size={20} className="text-slate-900" />
              <h2 className="text-xl font-bold text-slate-900">Notifications Layout</h2>
            </div>
            
            <div className="space-y-4">
               {/* Toggle 1 */}
               <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                 <div>
                   <h3 className="text-sm font-bold text-slate-900">Study Reminders</h3>
                   <p className="text-xs text-slate-500 mt-1">Receive daily push notifications to keep up your streak.</p>
                 </div>
                 <button 
                   onClick={() => setReminders(!reminders)}
                   className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${reminders ? 'bg-blue-600' : 'bg-slate-300'}`}
                 >
                   <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${reminders ? 'translate-x-6' : 'translate-x-0'}`} />
                 </button>
               </div>

               {/* Toggle 2 */}
               <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                 <div>
                   <h3 className="text-sm font-bold text-slate-900">Weekly Progress Report</h3>
                   <p className="text-xs text-slate-500 mt-1">Get an email summary of your achievements and XP.</p>
                 </div>
                 <button 
                   onClick={() => setReports(!reports)}
                   className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${reports ? 'bg-blue-600' : 'bg-slate-300'}`}
                 >
                   <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${reports ? 'translate-x-6' : 'translate-x-0'}`} />
                 </button>
               </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 mb-16">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl flex items-center gap-2 transition-colors shadow-sm shadow-blue-600/20">
              <Save size={18} /> Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
