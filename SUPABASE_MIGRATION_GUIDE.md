# Supabase Database Migration Guide for RankSavvy

## Overview
This guide explains the complete database redesign for the RankSavvy Birmingham Market Domination System. The new schema supports all 10 components (6 Phase 1 + 4 Phase 2).

## Key Changes from Original Schema

### Old Schema (3 tables):
- `projects` - Basic project info
- `pipeline_data` - Generic step data
- `chat_messages` - Chat history

### New Schema (17 tables + views):
- **Phase 1 Tables** (6): niches, domains, seo_analyses, design_inspirations, visual_assets, site_structures, site_pages
- **Phase 2 Tables** (4): seo_metrics, ad_campaigns, email_campaigns, email_sequences, agent_activities
- **Enhanced Niche Finder Tables** (4): niche_analyses, keyword_research, competitor_analyses, search_cache
- **Core Table** (1): projects (enhanced)
- **Views**: project_overview

## Migration Steps

### 1. Backup Existing Data (if any)
```sql
-- Export existing data first
SELECT * FROM projects;
SELECT * FROM pipeline_data;
SELECT * FROM chat_messages;
```

### 2. Run the New Schema
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy the entire contents of `supabase-setup.sql`
4. Paste and run the script

### 3. Key Features of New Schema

#### Proper Data Relationships
- All tables linked via `project_id`
- Cascading deletes for data integrity
- Foreign key constraints

#### Phase 1 Data Storage
- **Niches**: Stores AI-analyzed micro-niches with competition levels
- **Domains**: EMD availability with SEO scores
- **SEO Analyses**: Keywords, competitors, content gaps
- **Design Inspirations**: Scraped designs with AI analysis
- **Visual Assets**: Generated images with optimization status
- **Site Structures**: Complete site architecture
- **Site Pages**: Individual page content and SEO

#### Phase 2 Data Storage
- **SEO Metrics**: Real-time SEO performance tracking
- **Ad Campaigns**: Multi-platform campaign management
- **Email Campaigns**: Email marketing with metrics
- **Email Sequences**: Automated email workflows
- **Agent Activities**: Complete audit trail

#### Performance Optimizations
- Indexes on all foreign keys
- Indexes on frequently queried fields
- Composite indexes for complex queries

#### Security
- Row Level Security enabled
- Policies for access control
- Ready for multi-tenant support

### 4. Data Types Explained

#### JSONB Fields
Used for flexible, structured data:
- `analysis_data`: AI analysis results
- `keywords`: Array of keyword objects
- `color_palette`: Color schemes
- `targeting_data`: Ad targeting params
- `result_data`: Agent action results

#### Arrays
- `subcategories TEXT[]`: Multiple subcategories per niche
- `usage_context TEXT[]`: Multiple contexts for assets
- `technical_issues JSONB[]`: List of SEO issues

#### Enums (via CHECK constraints)
Ensures data integrity:
- `status`: Different for each table
- `competition_level`: low/medium/high
- `platform`: Google Ads/Facebook/etc
- `agent_type`: seo/ads/email/controller

#### Enhanced Niche Finder Tables
- **niche_analyses**: Complete analysis results with geographic data
- **keyword_research**: Detailed keyword metrics and SERP features
- **competitor_analyses**: Competitor websites and SEO data
- **search_cache**: Performance cache for API results

### 5. Enhanced Niche Finder Schema Update

To add the Enhanced Niche Finder tables, run the additional migration:
```sql
-- Run the contents of supabase-niche-finder-update.sql
-- This adds 4 new tables for real-time market analysis
```

Key features:
- Stores complete analysis results from Flask backend
- Tracks individual keywords with search metrics
- Detailed competitor analysis data
- Built-in caching for performance

### 6. Sample Queries

#### Get Project Overview
```sql
SELECT * FROM project_overview;
```

#### Get All Data for a Project
```sql
SELECT 
  p.*,
  n.name as niche_name,
  d.domain_name,
  COUNT(sp.id) as total_pages
FROM projects p
LEFT JOIN niches n ON p.id = n.project_id AND n.selected = true
LEFT JOIN domains d ON p.id = d.project_id AND d.selected = true
LEFT JOIN site_structures ss ON p.id = ss.project_id
LEFT JOIN site_pages sp ON ss.id = sp.site_structure_id
WHERE p.id = 'your-project-id'
GROUP BY p.id, n.name, d.domain_name;
```

#### Track Agent Performance
```sql
SELECT 
  agent_type,
  COUNT(*) as total_actions,
  AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) as avg_duration_seconds,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as successful_actions
FROM agent_activities
WHERE project_id = 'your-project-id'
  AND created_at > NOW() - INTERVAL '7 days'
GROUP BY agent_type;
```

### 6. Integration with Components

Each component should:
1. Read/write to its specific tables
2. Update project status as needed
3. Log activities to agent_activities
4. Store results in appropriate JSONB fields

### 7. Future Considerations

- **User Authentication**: Add user_id to projects table
- **Team Collaboration**: Add team members table
- **Billing**: Add subscription/payment tables
- **Analytics**: Add detailed metrics tables
- **Webhooks**: Add webhook events table

## Important Notes

1. **Data Migration**: The new schema drops all existing tables. Export data first if needed.
2. **UUID Extension**: Required for UUID generation
3. **Timestamps**: All tables use timezone-aware timestamps
4. **Policies**: Currently allow-all for development. Tighten for production.
5. **Indexes**: Already optimized for common queries

## Testing

After migration, test with:
```sql
-- Check all tables created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verify sample project
SELECT * FROM projects;

-- Test the view
SELECT * FROM project_overview;
```

## Troubleshooting

If errors occur:
1. Check for existing tables/constraints
2. Ensure UUID extension is enabled
3. Verify Supabase plan supports required features
4. Check RLS policies match your auth setup

## Next Steps

1. Update all API endpoints to use new tables
2. Implement Supabase client in components
3. Add proper error handling
4. Set up real-time subscriptions where needed
5. Configure proper RLS policies for production