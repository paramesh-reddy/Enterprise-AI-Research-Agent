import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { kbStore } from './server/db';
import { runResearchPipeline } from './server/pipeline';
import { ResearchSession } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// -------------------------------------------------------------
// SSE Active Subscribers Map for Live Pipeline Progress
// -------------------------------------------------------------
const sseClients = new Map<string, Set<Response>>();

function broadcastSessionUpdate(sessionId: string, data: any) {
  const clients = sseClients.get(sessionId);
  if (clients && clients.size > 0) {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    clients.forEach(res => {
      try {
        res.write(payload);
      } catch (err) {
        console.error('SSE client write error:', err);
      }
    });
  }
}

// -------------------------------------------------------------
// API Routes
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// List all research sessions
app.get('/api/sessions', (req: Request, res: Response) => {
  try {
    const sessions = kbStore.getAllSessions();
    res.json(sessions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get specific research session
app.get('/api/sessions/:id', (req: Request, res: Response) => {
  try {
    const session = kbStore.getSession(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create new research session
app.post('/api/sessions/create', (req: Request, res: Response) => {
  try {
    const { topic, targetScope } = req.body;
    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const id = `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const newSession: ResearchSession = {
      id,
      topic: topic.trim(),
      targetScope: targetScope?.trim() || `Enterprise research investigation into: ${topic.trim()}`,
      createdAt: now,
      updatedAt: now,
      status: 'idle',
      currentStep: 0,
      stepLogs: [],
      questions: [],
      sources: [],
      findings: [],
      evidenceComparisons: [],
      contradictions: [],
      conclusions: [],
      traceabilityMatrix: [],
      dossierSummary: {
        executiveOverview: '',
        totalSources: 0,
        totalFindings: 0,
        contradictionsDetected: 0,
        avgCredibility: 0,
        primaryGrowthDriver: '',
        primaryBottleneck: '',
      },
    };

    kbStore.saveSession(newSession);
    res.status(201).json(newSession);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Run or re-run research pipeline for a session
app.post('/api/sessions/:id/run', async (req: Request, res: Response) => {
  try {
    const session = kbStore.getSession(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Reset status to running
    session.status = 'running';
    session.currentStep = 1;
    session.stepLogs = [];
    kbStore.saveSession(session);

    // Return immediately to client so UI can listen to SSE or poll
    res.json({ status: 'started', sessionId: session.id });

    // Launch pipeline execution asynchronously
    runResearchPipeline(session, (step, name, status, summary, updatedSession) => {
      broadcastSessionUpdate(session.id, {
        type: 'step_update',
        step,
        name,
        status,
        summary,
        session: updatedSession,
      });
    }).then(completedSession => {
      broadcastSessionUpdate(session.id, {
        type: 'pipeline_completed',
        session: completedSession,
      });
    }).catch(err => {
      console.error('Async pipeline runner error:', err);
      broadcastSessionUpdate(session.id, {
        type: 'pipeline_failed',
        error: err.message,
      });
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// SSE Live Stream for active session progress
app.get('/api/sessions/:id/stream', (req: Request, res: Response) => {
  const sessionId = req.params.id;
  const session = kbStore.getSession(sessionId);

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  if (!sseClients.has(sessionId)) {
    sseClients.set(sessionId, new Set());
  }
  sseClients.get(sessionId)!.add(res);

  // Send initial state
  res.write(`data: ${JSON.stringify({ type: 'initial_state', session })}\n\n`);

  req.on('close', () => {
    const clients = sseClients.get(sessionId);
    if (clients) {
      clients.delete(res);
      if (clients.size === 0) {
        sseClients.delete(sessionId);
      }
    }
  });
});

// Delete a session
app.delete('/api/sessions/:id', (req: Request, res: Response) => {
  try {
    const deleted = kbStore.deleteSession(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json({ status: 'deleted', id: req.params.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Knowledge Base Stats
app.get('/api/knowledge-base/stats', (req: Request, res: Response) => {
  try {
    const stats = kbStore.getKnowledgeBaseStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Knowledge Base Search
app.get('/api/knowledge-base/search', (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || '';
    const category = (req.query.category as string) || 'ALL';
    const results = kbStore.searchKnowledgeBase(query, category);
    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Export Session (Markdown or JSON)
app.get('/api/sessions/:id/export', (req: Request, res: Response) => {
  try {
    const session = kbStore.getSession(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const format = (req.query.format as string) || 'markdown';

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${session.topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_research.json"`);
      return res.send(JSON.stringify(session, null, 2));
    }

    // Markdown Executive Dossier
    const md = generateMarkdownDossier(session);
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${session.topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_dossier.md"`);
    res.send(md);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

function generateMarkdownDossier(session: ResearchSession): string {
  let md = `# Enterprise Research Dossier: ${session.topic}\n\n`;
  md += `**Date:** ${new Date(session.createdAt).toLocaleDateString()} | **Status:** ${session.status.toUpperCase()} | **Credibility Average:** ${session.dossierSummary.avgCredibility}/100\n\n`;
  md += `## 1. Executive Summary\n${session.dossierSummary.executiveOverview || 'Comprehensive research synthesis conducted across verified multi-tier sources.'}\n\n`;
  
  md += `## 2. Research Questions Scoped\n`;
  session.questions.forEach((q, i) => {
    md += `${i + 1}. **[${q.category}]** ${q.question}\n   *Rationale:* ${q.rationale}\n`;
  });
  md += `\n`;

  md += `## 3. Strategic Conclusions & Executive Recommendations\n`;
  session.conclusions.forEach((c, i) => {
    md += `### ${i + 1}. ${c.title} (${c.confidenceLevel} Confidence, Horizon: ${c.timeHorizon})\n`;
    md += `${c.executiveSummary}\n\n`;
    md += `- **Operational Impact:** ${c.operationalImpact}\n`;
    md += `- **Strategic Directive:** ${c.strategicRecommendation}\n`;
    if (c.riskFactors && c.riskFactors.length > 0) {
      md += `- **Risk Factors:** ${c.riskFactors.join(', ')}\n`;
    }
    md += `\n`;
  });

  md += `## 4. Evidence Contradictions & Resolving Logic\n`;
  if (session.contradictions.length === 0) {
    md += `*No direct evidence contradictions detected across ingested sources.*\n\n`;
  } else {
    session.contradictions.forEach((cnt, i) => {
      md += `### Conflict ${i + 1}: ${cnt.topic} (Severity: ${cnt.severity})\n`;
      md += `- **Claim A (${cnt.claimA.sourceTitle} - ${cnt.claimA.sourceDomain}):** "${cnt.claimA.statement}"\n`;
      md += `- **Claim B (${cnt.claimB.sourceTitle} - ${cnt.claimB.sourceDomain}):** "${cnt.claimB.statement}"\n`;
      md += `- **Root Cause Analysis:** ${cnt.rootCauseAnalysis}\n`;
      md += `- **Enterprise Resolution:** ${cnt.enterpriseResolution}\n\n`;
    });
  }

  md += `## 5. Extracted Atomic Findings (${session.findings.length})\n`;
  session.findings.forEach((f, i) => {
    md += `${i + 1}. **[${f.taxonomyCategory}]** ${f.statement} (Confidence: ${f.confidence}%)\n`;
    if (f.metric) md += `   - *Metric:* ${f.metric}: \`${f.metricValue || 'N/A'}\`\n`;
  });
  md += `\n`;

  md += `## 6. Authoritative Sources Repository (${session.sources.length})\n`;
  session.sources.forEach((s, i) => {
    md += `${i + 1}. **${s.title}** — *${s.authorOrPublisher}* (${s.publicationDate})\n   - **URL:** ${s.url}\n   - **Tier:** ${s.credibilityTier} (Score: ${s.credibilityScore}/100)\n   - **Excerpt:** "${s.fullExcerpt}"\n\n`;
  });

  md += `## 7. Traceability Matrix\n`;
  session.traceabilityMatrix.forEach((t, i) => {
    md += `- **Conclusion:** "${t.conclusionTitle}" ➔ **Finding:** "${t.findingStatement}" ➔ **Source:** [${t.sourceTitle}](${t.sourceUrl}) (Match: ${t.relevanceScore}%)\n`;
  });

  return md;
}

// -------------------------------------------------------------
// Vite Middleware / Static Server
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Enterprise AI Research Agent server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
