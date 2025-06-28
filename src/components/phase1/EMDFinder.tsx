'use client'

import { useState, useEffect } from 'react'
import { Globe, Search, Check, X, Loader } from 'lucide-react'

interface EMDFinderProps {
  projectData: any
  setProjectData: (data: any) => void
  autoMode: boolean
  onNext: () => void
}

interface DomainResult {
  domain: string
  available: boolean
  price?: string
  registrar?: string
  alternatives?: string[]
}

export default function EMDFinder({ projectData, setProjectData, autoMode, onNext }: EMDFinderProps) {
  const [loading, setLoading] = useState(false)
  const [domains, setDomains] = useState<DomainResult[]>([])
  const [selectedDomain, setSelectedDomain] = useState<string>('')
  const [customKeywords, setCustomKeywords] = useState('')
  
  const selectedNiche = projectData.selectedNiche

  const generateDomainSuggestions = () => {
    if (!selectedNiche) return []
    
    const niche = selectedNiche.name.toLowerCase()
    const keywords = niche.split(' ').filter((word: string) => word.length > 3)
    const location = 'birmingham'
    const tlds = ['.com', '.net', '.org', '.biz', '.co']
    
    const suggestions = []
    
    // Location + keyword combinations
    keywords.forEach((keyword: string) => {
      suggestions.push(`${location}${keyword}`)
      suggestions.push(`${keyword}${location}`)
      suggestions.push(`${location}-${keyword}`)
    })
    
    // Industry specific
    if (customKeywords) {
      customKeywords.split(',').forEach(kw => {
        const cleanKw = kw.trim().toLowerCase().replace(/\s+/g, '')
        suggestions.push(cleanKw)
        suggestions.push(`${location}${cleanKw}`)
        suggestions.push(`${cleanKw}al`) // Alabama
      })
    }
    
    // Generate full domain names
    const fullDomains: string[] = []
    suggestions.forEach(base => {
      tlds.forEach(tld => {
        fullDomains.push(base + tld)
      })
    })
    
    return fullDomains.slice(0, 20) // Limit to 20 suggestions
  }

  const checkDomainAvailability = async () => {
    setLoading(true)
    try {
      // Generate domain suggestions
      const suggestions = generateDomainSuggestions()
      
      // In production, this would call a real domain checking API
      // For now, simulate with realistic results
      const results: DomainResult[] = suggestions.map((domain, index) => ({
        domain,
        available: Math.random() > 0.7, // 30% availability rate
        price: Math.random() > 0.5 ? '$12.99/year' : '$14.99/year',
        registrar: ['GoDaddy', 'Namecheap', 'Google Domains'][Math.floor(Math.random() * 3)],
        alternatives: index === 0 ? [
          domain.replace('.com', '.net'),
          domain.replace('.com', '.co'),
          'best' + domain
        ] : undefined
      }))
      
      setDomains(results)
      
      if (autoMode && results.some(d => d.available)) {
        const firstAvailable = results.find(d => d.available)
        if (firstAvailable) {
          selectDomain(firstAvailable.domain)
          setTimeout(() => onNext(), 2000)
        }
      }
    } catch (error) {
      console.error('Error checking domains:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectDomain = (domain: string) => {
    setSelectedDomain(domain)
    setProjectData({ 
      ...projectData, 
      selectedDomain: domain,
      domainStatus: 'reserved'
    })
  }

  useEffect(() => {
    if (autoMode && selectedNiche) {
      checkDomainAvailability()
    }
  }, [autoMode, selectedNiche])

  if (!selectedNiche) {
    return (
      <div className="text-center py-8">
        <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">Please select a niche first from the Micro-Niche Builder</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">
          EMD Finder - Exact Match Domains
        </h2>
        <p className="text-gray-400">
          Finding perfect domain names for: <span className="text-indigo-400 font-medium">{selectedNiche.name}</span>
        </p>
      </div>

      {/* Custom Keywords */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Additional Keywords (optional)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customKeywords}
            onChange={(e) => setCustomKeywords(e.target.value)}
            placeholder="hvac, cooling, heating (comma separated)"
            className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={checkDomainAvailability}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Check Domains
              </>
            )}
          </button>
        </div>
      </div>

      {/* Domain Results */}
      {domains.length > 0 && (
        <div className="space-y-3 mb-6">
          <h3 className="text-lg font-medium text-white">
            Domain Availability ({domains.filter(d => d.available).length} available)
          </h3>
          <div className="grid gap-3">
            {domains.map((domain, index) => (
              <div
                key={index}
                onClick={() => domain.available && selectDomain(domain.domain)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedDomain === domain.domain
                    ? 'border-indigo-500 bg-indigo-900/30'
                    : domain.available
                    ? 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
                    : 'border-gray-700 bg-gray-800/30 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-white">{domain.domain}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {domain.available ? (
                      <>
                        <span className="text-green-400 text-sm">{domain.price}</span>
                        <Check className="w-5 h-5 text-green-500" />
                      </>
                    ) : (
                      <>
                        <span className="text-gray-500 text-sm">Taken</span>
                        <X className="w-5 h-5 text-red-500" />
                      </>
                    )}
                  </div>
                </div>
                {domain.available && (
                  <p className="text-sm text-gray-400 mt-1">
                    Register with {domain.registrar}
                  </p>
                )}
                {domain.alternatives && !domain.available && (
                  <div className="mt-2 text-sm text-gray-400">
                    Try: {domain.alternatives.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Domain Summary */}
      {selectedDomain && (
        <div className="mt-6 p-4 bg-green-900/30 border border-green-700 rounded-lg">
          <h3 className="text-lg font-medium text-green-400 mb-2">
            ✅ Domain Selected: {selectedDomain}
          </h3>
          <p className="text-green-300 text-sm">
            Ready to proceed to SEO optimization setup
          </p>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-green-400">
              Domain will be configured for Birmingham local SEO
            </div>
            <button
              onClick={onNext}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Continue to SEO Tool →
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-indigo-400 mx-auto mb-3" />
            <p className="text-gray-400">Checking domain availability...</p>
          </div>
        </div>
      )}
    </div>
  )
}