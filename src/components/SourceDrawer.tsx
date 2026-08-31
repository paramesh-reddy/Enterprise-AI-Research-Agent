import React from 'react';
import { 
  X, 
  BookOpen, 
  ShieldCheck, 
  ExternalLink, 
  Calendar, 
  Tag, 
  CheckCircle2,
  Copy,
  Quote
} from 'lucide-react';
import { ResearchSource } from '../types';

interface SourceDrawerProps {
  source: ResearchSource | null;
  onClose: () => void;
}

export const SourceDrawer: React.FC<SourceDrawerProps> = ({ source, onClose }) => {
  if (!source) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full overflow-y-auto shadow-2xl p-6 space-y-6 flex flex-col justify-between">
        
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono font-bold border border-slate-700">
                  {source.id}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  {source.credibilityTier}
                </span>
              </div>
              <h3 className="text-base font-bold text-white leading-snug">
                {source.title}
              </h3>
              <p className="text-xs text-indigo-300 font-medium">
                {source.authorOrPublisher} ({source.domain})
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Credibility Audit Box */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-white">
                  Source Credibility Verification: {source.credibilityScore}/100
                </div>
                <div className="text-[11px] text-slate-400">
                  Peer-reviewed benchmark & domain reputation validation
                </div>
              </div>
            </div>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5"
            >
              <span>Visit URL</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Abstract / Scope Summary */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Methodology & Abstract
            </span>
            <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80 text-xs text-slate-200 leading-relaxed">
              {source.summary}
            </div>
          </div>

          {/* Complete Ingested Excerpt */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Quote className="w-3.5 h-3.5 text-indigo-400" />
                Raw Grounded Excerpt & Data Points
              </span>
              <button
                onClick={() => copyToClipboard(source.fullExcerpt)}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>Copy Quote</span>
              </button>
            </div>
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs text-slate-200 italic leading-relaxed border-l-4 border-indigo-500">
              &quot;{source.fullExcerpt}&quot;
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/40 p-3.5 rounded-lg border border-slate-800/60">
            <div>
              <span className="text-slate-500 block text-[10px]">Publication Date</span>
              <span className="font-semibold text-slate-200">{source.publicationDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Indexed At</span>
              <span className="font-semibold text-slate-200">
                {source.storedAt ? new Date(source.storedAt).toLocaleString() : 'In-memory'}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Taxonomy Tags
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {source.tags?.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Close Button Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
