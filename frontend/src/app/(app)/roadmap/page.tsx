"use client";

import { useState } from "react";
import { Map, Send, ChevronRight, Clock, BookOpen, Lock, CheckCircle2, Loader2, PlayCircle, Trophy, Target, Sparkles, LayoutDashboard, BrainCircuit } from "lucide-react";

const sampleRoadmap = [
  {
    phase: "Module 1: Frontend Fundamentals",
    status: "completed",
    progress: 100,
    topics: [
      { title: "HTML5 & Semantic Structure", status: "done" },
      { title: "CSS Grid & Flexbox Mastery", status: "done" },
      { title: "JavaScript ES6+ Essentials", status: "done" },
    ],
  },
  {
    phase: "Module 2: React Ecosystem",
    status: "in-progress",
    progress: 33,
    topics: [
      { title: "React Hooks & State Management", status: "current" },
      { title: "Component Architecture", status: "pending" },
      { title: "Router & Navigation", status: "pending" },
    ],
  },
  {
    phase: "Module 3: Backend with Node.js",
    status: "locked",
    progress: 0,
    topics: [
      { title: "Express.js Server Setup", status: "locked" },
      { title: "RESTful API Design Patterns", status: "locked" },
      { title: "Database Integration (MongoDB/PostgreSQL)", status: "locked" },
    ],
  },
];

export default function RoadmapPage() {
  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState("beginner");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(true);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setGenerated(true); }, 1800);
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === "done") return <CheckCircle2 size={18} className="text-green-500" />;
    if (status === "current") return <div className="w-4 h-4 rounded-full border-[3px] border-blue-600 bg-white" />;
    if (status === "pending") return <div className="w-4 h-4 rounded-full border-2 border-slate-300 bg-white" />;
    return <Lock size={16} className="text-slate-400" />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-7xl mx-auto py-8 px-6">
      
      {/* Header (Generator Section) - Kept subtle so the main content shines */}
      {!generated ? (
        <div className="max-w-3xl mx-auto w-full mt-12 mb-20 animate-in fade-in slide-in-from-bottom-4">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Map size={32} className="text-blue-600" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Generate Your Path</h1>
            <p className="text-slate-600 text-lg">Tell us what you want to master, and AI will build your perfect curriculum.</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-slate-900 mb-2 block">What do you want to learn?</label>
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                  placeholder="e.g. Next.js 14, Machine Learning, UI/UX Design..."
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-900 mb-2 block">Current Experience Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {["Beginner", "Intermediate", "Advanced"].map((l) => (
                    <button 
                      key={l}
                      onClick={() => setLevel(l.toLowerCase())}
                      className={`py-3 px-4 rounded-xl text-sm font-bold transition-colors border ${level === l.toLowerCase() ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleGenerate} disabled={loading || !skill} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors mt-4 shadow-sm shadow-blue-600/20">
                {loading ? <><Loader2 size={18} className="animate-spin" /> Generating Curriculum...</> : <><Sparkles size={18} /> Create My Learning Hub</>}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Main Learning Hub Layout */}
      {generated && (
        <div className="animate-in fade-in duration-500">
          
          {/* Top Banner */}
          <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 w-full max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/20">Active Course</span>
                <span className="text-slate-400 text-sm font-medium flex items-center gap-1"><Clock size={14}/> Est. Time: 12 weeks</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight">Full-Stack Web Development</h1>
              <p className="text-slate-400 text-lg mb-8">Your AI-generated curriculum to mastery.</p>
              
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                <div className="flex justify-between items-end mb-2">
                  <div className="text-sm font-bold text-white">Course Progress</div>
                  <div className="text-2xl font-black text-blue-400">54%</div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-blue-500 h-2.5 rounded-full w-[54%]" />
                </div>
              </div>
            </div>

            <div className="relative z-10 flex-shrink-0">
               <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-blue-600/20 w-full md:w-auto">
                 Regenerate Path
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Timeline */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <LayoutDashboard size={24} className="text-blue-600" />
                Curriculum Modules
              </h2>

              <div className="relative pl-6 space-y-8">
                {/* Vertical Line connecting modules */}
                <div className="absolute left-[15px] top-6 bottom-6 w-0.5 bg-slate-100" />

                {sampleRoadmap.map((module, idx) => {
                  const isActive = module.status === "in-progress";
                  const isDone = module.status === "completed";
                  const isLocked = module.status === "locked";

                  return (
                    <div key={idx} className="relative">
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[31px] top-6 w-8 h-8 rounded-full flex items-center justify-center border-[3px] bg-white z-10
                        ${isDone ? 'border-green-500' : isActive ? 'border-blue-600' : 'border-slate-200'}`}
                      >
                        {isDone && <CheckCircle2 size={16} className="text-green-500" />}
                        {isActive && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                        {isLocked && <Lock size={12} className="text-slate-300" />}
                      </div>

                      {/* Module Card */}
                      <div className={`rounded-3xl p-6 border transition-all
                        ${isActive ? 'bg-white border-blue-200 shadow-md shadow-blue-900/5 ring-1 ring-blue-50' : 
                          isDone ? 'bg-slate-50 border-slate-100' : 'bg-slate-50/50 border-slate-100 opacity-60'}`}
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className={`text-lg font-bold ${isActive ? 'text-blue-900' : isLocked ? 'text-slate-500' : 'text-slate-900'}`}>
                              {module.phase}
                            </h3>
                            <div className="text-sm text-slate-500 mt-1 font-medium">
                              {isDone ? 'Completed' : isActive ? 'Current Module' : 'Locked'}
                            </div>
                          </div>
                          {!isLocked && (
                            <div className="text-right">
                              <span className="text-2xl font-black text-slate-900">{module.progress}%</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          {module.topics.map((topic, i) => (
                            <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border ${
                               topic.status === "current" ? 'bg-blue-50 border-blue-100' : 
                               topic.status === "done" ? 'bg-white border-slate-100' : 'bg-transparent border-transparent'
                            }`}>
                               <div className="flex items-center gap-3">
                                 <StatusIcon status={topic.status} />
                                 <span className={`text-sm font-semibold ${
                                   topic.status === "current" ? 'text-blue-900' : 
                                   topic.status === "done" ? 'text-slate-700' : 'text-slate-500'
                                 }`}>
                                   {topic.title}
                                 </span>
                               </div>
                               
                               {topic.status === "current" && (
                                 <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-1.5 transition-colors">
                                   <PlayCircle size={14} /> Continue
                                 </button>
                               )}
                               {topic.status === "done" && (
                                 <span className="text-xs font-bold text-green-500 bg-green-50 px-2.5 py-1 rounded-md">100%</span>
                               )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="space-y-6">
              {/* Course Stats Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Course Stats</h3>
                
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-slate-600">
                      <BookOpen size={16} /> <span className="text-sm font-medium">Total Modules</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Target size={16} /> <span className="text-sm font-medium">Topics Learned</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">14</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Trophy size={16} className="text-amber-500" /> <span className="text-sm font-medium">Total XP Earned</span>
                    </div>
                    <span className="text-sm font-bold text-green-600">+2,450</span>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100">
                    <div className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Next Milestone</div>
                    <div className="text-sm font-bold text-slate-900">Frontend Certified 🏆</div>
                  </div>
                </div>
              </div>

              {/* AI Study Assistant Card */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-6 relative overflow-hidden shadow-lg shadow-blue-900/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                    <BrainCircuit size={20} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">AI Study Assistant</h3>
                  <p className="text-white/80 text-sm mb-6 leading-relaxed">
                    Stuck on React Hooks? Ask the AI to explain it or generate a quick practice quiz.
                  </p>
                  <button className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-sm text-sm">
                    Ask a Question
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
