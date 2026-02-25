"use client";

import { useState } from "react";
import { Brain, Send, Loader2, Lightbulb, BookOpen, Code2, ThumbsUp, ThumbsDown, Volume2 } from "lucide-react";

const levels = ["5-year-old", "High School", "Developer", "Expert"];

const sampleResult = {
  title: "Closures in JavaScript",
  eli5: "Imagine you have a backpack. When you go home, you can still use things inside it. A closure is like that backpack — a function that remembers things from where it was created, even after it went somewhere else.",
  explanation: "A closure is a function that has access to its outer function's scope even after the outer function has finished executing. This is because the inner function retains a reference to the outer scope's variables.",
  example: `function makeCounter() {
  let count = 0;  // lives in outer scope
  return function() {
    count++;       // inner fn still accesses count!
    return count;
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2 — count is remembered!`,
  analogies: [
    "Like a function's 'backpack' of variables",
    "Like a camera that captures the moment it was created",
    "Like a chef who remembers the kitchen they trained in",
  ],
  relatedConcepts: ["Lexical Scope", "Higher-Order Functions", "IIFE", "Module Pattern"],
};

export default function ConceptPage() {
  const [input, setInput] = useState("");
  const [level, setLevel] = useState("Developer");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<typeof sampleResult | null>(sampleResult);
  const [activeTab, setActiveTab] = useState<"explain" | "example" | "analogies">("explain");

  const handleSimplify = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setResult(sampleResult); }, 1600);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-aura-text flex items-center gap-3">
          <Brain className="text-aura-primary" size={28} /> Concept Simplifier
        </h1>
        <p className="text-aura-muted mt-1 text-sm">Claude 3 Sonnet explains any topic at your level. Powered by AWS Bedrock.</p>
      </div>

      {/* Input */}
      <div className="card p-6 space-y-4">
        <textarea
          className="input resize-none"
          rows={3}
          placeholder="Enter any concept, topic, or a confusing piece of code..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-aura-surface border border-aura-border rounded-xl p-1">
            {levels.map((l) => (
              <button key={l} onClick={() => setLevel(l)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  level === l ? "btn-primary py-1.5" : "text-aura-muted hover:text-aura-text"
                }`}>
                {l}
              </button>
            ))}
          </div>
          <button onClick={handleSimplify} disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? <><Loader2 size={15} className="animate-spin" /> Simplifying...</> : <><Send size={15} /> Simplify</>}
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-4">
          {/* ELI5 */}
          <div className="card p-6 border-l-4" style={{ borderLeftColor: "#7c6af7" }}>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={16} className="text-amber-400" />
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Quick Intuition</span>
            </div>
            <p className="text-aura-text leading-relaxed">{result.eli5}</p>
          </div>

          {/* Tabs */}
          <div className="card overflow-hidden">
            <div className="flex border-b border-aura-border">
              {(["explain", "example", "analogies"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-medium transition-colors capitalize ${
                    activeTab === tab
                      ? "text-aura-primary border-b-2 border-aura-primary bg-aura-primary/5"
                      : "text-aura-muted hover:text-aura-text"
                  }`}>
                  {tab === "explain" ? "Explanation" : tab === "example" ? "Code Example" : "Analogies"}
                </button>
              ))}
              <div className="ml-auto flex items-center pr-4">
                <button className="btn-ghost p-2">
                  <Volume2 size={14} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === "explain" && (
                <p className="text-aura-text leading-relaxed">{result.explanation}</p>
              )}
              {activeTab === "example" && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Code2 size={14} className="text-aura-primary" />
                    <span className="text-xs text-aura-muted font-mono">JavaScript</span>
                  </div>
                  <pre className="input-mono bg-[#0a0b10] text-green-300 p-4 rounded-xl text-xs leading-relaxed overflow-x-auto">
                    {result.example}
                  </pre>
                </div>
              )}
              {activeTab === "analogies" && (
                <div className="space-y-3">
                  {result.analogies.map((a, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-aura-border/20">
                      <span className="text-aura-primary font-bold text-sm">{i + 1}.</span>
                      <p className="text-aura-text text-sm">{a}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Related concepts */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={14} className="text-aura-muted" />
              <span className="text-sm font-medium text-aura-text">Related Concepts</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.relatedConcepts.map((c) => (
                <button key={c} className="badge-primary px-3 py-1.5 rounded-lg text-xs hover:bg-aura-primary/30 transition-colors">
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-aura-muted">Was this helpful?</span>
            <button className="btn-ghost p-2 gap-1 text-xs text-green-400"><ThumbsUp size={13} /> Yes</button>
            <button className="btn-ghost p-2 gap-1 text-xs text-red-400"><ThumbsDown size={13} /> No</button>
          </div>
        </div>
      )}
    </div>
  );
}
