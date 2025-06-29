import anthropic
from config.config import Config
from typing import Dict, Any, List

class ClaudeClient:
    """Claude API client for AI analysis"""
    
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=Config.ANTHROPIC_API_KEY)
        
    async def analyze(self, prompt: str, max_tokens: int = 1000) -> str:
        """Send a prompt to Claude and get response"""
        try:
            response = self.client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=max_tokens,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
            
            return response.content[0].text
            
        except Exception as e:
            print(f"[Claude Client] Error: {str(e)}")
            raise
    
    async def analyze_competitor_content(self, competitor_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze competitor website content"""
        prompt = f"""
        Analyze this competitor website data and extract key insights:
        
        H1 Tags: {', '.join(competitor_data.get('h1_tags', [])[:5])}
        H2 Tags: {', '.join(competitor_data.get('h2_tags', [])[:10])}
        Meta Description: {competitor_data.get('meta_description', 'None')}
        
        Provide:
        1. Main keywords they're targeting (list 5-10)
        2. Service focus areas
        3. Unique value propositions mentioned
        4. Content gaps or missing topics
        
        Format as JSON.
        """
        
        try:
            response = await self.analyze(prompt, max_tokens=1500)
            # Parse JSON from response
            import json
            
            # Clean the response to extract JSON
            response = response.strip()
            if response.startswith('```json'):
                response = response[7:]
            if response.endswith('```'):
                response = response[:-3]
            
            return json.loads(response)
            
        except Exception as e:
            print(f"[Claude Client] Error analyzing competitor: {str(e)}")
            return {
                'keywords': [],
                'service_focus': [],
                'value_propositions': [],
                'content_gaps': []
            }
    
    async def generate_content_outline(self, keyword: str, competitor_insights: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate content outline based on keyword and competitor analysis"""
        prompt = f"""
        Create a comprehensive content outline for a landing page targeting: "{keyword}"
        
        Competitor insights show these common topics:
        {str(competitor_insights)[:500]}
        
        Generate an outline that:
        1. Addresses all competitor topics but goes deeper
        2. Includes unique angles they're missing
        3. Follows SEO best practices
        4. Includes EEAT signals
        
        Format:
        - Page Title
        - Meta Description
        - H1
        - H2 sections with brief descriptions
        - FAQ questions
        - Schema markup recommendations
        """
        
        try:
            response = await self.analyze(prompt, max_tokens=2000)
            
            # Parse the response into structured format
            outline = {
                'keyword': keyword,
                'content': response,
                'sections': self._parse_outline_sections(response)
            }
            
            return outline
            
        except Exception as e:
            print(f"[Claude Client] Error generating outline: {str(e)}")
            return {
                'keyword': keyword,
                'error': str(e)
            }
    
    def _parse_outline_sections(self, outline_text: str) -> List[Dict[str, str]]:
        """Parse outline text into structured sections"""
        sections = []
        lines = outline_text.split('\n')
        
        current_section = None
        for line in lines:
            line = line.strip()
            if line.startswith('Page Title:'):
                sections.append({'type': 'title', 'content': line.replace('Page Title:', '').strip()})
            elif line.startswith('Meta Description:'):
                sections.append({'type': 'meta_description', 'content': line.replace('Meta Description:', '').strip()})
            elif line.startswith('H1:'):
                sections.append({'type': 'h1', 'content': line.replace('H1:', '').strip()})
            elif line.startswith('H2:') or line.startswith('##'):
                content = line.replace('H2:', '').replace('##', '').strip()
                sections.append({'type': 'h2', 'content': content})
            elif line.startswith('FAQ:') or line.startswith('Q:'):
                content = line.replace('FAQ:', '').replace('Q:', '').strip()
                sections.append({'type': 'faq', 'content': content})
        
        return sections