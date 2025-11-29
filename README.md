# MF Compass - Agentic AI Financial Assistant

MF Compass is a full-stack React application powered by Agentic AI and n8n automation to provide personalized mutual fund recommendations, financial twin simulation, and intelligent alerts.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm

### 1. Start the Backend Simulation
The backend runs the Ranking Engine, Mood Engine, and Mock Agentic Service.

```bash
cd backend
npm install
npm run dev
```
*Server runs on http://localhost:4000*

### 2. Start the Frontend
The frontend provides the interactive dashboard and chat interface.

```bash
cd mf-compass
npm install
npm run dev
```
*App runs on http://localhost:3000*

## 🏗️ Project Structure

- **/mf-compass**: Next.js Frontend (React + TypeScript + Tailwind + Zustand)
- **/backend**: Node.js Express Backend (Simulation Engine)
- **/data**: Shared JSON datasets (Funds, Portfolio, Market Data)
- **/n8n**: Automation workflows and prompts

## 🤖 Agentic Features

1.  **Ranking Engine**: Scores funds based on Rolling Returns, Consistency, Volatility, and Expense Ratio.
2.  **Mood Engine**: Classifies funds as Stable, Volatile, Aggressive, etc.
3.  **Financial Twin**: Simulates future portfolio value based on SIP and goal duration.
4.  **Smart Alerts**: Detects Fund Manager changes, Sector mismatches, and Risk profile conflicts.

## 🔄 n8n Automation
The logic for recommendations is designed as an n8n workflow.
- Import `n8n/workflow.json` into your n8n instance.
- The backend `src/services/automation.ts` simulates this workflow for the demo.

## 📝 License
MIT
