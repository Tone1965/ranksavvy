import json
from typing import Any, Optional
try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False

from config.config import Config
from utils.simple_cache import SimpleFileCache

class CacheManager:
    """Manages caching for the application (Redis or file-based)"""
    
    def __init__(self):
        self.default_ttl = Config.CACHE_TTL
        
        # Try to use Redis, fall back to file cache
        if REDIS_AVAILABLE:
            try:
                self.redis_client = redis.from_url(Config.REDIS_URL, decode_responses=True)
                # Test connection
                self.redis_client.ping()
                self.use_redis = True
                print("[Cache] Using Redis cache")
            except:
                self.use_redis = False
                self.file_cache = SimpleFileCache()
                print("[Cache] Redis not available, using file cache")
        else:
            self.use_redis = False
            self.file_cache = SimpleFileCache()
            print("[Cache] Using file cache (Redis not installed)")
        
    def get(self, key: str) -> Optional[str]:
        """Get value from cache"""
        if self.use_redis:
            try:
                return self.redis_client.get(key)
            except Exception as e:
                print(f"[Cache] Error getting key {key}: {str(e)}")
                return None
        else:
            return self.file_cache.get(key)
    
    def set(self, key: str, value: str, ttl: int = None) -> bool:
        """Set value in cache with TTL"""
        ttl = ttl or self.default_ttl
        
        if self.use_redis:
            try:
                return self.redis_client.setex(key, ttl, value)
            except Exception as e:
                print(f"[Cache] Error setting key {key}: {str(e)}")
                return False
        else:
            return self.file_cache.set(key, value, ttl)
    
    def delete(self, key: str) -> bool:
        """Delete key from cache"""
        if self.use_redis:
            try:
                return self.redis_client.delete(key) > 0
            except Exception as e:
                print(f"[Cache] Error deleting key {key}: {str(e)}")
                return False
        else:
            return self.file_cache.delete(key)
    
    def exists(self, key: str) -> bool:
        """Check if key exists in cache"""
        if self.use_redis:
            try:
                return self.redis_client.exists(key) > 0
            except Exception as e:
                print(f"[Cache] Error checking key {key}: {str(e)}")
                return False
        else:
            return self.file_cache.exists(key)
    
    def clear_pattern(self, pattern: str) -> int:
        """Clear all keys matching a pattern"""
        if self.use_redis:
            try:
                keys = self.redis_client.keys(pattern)
                if keys:
                    return self.redis_client.delete(*keys)
                return 0
            except Exception as e:
                print(f"[Cache] Error clearing pattern {pattern}: {str(e)}")
                return 0
        else:
            return self.file_cache.clear_pattern(pattern)