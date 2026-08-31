export interface ResearchQuestion {
  id: string;
  question: string;
  category: 'Strategic' | 'Economic & ROI' | 'Technological' | 'Operational' | 'Regulatory & Risk';
  rationale: string;
  priority: 'high' | 'medium' | 'low';
}

export type CredibilityTier = 
  | 'Tier 1 (Academic & Gov Research)' 
  | 'Tier 2 (Enterprise & Benchmark Reports)' 
  | 'Tier 3 (Industry Analyst & Consulting)' 
  | 'Tier 4 (Industry Trade & Tech Press)';

export interface ResearchSource {
  id: string;
  title: string;
  url: string;
  domain: string;
  authorOrPublisher: string;
  publicationDate: string;
  credibilityScore: number; // 0 to 100
  credibilityTier: CredibilityTier;
  summary: string;
  fullExcerpt: string;
  tags: string[];
  storedAt: string;
}

export type TaxonomyCategory =
  | 'Operational Efficiency'
  | 'Cost & ROI'
  | 'Workforce & Talent'
  | 'Tech Infrastructure'
  | 'Implementation Risk'
  | 'Regulatory & Ethics';

export type EvidenceType =
  | 'Empirical Benchmark'
  | 'Case Study'
  | 'Analyst Forecast'
  | 'Enterprise Survey'
  | 'Controlled Pilot';

export interface ResearchFinding {
  id: string;
  statement: string;
  metric?: string;
  metricValue?: string;
  confidence: number; // 0 to 100
  sourceIds: string[];
  questionIds: string[];
  taxonomyCategory: TaxonomyCategory;
  evidenceType: EvidenceType;
  primaryQuote?: string;
}

export interface EvidenceComparison {
  id: string;
  theme: string;
  consensusLevel: 'High Consensus' | 'Moderate Divergence' | 'Direct Disagreement';
  findingIds: string[];
  comparisonAnalysis: string;
  varianceSummary?: string;
  dominantTrend: string;
}

export interface Contradiction {
  id: string;
  topic: string;
  severity: 'Critical' | 'Moderate' | 'Nuance / Methodology Divergence';
  claimA: {
    findingId: string;
    statement: string;
    sourceTitle: string;
    sourceDomain: string;
  };
  claimB: {
    findingId: string;
    statement: string;
    sourceTitle: string;
    sourceDomain: string;
  };
  contradictionDescription: string;
  rootCauseAnalysis: string;
  enterpriseResolution: string;
}

export interface ResearchConclusion {
  id: string;
  title: string;
  executiveSummary: string;
  confidenceLevel: 'High' | 'Medium' | 'Guarded';
  supportingFindingIds: string[];
  primarySourceIds: string[];
  operationalImpact: string;
  strategicRecommendation: string;
  timeHorizon: 'Immediate (0-6m)' | 'Medium-Term (6-18m)' | 'Strategic (18m+)';
  riskFactors: string[];
}

export interface TraceabilityLink {
  conclusionId: string;
  conclusionTitle: string;
  findingId: string;
  findingStatement: string;
  sourceId: string;
  sourceTitle: string;
  sourceUrl: string;
  exactQuote: string;
  relevanceScore: number;
}

export interface PipelineStepLog {
  step: number;
  name: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  timestamp: string;
  summary: string;
  metricsCount?: number;
}

export interface ResearchSession {
  id: string;
  topic: string;
  targetScope: string;
  createdAt: string;
  updatedAt: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  currentStep: number;
  stepLogs: PipelineStepLog[];
  questions: ResearchQuestion[];
  sources: ResearchSource[];
  findings: ResearchFinding[];
  evidenceComparisons: EvidenceComparison[];
  contradictions: Contradiction[];
  conclusions: ResearchConclusion[];
  traceabilityMatrix: TraceabilityLink[];
  dossierSummary: {
    executiveOverview: string;
    totalSources: number;
    totalFindings: number;
    contradictionsDetected: number;
    avgCredibility: number;
    primaryGrowthDriver: string;
    primaryBottleneck: string;
  };
}

export interface KnowledgeBaseStats {
  totalSessions: number;
  totalUniqueSources: number;
  totalUniqueFindings: number;
  totalContradictions: number;
  categoriesCount: Record<string, number>;
  latestSessions: Array<{ id: string; topic: string; createdAt: string; findingsCount: number }>;
}
