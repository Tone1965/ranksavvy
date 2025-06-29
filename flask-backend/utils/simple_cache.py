import json
import time
from typing import Any, Optional, Dict
import os

class SimpleFileCache:
    """Simple file-based cache for development (no Redis required)"""
    
    def __init__(self):
        self.cache_dir = os.path.join(os.path.dirname(__file__), '..', '.cache')
        os.makedirs(self.cache_dir, exist_ok=True)
        self.default_ttl = 86400  # 24 hours
        
    def _get_cache_path(self, key: str) -> str:
        """Get file path for cache key"""
        # Replace special characters in key
        safe_key = key.replace(':', '_').replace('/', '_')
        return os.path.join(self.cache_dir, f"{safe_key}.json")
        
    def get(self, key: str) -> Optional[str]:
        """Get value from cache"""
        try:
            cache_path = self._get_cache_path(key)
            if not os.path.exists(cache_path):
                return None
                
            with open(cache_path, 'r') as f:
                data = json.load(f)
                
            # Check if expired
            if time.time() > data['expires_at']:
                os.remove(cache_path)
                return None
                
            return data['value']
            
        except Exception as e:
            print(f"[Cache] Error getting key {key}: {str(e)}")
            return None
    
    def set(self, key: str, value: str, ttl: int = None) -> bool:
        """Set value in cache with TTL"""
        try:
            ttl = ttl or self.default_ttl
            cache_path = self._get_cache_path(key)
            
            data = {
                'value': value,
                'expires_at': time.time() + ttl,
                'created_at': time.time()
            }
            
            with open(cache_path, 'w') as f:
                json.dump(data, f)
                
            return True
            
        except Exception as e:
            print(f"[Cache] Error setting key {key}: {str(e)}")
            return False
    
    def delete(self, key: str) -> bool:
        """Delete key from cache"""
        try:
            cache_path = self._get_cache_path(key)
            if os.path.exists(cache_path):
                os.remove(cache_path)
                return True
            return False
            
        except Exception as e:
            print(f"[Cache] Error deleting key {key}: {str(e)}")
            return False
    
    def exists(self, key: str) -> bool:
        """Check if key exists in cache"""
        cache_path = self._get_cache_path(key)
        if not os.path.exists(cache_path):
            return False
            
        # Check if expired
        value = self.get(key)
        return value is not None
    
    def clear_pattern(self, pattern: str) -> int:
        """Clear all keys matching a pattern"""
        count = 0
        try:
            for filename in os.listdir(self.cache_dir):
                if pattern.replace('*', '') in filename:
                    os.remove(os.path.join(self.cache_dir, filename))
                    count += 1
        except Exception as e:
            print(f"[Cache] Error clearing pattern {pattern}: {str(e)}")
            
        return count