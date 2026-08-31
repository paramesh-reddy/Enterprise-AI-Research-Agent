import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  BookOpen, 
  Lightbulb, 
  AlertTriangle, 
  Filter, 
  Layers, 
  ExternalLink,
  Trash2,
  Play,
  RotateCw,
  FolderArchive,
  ArrowRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { KnowledgeBaseStats, ResearchSession, ResearchSource, ResearchFinding, Contradiction } from '../types';

interface KnowledgeBaseViewProps {
  sessions: ResearchSession[];
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onOpenSource: (source: ResearchSource) => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  sessions,
  onSelectSession,
  onDeleteSession,
  onOpenSource,
}) => {
  const [stats, setStats] = useState<KnowledgeBaseStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchResults, setSearchResults] = useState<{
    sources: Array<ResearchSource & { sessionTopic: string; sessionId: string }>;
    findings: Array<ResearchFinding & { sessionTopic: string; sessionId: string }>;
    contradictions: Array<Contradiction & { sessionTopic: string; sessionId: string }>;
  } | null>(null);
  const [activeKBSubTab, setActiveKBSubTab] = useState<'sessions' | 'findings' | 'sources' | 'contradictions'>('sessions');

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/knowledge-base/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error('Failed to fetch KB stats:', e);
    }
  };

  const executeSearch = async () => {
    try {
      const res = await fetch(`/api/knowledge-base/search?q=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(categoryFilter)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (e) {
      console.error('Failed to search KB:', e);
    }
  };

  useEffect(() => {
    fetchStats();
    executeSearch();
  }, [searchQuery, categoryFilter, sessions]);

  return (
    <div id="knowledge-base-view" className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Enterprise Research Knowledge Base (Backend Store)
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Reusable multi-topic research repository persisting all validated sources, atomic empirical claims, and contradiction resolutions across all organizational investigations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { fetchStats(); executeSearch(); }}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Refresh Store</span>
            </button>
          </div>
        </div>

        {/* Global Aggregate Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium">Research Sessions</span>
            <div className="text-xl font-bold text-white mt-1">
              {stats?.totalSessions || sessions.length}
            </div>
            <span className="text-[10px] text-indigo-400">Stored on server</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium">Unique Sources</span>
            <div className="text-xl font-bold text-blue-400 mt-1">
              {stats?.totalUniqueSources || 0}
            </div>
            <span className="text-[10px] text-slate-400">Multi-tier indexed</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium">Atomic Findings</span>
            <div className="text-xl font-bold text-amber-400 mt-1">
              {stats?.totalUniqueFindings || 0}
            </div>
            <span className="text-[10px] text-slate-400">Falsifiable claims</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium">Resolved Conflicts</span>
            <div className="text-xl font-bold text-rose-400 mt-1">
              {stats?.totalContradictions || 0}
            </div>
            <span className="text-[10px] text-slate-400">Tradeoff resolutions</span>
          </div>
        </div>
      </div>

      {/* Global Search & Category Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search cross-topic knowledge base (e.g. 'edge compute', 'shrinkage', 'TCO', 'ROI')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Sub-tab switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveKBSubTab('sessions')}
              className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                activeKBSubTab === 'sessions' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sessions ({sessions.length})
            </button>
            <button
              onClick={() => setActiveKBSubTab('findings')}
              className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                activeKBSubTab === 'findings' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Findings ({searchResults?.findings?.length || 0})
            </button>
            <button
              onClick={() => setActiveKBSubTab('sources')}
              className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                activeKBSubTab === 'sources' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sources ({searchResults?.sources?.length || 0})
            </button>
            <button
              onClick={() => setActiveKBSubTab('contradictions')}
              className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                activeKBSubTab === 'contradictions' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Contradictions ({searchResults?.contradictions?.length || 0})
            </button>
          </div>

        </div>
      </div>

      {/* Sub-Tab 1: All Persisted Sessions */}
      {activeKBSubTab === 'sessions' && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Persisted Research Investigations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-sm space-y-3 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-400">
                      Created {new Date(s.createdAt).toLocaleDateString()}
                    </span>
                    <h5 className="text-sm font-bold text-white leading-snug">
                      {s.topic}
                    </h5>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded uppercase ${
                    s.status === 'completed' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {s.status}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {s.targetScope}
                </p>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-[11px] text-center">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Sources</span>
                    <span className="font-bold text-blue-400">{s.sources?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Findings</span>
                    <span className="font-bold text-amber-400">{s.findings?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Directives</span>
                    <span className="font-bold text-emerald-400">{s.conclusions?.length || 0}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => onSelectSession(s.id)}
                    className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>Open Research Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteSession(s.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Cross-Topic Findings */}
      {activeKBSubTab === 'findings' && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            All Atomic Findings in Knowledge Base ({searchResults?.findings?.length || 0})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {searchResults?.findings?.map((f) => (
              <div key={f.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 font-semibold border border-indigo-500/20">
                    {f.taxonomyCategory}
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    Topic: {f.sessionTopic}
                  </span>
                </div>
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  {f.statement}
                </p>
                {f.metric && (
                  <div className="text-[11px] text-amber-300 font-mono">
                    {f.metric}: <span className="font-bold">{f.metricValue}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px]">
                  <span className="text-slate-500">Confidence: {f.confidence}%</span>
                  <button
                    onClick={() => onSelectSession(f.sessionId)}
                    className="text-blue-400 hover:underline cursor-pointer"
                  >
                    View in Session ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Cross-Topic Sources */}
      {activeKBSubTab === 'sources' && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            All Authoritative Sources in Store ({searchResults?.sources?.length || 0})
          </h4>
          <div className="space-y-3">
            {searchResults?.sources?.map((s) => (
              <div key={s.id + '_' + s.sessionId} className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white hover:text-blue-400">
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
                      <span>{s.title}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    Credibility {s.credibilityScore}/100
                  </span>
                </div>
                <p className="text-xs text-indigo-300">{s.authorOrPublisher} ({s.domain})</p>
                <p className="text-xs text-slate-300 line-clamp-2">{s.summary}</p>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
                  <span>From Investigation: &quot;{s.sessionTopic}&quot;</span>
                  <button
                    onClick={() => onOpenSource(s)}
                    className="text-blue-400 hover:underline cursor-pointer"
                  >
                    Inspect Full Source Data ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Cross-Topic Contradictions */}
      {activeKBSubTab === 'contradictions' && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Resolved Cross-Topic Contradictions ({searchResults?.contradictions?.length || 0})
          </h4>
          <div className="space-y-3">
            {searchResults?.contradictions?.map((cnt) => (
              <div key={cnt.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-rose-300">{cnt.topic}</h5>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold">
                    {cnt.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{cnt.contradictionDescription}</p>
                <div className="bg-emerald-950/30 p-2.5 rounded border border-emerald-500/20 text-xs text-emerald-200">
                  <strong>Resolution:</strong> {cnt.enterpriseResolution}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
