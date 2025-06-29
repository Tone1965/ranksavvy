'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, TrendingUp, Sparkles, Download, Edit, Check, X, AlertCircle } from 'lucide-react'

interface EnhancedNicheFinderProps {
  projectData: any
  setProjectData: (data: any) => void
  autoMode: boolean
  onNext: () => void
}

interface AnalysisResult {
  query: string
  location: string
  timestamp: number
  geographic_data: any
  keywords: any
  competitors: any
  opportunities: any
  recommendations: any
  surprise_opportunities?: any[]
}

export default function EnhancedNicheFinder({ projectData, setProjectData, autoMode, onNext }: EnhancedNicheFinderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState({ step: '', message: '' })
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editableKeywords, setEditableKeywords] = useState<any[]>([])
  const [surpriseMode, setSurpriseMode] = useState(false)
  const [radiusMode, setRadiusMode] = useState(false)
  const [radius, setRadius] = useState(40)
  const eventSourceRef = useRef<EventSource | null>(null)

  const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_URL || 'http://localhost:5000'

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setProgress({ step: 'starting', message: 'Initializing analysis...' })

    try {
      // Use Server-Sent Events for real-time progress
      const eventSource = new EventSource(`${FLASK_API_URL}/api/niche/analyze/stream`, {
        withCredentials: false
      })
      
      eventSourceRef.current = eventSource

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data)
        
        if (data.status === 'processing') {
          setProgress({ step: data.step, message: data.message })
        } else if (data.status === 'completed') {
          setResults(data.results)
          setLoading(false)
          eventSource.close()
          
          // Save to project data
          if (data.results) {
            setProjectData({
              ...projectData,
              nicheAnalysis: data.results,
              selectedNiche: {
                name: data.results.query,
                location: data.results.location,
                keywords: data.results.keywords?.all_keywords || []
              }
            })
          }
        } else if (data.status === 'error') {
          console.error('Analysis error:', data.error)
          setLoading(false)
          eventSource.close()
        }
      }

      eventSource.onerror = () => {
        // Fallback to regular API call if SSE fails
        eventSource.close()
        performRegularAnalysis()
      }

      // Send the analysis request
      const [service, ...locationParts] = searchQuery.split(' ')
      const location = locationParts.join(' ')
      
      await fetch(`${FLASK_API_URL}/api/niche/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: service,
          location: location,
          options: {
            radius: radiusMode ? radius : null,
            surprise_me: surpriseMode
          }
        })
      })

    } catch (error) {
      console.error('Error during analysis:', error)
      setLoading(false)
    }
  }

  const performRegularAnalysis = async () => {
    try {
      const [service, ...locationParts] = searchQuery.split(' ')
      const location = locationParts.join(' ')
      
      const response = await fetch(`${FLASK_API_URL}/api/niche/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: service,
          location: location,
          options: {
            radius: radiusMode ? radius : null,
            surprise_me: surpriseMode
          }
        })
      })

      const data = await response.json()
      if (data.success && data.data) {
        setResults(data.data)
        setProjectData({
          ...projectData,
          nicheAnalysis: data.data,
          selectedNiche: {
            name: data.data.query,
            location: data.data.location,
            keywords: data.data.keywords?.all_keywords || []
          }
        })
      }
    } catch (error) {
      console.error('Error in regular analysis:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    if (!results) return

    try {
      const response = await fetch(`${FLASK_API_URL}/api/niche/export/csv`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results })
      })

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `niche_analysis_${results.query}_${results.location}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting CSV:', error)
    }
  }

  const enterEditMode = () => {
    if (results?.keywords?.all_keywords) {
      setEditableKeywords([...results.keywords.all_keywords])
      setEditMode(true)
    }
  }

  const saveEdits = () => {
    if (results) {
      const updatedResults = {
        ...results,
        keywords: {
          ...results.keywords,
          all_keywords: editableKeywords
        }
      }
      setResults(updatedResults)
      setProjectData({
        ...projectData,
        nicheAnalysis: updatedResults,
        selectedNiche: {
          ...projectData.selectedNiche,
          keywords: editableKeywords
        }
      })
    }
    setEditMode(false)
  }

  const removeKeyword = (index: number) => {
    setEditableKeywords(editableKeywords.filter((_, i) => i !== index))
  }

  const updateKeyword = (index: number, field: string, value: any) => {
    const updated = [...editableKeywords]
    updated[index] = { ...updated[index], [field]: value }
    setEditableKeywords(updated)
  }

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Enhanced Niche Finder
        </h2>
        <p className="text-gray-400">
          Deep local market research with real-time competitor analysis and keyword discovery
        </p>
      </div>

      {/* Search Interface */}
      <div className="space-y-4 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder='Enter service and location (e.g., "HVAC repair Pelham Alabama")'
            className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center space-x-2 text-gray-300">
            <input
              type="checkbox"
              checked={radiusMode}
              onChange={(e) => setRadiusMode(e.target.checked)}
              className="rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
            />
            <MapPin className="w-4 h-4" />
            <span>Custom radius</span>
            {radiusMode && (
              <input
                type="number"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="ml-2 w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                min="1"
                max="100"
              />
            )}
            {radiusMode && <span className="text-gray-400">miles</span>}
          </label>

          <label className="flex items-center space-x-2 text-gray-300">
            <input
              type="checkbox"
              checked={surpriseMode}
              onChange={(e) => setSurpriseMode(e.target.checked)}
              className="rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
            />
            <Sparkles className="w-4 h-4" />
            <span>Surprise me with hidden opportunities</span>
          </label>
        </div>

        <button
          onClick={handleSearch}
          disabled={loading || !searchQuery.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Analyze Market</span>
            </>
          )}
        </button>
      </div>

      {/* Progress Indicator */}
      {loading && progress.message && (
        <div className="mb-6 bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-pulse w-2 h-2 bg-indigo-500 rounded-full"></div>
            <span className="text-gray-300">{progress.message}</span>
          </div>
        </div>
      )}

      {/* Results */}
      {results && !loading && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-1">Keywords Found</h3>
              <p className="text-2xl font-bold text-white">
                {results.keywords?.all_keywords?.length || 0}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {results.keywords?.emergency_keywords?.length || 0} emergency
              </p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-1">Competitors</h3>
              <p className="text-2xl font-bold text-white">
                {(results.competitors?.local?.length || 0) + (results.competitors?.organic?.length || 0)}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {results.competitors?.local?.length || 0} local
              </p>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-1">Opportunities</h3>
              <p className="text-2xl font-bold text-white">
                {results.opportunities?.keyword_gaps?.length || 0}
              </p>
              <p className="text-sm text-gray-400 mt-1">keyword gaps</p>
            </div>
          </div>

          {/* Keywords Section */}
          <div className="bg-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Keywords to Target</h3>
              <div className="flex items-center space-x-2">
                {!editMode ? (
                  <button
                    onClick={enterEditMode}
                    className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="text-sm">Edit</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={saveEdits}
                      className="flex items-center space-x-1 text-green-400 hover:text-green-300"
                    >
                      <Check className="w-4 h-4" />
                      <span className="text-sm">Save</span>
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="flex items-center space-x-1 text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                      <span className="text-sm">Cancel</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {(editMode ? editableKeywords : results.keywords?.all_keywords || []).slice(0, 20).map((keyword, index) => (
                <div key={index} className="bg-gray-800 rounded p-3 flex items-center justify-between">
                  <div className="flex-1">
                    {editMode ? (
                      <input
                        type="text"
                        value={keyword.keyword}
                        onChange={(e) => updateKeyword(index, 'keyword', e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white w-full"
                      />
                    ) : (
                      <span className="text-white">{keyword.keyword}</span>
                    )}
                    <div className="flex items-center space-x-3 mt-1">
                      <span className={`text-xs px-2 py-1 rounded ${
                        keyword.type === 'emergency' ? 'bg-red-900 text-red-300' :
                        keyword.type === 'commercial' ? 'bg-green-900 text-green-300' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {keyword.type}
                      </span>
                      <span className={`text-xs ${
                        keyword.competition === 'low' ? 'text-green-400' :
                        keyword.competition === 'medium' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        Competition: {keyword.competition || 'unknown'}
                      </span>
                      <span className="text-xs text-gray-400">
                        Score: {keyword.search_volume_score || 0}
                      </span>
                    </div>
                  </div>
                  {editMode && (
                    <button
                      onClick={() => removeKeyword(index)}
                      className="ml-3 text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Competitors Section */}
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Top Competitors</h3>
            <div className="space-y-3">
              {results.competitors?.local?.slice(0, 5).map((comp, index) => (
                <div key={index} className="bg-gray-800 rounded p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{comp.name}</span>
                    {comp.rating && (
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-gray-300">{comp.rating}</span>
                        <span className="text-gray-500 text-sm">({comp.reviews_count} reviews)</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Opportunities Section */}
          {results.opportunities?.emergency_keywords?.length > 0 && (
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-yellow-400" />
                High-Value Emergency Keywords
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.opportunities.emergency_keywords.slice(0, 6).map((kw, index) => (
                  <div key={index} className="bg-gray-800 rounded p-3">
                    <span className="text-white">{kw.keyword}</span>
                    <span className="ml-2 text-xs text-green-400">Low competition</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Export CSV</span>
            </button>
            
            <button
              onClick={onNext}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Continue to EMD Finder →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}