"use client";

import { useState } from "react";
import { HelpCircle, CheckCircle2, XCircle, ChevronRight, Trophy, Clock, Zap } from "lucide-react";

const questions = [
  {
    id: 1,
    question: "What does the `useEffect` hook with an empty dependency array `[]` do in React?",
    options: [
      "Runs after every render",
      "Runs once after the initial render only",
      "Runs before the component mounts",
      "Runs when the component unmounts",
    ],
    correct: 1,
    explanation: "An empty dependency array `[]` tells React to run the effect only once after the initial render — equivalent to componentDidMount in class components.",
    topic: "React Hooks",
    difficulty: "Intermediate",
  },
  {
    id: 2,
    question: "Which DynamoDB operation is most cost-efficient for retrieving a single item when you know the full primary key?",
    options: ["Query", "Scan", "GetItem", "BatchGet"],
    correct: 2,
    explanation: "GetItem retrieves exactly one item by its primary key in O(1) time, using the minimum possible read capacity units — making it the most cost-efficient single-item retrieval.",
    topic: "AWS DynamoDB",
    difficulty: "Advanced",
  },
  {
    id: 3,
    question: "In JavaScript, what is the output of `typeof null`?",
    options: ['"null"', '"undefined"', '"object"', '"boolean"'],
    correct: 2,
    explanation: "This is a well-known bug in JavaScript. `typeof null` returns `'object'` due to how type tags were represented in the original JS engine — null was represented with 0, same as objects.",
    topic: "JavaScript Quirks",
    difficulty: "Beginner",
  },
];

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const q = questions[current];

  const handleSelect = (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    const correct = i === q.correct;
    if (correct) setScore(s => s + 1);
    setAnswers(a => [...a, correct]);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const restart = () => {
    setCurrent(0); setSelected(null); setAnswered(false);
    setScore(0); setFinished(false); setAnswers([]);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 pt-12">
        <div className="card p-12 space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c6af7, #5b5af0)" }}>
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
          <button onClick={restart} className="btn-primary mx-auto">Try Again</button>
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
        <div className="flex-1 progress-bar">
          <div className="progress-fill" style={{ width: `${((current) / questions.length) * 100}%` }} />
        </div>
        <span className="text-xs text-aura-muted whitespace-nowrap">{current + 1} / {questions.length}</span>
        <div className="flex items-center gap-1 text-xs text-amber-400">
          <Zap size={12} /> {score * 15} XP
        </div>
        <div className="flex items-center gap-1 text-xs text-aura-muted">
          <Clock size={12} /> 4:32
        </div>
      </div>

      {/* Question card */}
      <div className="card p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-2">
            <span className="badge-primary text-xs">{q.topic}</span>
            <span className={`badge text-xs ${
              q.difficulty === "Beginner" ? "badge-success" :
              q.difficulty === "Intermediate" ? "badge-warning" : "badge-danger"
            }`}>{q.difficulty}</span>
          </div>
          <span className="text-xs text-aura-muted">Q{current + 1}</span>
        </div>

        <h2 className="text-lg font-semibold text-aura-text leading-relaxed">{q.question}</h2>

        <div className="space-y-3">
          {q.options.map((opt, i) => {
            let style = "border-aura-border hover:border-aura-primary/40 hover:bg-aura-primary/5";
            if (answered) {
              if (i === q.correct) style = "border-green-500/50 bg-green-500/10";
              else if (i === selected && i !== q.correct) style = "border-red-500/50 bg-red-500/10";
              else style = "border-aura-border opacity-50";
            }
            return (
              <button key={i} onClick={() => handleSelect(i)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${style}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border ${
                  answered && i === q.correct ? "bg-green-500/20 border-green-500 text-green-400" :
                  answered && i === selected && i !== q.correct ? "bg-red-500/20 border-red-500 text-red-400" :
                  "border-aura-border text-aura-muted"
                }`}>
                  {answered && i === q.correct ? <CheckCircle2 size={14} /> :
                   answered && i === selected && i !== q.correct ? <XCircle size={14} /> :
                   String.fromCharCode(65 + i)}
                </div>
                <span className="text-sm text-aura-text">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {answered && (
          <div className={`p-4 rounded-xl border ${
            selected === q.correct ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {selected === q.correct
                ? <CheckCircle2 size={14} className="text-green-400" />
                : <XCircle size={14} className="text-red-400" />}
              <span className={`text-xs font-semibold ${selected === q.correct ? "text-green-400" : "text-red-400"}`}>
                {selected === q.correct ? "Correct! +15 XP" : "Incorrect"}
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
