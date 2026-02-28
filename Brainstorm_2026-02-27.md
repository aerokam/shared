# Brainstorming Session Summary — 2026-02-27

## Core Problem Being Solved

Three systems currently require **manual synchronization**:
1. **Google Sheets + Apps Script** — where the actual logic and data lives
2. **Claude Project knowledge files** — manually updated MD files to give Claude context
3. **GitHub** — code versioning, partially in sync

Every change potentially requires updating all three. This is unsustainable and is the primary friction in the current workflow.

## Core Vision

Replace this triple-maintenance burden with a **single local-first, GitHub-backed** architecture. Claude Code reads local files directly — no separate Claude Project knowledge files to maintain. One source of truth eliminates the sync problem entirely.

---

## Architecture Decisions

### Data & Storage
- **Sensitive data** (tax returns, account data, SSNs, brokerage holdings): stays on Google Drive
- **Market/public data** (Treasury yields, TIPS quotes, ladder state): local files (CSV/JSON), synced to GitHub
- **Code, scripts, knowledge files**: local + GitHub

### Compute & Interaction
- Replace spreadsheet formulas and Apps Script with Node scripts + Claude Code
- Claude Code reads local data files, performs analysis, answers questions in natural language
- No need to open a spreadsheet to get an answer

### Sharing / Output
- Charts and tables rendered as **HTML/SVG** on GitHub Pages
- Each chart has a stable URL — shareable as both inline image and clickable link (FRED-style)
- Replaces current screenshot → image host → BBcode workflow with a cleaner single-URL approach

### Version Control
- Git replaces manual file management
- Daily data snapshots auto-committed — provides historical audit trail
- VS Code source control panel keeps commit/push to ~3 clicks; can be further automated
- Always working on `main` branch; occasional feature branches as needed

---

## Knowledge Hierarchy

```
/knowledge
  /investing
    /treasuries
      /tips               ← notes + bonds combined (5, 10, 30yr); mechanically identical
      /nominal
        /bills            ← discount securities, no coupon, <1yr
        /notes-and-bonds  ← coupon, semiannual, 2-30yr; mechanically identical
      /shared             ← auction mechanics, CUSIP structure, common to both
    /equities
  /tax                    ← peer to /investing; heavy dependencies on investing
  /personal-finance
    /estate-planning
      /trusts
      /tod-pod            ← transfer/payable on death
      /beneficiaries
      /inheritance
    /account-management
      /institutions       ← Fidelity, Schwab comparisons and recommendations
      /account-types      ← brokerage, banking, IRA, etc.
  /fundamentals           ← atomic concepts, no dependencies; referenced by any domain
    /tips-mechanics       ← referenced by: /tips, /tax
    /treasury-pricing     ← referenced by: /treasuries, /account-management
    /bond-math            ← referenced by: /treasuries, /equities
    /tax-rules            ← referenced by: /tax, /tips, /personal-finance

/data                     ← live/daily data, separate from knowledge
  /yields
  /prices
```

**Structure note:**
The folder hierarchy is storage organization only. The actual knowledge relationships form a **directed acyclic graph (DAG)** — upper nodes reference any lower/fundamental nodes regardless of position in the tree. Cross-references live in the MD files themselves. A `KNOWLEDGE_MAP.md` (Mermaid diagram) in the repo root will visualize the full graph.

First task in Claude Code: scan existing project MD files, infer dependency graph, generate initial `KNOWLEDGE_MAP.md`.

**Terminology:**
- Technically TIPS ⊂ Treasuries, but colloquially treated as separate
- "Treasuries" in broker/Bogleheads context = nominal Treasuries
- Use "nominal" or "nominal Treasuries" when precision needed
- Data files co-located within each domain folder, not top-level

---

## Key Projects Identified

### 1. TIPS Ladder Rebalancing Web App ← **First implementation target**
- **Current state**: Working in Google Sheets + Apps Script
- **Inputs**: A few parameters + holdings CSV (CUSIP, quantity)
- **Algorithm**: Duration-matching rebalancing logic, bracket bonds, synthetic gap bonds (2037–2039)
- **Reference data**: TIPS CUSIP details from CSVs (sourced from broker downloads + public APIs)
- **Migration target**: Local Node app with simple web UI, hosted on GitHub Pages
- **Goal**: Shareable with Bogleheads community (fills gap that tipslader.com doesn't cover)

### 2. Tax Prep Agent ← **Longer-term**
- **Purpose**: Encapsulate Kevin's tax knowledge so family can benefit without needing the expertise
- **Scope**: Broader than treasury taxation — full personal/family tax return preparation
- **Dependencies**: References (but does not absorb) the existing *Treasury Taxation* project
- **Knowledge capture method**: Narrate to Claude Code while working through HR Block screens → auto-distilled into MD files → auto-committed
- **Cross-repo**: Treasury Taxation repo included as a **git submodule**

### 3. Daily Yield Monitoring
- Replace morning spreadsheet review with local JSON files updated by existing Node scraping scripts
- Ask Claude Code questions against the data rather than reading cells
- Public/market data only — no sensitive account info

---

## Long-Term Vision

Build a **personal knowledge base** (hierarchical MD files) that encapsulates Kevin's expertise in:
- TIPS ladder construction and rebalancing
- Treasury taxation (OID, premium amortization, TIPS inflation adjustments)
- Family financial management and tax preparation

Goal: an agent that can answer questions and perform tasks the way Kevin would — useful both for daily workflow and eventually for family members who lack the expertise.

---

## Immediate Next Steps

1. Open TIPS Ladder project in VS Code/Claude Code
2. Get existing Apps Script code and reference CSVs into local repo
3. Scope the web app migration in detail
4. Set up auto-commit workflow for data files
5. During tax season: narrate → log → commit knowledge as you work through HR Block screens

---

## Notes
- GitHub free tier is sufficient for all code/data/knowledge files
- HTML/SVG charts are kilobytes vs. megabytes for images — storage essentially free
- Single source of truth: local files synced to GitHub (no duplication with Claude Projects)
- This chat URL: https://claude.ai/chat/[current session — save manually]
