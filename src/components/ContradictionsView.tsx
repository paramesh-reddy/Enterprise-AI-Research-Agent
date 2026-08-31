import React from 'react';
import { 
  Scale, 
  AlertTriangle, 
  GitCompare, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { Contradiction, EvidenceComparison, ResearchFinding } from '../types';

interface ContradictionsViewProps {
  contradictions: Contradiction[];
  evidenceComparisons: EvidenceComparison[];
  findings: ResearchFinding[];
  onOpenFinding: (findingId: string) => void;
}

export const ContradictionsView: React.FC<ContradictionsViewProps> = ({
  contradictions,
  evidenceComparisons,
  findings,
  onOpenFinding,
}) => {
  return (
    <div id="contradictions-view" className="space-y-6">
      
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-rose-400" />
            Contradiction Detection & Evidence Comparison (Stage 6 & 8)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Explicit conflict resolution, methodology divergence diagnostics, and enterprise tradeoff decisions.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
          {contradictions.length} Conflicts Flagged
        </span>
      </div>

      {/* Contradictions Breakdown Cards */}
      <div className="space-y-4">
        {contradictions.length > 0 ? (
          contradictions.map((cnt, idx) => (
            <div 
              key={cnt.id}
              id={`contradiction-card-${cnt.id}`}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 hover:border-slate-700 transition-colors"
            >
              {/* Conflict Header */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-rose-600/20 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center justify-center">
                    !{idx + 1}
                  </span>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                      Detected Evidence Conflict
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      {cnt.topic}
                    </h4>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-md border ${
                  cnt.severity === 'Critical'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {cnt.severity} Severity
                </span>
              </div>

              {/* Side-by-Side Contradictory Claims */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Claim A */}
                <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-blue-400">Claim A Perspective</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      {cnt.claimA.sourceDomain}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed italic">
                    &quot;{cnt.claimA.statement}&quot;
                  </p>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                    Source: <span className="text-slate-300">{cnt.claimA.sourceTitle}</span>
                  </div>
                </div>

                {/* Claim B */}
                <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-amber-400">Opposing Claim B Perspective</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      {cnt.claimB.sourceDomain}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed italic">
                    &quot;{cnt.claimB.statement}&quot;
                  </p>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                    Source: <span className="text-slate-300">{cnt.claimB.sourceTitle}</span>
                  </div>
                </div>

              </div>

              {/* Description & Diagnostics */}
              <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/50 space-y-1.5 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Conflict Diagnostic & Root Cause
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {cnt.contradictionDescription}
                </p>
                <div className="text-[11px] text-amber-300/90 pt-1 border-t border-slate-700/40">
                  <strong>Root Cause:</strong> {cnt.rootCauseAnalysis}
                </div>
              </div>

              {/* Concrete Enterprise Resolution Directive */}
              <div className="bg-emerald-950/25 p-3 rounded-lg border border-emerald-500/25 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Enterprise Resolution Guidance</span>
                </div>
                <p className="text-slate-200 text-xs leading-relaxed">
                  {cnt.enterpriseResolution}
                </p>
              </div>

            </div>
          ))
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
            <p className="text-xs font-semibold text-slate-300">No Direct Contradictions Detected</p>
            <p className="text-[11px] text-slate-500">All ingested empirical data points show high inter-source consistency.</p>
          </div>
        )}
      </div>

      {/* Cross-Evidence Comparison Themes (Stage 6) */}
      {evidenceComparisons && evidenceComparisons.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-blue-400" />
            Cross-Source Evidence Comparison Themes
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evidenceComparisons.map((cmp) => (
              <div 
                key={cmp.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-200">
                    {cmp.theme}
                  </h5>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                    cmp.consensusLevel === 'High Consensus'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : cmp.consensusLevel === 'Moderate Divergence'
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  }`}>
                    {cmp.consensusLevel}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {cmp.comparisonAnalysis}
                </p>

                {cmp.varianceSummary && (
                  <div className="text-[11px] bg-slate-950 p-2 rounded text-slate-400 border border-slate-800 font-mono">
                    <span className="text-blue-400 font-semibold">Variance:</span> {cmp.varianceSummary}
                  </div>
                )}

                <div className="text-[11px] text-emerald-400 font-medium pt-1">
                  <strong>Dominant Trend:</strong> {cmp.dominantTrend}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
