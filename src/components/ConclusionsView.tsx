import React from 'react';
import { 
  Award, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { ResearchConclusion, ResearchFinding, ResearchSource } from '../types';

interface ConclusionsViewProps {
  conclusions: ResearchConclusion[];
  findings: ResearchFinding[];
  sources: ResearchSource[];
  onOpenSource: (source: ResearchSource) => void;
  onOpenFinding: (findingId: string) => void;
}

export const ConclusionsView: React.FC<ConclusionsViewProps> = ({
  conclusions,
  findings,
  sources,
  onOpenSource,
  onOpenFinding,
}) => {
  if (!conclusions || conclusions.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-10 text-center text-slate-400 space-y-3">
        <Award className="w-10 h-10 mx-auto text-slate-600" />
        <h3 className="text-base font-semibold text-slate-200">No Conclusions Generated Yet</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Execute the 10-step research pipeline to synthesize executive-level conclusions backed by verified empirical citations.
        </p>
      </div>
    );
  }

  return (
    <div id="conclusions-view" className="space-y-6">
      
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            Executive Conclusions & Strategic Directives (Stage 9 & 10)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Synthesis of high-confidence findings with operational impact and defined implementation timeframes.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          {conclusions.length} Action Directives
        </span>
      </div>

      {/* Conclusions Cards */}
      <div className="grid grid-cols-1 gap-5">
        {conclusions.map((c, idx) => {
          const supportingFindings = findings.filter(f => c.supportingFindingIds?.includes(f.id));
          const relatedSources = sources.filter(s => c.primarySourceIds?.includes(s.id) || supportingFindings.some(f => f.sourceIds.includes(s.id)));

          return (
            <div 
              key={c.id}
              id={`conclusion-card-${c.id}`}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 hover:border-slate-700 transition-colors"
            >
              {/* Header row: ID, Title, Confidence & Horizon Badges */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center justify-center">
                    C-{idx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    {c.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Confidence Level */}
                  <span className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-md border flex items-center gap-1 ${
                    c.confidenceLevel === 'High'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : c.confidenceLevel === 'Medium'
                      ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  }`}>
                    <ShieldCheck className="w-3 h-3" />
                    <span>{c.confidenceLevel} Confidence</span>
                  </span>

                  {/* Time Horizon */}
                  <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 rounded-md flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{c.timeHorizon}</span>
                  </span>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-lg border border-slate-800/60">
                <p>{c.executiveSummary}</p>
              </div>

              {/* Impact & Directives Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                    Measurable Operational Impact
                  </span>
                  <p className="text-slate-200 text-xs leading-normal">
                    {c.operationalImpact}
                  </p>
                </div>

                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    Strategic Directive & Roadmap
                  </span>
                  <p className="text-slate-200 text-xs leading-normal">
                    {c.strategicRecommendation}
                  </p>
                </div>
              </div>

              {/* Risk Factors */}
              {c.riskFactors && c.riskFactors.length > 0 && (
                <div className="flex items-start gap-2 text-xs bg-amber-950/20 border border-amber-500/20 p-2.5 rounded-lg text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[11px] text-amber-300">Identified Risk Factors: </span>
                    <span className="text-slate-300 text-[11px]">{c.riskFactors.join(' • ')}</span>
                  </div>
                </div>
              )}

              {/* Traceability & Supporting Findings Reference */}
              <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] text-slate-400 font-medium">Underlying Evidence:</span>
                  {supportingFindings.map(f => (
                    <button
                      key={f.id}
                      onClick={() => onOpenFinding(f.id)}
                      className="px-2 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 rounded flex items-center gap-1 cursor-pointer"
                      title={f.statement}
                    >
                      <span>{f.id}</span>
                      {f.metricValue && <span className="font-mono text-amber-300">({f.metricValue})</span>}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] text-slate-400 font-medium">Sources:</span>
                  {relatedSources.map(s => (
                    <button
                      key={s.id}
                      onClick={() => onOpenSource(s)}
                      className="px-2 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-500/30 rounded flex items-center gap-1 cursor-pointer"
                      title={s.title}
                    >
                      <span>{s.domain}</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                    </button>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
