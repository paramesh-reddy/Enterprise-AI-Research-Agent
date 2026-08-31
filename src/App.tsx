import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Layers, 
  Sparkles, 
  Award, 
  Scale, 
  Lightbulb, 
  BookOpen, 
  Network, 
  HelpCircle, 
  Database, 
  RotateCw,
  Download,
  AlertCircle,
  FileText
} from 'lucide-react';
import { ResearchSession, ResearchSource } from './types';
import { Navbar } from './components/Navbar';
import { PipelineStepper } from './components/PipelineStepper';
import { LivePipelineMonitor } from './components/LivePipelineMonitor';
import { ConclusionsView } from './components/ConclusionsView';
import { ContradictionsView } from './components/ContradictionsView';
import { FindingsView } from './components/FindingsView';
import { SourcesView } from './components/SourcesView';
import { TraceabilityView } from './components/TraceabilityView';
import { QuestionsView } from './components/QuestionsView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { SourceDrawer } from './components/SourceDrawer';
import { NewResearchModal } from './components/NewResearchModal';

type ActiveTab = 
  | 'pipeline' 
  | 'conclusions' 
  | 'contradictions' 
  | 'findings' 
  | 'sources' 
  | 'traceability' 
  | 'questions' 
  | 'kb';

export default function App() {
  const [sessions, setSessions] = useState<ResearchSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('pipeline');
  const [activeStepTab, setActiveStepTab] = useState<number>(1);
  const [selectedSource, setSelectedSource] = useState<ResearchSource | null>(null);
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);

  // Fetch all sessions on initial load
  const fetchSessions = async (selectId?: string) => {
    try {
      const res = await fetch('/api/sessions');
      if (res.ok) {
        const data: ResearchSession[] = await res.json();
        setSessions(data);
        if (data.length > 0) {
          const targetId = selectId || currentSessionId || data[0].id;
          const exists = data.some(s => s.id === targetId);
          setCurrentSessionId(exists ? targetId : data[0].id);
        }
      }
    } catch (err: any) {
      console.error('Failed to load research sessions:', err);
      setErrorMsg('Could not connect to research backend service.');
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const currentSession = sessions.find(s => s.id === currentSessionId) || null;

  // Setup SSE stream for the currently active session
  useEffect(() => {
    if (!currentSessionId) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const es = new EventSource(`/api/sessions/${currentSessionId}/stream`);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.session) {
          setSessions(prev => {
            const index = prev.findIndex(s => s.id === payload.session.id);
            if (index >= 0) {
              const updated = [...prev];
              updated[index] = payload.session;
              return updated;
            } else {
              return [payload.session, ...prev];
            }
          });
        }
      } catch (err) {
        console.error('SSE JSON parse error:', err);
      }
    };

    es.onerror = () => {
      // In dev or on reconnect, SSE might drop briefly; it will automatically reconnect
    };

    return () => {
      es.close();
    };
  }, [currentSessionId]);

  // Launch pipeline execution
  const handleRunPipeline = async () => {
    if (!currentSessionId) return;
    try {
      setErrorMsg(null);
      const res = await fetch(`/api/sessions/${currentSessionId}/run`, {
        method: 'POST',
      });
      if (res.ok) {
        setActiveTab('pipeline');
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Failed to start pipeline.');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Pipeline execution failed.');
    }
  };

  // Create new research session and trigger run
  const handleCreateNewSession = async (topic: string, scope: string) => {
    try {
      setIsCreating(true);
      setErrorMsg(null);

      const res = await fetch('/api/sessions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, targetScope: scope }),
      });

      if (!res.ok) {
        throw new Error('Failed to initialize new research session');
      }

      const newSession: ResearchSession = await res.json();
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      setIsNewModalOpen(false);
      setActiveTab('pipeline');

      // Auto-trigger pipeline
      await fetch(`/api/sessions/${newSession.id}/run`, { method: 'POST' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create session');
    } finally {
      setIsCreating(false);
    }
  };

  // Delete a session
  const handleDeleteSession = async (id: string) => {
    try {
      const res = await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const remaining = sessions.filter(s => s.id !== id);
        setSessions(remaining);
        if (currentSessionId === id && remaining.length > 0) {
          setCurrentSessionId(remaining[0].id);
        }
      }
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  // Export session
  const handleExport = (format: 'markdown' | 'json') => {
    if (!currentSessionId) return;
    window.location.href = `/api/sessions/${currentSessionId}/export?format=${format}`;
  };

  // Map 10-step stepper selection to workspace tabs
  const handleSelectStepTab = (step: number) => {
    setActiveStepTab(step);
    if (step === 1) setActiveTab('questions');
    else if (step === 2 || step === 3 || step === 4) setActiveTab('sources');
    else if (step === 5 || step === 7) setActiveTab('findings');
    else if (step === 6 || step === 8) setActiveTab('contradictions');
    else if (step === 9) setActiveTab('conclusions');
    else if (step === 10) setActiveTab('traceability');
  };

  const handleOpenFinding = (fId: string) => {
    setSelectedFindingId(fId);
    setActiveTab('findings');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Top Navigation */}
      <Navbar
        sessions={sessions}
        currentSession={currentSession}
        onSelectSession={(id) => {
          setCurrentSessionId(id);
          setActiveTab('pipeline');
        }}
        onOpenNewModal={() => setIsNewModalOpen(true)}
        onOpenKB={() => setActiveTab('kb')}
        isKBActive={activeTab === 'kb'}
        onRunPipeline={handleRunPipeline}
        onExport={handleExport}
      />

      {/* 10-Stage Pipeline Sequential Stepper */}
      {activeTab !== 'kb' && (
        <PipelineStepper
          session={currentSession}
          activeStepTab={activeStepTab}
          onSelectStepTab={handleSelectStepTab}
        />
      )}

      {/* Global Error Banner */}
      {errorMsg && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
          <div className="bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-rose-400 hover:text-white text-xs font-semibold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Workspace Sub-Navigation Tabs */}
        {activeTab !== 'kb' && (
          <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
            <button
              id="tab-btn-pipeline"
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'pipeline'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Live Pipeline Monitor</span>
            </button>

            <button
              id="tab-btn-conclusions"
              onClick={() => setActiveTab('conclusions')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'conclusions'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Executive Conclusions ({currentSession?.conclusions?.length || 0})</span>
            </button>

            <button
              id="tab-btn-contradictions"
              onClick={() => setActiveTab('contradictions')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'contradictions'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Contradictions & Tradeoffs ({currentSession?.contradictions?.length || 0})</span>
            </button>

            <button
              id="tab-btn-findings"
              onClick={() => setActiveTab('findings')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'findings'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Classified Findings ({currentSession?.findings?.length || 0})</span>
            </button>

            <button
              id="tab-btn-sources"
              onClick={() => setActiveTab('sources')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'sources'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Sources & Credibility ({currentSession?.sources?.length || 0})</span>
            </button>

            <button
              id="tab-btn-traceability"
              onClick={() => setActiveTab('traceability')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'traceability'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Traceability Lineage ({currentSession?.traceabilityMatrix?.length || 0})</span>
            </button>

            <button
              id="tab-btn-questions"
              onClick={() => setActiveTab('questions')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'questions'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Scoped Questions ({currentSession?.questions?.length || 0})</span>
            </button>
          </div>
        )}

        {/* View Switcher */}
        {activeTab === 'pipeline' && (
          <LivePipelineMonitor
            session={currentSession}
            onRunPipeline={handleRunPipeline}
            onSelectPrompt={(title, scope) => handleCreateNewSession(title, scope)}
            onNavigateTab={(tab) => setActiveTab(tab as ActiveTab)}
          />
        )}

        {activeTab === 'conclusions' && (
          <ConclusionsView
            conclusions={currentSession?.conclusions || []}
            findings={currentSession?.findings || []}
            sources={currentSession?.sources || []}
            onOpenSource={(s) => setSelectedSource(s)}
            onOpenFinding={handleOpenFinding}
          />
        )}

        {activeTab === 'contradictions' && (
          <ContradictionsView
            contradictions={currentSession?.contradictions || []}
            evidenceComparisons={currentSession?.evidenceComparisons || []}
            findings={currentSession?.findings || []}
            onOpenFinding={handleOpenFinding}
          />
        )}

        {activeTab === 'findings' && (
          <FindingsView
            findings={currentSession?.findings || []}
            sources={currentSession?.sources || []}
            onOpenSource={(s) => setSelectedSource(s)}
            selectedFindingId={selectedFindingId}
          />
        )}

        {activeTab === 'sources' && (
          <SourcesView
            sources={currentSession?.sources || []}
            onOpenSource={(s) => setSelectedSource(s)}
          />
        )}

        {activeTab === 'traceability' && (
          <TraceabilityView
            traceabilityMatrix={currentSession?.traceabilityMatrix || []}
            onOpenSource={(s) => setSelectedSource(s)}
          />
        )}

        {activeTab === 'questions' && (
          <QuestionsView
            questions={currentSession?.questions || []}
          />
        )}

        {activeTab === 'kb' && (
          <KnowledgeBaseView
            sessions={sessions}
            onSelectSession={(id) => {
              setCurrentSessionId(id);
              setActiveTab('pipeline');
            }}
            onDeleteSession={handleDeleteSession}
            onOpenSource={(s) => setSelectedSource(s)}
          />
        )}

      </main>

      {/* Source Details Slide-Over Drawer */}
      <SourceDrawer
        source={selectedSource}
        onClose={() => setSelectedSource(null)}
      />

      {/* New Research Launch Modal */}
      <NewResearchModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleCreateNewSession}
        isCreating={isCreating}
      />

    </div>
  );
}
