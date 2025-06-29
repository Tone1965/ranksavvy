from typing import Dict, Any, List
import asyncio
from agents.scraper_agent import ScraperAgent
from agents.keyword_agent import KeywordAgent
from agents.competitor_agent import CompetitorAgent
from agents.geo_agent import GeoAgent
from utils.cache_manager import CacheManager
import json

class LeadAgent:
    """
    Orchestrates the entire niche finding process
    Coordinates other agents and manages the workflow
    """
    
    def __init__(self):
        self.scraper_agent = ScraperAgent()
        self.keyword_agent = KeywordAgent()
        self.competitor_agent = CompetitorAgent()
        self.geo_agent = GeoAgent()
        self.cache = CacheManager()
        
    async def analyze_niche(self, query: str, location: str, options: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Main orchestration method for niche analysis
        """
        # Default options
        options = options or {}
        radius = options.get('radius', None)
        include_surprise = options.get('surprise_me', False)
        
        # Check cache first
        cache_key = f"niche_analysis:{query}:{location}:{radius}"
        cached_result = self.cache.get(cache_key)
        if cached_result:
            return json.loads(cached_result)
        
        # Initialize results
        results = {
            'query': query,
            'location': location,
            'timestamp': asyncio.get_event_loop().time(),
            'geographic_data': {},
            'keywords': {},
            'competitors': {},
            'opportunities': {},
            'recommendations': {}
        }
        
        try:
            # Step 1: Geographic Analysis
            print(f"[Lead Agent] Starting geographic analysis for {location}")
            geo_data = await self.geo_agent.analyze_location(location, radius)
            results['geographic_data'] = geo_data
            
            # Step 2: Initial keyword discovery
            print(f"[Lead Agent] Discovering keywords for {query} in {location}")
            keywords = await self.keyword_agent.discover_keywords(query, location, geo_data)
            results['keywords'] = keywords
            
            # Step 3: Competitor analysis (parallel for efficiency)
            print(f"[Lead Agent] Analyzing competitors")
            competitor_tasks = []
            
            # Get local competitors from Google Maps
            local_competitors = await self.scraper_agent.get_local_competitors(query, location)
            
            # Get organic competitors from SERP
            serp_data = await self.scraper_agent.scrape_serp(query, location)
            organic_competitors = serp_data.get('organic_results', [])[:5]
            
            # Analyze each competitor
            for competitor in local_competitors[:5]:
                task = self.competitor_agent.analyze_competitor(competitor)
                competitor_tasks.append(task)
                
            for competitor in organic_competitors:
                if competitor.get('url'):
                    task = self.competitor_agent.analyze_competitor({'url': competitor['url'], 'name': competitor['title']})
                    competitor_tasks.append(task)
            
            competitor_results = await asyncio.gather(*competitor_tasks, return_exceptions=True)
            
            # Filter out exceptions
            valid_competitors = [r for r in competitor_results if not isinstance(r, Exception)]
            results['competitors'] = {
                'local': local_competitors,
                'organic': organic_competitors,
                'detailed_analysis': valid_competitors
            }
            
            # Step 4: Find opportunities
            print(f"[Lead Agent] Identifying opportunities")
            opportunities = await self._identify_opportunities(results)
            results['opportunities'] = opportunities
            
            # Step 5: Generate recommendations
            print(f"[Lead Agent] Generating recommendations")
            recommendations = await self._generate_recommendations(results)
            results['recommendations'] = recommendations
            
            # Step 6: Surprise me mode (optional)
            if include_surprise:
                print(f"[Lead Agent] Finding surprise opportunities")
                surprise_data = await self._find_surprise_opportunities(geo_data, query)
                results['surprise_opportunities'] = surprise_data
            
            # Cache the results
            self.cache.set(cache_key, json.dumps(results), ttl=86400)  # 24 hour cache
            
            return results
            
        except Exception as e:
            print(f"[Lead Agent] Error during analysis: {str(e)}")
            results['error'] = str(e)
            return results
    
    async def _identify_opportunities(self, analysis_data: Dict[str, Any]) -> Dict[str, Any]:
        """Identify gaps and opportunities from the analysis"""
        opportunities = {
            'keyword_gaps': [],
            'content_gaps': [],
            'service_gaps': [],
            'emergency_keywords': [],
            'low_competition': []
        }
        
        # Analyze keyword gaps
        all_keywords = analysis_data['keywords'].get('all_keywords', [])
        competitor_keywords = set()
        
        for comp in analysis_data['competitors'].get('detailed_analysis', []):
            if comp and 'keywords' in comp:
                competitor_keywords.update(comp['keywords'])
        
        # Find keywords competitors are missing
        for kw in all_keywords:
            if kw['keyword'] not in competitor_keywords and kw.get('intent') == 'commercial':
                opportunities['keyword_gaps'].append(kw)
        
        # Find emergency/urgent keywords with low competition
        for kw in all_keywords:
            if any(term in kw['keyword'].lower() for term in ['emergency', '24/7', 'urgent', 'now', 'today']):
                if kw.get('competition', 'high') != 'high':
                    opportunities['emergency_keywords'].append(kw)
        
        # Find low competition keywords
        low_comp = [kw for kw in all_keywords if kw.get('competition') == 'low']
        opportunities['low_competition'] = sorted(low_comp, key=lambda x: x.get('search_volume_score', 0), reverse=True)[:10]
        
        return opportunities
    
    async def _generate_recommendations(self, analysis_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate actionable recommendations"""
        recommendations = {
            'immediate_actions': [],
            'content_strategy': [],
            'technical_seo': [],
            'local_seo': []
        }
        
        # Immediate keyword targets
        if analysis_data['opportunities'].get('emergency_keywords'):
            recommendations['immediate_actions'].append({
                'action': 'Target emergency keywords',
                'priority': 'high',
                'keywords': analysis_data['opportunities']['emergency_keywords'][:5],
                'reason': 'High-intent searches with lower competition'
            })
        
        # Content recommendations
        if analysis_data['keywords'].get('questions'):
            recommendations['content_strategy'].append({
                'action': 'Create FAQ content',
                'priority': 'medium',
                'questions': analysis_data['keywords']['questions'][:10],
                'reason': 'Address common customer questions'
            })
        
        # Local SEO recommendations
        local_pack_size = len(analysis_data['competitors'].get('local', []))
        if local_pack_size < 3:
            recommendations['local_seo'].append({
                'action': 'Optimize for local pack',
                'priority': 'high',
                'reason': f'Only {local_pack_size} businesses in local pack - opportunity to rank'
            })
        
        return recommendations
    
    async def _find_surprise_opportunities(self, geo_data: Dict[str, Any], base_query: str) -> List[Dict[str, Any]]:
        """Find unexpected high-value opportunities"""
        surprise_keywords = []
        
        # Related services that might be underserved
        related_services = await self.keyword_agent.find_related_services(base_query)
        
        for service in related_services[:5]:
            serp_data = await self.scraper_agent.scrape_serp(service, geo_data['primary_location'])
            
            # Low competition indicator: few ads, incomplete local pack
            if len(serp_data.get('ads', [])) < 2 and len(serp_data.get('local_pack', [])) < 3:
                surprise_keywords.append({
                    'keyword': service,
                    'opportunity_score': 9,
                    'reason': 'Underserved market with low competition'
                })
        
        return surprise_keywords