import React, { useState } from 'react';
import { 
  Network, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  Quote, 
  ShieldCheck,
  Search,
  Layers
} from 'lucide-react';
import { TraceabilityLink, ResearchSource } from '../types';

interface TraceabilityViewProps {
  traceabilityMatrix: TraceabilityLink[];
  onOpenSource: (source: ResearchSource) => void;
}

export const TraceabilityView: React.FC<TraceabilityViewProps> = ({
  traceabilityMatrix,
  onOpenSource,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLinks = traceabilityMatrix.filter((t) => {
    return (
      !searchQuery ||
      t.conclusionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.findingStatement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.sourceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.exactQuote.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div id="traceability-view" className="space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-emerald-400" />
            Bi-Directional Citation & Traceability Graph (Stage 10)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit-grade evidentiary lineage connecting every strategic conclusion back to atomic claims and original publication excerpts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter citation chains..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 w-52"
            />
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            {filteredLinks.length} Traceability Links
          </span>
        </div>
      </div>

      {/* Traceability Lineage Cards */}
      <div className="space-y-4">
        {filteredLinks.map((link, idx) => (
          <div
            key={idx}
            id={`trace-link-${idx}`}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3 hover:border-slate-700 transition-colors"
          >
            {/* Header match score */}
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 font-mono">
                Trace Anchor #{idx + 1}
              </span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-semibold text-emerald-300">
                  {link.relevanceScore}% Evidence Match
                </span>
              </div>
            </div>

            {/* 3-Stage Lineage Flow */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center text-xs">
              
              {/* 1. Executive Conclusion */}
              <div className="lg:col-span-4 bg-slate-950 p-3 rounded-lg border border-indigo-500/30 space-y-1">
                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                  Level 1: Executive Conclusion
                </div>
                <h5 className="font-bold text-white text-xs leading-snug">
                  {link.conclusionTitle}
                </h5>
              </div>

              {/* Arrow 1 */}
              <div className="hidden lg:flex lg:col-span-1 justify-center text-slate-500">
                <ArrowRight className="w-5 h-5 text-indigo-400" />
              </div>

              {/* 2. Atomic Finding */}
              <div className="lg:col-span-3 bg-slate-950 p-3 rounded-lg border border-amber-500/30 space-y-1">
                <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Level 2: Atomic Claim
                </div>
                <p className="text-slate-300 text-xs leading-snug font-medium">
                  {link.findingStatement}
                </p>
              </div>

              {/* Arrow 2 */}
              <div className="hidden lg:flex lg:col-span-1 justify-center text-slate-500">
                <ArrowRight className="w-5 h-5 text-amber-400" />
              </div>

              {/* 3. Original Source & Quote */}
              <div className="lg:col-span-3 bg-slate-950 p-3 rounded-lg border border-blue-500/30 space-y-1">
                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Level 3: Source Origin</span>
                  <a
                    href={link.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>Link</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <p className="text-slate-200 text-xs font-semibold line-clamp-1">
                  {link.sourceTitle}
                </p>
                <p className="text-[11px] text-slate-400 italic line-clamp-2">
                  &quot;{link.exactQuote}&quot;
                </p>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
