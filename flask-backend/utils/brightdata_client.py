import asyncio
import aiohttp
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from config.config import Config
import json
from typing import List, Dict, Any
import time
from tenacity import retry, stop_after_attempt, wait_exponential

class BrightDataClient:
    def __init__(self):
        self.proxy_url = f"http://{Config.BRIGHTDATA_USERNAME}:{Config.BRIGHTDATA_PASSWORD}@{Config.BRIGHTDATA_HOST}:{Config.BRIGHTDATA_PORT}"
        
    def _get_chrome_options(self):
        """Configure Chrome options for BrightData proxy"""
        options = Options()
        options.add_argument(f'--proxy-server={self.proxy_url}')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--disable-blink-features=AutomationControlled')
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option('useAutomationExtension', False)
        return options
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    async def scrape_google_serp(self, query: str, location: str = None) -> Dict[str, Any]:
        """Scrape Google SERP for a given query"""
        driver = None
        try:
            driver = webdriver.Chrome(options=self._get_chrome_options())
            
            # Build search URL
            search_query = f"{query} {location}" if location else query
            url = f"https://www.google.com/search?q={search_query}"
            
            driver.get(url)
            wait = WebDriverWait(driver, Config.SCRAPE_TIMEOUT / 1000)
            
            results = {
                'organic_results': [],
                'ads': [],
                'local_pack': [],
                'people_also_ask': [],
                'related_searches': [],
                'people_also_search_for': [],
                'featured_snippet': None,
                'knowledge_panel': None
            }
            
            # Organic results
            organic_elements = driver.find_elements(By.CSS_SELECTOR, 'div.g')
            for element in organic_elements[:10]:
                try:
                    title = element.find_element(By.CSS_SELECTOR, 'h3').text
                    link = element.find_element(By.CSS_SELECTOR, 'a').get_attribute('href')
                    snippet = element.find_element(By.CSS_SELECTOR, 'span.VwiC3b').text
                    
                    results['organic_results'].append({
                        'title': title,
                        'url': link,
                        'snippet': snippet,
                        'position': len(results['organic_results']) + 1
                    })
                except:
                    continue
            
            # Ads
            ad_elements = driver.find_elements(By.CSS_SELECTOR, 'div[data-text-ad]')
            for ad in ad_elements:
                try:
                    results['ads'].append({
                        'title': ad.find_element(By.CSS_SELECTOR, 'div[role="heading"]').text,
                        'url': ad.find_element(By.CSS_SELECTOR, 'a').get_attribute('href'),
                        'description': ad.find_element(By.CSS_SELECTOR, 'div.Va3FIb').text
                    })
                except:
                    continue
            
            # Local Pack
            try:
                local_pack = driver.find_element(By.CSS_SELECTOR, 'div[jscontroller][data-async-context]')
                places = local_pack.find_elements(By.CSS_SELECTOR, 'div[jsaction*="mouseover"]')
                for place in places[:3]:
                    try:
                        name = place.find_element(By.CSS_SELECTOR, 'div[role="heading"]').text
                        results['local_pack'].append({
                            'name': name,
                            'position': len(results['local_pack']) + 1
                        })
                    except:
                        continue
            except:
                pass
            
            # People Also Ask
            try:
                paa_elements = driver.find_elements(By.CSS_SELECTOR, 'div[jsname="yEVEwb"]')
                for paa in paa_elements:
                    question = paa.find_element(By.CSS_SELECTOR, 'span').text
                    results['people_also_ask'].append(question)
            except:
                pass
            
            # Related searches
            try:
                related = driver.find_elements(By.CSS_SELECTOR, 'div[data-hveid] a')
                for rel in related:
                    text = rel.text.strip()
                    if text:
                        results['related_searches'].append(text)
            except:
                pass
            
            return results
            
        finally:
            if driver:
                driver.quit()
    
    async def scrape_google_autocomplete(self, query: str, location: str = None) -> List[str]:
        """Get Google autocomplete suggestions"""
        suggestions = []
        driver = None
        
        try:
            driver = webdriver.Chrome(options=self._get_chrome_options())
            driver.get("https://www.google.com")
            
            search_box = driver.find_element(By.NAME, "q")
            search_query = f"{query} {location}" if location else query
            
            # Type slowly to trigger autocomplete
            for char in search_query:
                search_box.send_keys(char)
                await asyncio.sleep(0.1)
            
            # Wait for suggestions
            await asyncio.sleep(1)
            
            # Get suggestions
            suggestion_elements = driver.find_elements(By.CSS_SELECTOR, 'li[role="option"] span')
            for element in suggestion_elements:
                text = element.text.strip()
                if text and text != search_query:
                    suggestions.append(text)
            
            return suggestions[:10]  # Top 10 suggestions
            
        finally:
            if driver:
                driver.quit()
    
    async def scrape_competitor_site(self, url: str) -> Dict[str, Any]:
        """Scrape competitor website for SEO data"""
        driver = None
        try:
            driver = webdriver.Chrome(options=self._get_chrome_options())
            driver.get(url)
            wait = WebDriverWait(driver, Config.SCRAPE_TIMEOUT / 1000)
            
            # Wait for page to load
            wait.until(EC.presence_of_element_located((By.TAG_NAME, "h1")))
            
            data = {
                'url': url,
                'title': driver.title,
                'h1_tags': [],
                'h2_tags': [],
                'meta_description': '',
                'schema_types': [],
                'internal_links': [],
                'images_alt_text': []
            }
            
            # H1 tags
            h1_elements = driver.find_elements(By.TAG_NAME, 'h1')
            data['h1_tags'] = [h1.text.strip() for h1 in h1_elements if h1.text.strip()]
            
            # H2 tags
            h2_elements = driver.find_elements(By.TAG_NAME, 'h2')
            data['h2_tags'] = [h2.text.strip() for h2 in h2_elements if h2.text.strip()]
            
            # Meta description
            try:
                meta_desc = driver.find_element(By.CSS_SELECTOR, 'meta[name="description"]')
                data['meta_description'] = meta_desc.get_attribute('content')
            except:
                pass
            
            # Schema markup
            try:
                scripts = driver.find_elements(By.CSS_SELECTOR, 'script[type="application/ld+json"]')
                for script in scripts:
                    try:
                        schema_data = json.loads(script.get_attribute('innerHTML'))
                        if '@type' in schema_data:
                            data['schema_types'].append(schema_data['@type'])
                    except:
                        continue
            except:
                pass
            
            # Internal links
            links = driver.find_elements(By.TAG_NAME, 'a')
            base_domain = url.split('/')[2]
            for link in links[:50]:  # Limit to 50 links
                href = link.get_attribute('href')
                if href and base_domain in href:
                    data['internal_links'].append({
                        'url': href,
                        'anchor_text': link.text.strip()
                    })
            
            return data
            
        finally:
            if driver:
                driver.quit()
    
    async def scrape_google_maps(self, query: str, location: str) -> List[Dict[str, Any]]:
        """Scrape Google Maps for local businesses"""
        driver = None
        try:
            driver = webdriver.Chrome(options=self._get_chrome_options())
            
            # Go to Google Maps
            maps_url = f"https://www.google.com/maps/search/{query}+{location}"
            driver.get(maps_url)
            
            # Wait for results to load
            wait = WebDriverWait(driver, Config.SCRAPE_TIMEOUT / 1000)
            wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'div[role="article"]')))
            
            # Scroll to load more results
            results_container = driver.find_element(By.CSS_SELECTOR, 'div[role="feed"]')
            for _ in range(3):  # Scroll 3 times
                driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", results_container)
                await asyncio.sleep(2)
            
            businesses = []
            business_elements = driver.find_elements(By.CSS_SELECTOR, 'div[role="article"]')
            
            for element in business_elements[:20]:  # Top 20 results
                try:
                    name = element.find_element(By.CSS_SELECTOR, 'div[class*="fontHeadlineSmall"]').text
                    
                    business_data = {
                        'name': name,
                        'rating': None,
                        'reviews_count': None,
                        'category': None,
                        'address': None,
                        'phone': None,
                        'website': None
                    }
                    
                    # Try to get rating
                    try:
                        rating_text = element.find_element(By.CSS_SELECTOR, 'span[role="img"]').get_attribute('aria-label')
                        if rating_text:
                            rating = float(rating_text.split()[0])
                            business_data['rating'] = rating
                    except:
                        pass
                    
                    # Try to get review count
                    try:
                        reviews = element.find_element(By.CSS_SELECTOR, 'span[aria-label*="reviews"]').text
                        business_data['reviews_count'] = reviews.strip('()')
                    except:
                        pass
                    
                    businesses.append(business_data)
                    
                except:
                    continue
            
            return businesses
            
        finally:
            if driver:
                driver.quit()