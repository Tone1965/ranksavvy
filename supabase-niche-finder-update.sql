-- Enhanced Niche Finder Database Schema Update
-- Additional tables for real-time market analysis data

-- Niche Analysis Results table
CREATE TABLE IF NOT EXISTS niche_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  location TEXT NOT NULL,
  radius INTEGER, -- Search radius in miles
  analysis_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Geographic data
  primary_location TEXT,
  coordinates JSONB, -- {lat, lon}
  nearby_cities JSONB[], -- Array of nearby cities
  service_area JSONB, -- Bounds and coverage
  
  -- Analysis results
  keywords_data JSONB, -- All discovered keywords with scores
  competitors_data JSONB, -- Local and organic competitors
  opportunities JSONB, -- Keyword gaps, low competition, etc.
  recommendations JSONB, -- AI-generated recommendations
  surprise_opportunities JSONB, -- Hidden gems found
  
  -- Metadata
  total_keywords_found INTEGER,
  emergency_keywords_count INTEGER,
  competitors_analyzed INTEGER,
  analysis_duration INTEGER, -- in seconds
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Keyword Research table (detailed keyword storage)
CREATE TABLE IF NOT EXISTS keyword_research (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID REFERENCES niche_analyses(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  keyword_type TEXT CHECK (keyword_type IN ('primary', 'emergency', 'commercial', 'informational', 'long-tail', 'ai-suggested')),
  
  -- Search metrics
  search_volume_score INTEGER CHECK (search_volume_score >= 0 AND search_volume_score <= 10),
  competition_level TEXT CHECK (competition_level IN ('low', 'medium', 'high', 'unknown')),
  commercial_intent BOOLEAN DEFAULT false,
  local_intent BOOLEAN DEFAULT false,
  
  -- SERP features
  has_ads BOOLEAN DEFAULT false,
  ad_count INTEGER DEFAULT 0,
  has_local_pack BOOLEAN DEFAULT false,
  has_featured_snippet BOOLEAN DEFAULT false,
  has_people_also_ask BOOLEAN DEFAULT false,
  
  -- User modifications
  user_edited BOOLEAN DEFAULT false,
  user_removed BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique keywords per analysis
  UNIQUE(analysis_id, keyword)
);

-- Competitor Analysis table
CREATE TABLE IF NOT EXISTS competitor_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID REFERENCES niche_analyses(id) ON DELETE CASCADE,
  competitor_name TEXT NOT NULL,
  competitor_type TEXT CHECK (competitor_type IN ('local', 'organic', 'national')),
  
  -- Basic info
  website_url TEXT,
  position INTEGER, -- Ranking position
  
  -- Local business data (from Google Maps)
  rating DECIMAL(2,1),
  reviews_count INTEGER,
  business_category TEXT,
  
  -- SEO data (from website scraping)
  h1_tags TEXT[],
  h2_tags TEXT[],
  meta_description TEXT,
  schema_types TEXT[],
  keywords_found TEXT[],
  
  -- Analysis
  strengths TEXT[],
  weaknesses TEXT[],
  opportunities TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Search Queries Cache table (for performance)
CREATE TABLE IF NOT EXISTS search_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cache_key TEXT UNIQUE NOT NULL,
  query_type TEXT CHECK (query_type IN ('serp', 'autocomplete', 'maps', 'competitor')),
  query_params JSONB,
  results JSONB,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_niche_analyses_project ON niche_analyses(project_id);
CREATE INDEX idx_niche_analyses_location ON niche_analyses(location);
CREATE INDEX idx_keyword_research_analysis ON keyword_research(analysis_id);
CREATE INDEX idx_keyword_research_type ON keyword_research(keyword_type);
CREATE INDEX idx_competitor_analyses_analysis ON competitor_analyses(analysis_id);
CREATE INDEX idx_search_cache_key ON search_cache(cache_key);
CREATE INDEX idx_search_cache_expires ON search_cache(expires_at);

-- Enable Row Level Security
ALTER TABLE niche_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE keyword_research ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_cache ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (for authenticated users)
CREATE POLICY "Users can view their own niche analyses" ON niche_analyses
  FOR ALL USING (true); -- Modify based on your auth setup

CREATE POLICY "Users can view their own keyword research" ON keyword_research
  FOR ALL USING (true); -- Modify based on your auth setup

CREATE POLICY "Users can view their own competitor analyses" ON competitor_analyses
  FOR ALL USING (true); -- Modify based on your auth setup

CREATE POLICY "Public read access to cache" ON search_cache
  FOR SELECT USING (true);

-- Function to clean expired cache entries
CREATE OR REPLACE FUNCTION clean_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM search_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update project's updated_at when analyses are added
CREATE OR REPLACE FUNCTION update_project_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects 
  SET updated_at = NOW() 
  WHERE id = NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_project_on_analysis
  AFTER INSERT ON niche_analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_project_timestamp();