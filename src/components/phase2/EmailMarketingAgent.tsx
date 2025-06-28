'use client'

import { useState, useEffect } from 'react'
import { Mail, Send, Users, Calendar, BarChart3, Check, Loader, Play, Pause, Eye, MousePointer, Sparkles } from 'lucide-react'

interface EmailMarketingAgentProps {
  projectData: any
  setProjectData: (data: any) => void
  autoMode: boolean
  onNext: () => void
}

interface EmailCampaign {
  id: string
  name: string
  type: 'welcome' | 'promotional' | 'newsletter' | 'follow-up' | 'abandoned'
  status: 'draft' | 'scheduled' | 'sent' | 'active'
  subject: string
  previewText: string
  recipients: number
  sentDate?: string
  opens: number
  clicks: number
  conversions: number
  openRate: number
  clickRate: number
}

interface EmailTask {
  id: string
  name: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
}

interface EmailSequence {
  id: string
  name: string
  emails: number
  active: boolean
  subscribers: number
}

export default function EmailMarketingAgent({ projectData, setProjectData, autoMode, onNext }: EmailMarketingAgentProps) {
  const [agentActive, setAgentActive] = useState(false)
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([])
  const [sequences, setSequences] = useState<EmailSequence[]>([])
  const [tasks, setTasks] = useState<EmailTask[]>([])
  const [subscribers, setSubscribers] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  
  const { selectedNiche, selectedDomain, siteStructure } = projectData

  const emailTasks: EmailTask[] = [
    {
      id: 'list-building',
      name: 'Email List Building',
      description: 'Setting up lead capture forms and opt-in incentives',
      status: 'pending',
      progress: 0
    },
    {
      id: 'campaign-creation',
      name: 'Campaign Creation',
      description: 'Creating email templates and campaign content',
      status: 'pending',
      progress: 0
    },
    {
      id: 'automation-setup',
      name: 'Automation Setup',
      description: 'Configuring automated email sequences',
      status: 'pending',
      progress: 0
    },
    {
      id: 'segmentation',
      name: 'Audience Segmentation',
      description: 'Segmenting Birmingham customers by interest and behavior',
      status: 'pending',
      progress: 0
    },
    {
      id: 'optimization',
      name: 'Campaign Optimization',
      description: 'A/B testing and performance optimization',
      status: 'pending',
      progress: 0
    }
  ]

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev])
  }

  const generateCampaigns = () => {
    const baseCampaigns: EmailCampaign[] = [
      {
        id: 'welcome-series',
        name: 'Welcome Series',
        type: 'welcome',
        status: 'draft',
        subject: `Welcome to ${selectedDomain} - Birmingham's Trusted ${selectedNiche?.name}`,
        previewText: 'Get 15% off your first service',
        recipients: 0,
        opens: 0,
        clicks: 0,
        conversions: 0,
        openRate: 0,
        clickRate: 0
      },
      {
        id: 'monthly-newsletter',
        name: 'Monthly Newsletter',
        type: 'newsletter',
        status: 'draft',
        subject: `${selectedNiche?.name} Tips for Birmingham Homeowners`,
        previewText: 'Seasonal maintenance guide inside',
        recipients: 0,
        opens: 0,
        clicks: 0,
        conversions: 0,
        openRate: 0,
        clickRate: 0
      },
      {
        id: 'service-promo',
        name: 'Service Promotion',
        type: 'promotional',
        status: 'draft',
        subject: 'Limited Time: 20% Off All Services',
        previewText: 'Birmingham residents exclusive offer',
        recipients: 0,
        opens: 0,
        clicks: 0,
        conversions: 0,
        openRate: 0,
        clickRate: 0
      },
      {
        id: 'follow-up',
        name: 'Service Follow-up',
        type: 'follow-up',
        status: 'draft',
        subject: 'How was your recent service experience?',
        previewText: 'We value your feedback',
        recipients: 0,
        opens: 0,
        clicks: 0,
        conversions: 0,
        openRate: 0,
        clickRate: 0
      }
    ]
    
    return baseCampaigns
  }

  const generateSequences = (): EmailSequence[] => [
    {
      id: 'onboarding',
      name: 'New Customer Onboarding',
      emails: 5,
      active: true,
      subscribers: 0
    },
    {
      id: 'nurture',
      name: 'Lead Nurture Sequence',
      emails: 7,
      active: true,
      subscribers: 0
    },
    {
      id: 'win-back',
      name: 'Customer Win-Back',
      emails: 3,
      active: false,
      subscribers: 0
    },
    {
      id: 'seasonal',
      name: 'Seasonal Maintenance Reminders',
      emails: 4,
      active: true,
      subscribers: 0
    }
  ]

  const runEmailTask = async (taskId: string) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId)
    if (taskIndex === -1) return

    const updatedTasks = [...tasks]
    updatedTasks[taskIndex].status = 'running'
    setTasks(updatedTasks)

    addLog(`Starting ${updatedTasks[taskIndex].name}...`)

    // Simulate task progress
    for (let progress = 0; progress <= 100; progress += 20) {
      updatedTasks[taskIndex].progress = progress
      setTasks([...updatedTasks])
      
      // Update subscriber count during list building
      if (taskId === 'list-building') {
        setSubscribers(prev => prev + Math.floor(Math.random() * 50) + 10)
      }
      
      await new Promise(resolve => setTimeout(resolve, 400))
    }

    updatedTasks[taskIndex].status = 'completed'
    setTasks(updatedTasks)
    
    addLog(`✅ Completed ${updatedTasks[taskIndex].name}`)

    // Task-specific updates
    if (taskId === 'campaign-creation') {
      const newCampaigns = generateCampaigns()
      setCampaigns(newCampaigns)
      addLog(`Created ${newCampaigns.length} email campaigns`)
    }
    
    if (taskId === 'automation-setup') {
      const newSequences = generateSequences()
      setSequences(newSequences)
      addLog(`Set up ${newSequences.length} automated sequences`)
    }
    
    if (taskId === 'optimization') {
      // Simulate campaign performance
      setCampaigns(prev => prev.map(campaign => ({
        ...campaign,
        status: 'sent',
        recipients: subscribers,
        opens: Math.floor(subscribers * (Math.random() * 0.3 + 0.2)),
        clicks: Math.floor(subscribers * (Math.random() * 0.1 + 0.05)),
        conversions: Math.floor(subscribers * (Math.random() * 0.05 + 0.02)),
        openRate: parseFloat((Math.random() * 30 + 20).toFixed(1)),
        clickRate: parseFloat((Math.random() * 10 + 5).toFixed(1))
      })))
      
      // Update sequences with subscribers
      setSequences(prev => prev.map(seq => ({
        ...seq,
        subscribers: Math.floor(subscribers * (Math.random() * 0.3 + 0.1))
      })))
    }
  }

  const startEmailAgent = async () => {
    setAgentActive(true)
    setTasks(emailTasks)
    setSubscribers(0)
    addLog('🚀 Email Marketing Agent activated - Building email campaigns')

    // Run all tasks sequentially
    for (const task of emailTasks) {
      if (!agentActive) break
      await runEmailTask(task.id)
    }

    addLog('🎉 Email marketing system fully operational!')
    
    // Update project data
    setProjectData({
      ...projectData,
      emailCampaigns: campaigns,
      emailSequences: sequences,
      emailSubscribers: subscribers
    })
    
    if (autoMode) {
      setTimeout(() => onNext(), 2000)
    }
  }

  const stopEmailAgent = () => {
    setAgentActive(false)
    addLog('⏸️ Email Agent paused')
  }

  const getTotalMetrics = () => {
    return campaigns.reduce((acc, campaign) => ({
      sent: acc.sent + (campaign.status === 'sent' ? 1 : 0),
      opens: acc.opens + campaign.opens,
      clicks: acc.clicks + campaign.clicks,
      conversions: acc.conversions + campaign.conversions
    }), { sent: 0, opens: 0, clicks: 0, conversions: 0 })
  }

  useEffect(() => {
    if (autoMode && selectedNiche && selectedDomain && siteStructure && !agentActive) {
      startEmailAgent()
    }
  }, [autoMode])

  if (!selectedNiche || !selectedDomain || !siteStructure) {
    return (
      <div className="text-center py-8">
        <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">Please complete website setup before activating Email Agent</p>
      </div>
    )
  }

  const totalMetrics = getTotalMetrics()

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">
          Email Marketing Agent
        </h2>
        <p className="text-gray-400">
          Automated email campaigns for {selectedDomain}
        </p>
      </div>

      {/* Agent Control */}
      <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={agentActive ? stopEmailAgent : startEmailAgent}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                agentActive 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {agentActive ? (
                <>
                  <Pause className="w-5 h-5" />
                  Stop Email Agent
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start Email Agent
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
          <div className="text-right">
            <p className="text-2xl font-semibold text-white">{subscribers}</p>
            <p className="text-sm text-gray-400">Total Subscribers</p>
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      {campaigns.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Campaigns Sent</span>
              <Send className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-semibold text-white">{totalMetrics.sent}</p>
            <p className="text-xs text-gray-500 mt-1">Total campaigns</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Opens</span>
              <Eye className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-semibold text-white">{totalMetrics.opens}</p>
            <p className="text-xs text-gray-500 mt-1">Email opens</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Clicks</span>
              <MousePointer className="w-4 h-4 text-indigo-500" />
            </div>
            <p className="text-2xl font-semibold text-white">{totalMetrics.clicks}</p>
            <p className="text-xs text-gray-500 mt-1">Link clicks</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Conversions</span>
              <Sparkles className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-semibold text-white">{totalMetrics.conversions}</p>
            <p className="text-xs text-gray-500 mt-1">Sales generated</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks and Campaigns Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tasks */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Email Tasks</h3>
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
          </div>

          {/* Email Campaigns */}
          {campaigns.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Email Campaigns</h3>
              <div className="space-y-3">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{campaign.name}</h4>
                        <p className="text-sm text-gray-400 mt-1">{campaign.subject}</p>
                        <p className="text-xs text-gray-500 mt-1">{campaign.previewText}</p>
                      </div>
                      <span className={`text-sm px-2 py-1 rounded ${
                        campaign.status === 'sent' 
                          ? 'bg-green-900/50 text-green-400'
                          : campaign.status === 'scheduled'
                          ? 'bg-blue-900/50 text-blue-400'
                          : 'bg-gray-700 text-gray-400'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                    
                    {campaign.status === 'sent' && (
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Recipients</p>
                          <p className="text-white font-medium">{campaign.recipients}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Open Rate</p>
                          <p className="text-white font-medium">{campaign.openRate}%</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Click Rate</p>
                          <p className="text-white font-medium">{campaign.clickRate}%</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Conversions</p>
                          <p className="text-green-400 font-medium">{campaign.conversions}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sequences and Activity Log */}
        <div className="space-y-6">
          {/* Automated Sequences */}
          {sequences.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Automated Sequences</h3>
              <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                {sequences.map((seq) => (
                  <div key={seq.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-white">{seq.name}</p>
                      <p className="text-xs text-gray-400">
                        {seq.emails} emails • {seq.subscribers} subscribers
                      </p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      seq.active ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Log */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Activity Log</h4>
            <div className="bg-gray-800/50 rounded-lg p-3 h-64 overflow-y-auto">
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
      </div>

      {/* Success Message */}
      {tasks.every(t => t.status === 'completed') && (
        <div className="mt-6 p-4 bg-green-900/30 border border-green-700 rounded-lg">
          <div className="flex items-center gap-3">
            <Check className="w-6 h-6 text-green-400" />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-green-400">
                Email Marketing System Active!
              </h3>
              <p className="text-green-300 text-sm mt-1">
                {campaigns.length} campaigns created, {sequences.filter(s => s.active).length} automated sequences running, {subscribers} subscribers
              </p>
            </div>
            <button
              onClick={onNext}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Continue to AI Controller →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}