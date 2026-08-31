import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  ExternalLink, 
  Calendar, 
  Search, 
  Tag, 
  CheckCircle2, 
  Award,
  Filter
} from 'lucide-react';
import { ResearchSource, CredibilityTier } from '../types';

interface SourcesViewProps {
  sources: ResearchSource[];
  onOpenSource: (source: ResearchSource) => void;
}

export const SourcesView: React.FC<SourcesViewProps> = ({
  sources,
  onOpenSource,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('ALL');

  const filteredSources = sources.filter((s) => {
    const matchesTier = tierFilter === 'ALL' || s.credibilityTier.includes(tierFilter);
    const matchesSearch = !searchQuery || 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.authorOrPublisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  return (
    <div id="sources-view" className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            Ingested Sources & Credibility Repository (Stage 2, 3 & 4)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified academic, industry analyst, and enterprise field studies with calculated credibility ratings.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search title, author, domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 w-52"
            />
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
            {filteredSources.length} of {sources.length} Sources
          </span>
        </div>
      </div>

      {/* Tier Filter Badges */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        {['ALL', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'].map((t) => (
          <button
            key={t}
            onClick={() => setTierFilter(t)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              tierFilter === t
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            {t === 'ALL' ? 'All Tiers' : t}
          </button>
        ))}
      </div>

      {/* Sources List */}
      <div className="space-y-4">
        {filteredSources.map((s, idx) => (
          <div
            key={s.id}
            id={`source-card-${s.id}`}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3 hover:border-slate-700 transition-colors"
          >
            {/* Header: Title, Publisher, Credibility Badge */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono font-bold border border-slate-700">
                    {s.id}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    {s.credibilityTier}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {s.publicationDate}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white hover:text-blue-400 transition-colors">
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5">
                    <span>{s.title}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </h4>
                <p className="text-xs text-indigo-300 font-medium">
                  {s.authorOrPublisher} ({s.domain})
                </p>
              </div>

              {/* Credibility Score Meter */}
              <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <div className="text-right">
                  <div className="text-xs font-bold text-white font-mono">{s.credibilityScore}/100</div>
                  <div className="text-[9px] text-emerald-400 font-medium uppercase tracking-wider">Credibility</div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
              {s.summary}
            </p>

            {/* Extracted Excerpt */}
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Ingested Key Excerpt & Empirical Evidence
              </span>
              <p className="text-xs text-slate-200 italic leading-relaxed">
                &quot;{s.fullExcerpt}&quot;
              </p>
            </div>

            {/* Tags & Action Drawer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 flex-wrap gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                {s.tags?.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => onOpenSource(s)}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Inspect Full Metadata & Quotes</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
