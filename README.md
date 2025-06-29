# RankSavvy - Birmingham Market Domination System

AI-powered local business domination platform that creates authority websites to help Birmingham businesses rank #1 on Google.

## 🚀 Major Update: Enhanced Niche Finder with Real Data

We've completely rebuilt the Niche Finder with a Flask backend and BrightData integration for **100% real search data** - no more mock data!

## Overview

RankSavvy is a comprehensive AI-driven system designed to help local businesses in Birmingham, Alabama dominate their market through intelligent SEO, automated marketing, and authority site creation.

## Features

### Phase 1: Authority Site Builder (6 Components)
- **Enhanced Niche Finder** (formerly MicroNicheBuilder): 
  - Real-time Google search scraping with BrightData
  - Multi-agent architecture for deep market analysis
  - Editable keyword dashboard with CSV export
  - "Surprise me" mode for hidden opportunities
- **EMDFinder**: Exact match domain finder with availability checking
- **UnifiedSEOTool**: Comprehensive keyword research and competitor analysis
- **DesignScraper**: AI design inspiration from top-performing sites
- **VisualContentBuilder**: Automated visual asset generation
- **AuthoritySiteAssembly**: Complete site structure and content assembly

### Phase 2: Automated Marketing Agents (4 Components)
- **SEOAgent**: Automated SEO optimization and monitoring
- **ADSAgent**: Multi-platform advertising campaign management
- **EmailMarketingAgent**: Email campaign automation and sequences
- **AIAgentController**: Master control system orchestrating all agents

## Technology Stack

### Frontend
- **Framework**: Next.js 14.2.4 with TypeScript
- **Styling**: Tailwind CSS (Dark theme)
- **Icons**: Lucide React
- **State Management**: React hooks with persistent project data

### Backend (NEW!)
- **Flask Backend**: Python with multi-agent architecture
- **Web Scraping**: BrightData proxy + Selenium
- **Caching**: Redis or file-based cache
- **Real-time Updates**: Server-Sent Events (SSE)

### AI & Data
- **AI Integration**: Claude API (Anthropic)
- **Database**: Supabase (PostgreSQL)
- **Search Data**: BrightData for Google SERP, Maps, Autocomplete

## Key Features

- 🤖 100% AI-powered using Claude
- 🎯 Birmingham, AL local market focus
- 📊 REAL search data (no mock data!)
- 🔍 Deep competitor analysis
- 📈 Search volume estimation
- 🚀 Auto mode for hands-free operation
- 💾 Editable results with CSV export
- 🎨 Dark theme with Axiom-style dashboard
- 🔄 Real-time progress updates
- 📱 Responsive design
- 🔒 Security best practices

## Getting Started

### 1. Clone the repository:
```bash
git clone https://github.com/Tone1965/ranksavvy.git
cd ranksavvy
```

### 2. Set up the Next.js frontend:
```bash
npm install
```

### 3. Set up the Flask backend:
```bash
cd flask-backend
pip install -r requirements.txt
```

### 4. Configure environment variables:

Create `.env.local` in the root directory:
```env
# Claude API
ANTHROPIC_API_KEY=your-claude-api-key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Flask Backend
NEXT_PUBLIC_FLASK_URL=http://localhost:5000
```

Update `flask-backend/.env`:
```env
# Add your Claude API key here
ANTHROPIC_API_KEY=your-claude-api-key

# BrightData credentials (already configured)
BRIGHTDATA_HOST=brd.superproxy.io
BRIGHTDATA_PORT=9222
BRIGHTDATA_USERNAME=brd-customer-hl_05cef420-zone-scraping_browser1
BRIGHTDATA_PASSWORD=tb6tot21cg0a
```

### 5. Start the services:

Terminal 1 - Flask Backend:
```bash
cd flask-backend
python app.py
```

Terminal 2 - Next.js Frontend:
```bash
npm run dev
```

### 6. Open [http://localhost:3000](http://localhost:3000) to start dominating Birmingham markets!

## Enhanced Niche Finder Usage

1. Navigate to "Enhanced Niche Finder" in the sidebar
2. Enter a search query like "HVAC repair Pelham Alabama"
3. Optional: Set custom radius or enable "Surprise me" mode
4. Click "Analyze Market"
5. Review real-time results:
   - Keywords with search volume indicators
   - Local and organic competitors
   - Emergency/high-intent keywords
   - Market opportunities
6. Edit keywords before proceeding
7. Export results to CSV

## Project Structure

```
ranksavvy/
├── src/
│   ├── app/
│   │   ├── api/          # API routes for Claude integration
│   │   └── page.tsx      # Main dashboard
│   └── components/
│       ├── NewDashboard.tsx        # Main navigation
│       ├── ChatInterface.tsx       # Claude chat interface
│       ├── phase1/                 # Authority site builder
│       │   ├── EnhancedNicheFinder.tsx  # NEW! Real data scraping
│       │   ├── EMDFinder.tsx
│       │   ├── UnifiedSEOTool.tsx
│       │   └── ...
│       └── phase2/                 # Marketing agents
├── flask-backend/                  # NEW! Python backend
│   ├── agents/                     # Multi-agent system
│   │   ├── lead_agent.py          # Orchestrator
│   │   ├── scraper_agent.py       # BrightData integration
│   │   ├── keyword_agent.py       # Keyword discovery
│   │   ├── competitor_agent.py    # Competitor analysis
│   │   └── geo_agent.py           # Geographic clustering
│   ├── api/                        # Flask routes
│   ├── utils/                      # Utilities
│   └── app.py                      # Flask app
```

## API Endpoints

### Flask Backend Endpoints
- `POST /api/niche/analyze` - Full niche analysis
- `POST /api/niche/analyze/stream` - Real-time progress (SSE)
- `POST /api/niche/keywords/autocomplete` - Google autocomplete
- `POST /api/niche/competitors/local` - Local competitors
- `POST /api/niche/export/csv` - Export results

## Database Schema

See [SUPABASE_MIGRATION_GUIDE.md](./SUPABASE_MIGRATION_GUIDE.md) for complete database setup with 13 tables supporting all components.

## License

This project is proprietary software for Birmingham market domination.

## Support

For support, please contact the RankSavvy team.

---

Built with ❤️ for Birmingham businesses using real data, not mock data!