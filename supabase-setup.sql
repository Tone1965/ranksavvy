-- RankSavvy Birmingham Market Domination Database Schema
-- Complete database structure for all Phase 1 & Phase 2 components
-- Copy and paste this into your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS agent_activities CASCADE;
DROP TABLE IF EXISTS email_sequences CASCADE;
DROP TABLE IF EXISTS email_campaigns CASCADE;
DROP TABLE IF EXISTS ad_campaigns CASCADE;
DROP TABLE IF EXISTS seo_metrics CASCADE;
DROP TABLE IF EXISTS visual_assets CASCADE;
DROP TABLE IF EXISTS site_pages CASCADE;
DROP TABLE IF EXISTS site_structures CASCADE;
DROP TABLE IF EXISTS design_inspirations CASCADE;
DROP TABLE IF EXISTS seo_analyses CASCADE;
DROP TABLE IF EXISTS domains CASCADE;
DROP TABLE IF EXISTS niches CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- Main Projects table (central hub for all data)
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
  user_id UUID, -- For future multi-user support
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phase 1: Micro Niches table
CREATE TABLE niches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategories TEXT[], -- Array of subcategories
  market_size INTEGER,
  competition_level TEXT CHECK (competition_level IN ('low', 'medium', 'high')),
  profit_potential DECIMAL(10,2),
  local_demand_score INTEGER CHECK (local_demand_score >= 0 AND local_demand_score <= 100),
  selected BOOLEAN DEFAULT false,
  analysis_data JSONB, -- Store detailed analysis from Claude
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phase 1: Domains table
CREATE TABLE domains (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  niche_id UUID REFERENCES niches(id) ON DELETE CASCADE,
  domain_name TEXT NOT NULL UNIQUE,
  tld TEXT NOT NULL,
  availability_status TEXT CHECK (availability_status IN ('available', 'taken', 'premium', 'unknown')),
  price DECIMAL(10,2),
  registrar TEXT,
  seo_score INTEGER CHECK (seo_score >= 0 AND seo_score <= 100),
  brandability_score INTEGER CHECK (brandability_score >= 0 AND brandability_score <= 100),
  selected BOOLEAN DEFAULT false,
  whois_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phase 1: SEO Analyses table
CREATE TABLE seo_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  domain_id UUID REFERENCES domains(id) ON DELETE CASCADE,
  keywords JSONB[], -- Array of keyword objects with volume, difficulty, etc.
  competitors JSONB[], -- Array of competitor analysis data
  local_search_volume INTEGER,
  ranking_difficulty TEXT CHECK (ranking_difficulty IN ('easy', 'medium', 'hard', 'very hard')),
  content_gaps JSONB,
  technical_recommendations JSONB,
  estimated_time_to_rank INTEGER, -- in days
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phase 1: Design Inspirations table
CREATE TABLE design_inspirations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  source_url TEXT,
  layout_type TEXT,
  color_palette JSONB, -- Store color codes and names
  typography JSONB, -- Font families, sizes, etc.
  ui_elements JSONB, -- Buttons, forms, navigation styles
  performance_score INTEGER,
  mobile_friendly BOOLEAN DEFAULT true,
  ai_analysis JSONB, -- Claude's design analysis
  selected BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phase 1: Visual Assets table
CREATE TABLE visual_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  asset_type TEXT CHECK (asset_type IN ('logo', 'hero', 'service', 'team', 'testimonial', 'icon', 'background')),
  file_url TEXT,
  file_name TEXT,
  alt_text TEXT,
  dimensions JSONB, -- {width, height}
  file_size INTEGER, -- in bytes
  optimization_status TEXT DEFAULT 'pending',
  usage_context TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phase 1: Site Structures table
CREATE TABLE site_structures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  site_name TEXT NOT NULL,
  tagline TEXT,
  navigation_structure JSONB, -- Complete navigation menu structure
  seo_config JSONB, -- Meta tags, schema markup, etc.
  content_strategy JSONB, -- Content planning data
  technical_setup JSONB, -- Platform, hosting, performance config
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'building', 'ready', 'deployed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phase 1: Site Pages table
CREATE TABLE site_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_structure_id UUID REFERENCES site_structures(id) ON DELETE CASCADE,
  page_title TEXT NOT NULL,
  slug TEXT NOT NULL,
  page_type TEXT CHECK (page_type IN ('landing', 'service', 'about', 'contact', 'blog', 'location')),
  content JSONB, -- Structured content blocks
  seo_meta JSONB, -- Title, description, keywords
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'ready', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(site_structure_id, slug)
);

-- Phase 2: SEO Metrics table (for SEO Agent)
CREATE TABLE seo_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  domain_authority INTEGER DEFAULT 0,
  page_speed_score INTEGER DEFAULT 0,
  mobile_score INTEGER DEFAULT 0,
  backlinks_count INTEGER DEFAULT 0,
  indexed_pages_count INTEGER DEFAULT 0,
  organic_traffic INTEGER DEFAULT 0,
  ranking_keywords_count INTEGER DEFAULT 0,
  technical_issues JSONB[],
  opportunities JSONB[],
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phase 2: Ad Campaigns table (for ADS Agent)
CREATE TABLE ad_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  campaign_name TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('Google Ads', 'Facebook', 'Instagram', 'LinkedIn')),
  campaign_type TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  budget DECIMAL(10,2),
  spent DECIMAL(10,2) DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  ctr DECIMAL(5,2) DEFAULT 0, -- Click-through rate
  cpc DECIMAL(10,2) DEFAULT 0, -- Cost per click
  roi DECIMAL(10,2) DEFAULT 0, -- Return on investment
  targeting_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phase 2: Email Campaigns table (for Email Marketing Agent)
CREATE TABLE email_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  campaign_name TEXT NOT NULL,
  campaign_type TEXT CHECK (campaign_type IN ('welcome', 'promotional', 'newsletter', 'follow-up', 'abandoned')),
  subject_line TEXT NOT NULL,
  preview_text TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'active')),
  recipients_count INTEGER DEFAULT 0,
  sent_date TIMESTAMP WITH TIME ZONE,
  opens INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  open_rate DECIMAL(5,2) DEFAULT 0,
  click_rate DECIMAL(5,2) DEFAULT 0,
  content JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phase 2: Email Sequences table
CREATE TABLE email_sequences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  sequence_name TEXT NOT NULL,
  email_count INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT false,
  subscribers_count INTEGER DEFAULT 0,
  trigger_event TEXT,
  delay_between_emails INTEGER, -- in hours
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Phase 2: Agent Activities table (for AI Agent Controller)
CREATE TABLE agent_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  agent_type TEXT CHECK (agent_type IN ('seo', 'ads', 'email', 'controller')),
  action_type TEXT NOT NULL,
  action_description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  result_data JSONB,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_niches_project_id ON niches(project_id);
CREATE INDEX idx_domains_project_id ON domains(project_id);
CREATE INDEX idx_domains_availability ON domains(availability_status);
CREATE INDEX idx_seo_metrics_project_id ON seo_metrics(project_id);
CREATE INDEX idx_seo_metrics_timestamp ON seo_metrics(timestamp);
CREATE INDEX idx_ad_campaigns_project_id ON ad_campaigns(project_id);
CREATE INDEX idx_ad_campaigns_status ON ad_campaigns(status);
CREATE INDEX idx_email_campaigns_project_id ON email_campaigns(project_id);
CREATE INDEX idx_agent_activities_project_id ON agent_activities(project_id);
CREATE INDEX idx_agent_activities_agent_type ON agent_activities(agent_type);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE niches ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_inspirations ENABLE ROW LEVEL SECURITY;
ALTER TABLE visual_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_activities ENABLE ROW LEVEL SECURITY;

-- Create policies (for development - adjust for production)
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all operations on niches" ON niches FOR ALL USING (true);
CREATE POLICY "Allow all operations on domains" ON domains FOR ALL USING (true);
CREATE POLICY "Allow all operations on seo_analyses" ON seo_analyses FOR ALL USING (true);
CREATE POLICY "Allow all operations on design_inspirations" ON design_inspirations FOR ALL USING (true);
CREATE POLICY "Allow all operations on visual_assets" ON visual_assets FOR ALL USING (true);
CREATE POLICY "Allow all operations on site_structures" ON site_structures FOR ALL USING (true);
CREATE POLICY "Allow all operations on site_pages" ON site_pages FOR ALL USING (true);
CREATE POLICY "Allow all operations on seo_metrics" ON seo_metrics FOR ALL USING (true);
CREATE POLICY "Allow all operations on ad_campaigns" ON ad_campaigns FOR ALL USING (true);
CREATE POLICY "Allow all operations on email_campaigns" ON email_campaigns FOR ALL USING (true);
CREATE POLICY "Allow all operations on email_sequences" ON email_sequences FOR ALL USING (true);
CREATE POLICY "Allow all operations on agent_activities" ON agent_activities FOR ALL USING (true);

-- Create update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ad_campaigns_updated_at BEFORE UPDATE ON ad_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample project for testing
INSERT INTO projects (name, description, status) 
VALUES ('Birmingham HVAC Domination', 'Demo project for HVAC business in Birmingham, AL', 'active');

-- Helpful views for the application
CREATE VIEW project_overview AS
SELECT 
    p.id,
    p.name,
    p.status,
    p.created_at,
    COUNT(DISTINCT n.id) as niche_count,
    COUNT(DISTINCT d.id) as domain_count,
    COUNT(DISTINCT sp.id) as page_count,
    COUNT(DISTINCT ac.id) as ad_campaign_count,
    COUNT(DISTINCT ec.id) as email_campaign_count
FROM projects p
LEFT JOIN niches n ON p.id = n.project_id
LEFT JOIN domains d ON p.id = d.project_id
LEFT JOIN site_structures ss ON p.id = ss.project_id
LEFT JOIN site_pages sp ON ss.id = sp.site_structure_id
LEFT JOIN ad_campaigns ac ON p.id = ac.project_id
LEFT JOIN email_campaigns ec ON p.id = ec.project_id
GROUP BY p.id;

-- Grant permissions for the views
GRANT SELECT ON project_overview TO anon, authenticated;

COMMENT ON TABLE projects IS 'Main projects table - central hub for all RankSavvy data';
COMMENT ON TABLE niches IS 'Phase 1: Stores micro-niche selections for Birmingham businesses';
COMMENT ON TABLE domains IS 'Phase 1: EMD (Exact Match Domain) findings and availability';
COMMENT ON TABLE seo_analyses IS 'Phase 1: Comprehensive SEO and competitor analysis data';
COMMENT ON TABLE design_inspirations IS 'Phase 1: AI-scraped design inspiration data';
COMMENT ON TABLE visual_assets IS 'Phase 1: Generated logos, images, and visual content';
COMMENT ON TABLE site_structures IS 'Phase 1: Complete authority site structure and configuration';
COMMENT ON TABLE site_pages IS 'Phase 1: Individual pages within the authority site';
COMMENT ON TABLE seo_metrics IS 'Phase 2: SEO Agent performance tracking';
COMMENT ON TABLE ad_campaigns IS 'Phase 2: ADS Agent campaign management';
COMMENT ON TABLE email_campaigns IS 'Phase 2: Email Marketing Agent campaigns';
COMMENT ON TABLE agent_activities IS 'Phase 2: AI Agent Controller activity logs';