"use client";

import { useState } from "react";
import { Code2, Play, Loader2, CheckCircle, AlertTriangle, Lightbulb, Terminal } from "lucide-react";

const languageOptions = [
  { id: 71, label: "Python 3" },
  { id: 63, label: "JavaScript" },
  { id: 54, label: "C++" },
  { id: 62, label: "Java" },
  { id: 74, label: "TypeScript" },
];

const sampleCode = `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

# Test
nums = [1, 3, 5, 7, 9, 11, 13]
print(binary_search(nums, 7))   # → 3
print(binary_search(nums, 6))   # → -1`;

const sampleAnalysis = {
  output: "3\n-1",
  time: "0.042s",
  memory: "8.2 MB",
  status: "Accepted",
  explanation: "Your binary search implementation is correct and efficient. It runs in O(log n) time complexity with O(1) space.",
  patterns: [
    "✅ Correct two-pointer approach",
    "✅ Proper mid-point calculation avoids integer overflow",
    "✅ Handles edge case: target not found (returns -1)",
  ],
  improvements: [
    "Consider adding type hints: `def binary_search(arr: list[int], target: int) -> int`",
    "For very large lists, consider `mid = left + (right - left) // 2` to be explicit about overflow safety",
    "Add a docstring describing time complexity O(log n) and space complexity O(1)",
  ],
};

export default function DeveloperModePage() {
  const [code, setCode] = useState(sampleCode);
  const [lang, setLang] = useState(71);
  const [stdin, setStdin] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<typeof sampleAnalysis | null>(sampleAnalysis);

  const handleRun = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setResult(sampleAnalysis); }, 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-aura-text flex items-center gap-3">
          <Code2 className="text-aura-primary" size={28} /> Developer Mode
        </h1>
        <p className="text-aura-muted mt-1 text-sm">Execute code via Judge0 + get AI analysis from AWS Bedrock.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="card overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-aura-border bg-[#0a0b10]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-amber-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <select className="text-xs bg-transparent text-aura-muted border-none outline-none cursor-pointer"
              value={lang} onChange={(e) => setLang(Number(e.target.value))}>
              {languageOptions.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
            </select>
            <div className="ml-auto text-xs text-aura-muted font-mono">Judge0 CE · RapidAPI</div>
          </div>

          {/* Code area */}
          <textarea
            className="code-editor w-full p-4 text-xs leading-relaxed min-h-[340px] outline-none border-none"
            style={{ background: "#0a0b10", color: "#4ade80", fontFamily: "'JetBrains Mono', monospace", resize: "none" }}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />

          {/* Stdin */}
          <div className="border-t border-aura-border px-4 py-3 bg-[#0a0b10]">
            <label className="text-[10px] text-aura-muted uppercase tracking-wider block mb-1.5">stdin (optional)</label>
            <input className="input-mono text-xs py-2 bg-aura-surface text-aura-muted"
              placeholder="Standard input..." value={stdin} onChange={(e) => setStdin(e.target.value)} />
          </div>

          <div className="p-4 border-t border-aura-border">
            <button onClick={handleRun} disabled={loading} className="btn-primary disabled:opacity-50">
              {loading ? <><Loader2 size={15} className="animate-spin" /> Running on Judge0...</> : <><Play size={15} /> Run & Analyze</>}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {result && (
            <>
              {/* Output */}
              <div className="card overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-aura-border bg-[#0a0b10]">
                  <Terminal size={14} className="text-aura-muted" />
                  <span className="text-xs text-aura-muted font-mono">Output</span>
                  <div className="ml-auto flex items-center gap-3 text-xs">
                    <span className="text-aura-muted">⏱ {result.time}</span>
                    <span className="text-aura-muted">💾 {result.memory}</span>
                    <span className={`font-semibold ${result.status === "Accepted" ? "text-green-400" : "text-red-400"}`}>
                      {result.status === "Accepted" ? <CheckCircle size={13} className="inline mr-1" /> : <AlertTriangle size={13} className="inline mr-1" />}
                      {result.status}
                    </span>
                  </div>
                </div>
                <pre className="p-4 text-xs font-mono text-green-400 bg-[#0a0b10] min-h-[80px]">{result.output}</pre>
              </div>

              {/* AI Analysis */}
              <div className="card p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Lightbulb size={15} className="text-amber-400" />
                  <span className="text-sm font-semibold text-aura-text">AI Analysis · Bedrock</span>
                  <span className="badge-primary text-xs ml-auto">Claude 3 Sonnet</span>
                </div>
                <p className="text-sm text-aura-muted leading-relaxed">{result.explanation}</p>

                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-aura-text uppercase tracking-wider">Patterns Detected</p>
                  {result.patterns.map((p) => (
                    <p key={p} className="text-xs text-green-400">{p}</p>
                  ))}
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-aura-text uppercase tracking-wider">Suggestions</p>
                  {result.improvements.map((imp, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-aura-border/20">
                      <span className="text-aura-primary text-xs font-bold mt-0.5">{i + 1}.</span>
                      <p className="text-xs text-aura-muted leading-relaxed">{imp}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
