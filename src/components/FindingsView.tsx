import React, { useState } from 'react';
import { 
  Lightbulb, 
  Tags, 
  Filter, 
  TrendingUp, 
  ShieldCheck, 
  ExternalLink, 
  Quote,
  Search
} from 'lucide-react';
import { ResearchFinding, ResearchSource, TaxonomyCategory } from '../types';

interface FindingsViewProps {
  findings: ResearchFinding[];
  sources: ResearchSource[];
  onOpenSource: (source: ResearchSource) => void;
  selectedFindingId?: string | null;
}

const TAXONOMY_OPTIONS: Array<TaxonomyCategory | 'ALL'> = [
  'ALL',
  'Cost & ROI',
  'Operational Efficiency',
  'Workforce & Talent',
  'Tech Infrastructure',
  'Implementation Risk',
  'Regulatory & Ethics',
];

export const FindingsView: React.FC<FindingsViewProps> = ({
  findings,
  sources,
  onOpenSource,
  selectedFindingId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<TaxonomyCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFindings = findings.filter((f) => {
    const matchesCat = selectedCategory === 'ALL' || f.taxonomyCategory === selectedCategory;
    const matchesSearch = !searchQuery || 
      f.statement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.metric && f.metric.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div id="findings-view" className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            Classified Atomic Findings & Empirical Benchmarks (Stage 5 & 7)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Atomic verifiable claims with quantitative impact metrics, confidence ratings, and taxonomy classification.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search findings or metrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
            />
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
            {filteredFindings.length} of {findings.length} Findings
          </span>
        </div>
      </div>

      {/* Taxonomy Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-1" />
        {TAXONOMY_OPTIONS.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = cat === 'ALL' 
            ? findings.length 
            : findings.filter(f => f.taxonomyCategory === cat).length;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Findings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFindings.map((f, idx) => {
          const isHighlighted = selectedFindingId === f.id;
          const linkedSources = sources.filter(s => f.sourceIds?.includes(s.id));

          return (
            <div
              key={f.id}
              id={`finding-card-${f.id}`}
              className={`bg-slate-900 border rounded-xl p-4 space-y-3 shadow-sm transition-all ${
                isHighlighted
                  ? 'border-indigo-400 ring-2 ring-indigo-500/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header: ID, Category & Evidence Type */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono font-bold border border-slate-700">
                    {f.id}
                  </span>
                  <span className="text-[11px] font-semibold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {f.taxonomyCategory}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {f.evidenceType}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {f.confidence}% Conf
                  </span>
                </div>
              </div>

              {/* Statement */}
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {f.statement}
              </p>

              {/* Highlighted Metric Badge */}
              {f.metric && (
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <div className="flex items-center justify-between w-full text-xs">
                    <span className="text-slate-400 text-[11px]">{f.metric}:</span>
                    <span className="font-mono font-bold text-amber-300 text-xs">
                      {f.metricValue || 'Measured'}
                    </span>
                  </div>
                </div>
              )}

              {/* Primary Quote / Traceability Anchor */}
              {f.primaryQuote && (
                <div className="bg-slate-950/40 p-2.5 rounded text-[11px] text-slate-400 italic border-l-2 border-indigo-500 flex items-start gap-1.5">
                  <Quote className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
                  <span>&quot;{f.primaryQuote}&quot;</span>
                </div>
              )}

              {/* Linked Sources */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500">Source Citations:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {linkedSources.map(src => (
                    <button
                      key={src.id}
                      onClick={() => onOpenSource(src)}
                      className="px-2 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-500/30 rounded flex items-center gap-1 cursor-pointer"
                      title={src.title}
                    >
                      <span>{src.domain}</span>
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
