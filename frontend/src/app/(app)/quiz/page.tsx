"use client";

import { useState, useEffect } from "react";
import { HelpCircle, CheckCircle2, XCircle, ChevronRight, Trophy, Zap, Loader2, AlertCircle } from "lucide-react";
import { quizService, QuizQuestion } from "@/lib/quizService";
import { ApiError } from "@/lib/apiClient";

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await quizService.generate(["javascript", "react", "aws"], 5, 5);
        setQuestions(data.questions);
      } catch (e) {
        setError(e instanceof ApiError ? e.message : "Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={36} className="animate-spin text-aura-primary" />
        <p className="text-aura-muted text-sm">Generating adaptive quiz with Bedrock...</p>
      </div>
    );

  if (error)
    return (
      <div className="max-w-2xl mx-auto mt-20 card p-8 flex items-center gap-4 border-red-500/30 border">
        <AlertCircle size={24} className="text-red-400 flex-shrink-0" />
        <div>
          <p className="text-red-400 font-semibold">Failed to load quiz</p>
          <p className="text-aura-muted text-sm mt-1">{error}</p>
        </div>
      </div>
    );

  if (!questions.length) return null;

  const q = questions[current];
  const options = q.options ?? [];
  // Find the correct answer index by matching option text/label to correctAnswer
  const correctIdx = options.findIndex(
    (opt) => opt.label === q.correctAnswer || opt.text === q.correctAnswer
  );

  const handleSelect = (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    const correct = i === correctIdx;
    if (correct) setScore((s) => s + 1);
    setAnswers((a) => [...a, correct]);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
    setAnswers([]);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 pt-12">
        <div className="card p-12 space-y-6">
          <div
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c6af7, #5b5af0)" }}
          >
            <Trophy size={36} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-aura-text">Quiz Complete!</h2>
            <p className="text-aura-muted mt-2">Here&apos;s how you did</p>
          </div>
          <div className="text-7xl font-black gradient-text">{pct}%</div>
          <div className="grid grid-cols-3 gap-4">
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{score}</div>
              <div className="text-xs text-aura-muted">Correct</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{questions.length - score}</div>
              <div className="text-xs text-aura-muted">Wrong</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-aura-primary">+{score * 15} XP</div>
              <div className="text-xs text-aura-muted">Earned</div>
            </div>
          </div>
          <button onClick={restart} className="btn-primary mx-auto">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-aura-text flex items-center gap-3">
          <HelpCircle className="text-aura-primary" size={28} /> Quiz Session
        </h1>
        <p className="text-aura-muted mt-1 text-sm">Adaptive spaced-repetition. Powered by AWS Bedrock + DynamoDB.</p>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1 xp-bar">
          <div className="progress-fill" style={{ width: `${(current / questions.length) * 100}%` }} />
        </div>
        <span className="text-xs text-aura-muted whitespace-nowrap">
          {current + 1} / {questions.length}
        </span>
        <div className="flex items-center gap-1 text-xs text-amber-400">
          <Zap size={12} /> {score * 15} XP
        </div>
      </div>

      {/* Question card */}
      <div className="card p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-2">
            <span className="badge-primary text-xs">{q.conceptId}</span>
            <span
              className={`badge text-xs ${
                q.difficulty <= 3 ? "badge-success" : q.difficulty <= 6 ? "badge-warning" : "badge-danger"
              }`}
            >
              {q.type}
            </span>
          </div>
          <span className="text-xs text-aura-muted">Q{current + 1}</span>
        </div>

        <h2 className="text-lg font-semibold text-aura-text leading-relaxed">{q.prompt}</h2>

        <div className="space-y-3">
          {options.map((opt, i) => {
            let style = "border-aura-border hover:border-aura-primary/40 hover:bg-aura-primary/5";
            if (answered) {
              if (i === correctIdx) style = "border-green-500/50 bg-green-500/10";
              else if (i === selected && i !== correctIdx) style = "border-red-500/50 bg-red-500/10";
              else style = "border-aura-border opacity-50";
            }
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${style}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border ${
                    answered && i === correctIdx
                      ? "bg-green-500/20 border-green-500 text-green-400"
                      : answered && i === selected && i !== correctIdx
                      ? "bg-red-500/20 border-red-500 text-red-400"
                      : "border-aura-border text-aura-muted"
                  }`}
                >
                  {answered && i === correctIdx ? (
                    <CheckCircle2 size={14} />
                  ) : answered && i === selected && i !== correctIdx ? (
                    <XCircle size={14} />
                  ) : (
                    opt.label
                  )}
                </div>
                <span className="text-sm text-aura-text">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {answered && (
          <div
            className={`p-4 rounded-xl border ${
              selected === correctIdx ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {selected === correctIdx ? (
                <CheckCircle2 size={14} className="text-green-400" />
              ) : (
                <XCircle size={14} className="text-red-400" />
              )}
              <span
                className={`text-xs font-semibold ${selected === correctIdx ? "text-green-400" : "text-red-400"}`}
              >
                {selected === correctIdx ? "Correct! +15 XP" : "Incorrect"}
              </span>
            </div>
            <p className="text-sm text-aura-muted leading-relaxed">{q.explanation}</p>
          </div>
        )}

        {answered && (
          <button onClick={handleNext} className="btn-primary w-full justify-center">
            {current + 1 >= questions.length ? "See Results" : "Next Question"}
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
