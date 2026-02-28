"use client";

import { useState } from "react";
import { Sparkles, CheckCheck, Lightbulb, ClipboardList, PenTool } from "lucide-react";
import { conceptService, SimplifyConceptResponse } from "@/lib/conceptService";
import { ApiError } from "@/lib/apiClient";

type ResultShape = {
  title: string
  eli5: string
  explanation: string
  example: string
  analogies: string[]
  relatedConcepts: string[]
}

export default function ConceptPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultShape | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSimplify = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      // Defaulting to "beginner" to match the "Simple Explanation" vibe of the mockup
      const data: SimplifyConceptResponse = await conceptService.simplify(input.trim(), "beginner");
      const steps = data.explanation.stepByStep;
      const codeExample = steps.find(s => s.conceptsUsed.length > 0);
      setResult({
        title: input.trim(),
        eli5: data.explanation.summary,
        explanation: data.explanation.suggestions.join(' ') || data.explanation.summary,
        example: codeExample?.explanation ?? '',
        analogies: data.explanation.patterns.map(p => p.explanation),
        relatedConcepts: data.relatedConcepts, // treating these as takeaways for the new UI
      });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] bg-white max-w-4xl mx-auto py-12 px-6">
      {/* Header section matching mockup */}
      <div className="text-center mb-10 w-full max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-[44px] font-black text-slate-900 mb-4 tracking-tight">
          Learn anything <span className="text-blue-600">faster.</span>
        </h1>
        <p className="text-slate-600 text-lg leading-relaxed">
          Break down complex topics into simple, digestible pieces using AI-powered explanations.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-10">
        <div className="mb-2">
          <label className="text-sm font-bold text-slate-900">Topic or Content to simplify</label>
        </div>
        <textarea
          className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-slate-700 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none min-h-[120px] mb-4"
          placeholder="Paste a complex paragraph or enter a technical term (e.g., Quantum Entanglement, Kubernetes, Supply and Demand)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button 
          onClick={handleSimplify} 
          disabled={loading || !input.trim()} 
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm shadow-blue-600/20"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Simplifying...
            </span>
          ) : (
            <>
              <Sparkles size={18} /> Simplify with AI
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm border border-red-100 mb-8 text-center">
          {error}
        </div>
      )}

      {/* Result Section */}
      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* The Simple Explanation */}
          <div className="pl-6 border-l-4 border-blue-600">
            <h2 className="text-xl font-bold text-blue-600 mb-3">The Simple Explanation</h2>
            <p className="text-slate-700 leading-relaxed text-[15px]">
               {/* Rendering purely as text. In a real app we might parse markdown to get the bold styling like the mockup */}
               {result.eli5}
            </p>
          </div>

          {/* Cards Row (Takeaways & Analogy) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Key Takeaways */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList size={18} className="text-blue-600" />
                <h3 className="text-sm font-bold text-blue-600">Key Takeaways</h3>
              </div>
              <ul className="space-y-3">
                {result.relatedConcepts.length > 0 ? result.relatedConcepts.slice(0, 3).map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                    <span className="text-slate-700 text-sm leading-relaxed">{item}</span>
                  </li>
                )) : (
                   <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                    <span className="text-slate-700 text-sm leading-relaxed">Reduces "boilerplate" code significantly.</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Perfect Analogy */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={18} className="text-blue-600" />
                <h3 className="text-sm font-bold text-blue-600">Perfect Analogy</h3>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                "{result.analogies[0] || "Think of this concept like a direct phone line. Instead of walking, you just signal exactly where you are sitting."}"
              </p>
            </div>
            
          </div>

          {/* Test Your Knowledge Placeholder */}
          <div className="pt-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Test Your Knowledge</h2>
            
            {/* Question 1 */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-4">
               <p className="text-sm font-medium text-slate-900 mb-4">
                 1. Based on the explanation, what is the core benefit of this concept?
               </p>
               <div className="space-y-3">
                 <button className="w-full text-left p-4 rounded-xl border border-slate-200 text-sm text-slate-700 hover:border-blue-400 transition-colors">
                   It simplifies understanding complex topics.
                 </button>
                 <button className="w-full text-left p-4 rounded-xl border border-blue-200 bg-blue-50/50 text-sm text-blue-700 font-medium transition-colors">
                   It allows direct interaction without manual boilerplate.
                 </button>
               </div>
            </div>

            <div className="text-center mt-10">
              <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-full inline-flex items-center gap-2 transition-colors">
                <PenTool size={16} /> Generate Full Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Text */}
      <div className="mt-auto pt-16 text-center">
        <p className="text-[11px] text-slate-400">© 2024 Concept Simplifier. Powered by AI for better learning.</p>
      </div>
    </div>
  );
}
