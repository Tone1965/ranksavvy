# RankSavvy - Birmingham Market Domination System

AI-powered local business domination platform that creates authority websites to help Birmingham businesses rank #1 on Google.

## Overview

RankSavvy is a comprehensive AI-driven system designed to help local businesses in Birmingham, Alabama dominate their market through intelligent SEO, automated marketing, and authority site creation.

## Features

### Phase 1: Authority Site Builder (6 Components)
- **MicroNicheBuilder**: AI-powered niche selection for Birmingham businesses
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

- **Frontend**: Next.js 14.2.4 with TypeScript
- **Styling**: Tailwind CSS (Dark theme)
- **AI Integration**: Claude API
- **Database**: Supabase
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Key Features

- 🤖 100% AI-powered using Claude
- 🎯 Birmingham, AL local market focus
- 🚀 Auto mode for hands-free operation
- 📊 Real-time metrics and monitoring
- 🎨 Dark theme with Axiom-style dashboard
- 🔄 Comprehensive project data persistence
- 📱 Responsive design
- 🔒 Security best practices

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/Tone1965/ranksavvy.git
cd ranksavvy
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables:
- `ANTHROPIC_API_KEY`: Your Claude API key
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) to start dominating Birmingham markets!

## Project Structure

```
ranksavvy/
├── src/
│   ├── app/
│   │   ├── api/          # API routes for Claude integration
│   │   ├── globals.css   # Global styles with dark theme
│   │   └── page.tsx      # Main dashboard
│   └── components/
│       ├── NewDashboard.tsx    # Main navigation dashboard
│       ├── phase1/             # Authority site builder components
│       │   ├── MicroNicheBuilder.tsx
│       │   ├── EMDFinder.tsx
│       │   ├── UnifiedSEOTool.tsx
│       │   ├── DesignScraper.tsx
│       │   ├── VisualContentBuilder.tsx
│       │   └── AuthoritySiteAssembly.tsx
│       └── phase2/             # Marketing agent components
│           ├── SEOAgent.tsx
│           ├── ADSAgent.tsx
│           ├── EmailMarketingAgent.tsx
│           └── AIAgentController.tsx
```

## Usage Flow

1. **Phase 1**: Build your authority site
   - Select a micro-niche for your Birmingham business
   - Find the perfect domain name
   - Research keywords and analyze competitors
   - Generate design inspiration
   - Create visual assets
   - Assemble the complete site

2. **Phase 2**: Activate marketing agents
   - Launch SEO optimization
   - Start advertising campaigns
   - Begin email marketing
   - Monitor everything with AI Controller

## License

This project is proprietary software for Birmingham market domination.

## Support

For support, please contact the RankSavvy team.

---

Built with ❤️ for Birmingham businesses