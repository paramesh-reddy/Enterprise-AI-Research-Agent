import fs from 'fs';
import path from 'path';
import { ResearchSession, KnowledgeBaseStats, ResearchSource, ResearchFinding, Contradiction } from '../src/types';
import { SEED_SESSIONS } from './seedData';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'knowledge_base.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class KnowledgeBaseStore {
  private sessions: Map<string, ResearchSession> = new Map();

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const list: ResearchSession[] = JSON.parse(raw);
        if (Array.isArray(list) && list.length > 0) {
          list.forEach(s => this.sessions.set(s.id, s));
          return;
        }
      }
    } catch (err) {
      console.warn('Could not read existing knowledge base file, initializing seeds...', err);
    }

    // Seed defaults
    SEED_SESSIONS.forEach(s => this.sessions.set(s.id, s));
    this.save();
  }

  private save() {
    try {
      const list = Array.from(this.sessions.values());
      fs.writeFileSync(DB_FILE, JSON.stringify(list, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write knowledge base to disk:', err);
    }
  }

  public getAllSessions(): ResearchSession[] {
    return Array.from(this.sessions.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getSession(id: string): ResearchSession | undefined {
    return this.sessions.get(id);
  }

  public saveSession(session: ResearchSession): void {
    session.updatedAt = new Date().toISOString();
    this.sessions.set(session.id, session);
    this.save();
  }

  public deleteSession(id: string): boolean {
    const deleted = this.sessions.delete(id);
    if (deleted) this.save();
    return deleted;
  }

  public getKnowledgeBaseStats(): KnowledgeBaseStats {
    const all = Array.from(this.sessions.values());
    const sourceMap = new Map<string, ResearchSource>();
    const findingMap = new Map<string, ResearchFinding>();
    let totalContradictions = 0;
    const categoriesCount: Record<string, number> = {};

    all.forEach(s => {
      s.sources?.forEach(src => sourceMap.set(src.id + '_' + src.url, src));
      s.findings?.forEach(f => {
        findingMap.set(f.id, f);
        const cat = f.taxonomyCategory || 'Operational Efficiency';
        categoriesCount[cat] = (categoriesCount[cat] || 0) + 1;
      });
      totalContradictions += (s.contradictions?.length || 0);
    });

    return {
      totalSessions: all.length,
      totalUniqueSources: sourceMap.size,
      totalUniqueFindings: findingMap.size,
      totalContradictions,
      categoriesCount,
      latestSessions: all.slice(0, 5).map(s => ({
        id: s.id,
        topic: s.topic,
        createdAt: s.createdAt,
        findingsCount: s.findings?.length || 0,
      })),
    };
  }

  public searchKnowledgeBase(query: string, categoryFilter?: string): {
    sources: Array<ResearchSource & { sessionTopic: string; sessionId: string }>;
    findings: Array<ResearchFinding & { sessionTopic: string; sessionId: string }>;
    contradictions: Array<Contradiction & { sessionTopic: string; sessionId: string }>;
  } {
    const q = query.toLowerCase().trim();
    const matchedSources: Array<ResearchSource & { sessionTopic: string; sessionId: string }> = [];
    const matchedFindings: Array<ResearchFinding & { sessionTopic: string; sessionId: string }> = [];
    const matchedContradictions: Array<Contradiction & { sessionTopic: string; sessionId: string }> = [];

    this.sessions.forEach(s => {
      s.sources?.forEach(src => {
        if (!q || src.title.toLowerCase().includes(q) || src.summary.toLowerCase().includes(q) || src.tags.some(t => t.toLowerCase().includes(q))) {
          matchedSources.push({ ...src, sessionTopic: s.topic, sessionId: s.id });
        }
      });

      s.findings?.forEach(f => {
        const matchesQuery = !q || f.statement.toLowerCase().includes(q) || (f.metric && f.metric.toLowerCase().includes(q));
        const matchesCategory = !categoryFilter || categoryFilter === 'ALL' || f.taxonomyCategory === categoryFilter;
        if (matchesQuery && matchesCategory) {
          matchedFindings.push({ ...f, sessionTopic: s.topic, sessionId: s.id });
        }
      });

      s.contradictions?.forEach(cnt => {
        if (!q || cnt.topic.toLowerCase().includes(q) || cnt.contradictionDescription.toLowerCase().includes(q) || cnt.enterpriseResolution.toLowerCase().includes(q)) {
          matchedContradictions.push({ ...cnt, sessionTopic: s.topic, sessionId: s.id });
        }
      });
    });

    return {
      sources: matchedSources,
      findings: matchedFindings,
      contradictions: matchedContradictions,
    };
  }
}

export const kbStore = new KnowledgeBaseStore();
