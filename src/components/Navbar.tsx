import React from 'react';
import { 
  Sparkles, 
  Database, 
  PlusCircle, 
  Download, 
  RotateCw, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Layers,
  Search
} from 'lucide-react';
import { ResearchSession } from '../types';

interface NavbarProps {
  sessions: ResearchSession[];
  currentSession: ResearchSession | null;
  onSelectSession: (id: string) => void;
  onOpenNewModal: () => void;
  onOpenKB: () => void;
  isKBActive: boolean;
  onRunPipeline: () => void;
  onExport: (format: 'markdown' | 'json') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  sessions,
  currentSession,
  onSelectSession,
  onOpenNewModal,
  onOpenKB,
  isKBActive,
  onRunPipeline,
  onExport,
}) => {
  const isRunning = currentSession?.status === 'running';

  return (
    <header id="app-header" className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center shadow-inner">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">Enterprise AI Research Agent</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
                  10-Stage Pipeline
                </span>
              </div>
              <p className="text-xs text-slate-400">Autonomous Evidence Synthesis & Reusable Knowledge Base</p>
            </div>
          </div>

          {/* Center Topic Selector */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-2">
            <label htmlFor="topic-selector" className="text-xs text-slate-400 font-medium whitespace-nowrap">
              Topic:
            </label>
            <select
              id="topic-selector"
              value={currentSession?.id || ''}
              onChange={(e) => onSelectSession(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 truncate"
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.topic} ({s.status.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="btn-nav-new-topic"
              onClick={onOpenNewModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-sm cursor-pointer"
              title="Launch new structured enterprise research pipeline"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Question</span>
            </button>

            <button
              id="btn-nav-kb-toggle"
              onClick={onOpenKB}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                isKBActive
                  ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Browse reusable knowledge base across past research"
            >
              <Database className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Knowledge Base</span>
            </button>

            {currentSession && (
              <div className="flex items-center gap-1">
                <button
                  id="btn-nav-rerun-pipeline"
                  onClick={onRunPipeline}
                  disabled={isRunning}
                  className={`p-1.5 text-xs font-medium rounded-lg border border-slate-700 text-slate-300 transition-colors ${
                    isRunning 
                      ? 'opacity-50 cursor-not-allowed bg-slate-800' 
                      : 'hover:bg-slate-800 cursor-pointer text-slate-300'
                  }`}
                  title="Re-run research pipeline"
                >
                  <RotateCw className={`w-4 h-4 ${isRunning ? 'animate-spin text-blue-400' : ''}`} />
                </button>

                <div className="relative group">
                  <button
                    id="btn-nav-export-dropdown"
                    className="p-1.5 text-xs font-medium rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 cursor-pointer"
                    title="Export Research Dossier"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 mt-1 w-44 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 hidden group-hover:block group-focus-within:block z-50">
                    <button
                      onClick={() => onExport('markdown')}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                      <span>Executive Markdown (.md)</span>
                    </button>
                    <button
                      onClick={() => onExport('json')}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
                    >
                      <Database className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Full Audit JSON (.json)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
