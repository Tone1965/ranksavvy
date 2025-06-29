from typing import Dict, Any, List, Tuple
import asyncio
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
import re

class GeoAgent:
    """
    Handles geographic analysis and location clustering
    """
    
    def __init__(self):
        self.geolocator = Nominatim(user_agent="ranksavvy_geo_agent")
        
    async def analyze_location(self, location: str, radius: float = None) -> Dict[str, Any]:
        """
        Analyze a location and optionally find nearby areas
        """
        print(f"[Geo Agent] Analyzing location: {location}")
        
        geo_data = {
            'primary_location': location,
            'coordinates': None,
            'city': None,
            'state': None,
            'county': None,
            'zip_codes': [],
            'nearby_cities': [],
            'service_area': {},
            'population_density': 'unknown'
        }
        
        try:
            # Geocode the location
            location_data = self.geolocator.geocode(location, addressdetails=True)
            
            if location_data:
                geo_data['coordinates'] = (location_data.latitude, location_data.longitude)
                
                # Extract location details
                address = location_data.raw.get('address', {})
                geo_data['city'] = address.get('city') or address.get('town') or address.get('village')
                geo_data['state'] = address.get('state')
                geo_data['county'] = address.get('county')
                geo_data['zip_codes'] = [address.get('postcode')] if address.get('postcode') else []
                
                # If radius specified, find nearby cities
                if radius:
                    geo_data['service_area'] = await self._calculate_service_area(
                        geo_data['coordinates'], radius
                    )
                    geo_data['nearby_cities'] = await self._find_nearby_cities(
                        geo_data['coordinates'], radius
                    )
                
                # Determine population density based on location type
                geo_data['population_density'] = self._estimate_population_density(address)
                
        except Exception as e:
            print(f"[Geo Agent] Error geocoding location: {str(e)}")
            
        return geo_data
    
    async def _calculate_service_area(self, center: Tuple[float, float], radius: float) -> Dict[str, Any]:
        """
        Calculate service area bounds
        """
        # Calculate bounding box for the service area
        # This is approximate but good enough for local search
        lat, lon = center
        
        # Rough conversion: 1 degree latitude = 69 miles
        lat_delta = radius / 69
        # Longitude varies by latitude, rough approximation
        lon_delta = radius / (69 * abs(max(0.1, abs(lat) / 90)))
        
        return {
            'center': {'lat': lat, 'lon': lon},
            'radius_miles': radius,
            'bounds': {
                'north': lat + lat_delta,
                'south': lat - lat_delta,
                'east': lon + lon_delta,
                'west': lon - lon_delta
            }
        }
    
    async def _find_nearby_cities(self, center: Tuple[float, float], radius: float) -> List[Dict[str, Any]]:
        """
        Find nearby cities within radius
        """
        nearby_cities = []
        
        # Common nearby city patterns for Alabama (customize per state)
        # In production, this would query a proper geographic database
        search_offsets = [
            (0.1, 0.1), (0.1, -0.1), (-0.1, 0.1), (-0.1, -0.1),
            (0.15, 0), (0, 0.15), (-0.15, 0), (0, -0.15)
        ]
        
        lat, lon = center
        
        for lat_offset, lon_offset in search_offsets:
            try:
                search_point = (lat + lat_offset, lon + lon_offset)
                location = self.geolocator.reverse(search_point, exactly_one=True)
                
                if location:
                    address = location.raw.get('address', {})
                    city = address.get('city') or address.get('town') or address.get('village')
                    
                    if city:
                        distance = geodesic(center, search_point).miles
                        
                        if distance <= radius and not any(c['name'] == city for c in nearby_cities):
                            nearby_cities.append({
                                'name': city,
                                'distance_miles': round(distance, 1),
                                'state': address.get('state', ''),
                                'coordinates': {'lat': search_point[0], 'lon': search_point[1]}
                            })
                            
            except:
                continue
        
        # Sort by distance
        nearby_cities.sort(key=lambda x: x['distance_miles'])
        
        return nearby_cities[:10]  # Return top 10 nearest
    
    def _estimate_population_density(self, address: Dict[str, str]) -> str:
        """
        Estimate population density based on location type
        """
        # Simple heuristic based on place type
        if address.get('city'):
            return 'urban'
        elif address.get('town'):
            return 'suburban'
        elif address.get('village') or address.get('hamlet'):
            return 'rural'
        else:
            return 'unknown'
    
    def suggest_location_clusters(self, primary_location: str, nearby_cities: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Suggest logical location clusters for targeting
        """
        clusters = []
        
        # Primary cluster (just the main city)
        clusters.append({
            'name': f"{primary_location} Metro",
            'locations': [primary_location],
            'type': 'primary',
            'recommended': True
        })
        
        # Nearby cluster (main + close cities)
        if nearby_cities:
            close_cities = [c['name'] for c in nearby_cities if c['distance_miles'] <= 15]
            if close_cities:
                clusters.append({
                    'name': f"{primary_location} Area",
                    'locations': [primary_location] + close_cities[:5],
                    'type': 'expanded',
                    'recommended': len(close_cities) >= 3
                })
        
        # Regional cluster (wider area)
        if nearby_cities:
            regional_cities = [c['name'] for c in nearby_cities if c['distance_miles'] <= 30]
            if len(regional_cities) >= 5:
                clusters.append({
                    'name': f"{primary_location} Region",
                    'locations': [primary_location] + regional_cities,
                    'type': 'regional',
                    'recommended': False  # Only for established businesses
                })
        
        return clusters
    
    def format_location_for_search(self, location: str, state: str = None) -> str:
        """
        Format location for consistent search queries
        """
        # Clean up the location string
        location = location.strip()
        
        # Add state if not present and we have it
        if state and state.lower() not in location.lower():
            location = f"{location} {state}"
        
        # Standardize common abbreviations
        location = location.replace('St.', 'Saint')
        location = location.replace('Mt.', 'Mount')
        
        return location