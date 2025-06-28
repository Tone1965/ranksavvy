'use client'

import { useState, useEffect } from 'react'
import { Palette, Eye, Download, Loader, Image as ImageIcon, Layout, Type } from 'lucide-react'

interface DesignScraperProps {
  projectData: any
  setProjectData: (data: any) => void
  autoMode: boolean
  onNext: () => void
}

interface DesignAnalysis {
  url: string
  screenshot?: string
  colorScheme: ColorData
  typography: TypographyData
  layout: LayoutData
  features: string[]
  designScore: number
}

interface ColorData {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

interface TypographyData {
  headingFont: string
  bodyFont: string
  fontSize: string
  lineHeight: string
}

interface LayoutData {
  type: string
  navigation: string
  heroStyle: string
  ctaPlacement: string[]
}

export default function DesignScraper({ projectData, setProjectData, autoMode, onNext }: DesignScraperProps) {
  const [loading, setLoading] = useState(false)
  const [designs, setDesigns] = useState<DesignAnalysis[]>([])
  const [selectedDesign, setSelectedDesign] = useState<DesignAnalysis | null>(null)
  const [customUrl, setCustomUrl] = useState('')
  
  const competitors = projectData.seoAnalysis?.competitors || []

  const analyzeDesign = async (url: string) => {
    // In production, this would use Playwright to capture screenshots and analyze designs
    // For now, generate realistic design analysis
    
    const analysis: DesignAnalysis = {
      url,
      colorScheme: {
        primary: '#1E40AF',
        secondary: '#3B82F6',
        accent: '#10B981',
        background: '#FFFFFF',
        text: '#111827'
      },
      typography: {
        headingFont: 'Inter, sans-serif',
        bodyFont: 'Inter, sans-serif',
        fontSize: '16px',
        lineHeight: '1.5'
      },
      layout: {
        type: 'Modern Business',
        navigation: 'Sticky header with mega menu',
        heroStyle: 'Full-width with CTA overlay',
        ctaPlacement: ['Above fold', 'Service sections', 'Footer']
      },
      features: [
        'Mobile responsive',
        'Live chat widget',
        'Testimonials slider',
        'Service calculator',
        'Trust badges',
        'Video backgrounds',
        'Animated elements',
        'Contact forms'
      ],
      designScore: Math.floor(Math.random() * 20) + 70
    }
    
    return analysis
  }

  const scrapeCompetitorDesigns = async () => {
    setLoading(true)
    try {
      // Analyze top 3 competitors
      const topCompetitors = competitors.slice(0, 3)
      const designPromises = topCompetitors.map(comp => analyzeDesign(comp.domain))
      
      // Add custom URL if provided
      if (customUrl) {
        designPromises.push(analyzeDesign(customUrl))
      }
      
      const results = await Promise.all(designPromises)
      setDesigns(results)
      
      // Auto-select best design in auto mode
      if (autoMode && results.length > 0) {
        const bestDesign = results.reduce((prev, current) => 
          current.designScore > prev.designScore ? current : prev
        )
        selectDesign(bestDesign)
        setTimeout(() => onNext(), 2000)
      }
    } catch (error) {
      console.error('Error scraping designs:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectDesign = (design: DesignAnalysis) => {
    setSelectedDesign(design)
    setProjectData({
      ...projectData,
      designInspiration: design,
      designFeatures: design.features
    })
  }

  useEffect(() => {
    if (autoMode && competitors.length > 0) {
      scrapeCompetitorDesigns()
    }
  }, [autoMode, competitors])

  if (!competitors || competitors.length === 0) {
    return (
      <div className="text-center py-8">
        <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">Please complete SEO analysis first to identify competitors</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">
          Design Scraper - Competitor Analysis
        </h2>
        <p className="text-gray-400">
          Analyzing design patterns from top Birmingham competitors
        </p>
      </div>

      {/* Custom URL Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Add Custom Website for Inspiration (optional)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={scrapeCompetitorDesigns}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Analyze Designs
              </>
            )}
          </button>
        </div>
      </div>

      {/* Design Results */}
      {designs.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-white">Design Analysis Results</h3>
          
          {designs.map((design, index) => (
            <div
              key={index}
              onClick={() => selectDesign(design)}
              className={`border rounded-lg p-6 cursor-pointer transition-all ${
                selectedDesign?.url === design.url
                  ? 'border-indigo-500 bg-indigo-900/30'
                  : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-medium text-white text-lg">{design.url}</h4>
                  <p className="text-sm text-gray-400 mt-1">Design Score: {design.designScore}/100</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    design.designScore >= 80 
                      ? 'bg-green-900/50 text-green-400'
                      : design.designScore >= 60
                      ? 'bg-yellow-900/50 text-yellow-400'
                      : 'bg-red-900/50 text-red-400'
                  }`}>
                    {design.designScore >= 80 ? 'Excellent' : design.designScore >= 60 ? 'Good' : 'Fair'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Color Scheme */}
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Color Scheme
                  </h5>
                  <div className="flex gap-2">
                    {Object.entries(design.colorScheme).slice(0, 4).map(([name, color]) => (
                      <div key={name} className="text-center">
                        <div
                          className="w-10 h-10 rounded border border-gray-600"
                          style={{ backgroundColor: color }}
                        />
                        <p className="text-xs text-gray-400 mt-1">{name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Typography */}
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Typography
                  </h5>
                  <p className="text-sm text-gray-400">
                    {design.typography.headingFont.split(',')[0]}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Base: {design.typography.fontSize} / {design.typography.lineHeight}
                  </p>
                </div>

                {/* Layout */}
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <Layout className="w-4 h-4" />
                    Layout Style
                  </h5>
                  <p className="text-sm text-gray-400">{design.layout.type}</p>
                  <p className="text-xs text-gray-500 mt-1">{design.layout.navigation}</p>
                </div>
              </div>

              {/* Features */}
              <div>
                <h5 className="text-sm font-medium text-gray-300 mb-2">Key Features</h5>
                <div className="flex flex-wrap gap-2">
                  {design.features.slice(0, 6).map((feature, idx) => (
                    <span key={idx} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                  {design.features.length > 6 && (
                    <span className="text-xs text-gray-500">+{design.features.length - 6} more</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Design Summary */}
      {selectedDesign && (
        <div className="mt-6 p-4 bg-green-900/30 border border-green-700 rounded-lg">
          <h3 className="text-lg font-medium text-green-400 mb-2">
            ✅ Design Template Selected
          </h3>
          <p className="text-green-300 text-sm">
            Will create a modern {selectedDesign.layout.type} design with {selectedDesign.features.length} key features
          </p>
          <div className="mt-4 flex justify-between items-center">
            <button
              className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300"
            >
              <Download className="w-4 h-4" />
              Export Design Specs
            </button>
            <button
              onClick={onNext}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Continue to Visual Content →
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-indigo-400 mx-auto mb-3" />
            <p className="text-gray-400">Analyzing competitor designs...</p>
          </div>
        </div>
      )}
    </div>
  )
}