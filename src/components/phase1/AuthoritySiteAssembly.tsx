'use client'

import { useState, useEffect } from 'react'
import { Globe, Code, Layers, Server, Database, Check, Loader, AlertCircle, Download, Rocket } from 'lucide-react'

interface AuthoritySiteAssemblyProps {
  projectData: any
  setProjectData: (data: any) => void
  autoMode: boolean
  onNext: () => void
}

interface SiteStructure {
  pages: PageInfo[]
  navigation: NavigationItem[]
  seoConfig: SEOConfig
  contentStrategy: ContentItem[]
  technicalSetup: TechnicalConfig
}

interface PageInfo {
  id: string
  title: string
  slug: string
  type: 'landing' | 'service' | 'about' | 'contact' | 'blog' | 'location'
  status: 'pending' | 'generating' | 'ready'
  content?: string
  seoMeta?: {
    title: string
    description: string
    keywords: string[]
  }
}

interface NavigationItem {
  label: string
  href: string
  children?: NavigationItem[]
}

interface SEOConfig {
  siteName: string
  tagline: string
  schema: any
  robots: string
  sitemap: boolean
}

interface ContentItem {
  type: string
  frequency: string
  topics: string[]
}

interface TechnicalConfig {
  platform: string
  hosting: string
  ssl: boolean
  cdn: boolean
  analytics: boolean
  performance: string[]
}

export default function AuthoritySiteAssembly({ projectData, setProjectData, autoMode, onNext }: AuthoritySiteAssemblyProps) {
  const [loading, setLoading] = useState(false)
  const [siteStructure, setSiteStructure] = useState<SiteStructure | null>(null)
  const [generatingPages, setGeneratingPages] = useState(false)
  const [activeTab, setActiveTab] = useState<'structure' | 'content' | 'technical' | 'preview'>('structure')
  
  const { selectedNiche, selectedDomain, seoAnalysis, designInspiration, visualAssets } = projectData

  const assembleSiteStructure = async () => {
    setLoading(true)
    try {
      // Create comprehensive site structure based on all previous data
      const structure: SiteStructure = {
        pages: [
          {
            id: 'home',
            title: `Birmingham's Premier ${selectedNiche?.name} Services`,
            slug: '/',
            type: 'landing',
            status: 'pending',
            seoMeta: {
              title: `${selectedNiche?.name} Birmingham AL | ${selectedDomain}`,
              description: `Professional ${selectedNiche?.name} services in Birmingham. Expert solutions, competitive pricing, and exceptional customer service. Call today!`,
              keywords: seoAnalysis?.keywords.map((k: any) => k.keyword) || []
            }
          },
          {
            id: 'about',
            title: 'About Our Birmingham Team',
            slug: '/about',
            type: 'about',
            status: 'pending',
            seoMeta: {
              title: `About Us | ${selectedNiche?.name} Experts in Birmingham`,
              description: `Learn about Birmingham's trusted ${selectedNiche?.name} professionals. Years of experience serving the local community.`,
              keywords: ['about', selectedNiche?.name, 'birmingham', 'team']
            }
          },
          // Service pages based on niche subcategories
          ...selectedNiche?.subcategories?.map((sub: string, index: number) => ({
            id: `service-${index + 1}`,
            title: sub,
            slug: `/services/${sub.toLowerCase().replace(/\s+/g, '-')}`,
            type: 'service' as const,
            status: 'pending' as const,
            seoMeta: {
              title: `${sub} | ${selectedNiche?.name} Birmingham`,
              description: `Professional ${sub} services in Birmingham AL. Quality work guaranteed.`,
              keywords: [sub.toLowerCase(), 'birmingham', 'service']
            }
          })) || [],
          // Location pages for local SEO
          {
            id: 'location-1',
            title: 'Serving Downtown Birmingham',
            slug: '/areas/downtown-birmingham',
            type: 'location',
            status: 'pending'
          },
          {
            id: 'location-2',
            title: 'Serving Mountain Brook',
            slug: '/areas/mountain-brook',
            type: 'location',
            status: 'pending'
          },
          {
            id: 'contact',
            title: 'Contact Us',
            slug: '/contact',
            type: 'contact',
            status: 'pending'
          }
        ],
        navigation: [
          { label: 'Home', href: '/' },
          { 
            label: 'Services', 
            href: '/services',
            children: selectedNiche?.subcategories?.map((sub: string) => ({
              label: sub,
              href: `/services/${sub.toLowerCase().replace(/\s+/g, '-')}`
            }))
          },
          { label: 'About', href: '/about' },
          { 
            label: 'Service Areas', 
            href: '/areas',
            children: [
              { label: 'Downtown Birmingham', href: '/areas/downtown-birmingham' },
              { label: 'Mountain Brook', href: '/areas/mountain-brook' },
              { label: 'Homewood', href: '/areas/homewood' },
              { label: 'Vestavia Hills', href: '/areas/vestavia-hills' }
            ]
          },
          { label: 'Contact', href: '/contact' }
        ],
        seoConfig: {
          siteName: selectedDomain || 'Birmingham Business',
          tagline: `Birmingham's Trusted ${selectedNiche?.name} Experts`,
          schema: {
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: selectedDomain,
            description: `Professional ${selectedNiche?.name} services in Birmingham AL`,
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Birmingham',
              addressRegion: 'AL',
              addressCountry: 'US'
            }
          },
          robots: 'index, follow',
          sitemap: true
        },
        contentStrategy: [
          {
            type: 'Blog Posts',
            frequency: 'Weekly',
            topics: [
              `${selectedNiche?.name} tips for Birmingham homeowners`,
              'Seasonal maintenance guides',
              'Local case studies and success stories',
              'Industry news and updates'
            ]
          },
          {
            type: 'Service Updates',
            frequency: 'Monthly',
            topics: [
              'New service offerings',
              'Team member spotlights',
              'Community involvement'
            ]
          }
        ],
        technicalSetup: {
          platform: 'Next.js 14',
          hosting: 'Vercel',
          ssl: true,
          cdn: true,
          analytics: true,
          performance: [
            'Image optimization with next/image',
            'Static generation for fast loads',
            'Edge caching for global performance',
            'Core Web Vitals optimized'
          ]
        }
      }
      
      setSiteStructure(structure)
      setProjectData({
        ...projectData,
        siteStructure: structure,
        siteStatus: 'structured'
      })
      
      if (autoMode) {
        setTimeout(() => generatePages(), 2000)
      }
    } catch (error) {
      console.error('Error assembling site:', error)
    } finally {
      setLoading(false)
    }
  }

  const generatePages = async () => {
    if (!siteStructure) return
    
    setGeneratingPages(true)
    try {
      // Simulate page generation
      const updatedPages = [...siteStructure.pages]
      
      for (let i = 0; i < updatedPages.length; i++) {
        updatedPages[i].status = 'generating'
        setSiteStructure({ ...siteStructure, pages: [...updatedPages] })
        
        await new Promise(resolve => setTimeout(resolve, 500))
        
        updatedPages[i].status = 'ready'
        updatedPages[i].content = `Page content for ${updatedPages[i].title}`
        setSiteStructure({ ...siteStructure, pages: [...updatedPages] })
      }
      
      if (autoMode) {
        setTimeout(() => onNext(), 2000)
      }
    } finally {
      setGeneratingPages(false)
    }
  }

  useEffect(() => {
    if (autoMode && selectedNiche && selectedDomain && seoAnalysis && designInspiration && visualAssets) {
      assembleSiteStructure()
    }
  }, [autoMode])

  if (!selectedNiche || !selectedDomain || !seoAnalysis || !designInspiration || !visualAssets) {
    return (
      <div className="text-center py-8">
        <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">Please complete all previous steps first</p>
        <div className="mt-4 text-sm text-gray-500">
          <p>Required: Niche selection, Domain, SEO analysis, Design, and Visual assets</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">
          Authority Site Assembly
        </h2>
        <p className="text-gray-400">
          Building complete site structure for {selectedDomain}
        </p>
      </div>

      {/* Assembly Button */}
      {!siteStructure && (
        <div className="text-center py-8">
          <button
            onClick={assembleSiteStructure}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Assembling Site Structure...
              </>
            ) : (
              <>
                <Layers className="w-5 h-5" />
                Begin Site Assembly
              </>
            )}
          </button>
        </div>
      )}

      {/* Site Structure Display */}
      {siteStructure && (
        <>
          {/* Tabs */}
          <div className="flex space-x-4 mb-6 border-b border-gray-700">
            {[
              { id: 'structure', label: 'Site Structure', icon: Layers },
              { id: 'content', label: 'Content Strategy', icon: Code },
              { id: 'technical', label: 'Technical Setup', icon: Server },
              { id: 'preview', label: 'Preview', icon: Globe }
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
            {activeTab === 'structure' && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Page Structure</h3>
                
                {/* Generate Pages Button */}
                {siteStructure.pages.some(p => p.status === 'pending') && (
                  <button
                    onClick={generatePages}
                    disabled={generatingPages}
                    className="mb-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                  >
                    {generatingPages ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Generating Pages...
                      </>
                    ) : (
                      <>
                        <Code className="w-4 h-4" />
                        Generate All Pages
                      </>
                    )}
                  </button>
                )}

                <div className="space-y-3">
                  {siteStructure.pages.map((page) => (
                    <div key={page.id} className="bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-gray-400" />
                          <div>
                            <h4 className="font-medium text-white">{page.title}</h4>
                            <p className="text-sm text-gray-400">{page.slug}</p>
                          </div>
                        </div>
                        <span className={`text-sm px-2 py-1 rounded ${
                          page.status === 'ready' 
                            ? 'bg-green-900/50 text-green-400'
                            : page.status === 'generating'
                            ? 'bg-yellow-900/50 text-yellow-400'
                            : 'bg-gray-700 text-gray-400'
                        }`}>
                          {page.status === 'ready' && <Check className="w-4 h-4 inline mr-1" />}
                          {page.status === 'generating' && <Loader className="w-4 h-4 inline mr-1 animate-spin" />}
                          {page.status}
                        </span>
                      </div>
                      {page.seoMeta && (
                        <div className="mt-2 text-xs text-gray-500">
                          SEO: {page.seoMeta.title}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Navigation Structure */}
                <h4 className="text-md font-medium text-white mt-6 mb-3">Navigation Menu</h4>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {siteStructure.navigation.map((item, index) => (
                      <li key={index}>
                        <span className="text-gray-300">{item.label}</span>
                        {item.children && (
                          <ul className="ml-4 mt-1 space-y-1">
                            {item.children.map((child, idx) => (
                              <li key={idx} className="text-sm text-gray-400">
                                • {child.label}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Content Strategy</h3>
                <div className="space-y-4">
                  {siteStructure.contentStrategy.map((strategy, index) => (
                    <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-white">{strategy.type}</h4>
                        <span className="text-sm text-indigo-400">{strategy.frequency}</span>
                      </div>
                      <ul className="space-y-1">
                        {strategy.topics.map((topic, idx) => (
                          <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'technical' && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Technical Configuration</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Platform & Hosting</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Platform</span>
                        <span className="text-white">{siteStructure.technicalSetup.platform}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Hosting</span>
                        <span className="text-white">{siteStructure.technicalSetup.hosting}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">SSL Certificate</span>
                        <Check className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">CDN Enabled</span>
                        <Check className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Analytics</span>
                        <Check className="w-5 h-5 text-green-500" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Performance Features</h4>
                    <ul className="space-y-1">
                      {siteStructure.technicalSetup.performance.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-500 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* SEO Configuration */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">SEO Configuration</h4>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Site Name:</span>
                        <span className="text-white ml-2">{siteStructure.seoConfig.siteName}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Tagline:</span>
                        <span className="text-white ml-2">{siteStructure.seoConfig.tagline}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Robots:</span>
                        <span className="text-white ml-2">{siteStructure.seoConfig.robots}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Sitemap:</span>
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Site Preview</h3>
                <div className="bg-gray-700/50 rounded-lg p-6">
                  <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <Globe className="w-16 h-16 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">Live preview will be available after deployment</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 mb-1">Domain</p>
                      <p className="text-white font-medium">{selectedDomain}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Total Pages</p>
                      <p className="text-white font-medium">{siteStructure.pages.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Design Style</p>
                      <p className="text-white font-medium">{designInspiration?.layout?.type || 'Modern Business'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Visual Assets</p>
                      <p className="text-white font-medium">{visualAssets?.length || 0} ready</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Section */}
          {siteStructure.pages.every(p => p.status === 'ready') && (
            <div className="mt-6 p-4 bg-green-900/30 border border-green-700 rounded-lg">
              <div className="flex items-start gap-3">
                <Rocket className="w-6 h-6 text-green-400 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-green-400 mb-2">
                    Authority Site Ready for Launch!
                  </h3>
                  <p className="text-green-300 text-sm mb-4">
                    Your Birmingham {selectedNiche?.name} authority site is fully assembled and ready for deployment
                  </p>
                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-green-400 font-medium">{siteStructure.pages.length}</p>
                      <p className="text-green-300">Pages Created</p>
                    </div>
                    <div>
                      <p className="text-green-400 font-medium">{visualAssets?.length || 0}</p>
                      <p className="text-green-300">Visual Assets</p>
                    </div>
                    <div>
                      <p className="text-green-400 font-medium">100%</p>
                      <p className="text-green-300">SEO Optimized</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <button className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300">
                      <Download className="w-4 h-4" />
                      Export Site Package
                    </button>
                    <button
                      onClick={onNext}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
                    >
                      Continue to Phase 2 →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-indigo-400 mx-auto mb-3" />
            <p className="text-gray-400">Assembling your authority site...</p>
          </div>
        </div>
      )}
    </div>
  )
}