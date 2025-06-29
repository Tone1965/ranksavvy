from typing import Dict, Any, List
import asyncio
from utils.brightdata_client import BrightDataClient
from utils.cache_manager import CacheManager
import json

class ScraperAgent:
    """
    Handles all web scraping operations using BrightData
    """
    
    def __init__(self):
        self.brightdata = BrightDataClient()
        self.cache = CacheManager()
        
    async def scrape_serp(self, query: str, location: str = None) -> Dict[str, Any]:
        """Scrape Google SERP with all features"""
        cache_key = f"serp:{query}:{location}"
        cached = self.cache.get(cache_key)
        if cached:
            return json.loads(cached)
        
        print(f"[Scraper Agent] Scraping SERP for: {query} in {location}")
        results = await self.brightdata.scrape_google_serp(query, location)
        
        # Analyze SERP features for search volume estimation
        results['search_volume_indicators'] = self._analyze_serp_features(results)
        
        self.cache.set(cache_key, json.dumps(results), ttl=86400)
        return results
    
    async def get_autocomplete_suggestions(self, query: str, location: str = None) -> List[str]:
        """Get Google autocomplete suggestions"""
        cache_key = f"autocomplete:{query}:{location}"
        cached = self.cache.get(cache_key)
        if cached:
            return json.loads(cached)
        
        print(f"[Scraper Agent] Getting autocomplete for: {query}")
        suggestions = await self.brightdata.scrape_google_autocomplete(query, location)
        
        self.cache.set(cache_key, json.dumps(suggestions), ttl=86400)
        return suggestions
    
    async def get_local_competitors(self, query: str, location: str) -> List[Dict[str, Any]]:
        """Get local competitors from Google Maps"""
        cache_key = f"local_competitors:{query}:{location}"
        cached = self.cache.get(cache_key)
        if cached:
            return json.loads(cached)
        
        print(f"[Scraper Agent] Getting local competitors for: {query} in {location}")
        competitors = await self.brightdata.scrape_google_maps(query, location)
        
        self.cache.set(cache_key, json.dumps(competitors), ttl=86400)
        return competitors
    
    async def scrape_competitor_site(self, url: str) -> Dict[str, Any]:
        """Scrape a competitor's website"""
        cache_key = f"competitor_site:{url}"
        cached = self.cache.get(cache_key)
        if cached:
            return json.loads(cached)
        
        print(f"[Scraper Agent] Scraping competitor site: {url}")
        site_data = await self.brightdata.scrape_competitor_site(url)
        
        self.cache.set(cache_key, json.dumps(site_data), ttl=86400)
        return site_data
    
    def _analyze_serp_features(self, serp_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze SERP features to estimate search volume"""
        indicators = {
            'estimated_volume': 'unknown',
            'competition_level': 'unknown',
            'commercial_intent': False,
            'local_intent': False,
            'informational_intent': False,
            'score': 0
        }
        
        # More ads = higher commercial value and search volume
        ad_count = len(serp_data.get('ads', []))
        if ad_count >= 4:
            indicators['estimated_volume'] = 'high'
            indicators['competition_level'] = 'high'
            indicators['commercial_intent'] = True
            indicators['score'] += 3
        elif ad_count >= 2:
            indicators['estimated_volume'] = 'medium'
            indicators['competition_level'] = 'medium'
            indicators['commercial_intent'] = True
            indicators['score'] += 2
        elif ad_count >= 1:
            indicators['estimated_volume'] = 'low-medium'
            indicators['competition_level'] = 'low'
            indicators['score'] += 1
        
        # Local pack indicates local intent
        if serp_data.get('local_pack'):
            indicators['local_intent'] = True
            indicators['score'] += 2
            if len(serp_data['local_pack']) == 3:
                indicators['competition_level'] = 'high' if indicators['competition_level'] == 'unknown' else indicators['competition_level']
        
        # People Also Ask indicates informational intent
        if serp_data.get('people_also_ask'):
            indicators['informational_intent'] = True
            indicators['score'] += 1
        
        # Featured snippet indicates high search volume
        if serp_data.get('featured_snippet'):
            indicators['estimated_volume'] = 'high' if indicators['estimated_volume'] == 'unknown' else indicators['estimated_volume']
            indicators['score'] += 2
        
        # Knowledge panel indicates brand or entity search
        if serp_data.get('knowledge_panel'):
            indicators['score'] += 1
        
        # Many related searches indicate topic depth
        if len(serp_data.get('related_searches', [])) >= 6:
            indicators['score'] += 1
        
        return indicators
    
    async def batch_scrape_keywords(self, keywords: List[str], location: str) -> List[Dict[str, Any]]:
        """Batch scrape multiple keywords for efficiency"""
        tasks = []
        for keyword in keywords:
            task = self.scrape_serp(keyword, location)
            tasks.append(task)
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Process results
        processed_results = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                print(f"[Scraper Agent] Error scraping {keywords[i]}: {str(result)}")
                processed_results.append({
                    'keyword': keywords[i],
                    'error': str(result)
                })
            else:
                processed_results.append({
                    'keyword': keywords[i],
                    'serp_data': result,
                    'volume_indicators': result.get('search_volume_indicators', {})
                })
        
        return processed_results