'use client'

import { useState } from 'react'
import { 
  ChevronDown, 
  ChevronRight, 
  Search, 
  Bell, 
  Settings, 
  User,
  BarChart3,
  Globe,
  Code,
  Palette,
  Camera,
  Layers,
  TrendingUp,
  Mail,
  Brain,
  Play,
  Pause
} from 'lucide-react'

interface DashboardProps {
  projectData?: any
  setProjectData?: (data: any) => void
}

export default function NewDashboard({ projectData = {}, setProjectData = () => {} }: DashboardProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeComponent, setActiveComponent] = useState('overview')
  const [phase1Expanded, setPhase1Expanded] = useState(true)
  const [phase2Expanded, setPhase2Expanded] = useState(true)
  const [autoMode, setAutoMode] = useState(false)

  // Phase 1 Components
  const phase1Components = [
    { id: 'micro-niche', name: 'Micro-Niche Builder', icon: Search, status: 'ready' },
    { id: 'emd-finder', name: 'EMD Finder', icon: Globe, status: 'pending' },
    { id: 'seo-tool', name: 'Unified SEO Tool', icon: BarChart3, status: 'pending' },
    { id: 'design-scraper', name: 'Design Scraper', icon: Palette, status: 'pending' },
    { id: 'visual-content', name: 'Visual Content Builder', icon: Camera, status: 'pending' },
    { id: 'site-assembly', name: 'Authority Site Assembly', icon: Layers, status: 'pending' }
  ]

  // Phase 2 Agents
  const phase2Agents = [
    { id: 'seo-agent', name: 'SEO Agent', icon: TrendingUp, status: 'pending' },
    { id: 'ads-agent', name: 'ADS Agent', icon: BarChart3, status: 'pending' },
    { id: 'email-agent', name: 'Email Marketing Agent', icon: Mail, status: 'pending' },
    { id: 'ai-controller', name: 'AI Agent Controller', icon: Brain, status: 'pending' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-500'
      case 'running': return 'text-blue-500'
      case 'pending': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  const renderMainContent = () => {
    if (activeComponent === 'overview') {
      return <OverviewContent projectData={projectData} autoMode={autoMode} />
    }
    
    // Import actual components
    const MicroNicheBuilder = require('./phase1/MicroNicheBuilder').default
    const EMDFinder = require('./phase1/EMDFinder').default
    const UnifiedSEOTool = require('./phase1/UnifiedSEOTool').default
    const DesignScraper = require('./phase1/DesignScraper').default
    const VisualContentBuilder = require('./phase1/VisualContentBuilder').default
    const AuthoritySiteAssembly = require('./phase1/AuthoritySiteAssembly').default
    const SEOAgent = require('./phase2/SEOAgent').default
    const ADSAgent = require('./phase2/ADSAgent').default
    const EmailMarketingAgent = require('./phase2/EmailMarketingAgent').default
    const AIAgentController = require('./phase2/AIAgentController').default
    
    const componentMap: { [key: string]: any } = {
      'micro-niche': MicroNicheBuilder,
      'emd-finder': EMDFinder,
      'seo-tool': UnifiedSEOTool,
      'design-scraper': DesignScraper,
      'visual-content': VisualContentBuilder,
      'site-assembly': AuthoritySiteAssembly,
      'seo-agent': SEOAgent,
      'ads-agent': ADSAgent,
      'email-agent': EmailMarketingAgent,
      'ai-controller': AIAgentController
    }
    
    const Component = componentMap[activeComponent]
    if (Component) {
      const props = {
        projectData,
        setProjectData,
        autoMode,
        onNext: () => {
          // Move to next component
          const allIds = [...phase1Components, ...phase2Agents].map(c => c.id)
          const currentIndex = allIds.indexOf(activeComponent)
          if (currentIndex < allIds.length - 1) {
            setActiveComponent(allIds[currentIndex + 1])
          }
        }
      }
      
      return (
        <div className="bg-gray-800 rounded-lg p-6">
          <Component {...props} />
        </div>
      )
    }
    
    return <OverviewContent projectData={projectData} autoMode={autoMode} />
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-gray-800 border-r border-gray-700 transition-all duration-300`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className={`text-xl font-bold text-white ${sidebarCollapsed ? 'hidden' : 'block'}`}>
              RankSavvy
            </h1>
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-gray-400 hover:text-white"
            >
              <ChevronRight className={`w-5 h-5 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
            </button>
          </div>

          <nav className="space-y-2">
            {/* Overview */}
            <button
              onClick={() => setActiveComponent('overview')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeComponent === 'overview' ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              {!sidebarCollapsed && <span>Overview</span>}
            </button>

            {/* Phase 1 */}
            <div className="pt-4">
              <button
                onClick={() => setPhase1Expanded(!phase1Expanded)}
                className="w-full flex items-center justify-between px-3 py-2 text-gray-400 hover:text-white"
              >
                {!sidebarCollapsed && (
                  <>
                    <span className="text-sm font-semibold">PHASE 1</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${phase1Expanded ? '' : '-rotate-90'}`} />
                  </>
                )}
              </button>
              
              {phase1Expanded && (
                <div className="mt-2 space-y-1">
                  {phase1Components.map((component) => (
                    <button
                      key={component.id}
                      onClick={() => setActiveComponent(component.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        activeComponent === component.id ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <component.icon className="w-4 h-4" />
                      {!sidebarCollapsed && (
                        <span className="text-sm">{component.name}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Phase 2 */}
            <div className="pt-4">
              <button
                onClick={() => setPhase2Expanded(!phase2Expanded)}
                className="w-full flex items-center justify-between px-3 py-2 text-gray-400 hover:text-white"
              >
                {!sidebarCollapsed && (
                  <>
                    <span className="text-sm font-semibold">PHASE 2</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${phase2Expanded ? '' : '-rotate-90'}`} />
                  </>
                )}
              </button>
              
              {phase2Expanded && (
                <div className="mt-2 space-y-1">
                  {phase2Agents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => setActiveComponent(agent.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        activeComponent === agent.id ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <agent.icon className="w-4 h-4" />
                      {!sidebarCollapsed && (
                        <span className="text-sm">{agent.name}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-white">Birmingham Market Domination System</h2>
              <span className="text-sm text-gray-400">AI Storefront Controller</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Auto Mode Toggle */}
              <button
                onClick={() => setAutoMode(!autoMode)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  autoMode ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
              >
                {autoMode ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                <span className="text-sm">Auto Mode</span>
              </button>
              
              <button className="text-gray-400 hover:text-white">
                <Bell className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-white">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {renderMainContent()}
        </main>
      </div>
    </div>
  )
}

// Overview Component
function OverviewContent({ projectData }: { projectData: any }) {
  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard
          title="Total Niches Analyzed"
          value="0"
          subtitle="Birmingham market"
          trend="+0%"
          color="indigo"
        />
        <StatusCard
          title="Active Domains"
          value="0"
          subtitle="EMD secured"
          trend="+0%"
          color="green"
        />
        <StatusCard
          title="Site Authority"
          value="N/A"
          subtitle="Average DA"
          trend="+0%"
          color="blue"
        />
        <StatusCard
          title="Active Agents"
          value="0/4"
          subtitle="Phase 2 agents"
          trend="Ready"
          color="purple"
        />
      </div>

      {/* Phase Progress */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Project Progress</h3>
        <div className="space-y-4">
          <PhaseProgress phase="Phase 1" completed={0} total={6} />
          <PhaseProgress phase="Phase 2" completed={0} total={4} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="text-gray-400 text-center py-8">
          <p>No activity yet. Start by initializing the Micro-Niche Builder.</p>
        </div>
      </div>
    </div>
  )
}

// Status Card Component
function StatusCard({ title, value, subtitle, trend, color }: any) {
  const colorClasses = {
    indigo: 'bg-indigo-900/20 text-indigo-400 border-indigo-800',
    green: 'bg-green-900/20 text-green-400 border-green-800',
    blue: 'bg-blue-900/20 text-blue-400 border-blue-800',
    purple: 'bg-purple-900/20 text-purple-400 border-purple-800'
  }

  return (
    <div className={`rounded-lg p-6 border ${colorClasses[color]}`}>
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-3xl font-semibold text-white">{value}</p>
        <p className="ml-2 text-sm text-gray-500">{trend}</p>
      </div>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
    </div>
  )
}

// Phase Progress Component
function PhaseProgress({ phase, completed, total }: any) {
  const percentage = (completed / total) * 100

  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-300">{phase}</span>
        <span className="text-gray-400">{completed}/{total} completed</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}