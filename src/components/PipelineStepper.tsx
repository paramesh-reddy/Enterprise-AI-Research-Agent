import React from 'react';
import { 
  CheckCircle2, 
  CircleDot, 
  Circle, 
  AlertCircle,
  HelpCircle,
  Search,
  BookOpen,
  Archive,
  Lightbulb,
  GitCompare,
  Tags,
  Scale,
  Award,
  Network
} from 'lucide-react';
import { ResearchSession, PipelineStepLog } from '../types';

interface PipelineStepperProps {
  session: ResearchSession | null;
  activeStepTab: number;
  onSelectStepTab: (step: number) => void;
}

export const PIPELINE_STEPS = [
  { step: 1, name: 'Define Questions', icon: HelpCircle, desc: 'Decompose core enterprise topic' },
  { step: 2, name: 'Search Sources', icon: Search, desc: 'Grounded domain literature search' },
  { step: 3, name: 'Collect Info', icon: BookOpen, desc: 'Extract metrics & excerpts' },
  { step: 4, name: 'Store Sources', icon: Archive, desc: 'Index into server knowledge base' },
  { step: 5, name: 'Extract Findings', icon: Lightbulb, desc: 'Atomic claims & benchmarks' },
  { step: 6, name: 'Compare Evidence', icon: GitCompare, desc: 'Cross-source consensus matrix' },
  { step: 7, name: 'Classify Findings', icon: Tags, desc: '6-pillar enterprise taxonomy' },
  { step: 8, name: 'Detect Contradictions', icon: Scale, desc: 'Conflict & tradeoff analysis' },
  { step: 9, name: 'Generate Conclusions', icon: Award, desc: 'Executive strategic roadmaps' },
  { step: 10, name: 'Maintain Traceability', icon: Network, desc: 'Bi-directional citation lineage' },
];

export const PipelineStepper: React.FC<PipelineStepperProps> = ({
  session,
  activeStepTab,
  onSelectStepTab,
}) => {
  const currentStep = session?.currentStep || 0;
  const isCompleted = session?.status === 'completed';
  const isFailed = session?.status === 'failed';
  const isRunning = session?.status === 'running';

  const getStepStatus = (stepNum: number) => {
    if (!session) return 'pending';
    const log = session.stepLogs.find((l) => l.step === stepNum);
    if (log?.status === 'failed') return 'failed';
    if (log?.status === 'completed' || (isCompleted && stepNum <= currentStep)) return 'completed';
    if (isRunning && currentStep === stepNum) return 'active';
    if (currentStep > stepNum) return 'completed';
    return 'pending';
  };

  return (
    <div id="pipeline-stepper-container" className="bg-slate-900/90 backdrop-blur border-b border-slate-800 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Research Pipeline Architecture:
            </span>
            <span className="text-xs text-slate-400">
              {isRunning
                ? `Executing Stage ${currentStep}/10...`
                : isCompleted
                ? 'All 10 Stages Validated & Indexed'
                : 'Ready to Run'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span> Completed
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping inline-block"></span> Active
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-600 inline-block"></span> Queued
            </span>
          </div>
        </div>

        {/* 10 Step Pipeline Bar */}
        <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-1.5 pt-1">
          {PIPELINE_STEPS.map((s) => {
            const status = getStepStatus(s.step);
            const isSelected = activeStepTab === s.step;
            const Icon = s.icon;

            let badgeColor = 'bg-slate-800/80 text-slate-400 border-slate-700 hover:border-slate-600';
            if (status === 'completed') {
              badgeColor = 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/40';
            } else if (status === 'active') {
              badgeColor = 'bg-blue-950/60 text-blue-200 border-blue-400 ring-2 ring-blue-500/30 animate-pulse';
            } else if (status === 'failed') {
              badgeColor = 'bg-rose-950/50 text-rose-300 border-rose-500/50';
            }

            if (isSelected) {
              badgeColor += ' ring-2 ring-indigo-400 font-semibold';
            }

            return (
              <button
                key={s.step}
                id={`step-btn-${s.step}`}
                onClick={() => onSelectStepTab(s.step)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all cursor-pointer relative ${badgeColor}`}
                title={`Stage ${s.step}: ${s.name} - ${s.desc}`}
              >
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-black/40">
                    {s.step}
                  </span>
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : status === 'active' ? (
                    <CircleDot className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                  ) : status === 'failed' ? (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  ) : (
                    <Icon className="w-3.5 h-3.5 opacity-70" />
                  )}
                </div>
                <span className="text-[11px] leading-tight font-medium line-clamp-1">
                  {s.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
