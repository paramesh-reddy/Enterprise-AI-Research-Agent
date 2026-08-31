# Enterprise AI Research Agent

An autonomous, multi-stage enterprise research and intelligence synthesis platform. Built with a full-stack TypeScript architecture, utilizing React, Express, Vite, and Tailwind CSS.

---

## Key Capabilities

- **10-Stage Autonomous Research Pipeline**:
  1. **Define Research Questions**: Decomposes multi-faceted strategic topics into operational, economic, technical, and regulatory sub-questions.
  2. **Search Sources**: Domain-specific literature discovery across peer-reviewed publications and industry benchmarks.
  3. **Collect Information**: Ingestion of verified excerpts, empirical metrics, author credentials, and domain reputations.
  4. **Store Sources**: Persistent multi-tier indexing into the server-side Knowledge Base repository.
  5. **Extract Findings**: Derivation of atomic, verifiable claims with quantitative impact benchmarks.
  6. **Compare Evidence**: Cross-source consensus evaluation and variance diagnostics across research cohorts.
  7. **Classify Findings**: Mapping claims into a structured 6-pillar enterprise taxonomy (*Cost & ROI*, *Operational Efficiency*, *Workforce & Talent*, *Tech Infrastructure*, *Implementation Risk*, *Regulatory & Ethics*).
  8. **Detect Contradictions**: Automated conflict detection between contradictory findings (e.g., vendor claims vs. field TCO), with root cause analysis and resolution directives.
  9. **Generate Conclusions**: Strategic executive recommendations, time-horizon implementations, and confidence scoring.
  10. **Maintain Traceability**: Bi-directional citation graph connecting conclusions to atomic claims and original publication excerpts.

- **Persistent Knowledge Base**: Reusable multi-topic repository enabling cross-investigation searches, metric comparisons, and data auditing.
- **Live Pipeline Monitor**: Real-time Server-Sent Events (SSE) telemetry and sequential stage execution logs.
- **Multi-Format Export**: One-click dossier generation in Executive Markdown (`.md`) or Full Audit JSON (`.json`).

---

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend**: Node.js, Express, Server-Sent Events (SSE), TypeScript
- **AI & Grounding Engine**: Google Gen AI SDK (`@google/genai`)
- **Build & Bundler**: Vite, ESBuild

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or bun

### Installation

1. Clone or download the repository:
   ```bash
   git clone <your-repo-url>
   cd enterprise-ai-research-agent
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   APP_URL="http://localhost:3000"
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build

To compile both client and backend bundles for production deployment:

```bash
npm run build
npm start
```

---

## License

MIT
