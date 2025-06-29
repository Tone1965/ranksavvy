# RankSavvy Flask Backend

## Enhanced Niche Finder with BrightData Integration

This Flask backend provides real-time market analysis using BrightData for web scraping and Claude AI for intelligent analysis.

## Setup Instructions

### 1. Install Dependencies

```bash
cd flask-backend
pip install -r requirements.txt
```

### 2. Install and Start Redis

#### Windows (using WSL):
```bash
sudo apt update
sudo apt install redis-server
sudo service redis-server start
```

#### Mac:
```bash
brew install redis
brew services start redis
```

### 3. Configure Environment Variables

Edit the `.env` file and add your API keys:

```env
# Already configured
BRIGHTDATA_HOST=brd.superproxy.io
BRIGHTDATA_PORT=9222
BRIGHTDATA_USERNAME=brd-customer-hl_05cef420-zone-scraping_browser1
BRIGHTDATA_PASSWORD=tb6tot21cg0a

# Add your Claude API key
ANTHROPIC_API_KEY=your-claude-api-key-here
```

### 4. Install Chrome/Chromium for Selenium

The BrightData scraper uses Selenium with Chrome. Make sure Chrome is installed:

#### Windows/Mac:
Download and install Chrome from https://www.google.com/chrome/

#### Linux:
```bash
sudo apt install chromium-browser chromium-chromedriver
```

### 5. Run the Flask Backend

```bash
python app.py
```

The backend will start on `http://localhost:5000`

## API Endpoints

### Main Analysis Endpoint
```
POST /api/niche/analyze
```

Request body:
```json
{
  "query": "HVAC repair",
  "location": "Pelham Alabama",
  "options": {
    "radius": 40,
    "surprise_me": true
  }
}
```

### Streaming Analysis (Server-Sent Events)
```
POST /api/niche/analyze/stream
```
Real-time progress updates during analysis

### Autocomplete Suggestions
```
POST /api/niche/keywords/autocomplete
```

### Local Competitors
```
POST /api/niche/competitors/local
```

### Export to CSV
```
POST /api/niche/export/csv
```

## Frontend Integration

Update your Next.js `.env.local`:
```env
NEXT_PUBLIC_FLASK_URL=http://localhost:5000
```

## Features

- **Real-time web scraping** with BrightData proxy
- **Google SERP analysis** for search volume estimation
- **Google Maps scraping** for local competitors
- **Autocomplete analysis** for keyword popularity
- **Competitor website analysis** for SEO gaps
- **Geographic clustering** for service area optimization
- **Claude AI integration** for intelligent insights
- **Redis caching** for 24-hour data persistence
- **CSV export** for analysis results

## Architecture

```
User Request → Flask API → Lead Agent → Parallel Agents:
                                        ├── Scraper Agent (BrightData)
                                        ├── Keyword Agent (Discovery)
                                        ├── Competitor Agent (Analysis)
                                        └── Geo Agent (Location)
                                              ↓
                                        Redis Cache
                                              ↓
                                        Results → Frontend
```

## Troubleshooting

### Redis Connection Error
Make sure Redis is running:
```bash
redis-cli ping
# Should return: PONG
```

### BrightData Connection Issues
- Verify your credentials in `.env`
- Check if your BrightData zone is active
- Ensure your IP is whitelisted (if required)

### Chrome/Selenium Errors
- Install Chrome/Chromium
- For headless mode issues, check the Chrome options in `brightdata_client.py`

## Next Steps

1. **Add Celery** for better async task management
2. **Implement WebSocket** for real-time progress
3. **Add more data sources** (Google Trends, etc.)
4. **Create Docker setup** for easier deployment