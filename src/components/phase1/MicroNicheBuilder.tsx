'use client'

import { useState, useEffect } from 'react'

interface MicroNicheBuilderProps {
  projectData: any
  setProjectData: (data: any) => void
  autoMode: boolean
  onNext: () => void
}

export default function MicroNicheBuilder({ projectData, setProjectData, autoMode, onNext }: MicroNicheBuilderProps) {
  const [loading, setLoading] = useState(false)
  const [niches, setNiches] = useState<any[]>([])
  const [selectedNiche, setSelectedNiche] = useState<any>(null)

  const findBirminghamNiches = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/phase1/micro-niche', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'Birmingham, Alabama',
          businessTypes: [
            'home services', 'restaurants', 'healthcare', 'legal services',
            'automotive', 'real estate', 'beauty & wellness', 'education',
            'financial services', 'entertainment', 'retail', 'construction'
          ],
          marketResearch: true
        })
      })
      
      const data = await response.json()
      setNiches(data.niches || [])
      
      if (autoMode && data.niches?.length > 0) {
        const topNiche = data.niches[0]
        setSelectedNiche(topNiche)
        setProjectData({ ...projectData, selectedNiche: topNiche })
        setTimeout(() => onNext(), 2000)
      }
    } catch (error) {
      console.error('Error finding niches:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectNiche = (niche: any) => {
    setSelectedNiche(niche)
    setProjectData({ ...projectData, selectedNiche: niche })
  }

  useEffect(() => {
    if (autoMode) {
      findBirminghamNiches()
    }
  }, [autoMode])

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Micro-Niche Builder
        </h2>
        <p className="text-gray-600">
          Discover profitable micro-niches in the Birmingham, Alabama market using real market data.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6">
        <button
          onClick={findBirminghamNiches}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg font-medium"
        >
          {loading ? 'Analyzing Birmingham Market...' : 'Find Profitable Niches'}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Researching Birmingham market opportunities...</span>
        </div>
      )}

      {/* Niche Results */}
      {niches.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Profitable Birmingham Niches Found ({niches.length})
          </h3>
          <div className="grid gap-4">
            {niches.map((niche, index) => (
              <div
                key={index}
                onClick={() => selectNiche(niche)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedNiche?.id === niche.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{niche.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{niche.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Competition: {niche.competitionLevel}
                      </span>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        Market Size: {niche.marketSize}
                      </span>
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                        Profit Potential: {niche.profitPotential}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">
                      ${niche.avgMonthlyRevenue}
                    </div>
                    <div className="text-sm text-gray-500">avg/month</div>
                  </div>
                </div>
                
                {/* Market Insights */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Market Insights:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {niche.insights?.map((insight: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Niche Summary */}
      {selectedNiche && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-medium text-green-900 mb-2">
            ✅ Selected Niche: {selectedNiche.name}
          </h3>
          <p className="text-green-700">{selectedNiche.description}</p>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-green-600">
              Ready to proceed to EMD Finder
            </div>
            <button
              onClick={onNext}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Continue to EMD Finder →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}