'use client'

import { useState, useEffect } from 'react'
import { DollarSign, Target, TrendingUp, BarChart3, Zap, Check, Loader, Play, Pause, AlertCircle, Eye, MousePointer } from 'lucide-react'

interface ADSAgentProps {
  projectData: any
  setProjectData: (data: any) => void
  autoMode: boolean
  onNext: () => void
}

interface Campaign {
  id: string
  name: string
  platform: 'Google Ads' | 'Facebook' | 'Instagram' | 'LinkedIn'
  status: 'draft' | 'active' | 'paused' | 'completed'
  budget: number
  spent: number
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  cpc: number
  roi: number
}

interface ADTask {
  id: string
  name: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
}

export default function ADSAgent({ projectData, setProjectData, autoMode, onNext }: ADSAgentProps) {
  const [agentActive, setAgentActive] = useState(false)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [tasks, setTasks] = useState<ADTask[]>([])
  const [totalBudget, setTotalBudget] = useState(1000)
  const [logs, setLogs] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Google Ads', 'Facebook'])
  
  const { selectedNiche, targetKeywords, selectedDomain } = projectData

  const adTasks: ADTask[] = [
    {
      id: 'market-research',
      name: 'Market Research',
      description: 'Analyzing Birmingham market competition and pricing',
      status: 'pending',
      progress: 0
    },
    {
      id: 'campaign-setup',
      name: 'Campaign Setup',
      description: 'Creating targeted campaigns for each platform',
      status: 'pending',
      progress: 0
    },
    {
      id: 'ad-creation',
      name: 'Ad Creative Generation',
      description: 'Creating compelling ad copy and visuals',
      status: 'pending',
      progress: 0
    },
    {
      id: 'audience-targeting',
      name: 'Audience Targeting',
      description: 'Setting up precise Birmingham audience segments',
      status: 'pending',
      progress: 0
    },
    {
      id: 'optimization',
      name: 'Campaign Optimization',
      description: 'Optimizing bids and targeting for best ROI',
      status: 'pending',
      progress: 0
    }
  ]

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev])
  }

  const generateCampaigns = () => {
    const baseCampaigns: Campaign[] = []
    
    // Google Ads campaigns
    if (selectedPlatforms.includes('Google Ads')) {
      baseCampaigns.push({
        id: 'google-search',
        name: `${selectedNiche?.name} - Birmingham Search`,
        platform: 'Google Ads',
        status: 'draft',
        budget: totalBudget * 0.5,
        spent: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        cpc: 0,
        roi: 0
      })
    }
    
    // Facebook campaigns
    if (selectedPlatforms.includes('Facebook')) {
      baseCampaigns.push({
        id: 'facebook-local',
        name: `${selectedNiche?.name} - Birmingham Locals`,
        platform: 'Facebook',
        status: 'draft',
        budget: totalBudget * 0.3,
        spent: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        cpc: 0,
        roi: 0
      })
    }
    
    // Instagram campaigns
    if (selectedPlatforms.includes('Instagram')) {
      baseCampaigns.push({
        id: 'instagram-awareness',
        name: `${selectedNiche?.name} - Brand Awareness`,
        platform: 'Instagram',
        status: 'draft',
        budget: totalBudget * 0.2,
        spent: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        cpc: 0,
        roi: 0
      })
    }
    
    return baseCampaigns
  }

  const runADTask = async (taskId: string) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId)
    if (taskIndex === -1) return

    const updatedTasks = [...tasks]
    updatedTasks[taskIndex].status = 'running'
    setTasks(updatedTasks)

    addLog(`Starting ${updatedTasks[taskIndex].name}...`)

    // Simulate task progress
    for (let progress = 0; progress <= 100; progress += 25) {
      updatedTasks[taskIndex].progress = progress
      setTasks([...updatedTasks])
      await new Promise(resolve => setTimeout(resolve, 400))
    }

    updatedTasks[taskIndex].status = 'completed'
    setTasks(updatedTasks)
    
    addLog(`✅ Completed ${updatedTasks[taskIndex].name}`)

    // Update campaigns based on task completion
    if (taskId === 'campaign-setup') {
      const newCampaigns = generateCampaigns()
      setCampaigns(newCampaigns)
      addLog(`Created ${newCampaigns.length} campaigns`)
    }
    
    if (taskId === 'optimization') {
      // Simulate campaign performance
      setCampaigns(prev => prev.map(campaign => ({
        ...campaign,
        status: 'active',
        spent: campaign.budget * 0.7,
        impressions: Math.floor(Math.random() * 10000) + 5000,
        clicks: Math.floor(Math.random() * 500) + 100,
        conversions: Math.floor(Math.random() * 50) + 10,
        ctr: parseFloat((Math.random() * 5 + 2).toFixed(2)),
        cpc: parseFloat((Math.random() * 3 + 1).toFixed(2)),
        roi: parseFloat((Math.random() * 200 + 50).toFixed(0))
      })))
    }
  }

  const startADSAgent = async () => {
    setAgentActive(true)
    setTasks(adTasks)
    addLog('🚀 ADS Agent activated - Launching advertising campaigns')

    // Run all tasks sequentially
    for (const task of adTasks) {
      if (!agentActive) break
      await runADTask(task.id)
    }

    addLog('🎉 Advertising campaigns launched successfully!')
    
    // Update project data with campaign info
    setProjectData({
      ...projectData,
      adCampaigns: campaigns,
      monthlyAdSpend: totalBudget
    })
    
    if (autoMode) {
      setTimeout(() => onNext(), 2000)
    }
  }

  const stopADSAgent = () => {
    setAgentActive(false)
    addLog('⏸️ ADS Agent paused')
  }

  const getTotalMetrics = () => {
    return campaigns.reduce((acc, campaign) => ({
      spent: acc.spent + campaign.spent,
      impressions: acc.impressions + campaign.impressions,
      clicks: acc.clicks + campaign.clicks,
      conversions: acc.conversions + campaign.conversions
    }), { spent: 0, impressions: 0, clicks: 0, conversions: 0 })
  }

  useEffect(() => {
    if (autoMode && selectedNiche && targetKeywords && !agentActive) {
      startADSAgent()
    }
  }, [autoMode])

  if (!selectedNiche || !targetKeywords) {
    return (
      <div className="text-center py-8">
        <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">Please complete niche selection and keyword research first</p>
      </div>
    )
  }

  const totalMetrics = getTotalMetrics()

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">
          ADS Agent - Automated Advertising
        </h2>
        <p className="text-gray-400">
          Managing PPC campaigns for {selectedDomain} in Birmingham
        </p>
      </div>

      {/* Budget and Platform Selection */}
      <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Budget</label>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                disabled={agentActive}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Advertising Platforms</label>
            <div className="space-y-2">
              {['Google Ads', 'Facebook', 'Instagram', 'LinkedIn'].map(platform => (
                <label key={platform} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPlatforms([...selectedPlatforms, platform])
                      } else {
                        setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform))
                      }
                    }}
                    className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded"
                    disabled={agentActive}
                  />
                  <span className="text-sm text-gray-300">{platform}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        {/* Agent Control */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <button
            onClick={agentActive ? stopADSAgent : startADSAgent}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              agentActive 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            disabled={selectedPlatforms.length === 0}
          >
            {agentActive ? (
              <>
                <Pause className="w-5 h-5" />
                Stop ADS Agent
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start ADS Agent
              </>
            )}
          </button>
          {agentActive && (
            <div className="flex items-center gap-2 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm">Agent Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Overview */}
      {campaigns.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Spent</span>
              <DollarSign className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-semibold text-white">${totalMetrics.spent.toFixed(0)}</p>
            <p className="text-xs text-gray-500 mt-1">of ${totalBudget} budget</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Impressions</span>
              <Eye className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-semibold text-white">{totalMetrics.impressions.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">People reached</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Clicks</span>
              <MousePointer className="w-4 h-4 text-indigo-500" />
            </div>
            <p className="text-2xl font-semibold text-white">{totalMetrics.clicks}</p>
            <p className="text-xs text-gray-500 mt-1">Website visits</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Conversions</span>
              <Target className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-semibold text-white">{totalMetrics.conversions}</p>
            <p className="text-xs text-gray-500 mt-1">New customers</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Panel */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-medium text-white">Campaign Tasks</h3>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-white">{task.name}</h4>
                    <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded ${
                    task.status === 'completed' 
                      ? 'bg-green-900/50 text-green-400'
                      : task.status === 'running'
                      ? 'bg-blue-900/50 text-blue-400'
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    {task.status === 'running' && <Loader className="w-3 h-3 inline mr-1 animate-spin" />}
                    {task.status === 'completed' && <Check className="w-3 h-3 inline mr-1" />}
                    {task.status}
                  </span>
                </div>
                
                {task.status === 'running' && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Active Campaigns */}
          {campaigns.length > 0 && (
            <>
              <h3 className="text-lg font-medium text-white mt-6">Active Campaigns</h3>
              <div className="space-y-3">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-white">{campaign.name}</h4>
                        <p className="text-sm text-gray-400">{campaign.platform}</p>
                      </div>
                      <span className={`text-sm px-2 py-1 rounded ${
                        campaign.status === 'active' 
                          ? 'bg-green-900/50 text-green-400'
                          : 'bg-gray-700 text-gray-400'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Budget</p>
                        <p className="text-white font-medium">${campaign.budget}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">CTR</p>
                        <p className="text-white font-medium">{campaign.ctr}%</p>
                      </div>
                      <div>
                        <p className="text-gray-400">CPC</p>
                        <p className="text-white font-medium">${campaign.cpc}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">ROI</p>
                        <p className="text-green-400 font-medium">+{campaign.roi}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Activity Log */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Activity Log</h4>
          <div className="bg-gray-800/50 rounded-lg p-3 h-96 overflow-y-auto">
            <div className="space-y-1 text-xs font-mono">
              {logs.length === 0 ? (
                <p className="text-gray-500">No activity yet...</p>
              ) : (
                logs.map((log, index) => (
                  <p key={index} className="text-gray-400">{log}</p>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {tasks.every(t => t.status === 'completed') && (
        <div className="mt-6 p-4 bg-green-900/30 border border-green-700 rounded-lg">
          <div className="flex items-center gap-3">
            <Check className="w-6 h-6 text-green-400" />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-green-400">
                Advertising Campaigns Live!
              </h3>
              <p className="text-green-300 text-sm mt-1">
                {campaigns.length} campaigns running across {selectedPlatforms.length} platforms targeting Birmingham customers
              </p>
            </div>
            <button
              onClick={onNext}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Continue to Email Agent →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}