import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  RotateCw
} from 'lucide-react';

interface NewResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (topic: string, scope: string) => void;
  isCreating: boolean;
}

const TEMPLATE_QUESTIONS = [
  {
    title: 'How is AI transforming retail operations?',
    scope: 'Loss prevention computer vision, demand forecasting, autonomous checkout, dynamic pricing, and frontline store associates.',
  },
  {
    title: 'What AI technologies are changing manufacturing?',
    scope: 'Industrial predictive maintenance, OT/IT edge computing, optical defect inspection, and generative tool design.',
  },
  {
    title: 'AI in Enterprise Financial Risk & Fraud Detection',
    scope: 'Real-time transaction anomaly detection, automated anti-money laundering (AML), credit decisioning models, and regulatory compliance.',
  },
  {
    title: 'Autonomous AI Agents in Healthcare Billing & Clinical Documentation',
    scope: 'Ambient clinical listening, automated ICD-10 medical coding, prior authorization approval pipelines, and HIPAA compliance.',
  }
];

export const NewResearchModal: React.FC<NewResearchModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isCreating,
}) => {
  const [topic, setTopic] = useState('');
  const [scope, setScope] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onSubmit(topic.trim(), scope.trim());
  };

  const handleSelectTemplate = (t: string, s: string) => {
    setTopic(t);
    setScope(s);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Launch Enterprise AI Research Pipeline
              </h3>
              <p className="text-xs text-slate-400">
                Define a high-level research question to trigger the 10-stage structured analysis.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Quick Template Scenarios
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TEMPLATE_QUESTIONS.map((t, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectTemplate(t.title, t.scope)}
                className="p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 cursor-pointer transition-all text-left group"
              >
                <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-300 line-clamp-1">
                  {t.title}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {t.scope}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Core Enterprise Research Question <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., How is AI transforming retail operations?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Target Scope & Investigation Domains (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g., Focus on computer vision for shrinkage, automated checkout TCO, dynamic pricing elasticity, and frontline associate assistants."
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Pipeline stages preview footer */}
          <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="text-slate-300 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>10-Stage Execution Sequence:</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              1. Define Questions ➔ 2. Search Sources ➔ 3. Collect Info ➔ 4. Store Sources ➔ 5. Extract Findings ➔ 6. Compare Evidence ➔ 7. Classify Findings ➔ 8. Detect Contradictions ➔ 9. Generate Conclusions ➔ 10. Traceability Graph.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isCreating || !topic.trim()}
              className={`px-5 py-2 text-xs font-semibold text-white rounded-lg flex items-center gap-2 shadow-md cursor-pointer transition-all ${
                isCreating || !topic.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              {isCreating ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Initializing Pipeline...</span>
                </>
              ) : (
                <>
                  <span>Create & Launch Pipeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
