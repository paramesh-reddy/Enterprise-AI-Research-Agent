import React from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  Tag, 
  AlertCircle, 
  Sparkles, 
  Layers 
} from 'lucide-react';
import { ResearchQuestion } from '../types';

interface QuestionsViewProps {
  questions: ResearchQuestion[];
}

export const QuestionsView: React.FC<QuestionsViewProps> = ({ questions }) => {
  return (
    <div id="questions-view" className="space-y-6">
      
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            Decomposed Research Questions & Scoping (Stage 1)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Structured decomposition of the primary investigation across strategic, economic, technological, and regulatory vectors.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          {questions.length} Targeted Questions
        </span>
      </div>

      {/* Questions Grid */}
      <div className="space-y-3">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            id={`question-card-${q.id}`}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3 hover:border-slate-700 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-indigo-600/20 text-indigo-300 text-xs font-mono font-bold flex items-center justify-center border border-indigo-500/30">
                  {idx + 1}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  {q.category}
                </span>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                q.priority === 'high'
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {q.priority} Priority
              </span>
            </div>

            <h4 className="text-sm font-bold text-white leading-snug">
              {q.question}
            </h4>

            {q.rationale && (
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 text-xs text-slate-300 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                  Enterprise Decision-Making Rationale
                </span>
                <p>{q.rationale}</p>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
