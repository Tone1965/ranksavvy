import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    DEBUG = os.getenv('FLASK_ENV') == 'development'
    
    # BrightData
    BRIGHTDATA_HOST = os.getenv('BRIGHTDATA_HOST')
    BRIGHTDATA_PORT = int(os.getenv('BRIGHTDATA_PORT', 9222))
    BRIGHTDATA_USERNAME = os.getenv('BRIGHTDATA_USERNAME')
    BRIGHTDATA_PASSWORD = os.getenv('BRIGHTDATA_PASSWORD')
    
    # Claude
    ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')
    
    # Redis
    REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
    
    # Celery
    CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
    CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
    
    # Scraping settings
    SCRAPE_TIMEOUT = 30000  # 30 seconds
    MAX_RETRIES = 3
    
    # Cache settings
    CACHE_TTL = 86400  # 24 hours