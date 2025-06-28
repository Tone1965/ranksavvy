'use client'

import { useState } from 'react'
import MicroNicheBuilder from './phase1/MicroNicheBuilder'
import EMDFinder from './phase1/EMDFinder'
import UnifiedSEOTool from './phase1/UnifiedSEOTool'
import DesignScraper from './phase1/DesignScraper'
import VisualContentBuilder from './phase1/VisualContentBuilder'
import AuthoritySiteAssembly from './phase1/AuthoritySiteAssembly'
import SEOAgent from './phase2/SEOAgent'
import ADSAgent from './phase2/ADSAgent'
import EmailMarketingAgent from './phase2/EmailMarketingAgent'
import AIAgentController from './phase2/AIAgentController'

type Phase1Step = 'micro-niche' | 'emd-finder' | 'seo-tool' | 'design-scraper' | 'visual-content' | 'site-assembly'
type Phase2Agent = 'seo' | 'ads' | 'email' | 'ai-controller'

export default function Dashboard() {
  const [currentPhase, setCurrentPhase] = useState<1 | 2>(1)
  const [currentStep, setCurrentStep] = useState<Phase1Step>('micro-niche')
  const [autoMode, setAutoMode] = useState(false)
  const [projectData, setProjectData] = useState<any>({})

  const phase1Steps: { key: Phase1Step; name: string; description: string }[] = [
    { key: 'micro-niche', name: 'Micro-Niche Builder', description: 'Find profitable Birmingham niches' },
    { key: 'emd-finder', name: 'EMD Finder', description: 'Discover exact match domains' },
    { key: 'seo-tool', name: 'Unified SEO Tool', description: 'Optimize for local search' },
    { key: 'design-scraper', name: 'Design Scraper', description: 'Analyze competitor designs' },
    { key: 'visual-content', name: 'Visual Content Builder', description: 'Create visual assets' },
    { key: 'site-assembly', name: 'Authority Site Assembly', description: 'Build complete website' }
  ]

  const phase2Agents: { key: Phase2Agent; name: string; description: string }[] = [
    { key: 'seo', name: 'SEO Agent', description: 'Automated SEO optimization' },
    { key: 'ads', name: 'ADS Agent', description: 'Manage advertising campaigns' },
    { key: 'email', name: 'Email Marketing Agent', description: 'Email automation' },
    { key: 'ai-controller', name: 'AI Agent Controller', description: 'Orchestrate all agents' }
  ]

  const renderPhase1Component = () => {
    const commonProps = {
      projectData,
      setProjectData,
      autoMode,
      onNext: () => {
        const currentIndex = phase1Steps.findIndex(step => step.key === currentStep)
        if (currentIndex < phase1Steps.length - 1) {
          setCurrentStep(phase1Steps[currentIndex + 1].key)
        } else {
          setCurrentPhase(2)
        }
      }
    }

    switch (currentStep) {
      case 'micro-niche': return <MicroNicheBuilder {...commonProps} />
      case 'emd-finder': return <EMDFinder {...commonProps} />
      case 'seo-tool': return <UnifiedSEOTool {...commonProps} />
      case 'design-scraper': return <DesignScraper {...commonProps} />
      case 'visual-content': return <VisualContentBuilder {...commonProps} />
      case 'site-assembly': return <AuthoritySiteAssembly {...commonProps} />
      default: return <MicroNicheBuilder {...commonProps} />
    }
  }

  const renderPhase2Component = () => {
    return (
      <div className="grid grid-cols-2 gap-6">
        <SEOAgent projectData={projectData} autoMode={autoMode} />
        <ADSAgent projectData={projectData} autoMode={autoMode} />
        <EmailMarketingAgent projectData={projectData} autoMode={autoMode} />
        <AIAgentController projectData={projectData} autoMode={autoMode} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🚀 RankSavvy AI Storefront Controller
              </h1>
              <p className="text-sm text-gray-600">Birmingham Market Domination System</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={autoMode}
                  onChange={(e) => setAutoMode(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Auto Mode</span>
              </label>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setCurrentPhase(1)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    currentPhase === 1 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Phase 1
                </button>
                <button
                  onClick={() => setCurrentPhase(2)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    currentPhase === 2 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Phase 2
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      {currentPhase === 1 && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 py-4 overflow-x-auto">
              {phase1Steps.map((step, index) => (
                <button
                  key={step.key}
                  onClick={() => setCurrentStep(step.key)}
                  className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${
                    currentStep === step.key
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span>{step.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPhase === 1 ? renderPhase1Component() : renderPhase2Component()}
      </div>
    </div>
  )
}