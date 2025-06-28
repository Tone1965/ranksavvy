'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, BarChart3, TrendingUp, AlertCircle, Check, Loader, X } from 'lucide-react'

interface UnifiedSEOToolProps {
  projectData: any
  setProjectData: (data: any) => void
  autoMode: boolean
  onNext: () => void
}

interface SEOAnalysis {
  keywords: KeywordData[]
  localSEO: LocalSEOData
  competitors: CompetitorData[]
  recommendations: string[]
}

interface KeywordData {
  keyword: string
  searchVolume: number
  difficulty: string
  cpc: string
  intent: string
}

interface LocalSEOData {
  googleMyBusiness: boolean
  citations: number
  reviews: number
  localPackRanking: number
}

interface CompetitorData {
  domain: string
  da: number
  backlinks: number
  ranking: number
  weaknesses: string[]
}

export default function UnifiedSEOTool({ projectData, setProjectData, autoMode, onNext }: UnifiedSEOToolProps) {
  const [loading, setLoading] = useState(false)
  const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysis | null>(null)
  const [activeTab, setActiveTab] = useState<'keywords' | 'local' | 'competitors' | 'technical'>('keywords')
  
  const selectedNiche = projectData.selectedNiche
  const selectedDomain = projectData.selectedDomain

  const performSEOAnalysis = async () => {
    setLoading(true)
    try {
      // In production, this would call Claude API for real SEO analysis
      // For now, generate realistic SEO data based on the niche
      
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      
      const analysis: SEOAnalysis = {
        keywords: [
          {
            keyword: `${selectedNiche.name.toLowerCase()} birmingham`,
            searchVolume: 1200,
            difficulty: 'Medium',
            cpc: '$3.45',
            intent: 'Commercial'
          },
          {
            keyword: `best ${selectedNiche.name.toLowerCase()} birmingham al`,
            searchVolume: 890,
            difficulty: 'Low',
            cpc: '$2.89',
            intent: 'Commercial'
          },
          {
            keyword: `${selectedNiche.name.split(' ')[0].toLowerCase()} services near me`,
            searchVolume: 2100,
            difficulty: 'High',
            cpc: '$4.12',
            intent: 'Transactional'
          },
          {
            keyword: `affordable ${selectedNiche.name.toLowerCase()} birmingham`,
            searchVolume: 650,
            difficulty: 'Low',
            cpc: '$2.34',
            intent: 'Commercial'
          },
          {
            keyword: `emergency ${selectedNiche.name.split(' ')[0].toLowerCase()} birmingham`,
            searchVolume: 450,
            difficulty: 'Low',
            cpc: '$5.67',
            intent: 'Transactional'
          }
        ],
        localSEO: {
          googleMyBusiness: false,
          citations: 0,
          reviews: 0,
          localPackRanking: 0
        },
        competitors: [
          {
            domain: 'competitor1.com',
            da: 35,
            backlinks: 1250,
            ranking: 1,
            weaknesses: ['Poor mobile experience', 'Slow page speed', 'Thin content']
          },
          {
            domain: 'competitor2.com',
            da: 28,
            backlinks: 890,
            ranking: 2,
            weaknesses: ['No schema markup', 'Missing local citations', 'Outdated design']
          },
          {
            domain: 'competitor3.com',
            da: 42,
            backlinks: 2100,
            ranking: 3,
            weaknesses: ['Limited service pages', 'No blog content', 'Poor internal linking']
          }
        ],
        recommendations: [
          'Create location-specific landing pages for each Birmingham neighborhood',
          'Implement local business schema markup',
          'Build citations on 50+ local directories',
          'Create a Google My Business profile and optimize it',
          'Target long-tail keywords with buying intent',
          'Build relationships with local Birmingham businesses for backlinks',
          'Create content about Birmingham-specific topics and events',
          'Optimize for "near me" searches with proper NAP consistency'
        ]
      }
      
      setSeoAnalysis(analysis)
      setProjectData({
        ...projectData,
        seoAnalysis: analysis,
        targetKeywords: analysis.keywords.slice(0, 3)
      })
      
      if (autoMode) {
        setTimeout(() => onNext(), 3000)
      }
    } catch (error) {
      console.error('Error performing SEO analysis:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoMode && selectedNiche && selectedDomain) {
      performSEOAnalysis()
    }
  }, [autoMode, selectedNiche, selectedDomain])

  if (!selectedNiche || !selectedDomain) {
    return (
      <div className="text-center py-8">
        <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">Please complete niche selection and domain choice first</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">
          Unified SEO Tool - Local Optimization
        </h2>
        <p className="text-gray-400">
          Optimizing <span className="text-indigo-400">{selectedDomain}</span> for Birmingham market
        </p>
      </div>

      {/* Analysis Button */}
      {!seoAnalysis && (
        <div className="text-center py-8">
          <button
            onClick={performSEOAnalysis}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Analyzing SEO Landscape...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Start SEO Analysis
              </>
            )}
          </button>
        </div>
      )}

      {/* Analysis Results */}
      {seoAnalysis && (
        <>
          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b border-gray-700">
            {[
              { id: 'keywords', label: 'Keywords', icon: Search },
              { id: 'local', label: 'Local SEO', icon: MapPin },
              { id: 'competitors', label: 'Competitors', icon: BarChart3 },
              { id: 'technical', label: 'Technical', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-gray-800/50 rounded-lg p-6">
            {activeTab === 'keywords' && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Target Keywords</h3>
                <div className="space-y-3">
                  {seoAnalysis.keywords.map((kw, index) => (
                    <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">{kw.keyword}</span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          kw.difficulty === 'Low' ? 'bg-green-900/50 text-green-400' :
                          kw.difficulty === 'Medium' ? 'bg-yellow-900/50 text-yellow-400' :
                          'bg-red-900/50 text-red-400'
                        }`}>
                          {kw.difficulty}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Volume:</span>
                          <span className="text-white ml-2">{kw.searchVolume.toLocaleString()}/mo</span>
                        </div>
                        <div>
                          <span className="text-gray-400">CPC:</span>
                          <span className="text-white ml-2">{kw.cpc}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Intent:</span>
                          <span className="text-white ml-2">{kw.intent}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'local' && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Local SEO Status</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-3">Current Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Google My Business</span>
                        <X className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Local Citations</span>
                        <span className="text-white">0</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Reviews</span>
                        <span className="text-white">0</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Local Pack Ranking</span>
                        <span className="text-white">Not ranked</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-3">Action Items</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <span className="text-gray-300">Create and verify GMB listing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <span className="text-gray-300">Build 50+ local citations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <span className="text-gray-300">Implement local schema markup</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <span className="text-gray-300">Create location pages</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'competitors' && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Competitor Analysis</h3>
                <div className="space-y-4">
                  {seoAnalysis.competitors.map((comp, index) => (
                    <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="font-medium text-white">{comp.domain}</span>
                          <span className="text-sm text-gray-400 ml-2">Rank #{comp.ranking}</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          DA: {comp.da} | Backlinks: {comp.backlinks.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Weaknesses:</p>
                        <div className="flex flex-wrap gap-2">
                          {comp.weaknesses.map((weakness, idx) => (
                            <span key={idx} className="text-xs bg-red-900/30 text-red-400 px-2 py-1 rounded">
                              {weakness}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'technical' && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">SEO Recommendations</h3>
                <div className="grid gap-3">
                  {seoAnalysis.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 bg-gray-700/50 rounded-lg p-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-gray-300">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Continue Button */}
          <div className="mt-6 p-4 bg-indigo-900/30 border border-indigo-700 rounded-lg">
            <h3 className="text-lg font-medium text-indigo-400 mb-2">
              SEO Strategy Ready
            </h3>
            <p className="text-indigo-300 text-sm">
              Complete SEO analysis and optimization strategy prepared
            </p>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-indigo-400">
                {seoAnalysis.keywords.length} keywords identified, {seoAnalysis.recommendations.length} recommendations
              </div>
              <button
                onClick={onNext}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Continue to Design Scraper →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}