# MF Compass Demo Script

**Time Required:** < 5 Minutes

## Setup (1 Minute)
1.  Open Terminal 1: `cd backend && npm run dev`
2.  Open Terminal 2: `cd mf-compass && npm run dev`
3.  Open Browser: `http://localhost:3000`

## Demo Flow

### 1. Dashboard & Agentic Insights (1 Minute)
- **Show**: The main dashboard loads with a "Thinking..." indicator.
- **Explain**: "The Agentic AI is analyzing your profile against 20+ live funds."
- **Highlight**:
    - **Top Pick**: See the recommended fund and the reasoning.
    - **Risk Meter**: Shows your calculated risk profile.
    - **Alerts**: Point out any "Critical Alerts" (e.g., Fund Manager Change).

### 2. Financial Twin Simulator (1 Minute)
- **Action**: Scroll to the "Financial Twin" section.
- **Interact**: Change the "Monthly SIP" amount or "Duration".
- **Observe**: The projection graph updates instantly.
- **Explain**: "This simulates your future wealth based on the AI's recommended portfolio allocation."

### 3. Ranking Engine & Moods (1 Minute)
- **Action**: Scroll to "Top Ranked Funds".
- **Interact**: Click "Score" to sort by the AI's calculated score.
- **Highlight**: The "Mood" column (Stable, Volatile, etc.).
- **Explain**: "Our backend engine calculates these scores in real-time based on volatility, consistency, and returns."

### 4. n8n Workflow (Optional)
- **Show**: Open `n8n/workflow.json` or the diagram.
- **Explain**: "This logic is powered by an n8n workflow that orchestrates data fetching, ranking, and LLM reasoning."

## Key Takeaway
MF Compass isn't just a tracker; it's an **active agent** that monitors your portfolio and suggests actionable moves.
