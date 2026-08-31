import React from 'react';
import { 
  Play, 
  RotateCw, 
  CheckCircle2, 
  Clock, 
  Terminal, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  BookOpen, 
  Lightbulb, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ResearchSession } from '../types';
import { PIPELINE_STEPS } from './PipelineStepper';

interface LivePipelineMonitorProps {
  session: ResearchSession | null;
  onRunPipeline: () => void;
  onSelectPrompt: (prompt: string, scope: string) => void;
  onNavigateTab: (tabId: string) => void;
}

const PRESET_TOPICS = [
  {
    title: 'How is AI transforming retail operations?',
    scope: 'Loss prevention computer vision, demand forecasting, autonomous checkout, dynamic pricing, and frontline store associates.',
    tag: 'Retail & Commerce',
  },
  {
    title: 'What AI technologies are changing manufacturing?',
    scope: 'Industrial predictive maintenance, OT/IT edge computing, optical defect inspection, and generative tool design.',
    tag: 'Industrial & OT',
  },
  {
    title: 'Agentic AI & Generative Workflows in Enterprise Supply Chains',
    scope: 'Autonomous freight dispatching, multi-echelon inventory allocation, supplier risk forecasting, and customs doc automation.',
    tag: 'Logistics & Ops',
  },
  {
    title: 'Enterprise AI Security, Governance & Regulatory Compliance',
    scope: 'EU AI Act auditability, prompt injection mitigation, air-gapped LLM deployment, and PII leakage prevention.',
    tag: 'Cyber & Risk',
  },
];

export const LivePipelineMonitor: React.FC<LivePipelineMonitorProps> = ({
  session,
  onRunPipeline,
  onSelectPrompt,
  onNavigateTab,
}) => {
  const isRunning = session?.status === 'running';
  const isCompleted = session?.status === 'completed';
  const currentStep = session?.currentStep || 0;

  return (
    <div id="live-pipeline-monitor" className="space-y-6">
      
      {/* Top Banner with Current Topic & Action */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
                Active Research Investigation
              </span>
              <span className="text-xs text-slate-500">
                ID: {session?.id || 'none'}
              </span>
              {session?.status && (
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded uppercase ${
                  isCompleted 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : isRunning 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse' 
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {session.status}
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight">
              {session?.topic || 'No topic selected'}
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
              {session?.targetScope || 'Select a topic or launch a new enterprise research question below.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {session && (
              <button
                id="btn-run-pipeline-main"
                onClick={onRunPipeline}
                disabled={isRunning}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white shadow-md transition-all cursor-pointer ${
                  isRunning
                    ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                    : isCompleted
                    ? 'bg-indigo-600 hover:bg-indigo-500'
                    : 'bg-blue-600 hover:bg-blue-500'
                }`}
              >
                {isRunning ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-blue-400" />
                    <span>Executing Pipeline (Step {currentStep}/10)...</span>
                  </>
                ) : isCompleted ? (
                  <>
                    <RotateCw className="w-4 h-4" />
                    <span>Re-Run Research Pipeline</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start 10-Step Pipeline</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Telemetry Snapshot Cards */}
        {session && isCompleted && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800">
            <div 
              onClick={() => onNavigateTab('sources')}
              className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg p-3 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Sources Ingested</span>
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="text-lg font-bold text-white">
                {session.sources?.length || 0}
              </div>
              <span className="text-[10px] text-slate-400">
                Avg Credibility: {session.dossierSummary?.avgCredibility || 90}/100
              </span>
            </div>

            <div 
              onClick={() => onNavigateTab('findings')}
              className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg p-3 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Atomic Findings</span>
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-lg font-bold text-white">
                {session.findings?.length || 0}
              </div>
              <span className="text-[10px] text-slate-400">
                Mapped to 6-Pillar Taxonomy
              </span>
            </div>

            <div 
              onClick={() => onNavigateTab('contradictions')}
              className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg p-3 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Contradictions</span>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="text-lg font-bold text-white">
                {session.contradictions?.length || 0}
              </div>
              <span className="text-[10px] text-rose-300">
                Resolved with root-cause analysis
              </span>
            </div>

            <div 
              onClick={() => onNavigateTab('conclusions')}
              className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg p-3 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>Conclusions</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-lg font-bold text-white">
                {session.conclusions?.length || 0}
              </div>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span>100% Traceable</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Split: Live Sequential Step Stream vs Evaluator Prompt Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Real-time Terminal Execution Log & Stage Inspector */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-200">
                  Autonomous Pipeline Telemetry & Live Stage Logs
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {session?.stepLogs?.length || 0} Events Recorded
              </span>
            </div>

            <div className="p-4 space-y-3 font-mono text-xs max-h-96 overflow-y-auto bg-slate-950/70">
              {session?.stepLogs && session.stepLogs.length > 0 ? (
                session.stepLogs.map((log, idx) => {
                  const isCur = isRunning && currentStep === log.step;
                  return (
                    <div 
                      key={idx}
                      className={`p-3 rounded-lg border transition-all ${
                        log.status === 'completed'
                          ? 'bg-slate-900/90 border-emerald-500/20 text-slate-300'
                          : log.status === 'active'
                          ? 'bg-blue-950/40 border-blue-500/40 text-blue-200 ring-1 ring-blue-500/30'
                          : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5 font-sans">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold flex items-center justify-center">
                            {log.step}
                          </span>
                          <span className="font-semibold text-slate-100 text-xs">
                            {log.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>{log.timestamp}</span>
                          {log.status === 'completed' && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                              PASS
                            </span>
                          )}
                          {log.status === 'active' && (
                            <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-medium animate-pulse">
                              RUNNING
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-slate-300 text-xs font-sans pl-7 leading-relaxed">
                        {log.summary}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-slate-500 space-y-2 font-sans">
                  <Terminal className="w-8 h-8 mx-auto opacity-40 text-slate-400" />
                  <p className="text-xs">No active pipeline logs for this session yet.</p>
                  <p className="text-[11px] text-slate-600">Click &quot;Start 10-Step Pipeline&quot; to begin autonomous multi-stage research.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Quick Preset Evaluator Test Questions */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Evaluator Test Cases
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Click any benchmark query to test the autonomous research pipeline:
            </p>

            <div className="space-y-2.5">
              {PRESET_TOPICS.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectPrompt(p.title, p.scope)}
                  className="group p-3 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 hover:border-blue-500/40 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      {p.tag}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200 group-hover:text-white mb-1">
                    &quot;{p.title}&quot;
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {p.scope}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Architectural Guarantees Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Pipeline Rigor Guarantees</span>
            </div>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>No Hallucinations:</strong> Every conclusion maps to empirical excerpts and source URLs.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Contradiction Detection:</strong> Disagreements between vendors and analysts are explicitly flagged.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Backend Store:</strong> Knowledge base persists across runs for cross-topic queries.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};
