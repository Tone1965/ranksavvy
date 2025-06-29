from typing import Dict, Any, List
import asyncio
from agents.scraper_agent import ScraperAgent
from utils.claude_client import ClaudeClient
from urllib.parse import urlparse

class CompetitorAgent:
    """
    Analyzes competitors to find gaps and opportunities
    """
    
    def __init__(self):
        self.scraper = ScraperAgent()
        self.claude = ClaudeClient()
        
    async def analyze_competitor(self, competitor: Dict[str, Any]) -> Dict[str, Any]:
        """
        Comprehensive competitor analysis
        """
        print(f"[Competitor Agent] Analyzing: {competitor.get('name', competitor.get('url'))}")
        
        analysis = {
            'name': competitor.get('name', ''),
            'url': competitor.get('url', ''),
            'type': 'local' if 'rating' in competitor else 'organic',
            'seo_data': {},
            'keywords': [],
            'content_strategy': {},
            'strengths': [],
            'weaknesses': [],
            'opportunities': []
        }
        
        # For local competitors (from Google Maps)
        if analysis['type'] == 'local':
            analysis['local_data'] = {
                'rating': competitor.get('rating'),
                'reviews_count': competitor.get('reviews_count'),
                'category': competitor.get('category')
            }
            
            # If they have a website, analyze it
            if competitor.get('website'):
                analysis['url'] = competitor['website']
        
        # Scrape competitor website if URL available
        if analysis['url']:
            try:
                site_data = await self.scraper.scrape_competitor_site(analysis['url'])
                analysis['seo_data'] = site_data
                
                # Use Claude to analyze the content
                claude_analysis = await self.claude.analyze_competitor_content(site_data)
                
                analysis['keywords'] = claude_analysis.get('keywords', [])
                analysis['content_strategy'] = {
                    'service_focus': claude_analysis.get('service_focus', []),
                    'value_propositions': claude_analysis.get('value_propositions', []),
                    'content_gaps': claude_analysis.get('content_gaps', [])
                }
                
                # Identify strengths and weaknesses
                analysis['strengths'] = self._identify_strengths(site_data, claude_analysis)
                analysis['weaknesses'] = self._identify_weaknesses(site_data, claude_analysis)
                
            except Exception as e:
                print(f"[Competitor Agent] Error analyzing {analysis['url']}: {str(e)}")
                analysis['error'] = str(e)
        
        return analysis
    
    async def analyze_competitor_keywords(self, competitors: List[Dict[str, Any]], location: str) -> Dict[str, Any]:
        """
        Analyze keywords across all competitors
        """
        keyword_analysis = {
            'common_keywords': {},
            'unique_keywords': {},
            'keyword_gaps': [],
            'trending_topics': []
        }
        
        # Collect all keywords from competitors
        all_keywords = []
        competitor_keywords_map = {}
        
        for comp in competitors:
            comp_keywords = comp.get('keywords', [])
            competitor_keywords_map[comp['name']] = comp_keywords
            all_keywords.extend(comp_keywords)
        
        # Find common keywords (used by multiple competitors)
        keyword_counts = {}
        for kw in all_keywords:
            keyword_counts[kw] = keyword_counts.get(kw, 0) + 1
        
        # Categorize keywords
        for keyword, count in keyword_counts.items():
            if count >= 3:  # Used by 3+ competitors
                keyword_analysis['common_keywords'][keyword] = {
                    'count': count,
                    'competition': 'high'
                }
            elif count == 1:  # Unique to one competitor
                keyword_analysis['unique_keywords'][keyword] = {
                    'count': count,
                    'competition': 'low'
                }
        
        return keyword_analysis
    
    async def find_content_gaps(self, competitors: List[Dict[str, Any]], our_keywords: List[str]) -> List[Dict[str, Any]]:
        """
        Find content gaps across competitors
        """
        gaps = []
        
        # Collect all topics covered by competitors
        all_topics = set()
        all_questions = set()
        
        for comp in competitors:
            # Add H2 topics
            h2_tags = comp.get('seo_data', {}).get('h2_tags', [])
            all_topics.update(h2_tags)
            
            # Add content gaps identified by Claude
            content_gaps = comp.get('content_strategy', {}).get('content_gaps', [])
            gaps.extend([{'gap': gap, 'type': 'missing_content'} for gap in content_gaps])
        
        # Find topics no one is covering well
        common_gaps = [
            'emergency service availability',
            'pricing transparency',
            'service guarantees',
            'local expertise',
            'response time commitments',
            'certification and licensing',
            'insurance and bonding',
            'customer testimonials',
            'before/after galleries',
            'service area maps'
        ]
        
        for gap in common_gaps:
            if not any(gap.lower() in topic.lower() for topic in all_topics):
                gaps.append({
                    'gap': gap,
                    'type': 'industry_standard',
                    'priority': 'high'
                })
        
        return gaps
    
    def _identify_strengths(self, site_data: Dict[str, Any], claude_analysis: Dict[str, Any]) -> List[str]:
        """Identify competitor strengths"""
        strengths = []
        
        # SEO strengths
        if len(site_data.get('h1_tags', [])) >= 1:
            strengths.append('Clear H1 structure')
        
        if len(site_data.get('h2_tags', [])) >= 5:
            strengths.append('Comprehensive content structure')
            
        if site_data.get('meta_description'):
            strengths.append('Optimized meta descriptions')
            
        if site_data.get('schema_types'):
            strengths.append(f"Schema markup: {', '.join(site_data['schema_types'])}")
            
        # Content strengths
        if len(claude_analysis.get('value_propositions', [])) >= 3:
            strengths.append('Clear value propositions')
            
        if len(claude_analysis.get('service_focus', [])) >= 5:
            strengths.append('Comprehensive service coverage')
        
        return strengths
    
    def _identify_weaknesses(self, site_data: Dict[str, Any], claude_analysis: Dict[str, Any]) -> List[str]:
        """Identify competitor weaknesses"""
        weaknesses = []
        
        # SEO weaknesses
        if not site_data.get('h1_tags'):
            weaknesses.append('Missing H1 tags')
            
        if len(site_data.get('h2_tags', [])) < 3:
            weaknesses.append('Limited content depth')
            
        if not site_data.get('meta_description'):
            weaknesses.append('No meta description')
            
        if not site_data.get('schema_types'):
            weaknesses.append('No schema markup')
            
        # Content weaknesses
        if not claude_analysis.get('value_propositions'):
            weaknesses.append('Unclear value proposition')
            
        if len(claude_analysis.get('content_gaps', [])) > 3:
            weaknesses.append('Multiple content gaps')
            
        # Image optimization
        images_with_alt = [img for img in site_data.get('images_alt_text', []) if img]
        if len(images_with_alt) < 5:
            weaknesses.append('Poor image optimization')
        
        return weaknesses