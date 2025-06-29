from typing import Dict, Any, List
import asyncio
from agents.scraper_agent import ScraperAgent
from utils.claude_client import ClaudeClient
import re

class KeywordAgent:
    """
    Discovers and analyzes keywords using search data and AI
    """
    
    def __init__(self):
        self.scraper = ScraperAgent()
        self.claude = ClaudeClient()
        
    async def discover_keywords(self, service: str, location: str, geo_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Discover keywords for a service in a location
        """
        print(f"[Keyword Agent] Discovering keywords for {service} in {location}")
        
        # Initialize results
        keywords_data = {
            'primary_keyword': f"{service} {location}",
            'emergency_keywords': [],
            'intent_keywords': [],
            'questions': [],
            'long_tail': [],
            'related_searches': [],
            'autocomplete': [],
            'all_keywords': []
        }
        
        # Get autocomplete suggestions (shows popularity order)
        autocomplete = await self.scraper.get_autocomplete_suggestions(service, location)
        keywords_data['autocomplete'] = autocomplete
        
        # Get SERP data for main keyword
        main_serp = await self.scraper.scrape_serp(service, location)
        
        # Extract questions from People Also Ask
        keywords_data['questions'] = main_serp.get('people_also_ask', [])
        
        # Get related searches
        keywords_data['related_searches'] = main_serp.get('related_searches', [])
        
        # Generate emergency/urgent variations
        emergency_terms = ['emergency', '24/7', 'urgent', 'same day', 'now', 'today', 'immediate', 'after hours']
        emergency_keywords = []
        for term in emergency_terms:
            emergency_keywords.append({
                'keyword': f"{term} {service} {location}",
                'type': 'emergency',
                'intent': 'urgent'
            })
            emergency_keywords.append({
                'keyword': f"{service} {term} {location}",
                'type': 'emergency',
                'intent': 'urgent'
            })
        
        # Batch check emergency keywords
        emergency_results = await self.scraper.batch_scrape_keywords(
            [kw['keyword'] for kw in emergency_keywords[:10]], 
            location
        )
        
        # Filter emergency keywords by actual search presence
        for i, result in enumerate(emergency_results):
            if not result.get('error'):
                volume_score = result['volume_indicators']['score']
                if volume_score > 0:  # Has some search volume
                    emergency_keywords[i]['search_volume_score'] = volume_score
                    emergency_keywords[i]['competition'] = result['volume_indicators']['competition_level']
                    keywords_data['emergency_keywords'].append(emergency_keywords[i])
        
        # Generate high-intent commercial keywords
        intent_terms = ['service', 'repair', 'install', 'fix', 'replace', 'cost', 'price', 'near me', 'best', 'top']
        intent_keywords = []
        for term in intent_terms:
            intent_keywords.append({
                'keyword': f"{service} {term} {location}",
                'type': 'commercial',
                'intent': 'high'
            })
            intent_keywords.append({
                'keyword': f"{term} {service} {location}",
                'type': 'commercial', 
                'intent': 'high'
            })
        
        # Batch check intent keywords
        intent_results = await self.scraper.batch_scrape_keywords(
            [kw['keyword'] for kw in intent_keywords[:10]], 
            location
        )
        
        # Filter intent keywords by search presence
        for i, result in enumerate(intent_results):
            if not result.get('error'):
                volume_score = result['volume_indicators']['score']
                if volume_score > 0:
                    intent_keywords[i]['search_volume_score'] = volume_score
                    intent_keywords[i]['competition'] = result['volume_indicators']['competition_level']
                    keywords_data['intent_keywords'].append(intent_keywords[i])
        
        # Use Claude to analyze patterns and suggest more keywords
        claude_keywords = await self._get_claude_keyword_suggestions(
            service, location, autocomplete, keywords_data['questions']
        )
        
        # Combine all keywords
        all_keywords = []
        
        # Add primary keyword
        all_keywords.append({
            'keyword': keywords_data['primary_keyword'],
            'type': 'primary',
            'search_volume_score': main_serp['search_volume_indicators']['score'],
            'competition': main_serp['search_volume_indicators']['competition_level']
        })
        
        # Add autocomplete (ordered by popularity)
        for i, kw in enumerate(autocomplete[:5]):
            all_keywords.append({
                'keyword': kw,
                'type': 'autocomplete',
                'popularity_rank': i + 1,
                'search_volume_score': 5 - i  # Higher rank = higher score
            })
        
        # Add emergency and intent keywords
        all_keywords.extend(keywords_data['emergency_keywords'])
        all_keywords.extend(keywords_data['intent_keywords'])
        
        # Add Claude suggestions
        all_keywords.extend(claude_keywords)
        
        # Sort by search volume score
        all_keywords.sort(key=lambda x: x.get('search_volume_score', 0), reverse=True)
        keywords_data['all_keywords'] = all_keywords
        
        return keywords_data
    
    async def _get_claude_keyword_suggestions(self, service: str, location: str, 
                                            autocomplete: List[str], questions: List[str]) -> List[Dict[str, Any]]:
        """Use Claude to analyze patterns and suggest keywords"""
        prompt = f"""
        Analyze these search patterns for {service} in {location} and suggest high-value keywords:
        
        Autocomplete suggestions: {', '.join(autocomplete[:5])}
        Questions people ask: {', '.join(questions[:5])}
        
        Based on these patterns, suggest 10 high-commercial-intent long-tail keywords that:
        1. Include emotional triggers (worried, concerned, need help)
        2. Include pain points specific to this service
        3. Include solution-focused terms
        4. Are specific to local searches
        
        Format: Return only the keywords, one per line.
        """
        
        try:
            suggestions = await self.claude.analyze(prompt)
            keywords = []
            
            for line in suggestions.split('\n'):
                line = line.strip()
                if line and len(line) > 10:  # Filter out empty or too short
                    keywords.append({
                        'keyword': line,
                        'type': 'ai_suggested',
                        'intent': 'commercial',
                        'search_volume_score': 3  # Medium score for AI suggestions
                    })
            
            return keywords[:10]
            
        except Exception as e:
            print(f"[Keyword Agent] Error getting Claude suggestions: {str(e)}")
            return []
    
    async def find_related_services(self, base_service: str) -> List[str]:
        """Find related services that might be underserved"""
        prompt = f"""
        For the service "{base_service}", list 5 closely related services that:
        1. The same type of business might offer
        2. Customers often need at the same time
        3. Are logical extensions of the main service
        
        Example: If the service is "HVAC repair", related might be "furnace maintenance", "AC installation", etc.
        
        Return only the service names, one per line.
        """
        
        try:
            related = await self.claude.analyze(prompt)
            services = []
            
            for line in related.split('\n'):
                line = line.strip()
                if line and len(line) > 5:
                    services.append(line)
            
            return services[:5]
            
        except Exception as e:
            print(f"[Keyword Agent] Error finding related services: {str(e)}")
            return []
    
    def calculate_keyword_value(self, keyword_data: Dict[str, Any]) -> int:
        """Calculate overall value score for a keyword"""
        score = 0
        
        # Base score from search volume indicators
        score += keyword_data.get('search_volume_score', 0) * 10
        
        # Intent multipliers
        if keyword_data.get('intent') == 'urgent':
            score *= 1.5
        elif keyword_data.get('intent') == 'commercial':
            score *= 1.3
        
        # Competition adjustments
        competition = keyword_data.get('competition', 'unknown')
        if competition == 'low':
            score *= 1.5
        elif competition == 'medium':
            score *= 1.2
        elif competition == 'high':
            score *= 0.8
        
        # Type bonuses
        if keyword_data.get('type') == 'emergency':
            score += 20
        elif keyword_data.get('type') == 'autocomplete':
            score += 15
        
        return int(score)