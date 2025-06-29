from flask import Blueprint, request, jsonify, Response
from agents.lead_agent import LeadAgent
import asyncio
import json
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

# Create blueprint
niche_bp = Blueprint('niche', __name__)

# Initialize lead agent
lead_agent = LeadAgent()

@niche_bp.route('/analyze', methods=['POST'])
def analyze_niche():
    """
    Main endpoint for niche analysis
    Expects: {
        "query": "HVAC repair",
        "location": "Pelham Alabama",
        "options": {
            "radius": 40,
            "surprise_me": true
        }
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        query = data.get('query')
        location = data.get('location')
        
        if not query or not location:
            return jsonify({'error': 'Query and location are required'}), 400
        
        options = data.get('options', {})
        
        logger.info(f"Starting analysis for: {query} in {location}")
        
        # Run async analysis
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            results = loop.run_until_complete(
                lead_agent.analyze_niche(query, location, options)
            )
            
            return jsonify({
                'success': True,
                'data': results
            })
            
        finally:
            loop.close()
            
    except Exception as e:
        logger.error(f"Error in analyze_niche: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@niche_bp.route('/analyze/stream', methods=['POST'])
def analyze_niche_stream():
    """
    Streaming endpoint for real-time progress updates
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        query = data.get('query')
        location = data.get('location')
        
        if not query or not location:
            return jsonify({'error': 'Query and location are required'}), 400
        
        def generate():
            """Generator for SSE streaming"""
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            try:
                # Send initial message
                yield f"data: {json.dumps({'status': 'started', 'message': 'Analysis started'})}\n\n"
                
                # Geographic analysis
                yield f"data: {json.dumps({'status': 'processing', 'step': 'geographic', 'message': 'Analyzing location data...'})}\n\n"
                
                # Keyword discovery
                yield f"data: {json.dumps({'status': 'processing', 'step': 'keywords', 'message': 'Discovering keywords...'})}\n\n"
                
                # Competitor analysis
                yield f"data: {json.dumps({'status': 'processing', 'step': 'competitors', 'message': 'Analyzing competitors...'})}\n\n"
                
                # Run actual analysis
                results = loop.run_until_complete(
                    lead_agent.analyze_niche(query, location, data.get('options', {}))
                )
                
                # Send final results
                yield f"data: {json.dumps({'status': 'completed', 'results': results})}\n\n"
                
            except Exception as e:
                yield f"data: {json.dumps({'status': 'error', 'error': str(e)})}\n\n"
                
            finally:
                loop.close()
        
        return Response(
            generate(),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'X-Accel-Buffering': 'no'
            }
        )
        
    except Exception as e:
        logger.error(f"Error in analyze_niche_stream: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@niche_bp.route('/keywords/autocomplete', methods=['POST'])
def get_autocomplete():
    """
    Get autocomplete suggestions for a keyword
    """
    try:
        data = request.get_json()
        query = data.get('query')
        location = data.get('location', '')
        
        if not query:
            return jsonify({'error': 'Query is required'}), 400
        
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            scraper = lead_agent.scraper_agent
            suggestions = loop.run_until_complete(
                scraper.get_autocomplete_suggestions(query, location)
            )
            
            return jsonify({
                'success': True,
                'suggestions': suggestions
            })
            
        finally:
            loop.close()
            
    except Exception as e:
        logger.error(f"Error in get_autocomplete: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@niche_bp.route('/competitors/local', methods=['POST'])
def get_local_competitors():
    """
    Get local competitors from Google Maps
    """
    try:
        data = request.get_json()
        query = data.get('query')
        location = data.get('location')
        
        if not query or not location:
            return jsonify({'error': 'Query and location are required'}), 400
        
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            scraper = lead_agent.scraper_agent
            competitors = loop.run_until_complete(
                scraper.get_local_competitors(query, location)
            )
            
            return jsonify({
                'success': True,
                'competitors': competitors
            })
            
        finally:
            loop.close()
            
    except Exception as e:
        logger.error(f"Error in get_local_competitors: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@niche_bp.route('/export/csv', methods=['POST'])
def export_csv():
    """
    Export analysis results as CSV
    """
    try:
        data = request.get_json()
        results = data.get('results')
        
        if not results:
            return jsonify({'error': 'No results to export'}), 400
        
        # Create CSV content
        import csv
        import io
        
        output = io.StringIO()
        
        # Export keywords
        if 'keywords' in results and 'all_keywords' in results['keywords']:
            writer = csv.DictWriter(output, fieldnames=['keyword', 'type', 'intent', 'search_volume_score', 'competition'])
            writer.writeheader()
            
            for kw in results['keywords']['all_keywords']:
                writer.writerow({
                    'keyword': kw.get('keyword', ''),
                    'type': kw.get('type', ''),
                    'intent': kw.get('intent', ''),
                    'search_volume_score': kw.get('search_volume_score', 0),
                    'competition': kw.get('competition', 'unknown')
                })
        
        # Return CSV file
        output.seek(0)
        return Response(
            output.getvalue(),
            mimetype='text/csv',
            headers={
                'Content-Disposition': 'attachment; filename=niche_analysis.csv'
            }
        )
        
    except Exception as e:
        logger.error(f"Error in export_csv: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500