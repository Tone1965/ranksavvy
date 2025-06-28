'use client'

import { useState, useEffect } from 'react'
import { Camera, Image as ImageIcon, Video, FileText, Upload, Loader, Check, Download } from 'lucide-react'

interface VisualContentBuilderProps {
  projectData: any
  setProjectData: (data: any) => void
  autoMode: boolean
  onNext: () => void
}

interface ContentAsset {
  id: string
  type: 'image' | 'video' | 'graphic'
  title: string
  description: string
  category: string
  status: 'generating' | 'ready' | 'error'
  url?: string
  thumbnail?: string
}

export default function VisualContentBuilder({ projectData, setProjectData, autoMode, onNext }: VisualContentBuilderProps) {
  const [loading, setLoading] = useState(false)
  const [assets, setAssets] = useState<ContentAsset[]>([])
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<'all' | 'hero' | 'services' | 'testimonials' | 'about'>('all')
  
  const selectedNiche = projectData.selectedNiche
  const designFeatures = projectData.designFeatures || []

  const generateVisualContent = async () => {
    setLoading(true)
    try {
      // In production, this would call AI image generation APIs
      // For now, create placeholder assets based on niche and design
      
      const contentPlan: ContentAsset[] = [
        // Hero Section
        {
          id: 'hero-1',
          type: 'image',
          title: 'Hero Background - Birmingham Skyline',
          description: `Professional ${selectedNiche?.name} services with Birmingham skyline`,
          category: 'hero',
          status: 'ready'
        },
        {
          id: 'hero-2',
          type: 'video',
          title: 'Hero Video Background',
          description: 'Professional team in action, Birmingham location shots',
          category: 'hero',
          status: 'ready'
        },
        
        // Service Images
        ...Array.from({ length: 4 }, (_, i) => ({
          id: `service-${i + 1}`,
          type: 'image' as const,
          title: `Service Image ${i + 1}`,
          description: `${selectedNiche?.name} service demonstration`,
          category: 'services',
          status: 'ready' as const
        })),
        
        // Testimonial Graphics
        {
          id: 'testimonial-1',
          type: 'graphic',
          title: 'Customer Review Badge',
          description: '5-star rating graphic with Birmingham customer quote',
          category: 'testimonials',
          status: 'ready'
        },
        {
          id: 'testimonial-2',
          type: 'image',
          title: 'Happy Customer Photo',
          description: 'Satisfied Birmingham customer portrait',
          category: 'testimonials',
          status: 'ready'
        },
        
        // About/Trust Elements
        {
          id: 'about-1',
          type: 'graphic',
          title: 'Years in Business Badge',
          description: 'Established in Birmingham graphic',
          category: 'about',
          status: 'ready'
        },
        {
          id: 'about-2',
          type: 'image',
          title: 'Team Photo',
          description: 'Professional team serving Birmingham',
          category: 'about',
          status: 'ready'
        },
        {
          id: 'about-3',
          type: 'graphic',
          title: 'Certifications & Awards',
          description: 'Industry certifications and local awards',
          category: 'about',
          status: 'ready'
        }
      ]
      
      setAssets(contentPlan)
      
      // Auto-select essential assets
      if (autoMode) {
        const essentialAssets = ['hero-1', 'service-1', 'service-2', 'testimonial-1', 'about-1']
        setSelectedAssets(essentialAssets)
        setProjectData({
          ...projectData,
          visualAssets: contentPlan.filter(a => essentialAssets.includes(a.id))
        })
        setTimeout(() => onNext(), 2000)
      }
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAssetSelection = (assetId: string) => {
    const newSelection = selectedAssets.includes(assetId)
      ? selectedAssets.filter(id => id !== assetId)
      : [...selectedAssets, assetId]
    
    setSelectedAssets(newSelection)
    setProjectData({
      ...projectData,
      visualAssets: assets.filter(a => newSelection.includes(a.id))
    })
  }

  useEffect(() => {
    if (autoMode && selectedNiche) {
      generateVisualContent()
    }
  }, [autoMode, selectedNiche])

  const filteredAssets = activeCategory === 'all' 
    ? assets 
    : assets.filter(a => a.category === activeCategory)

  const getIconForType = (type: string) => {
    switch (type) {
      case 'image': return ImageIcon
      case 'video': return Video
      case 'graphic': return FileText
      default: return ImageIcon
    }
  }

  if (!selectedNiche) {
    return (
      <div className="text-center py-8">
        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">Please complete previous steps first</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">
          Visual Content Builder
        </h2>
        <p className="text-gray-400">
          Creating visual assets for {selectedNiche.name} in Birmingham
        </p>
      </div>

      {/* Generate Button */}
      {assets.length === 0 && (
        <div className="text-center py-8">
          <button
            onClick={generateVisualContent}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Generating Visual Content...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                Generate Visual Assets
              </>
            )}
          </button>
        </div>
      )}

      {/* Category Filters */}
      {assets.length > 0 && (
        <>
          <div className="flex space-x-2 mb-6 border-b border-gray-700">
            {['all', 'hero', 'services', 'testimonials', 'about'].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category as any)}
                className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                  activeCategory === category
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {category}
                <span className="ml-2 text-xs">
                  ({assets.filter(a => category === 'all' || a.category === category).length})
                </span>
              </button>
            ))}
          </div>

          {/* Asset Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filteredAssets.map((asset) => {
              const Icon = getIconForType(asset.type)
              const isSelected = selectedAssets.includes(asset.id)
              
              return (
                <div
                  key={asset.id}
                  onClick={() => toggleAssetSelection(asset.id)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-900/30'
                      : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-400 capitalize">{asset.type}</span>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-indigo-400" />
                    )}
                  </div>
                  
                  <div className="aspect-video bg-gray-700/50 rounded mb-3 flex items-center justify-center">
                    <Icon className="w-12 h-12 text-gray-600" />
                  </div>
                  
                  <h4 className="font-medium text-white text-sm mb-1">{asset.title}</h4>
                  <p className="text-xs text-gray-400">{asset.description}</p>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded ${
                      asset.status === 'ready' 
                        ? 'bg-green-900/50 text-green-400'
                        : 'bg-yellow-900/50 text-yellow-400'
                    }`}>
                      {asset.status}
                    </span>
                    <button className="text-xs text-indigo-400 hover:text-indigo-300">
                      Preview
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Content Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-semibold text-white">{assets.length}</p>
                <p className="text-sm text-gray-400">Total Assets</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-indigo-400">{selectedAssets.length}</p>
                <p className="text-sm text-gray-400">Selected</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-green-400">
                  {assets.filter(a => a.type === 'image').length}
                </p>
                <p className="text-sm text-gray-400">Images</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-blue-400">
                  {assets.filter(a => a.type === 'video').length}
                </p>
                <p className="text-sm text-gray-400">Videos</p>
              </div>
            </div>
            
            {selectedAssets.length > 0 && (
              <div className="mt-4 p-4 bg-green-900/30 border border-green-700 rounded-lg">
                <h3 className="text-lg font-medium text-green-400 mb-2">
                  ✅ Visual Content Ready
                </h3>
                <p className="text-green-300 text-sm">
                  {selectedAssets.length} assets selected for your Birmingham {selectedNiche.name} website
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <button className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300">
                    <Download className="w-4 h-4" />
                    Export All Assets
                  </button>
                  <button
                    onClick={onNext}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Continue to Site Assembly →
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}