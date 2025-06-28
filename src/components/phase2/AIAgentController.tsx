'use client'

import { useState, useEffect } from 'react'
import { Brain, Activity, Shield, Zap, Check, Loader, Play, Pause, AlertCircle, Settings, BarChart3, TrendingUp, Mail, DollarSign, Rocket } from 'lucide-react'

interface AIAgentControllerProps {
  projectData: any
  setProjectData: (data: any) => void
  autoMode: boolean
  onNext: () => void
}

interface AgentStatus {
  id: string
  name: string
  icon: any
  status: 'active' | 'idle' | 'error' | 'disabled'
  lastAction: string
  performance: number
}

interface SystemMetric {
  name: string
  value: string | number
  change: string
  trend: 'up' | 'down' | 'stable'
}

interface AITask {
  id: string
  name: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
}

export default function AIAgentController({ projectData, setProjectData, autoMode, onNext }: AIAgentControllerProps) {
  const [systemActive, setSystemActive] = useState(false)
  const [agents, setAgents] = useState<AgentStatus[]>([])
  const [tasks, setTasks] = useState<AITask[]>([])
  const [metrics, setMetrics] = useState<SystemMetric[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const [overallHealth, setOverallHealth] = useState(0)
  
  const controllerTasks: AITask[] = [
    {
      id: 'system-init',
      name: 'System Initialization',
      description: 'Initializing AI agent network and connections',
      status: 'pending',
      progress: 0
    },
    {
      id: 'agent-sync',
      name: 'Agent Synchronization',
      description: 'Syncing all agent data and establishing communication',
      status: 'pending',
      progress: 0
    },
    {
      id: 'performance-baseline',
      name: 'Performance Baseline',
      description: 'Establishing baseline metrics for optimization',
      status: 'pending',
      progress: 0
    },
    {
      id: 'automation-rules',
      name: 'Automation Rules Setup',
      description: 'Configuring intelligent automation workflows',
      status: 'pending',
      progress: 0
    },
    {
      id: 'monitoring-active',
      name: 'Active Monitoring',
      description: 'Enabling real-time monitoring and optimization',
      status: 'pending',
      progress: 0
    }
  ]

  const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const timestamp = new Date().toLocaleTimeString()
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : '📌'
    setLogs(prev => [`[${timestamp}] ${icon} ${message}`, ...prev])
  }

  const initializeAgents = () => {
    const agentList: AgentStatus[] = [
      {
        id: 'seo-agent',
        name: 'SEO Agent',
        icon: TrendingUp,
        status: 'idle',
        lastAction: 'Waiting for initialization',
        performance: 0
      },
      {
        id: 'ads-agent',
        name: 'ADS Agent',
        icon: DollarSign,
        status: 'idle',
        lastAction: 'Waiting for initialization',
        performance: 0
      },
      {
        id: 'email-agent',
        name: 'Email Agent',
        icon: Mail,
        status: 'idle',
        lastAction: 'Waiting for initialization',
        performance: 0
      }
    ]
    setAgents(agentList)
  }

  const updateMetrics = () => {
    const currentMetrics: SystemMetric[] = [
      {
        name: 'Total Leads',
        value: Math.floor(Math.random() * 500) + 200,
        change: '+12%',
        trend: 'up'
      },
      {
        name: 'Conversion Rate',
        value: `${(Math.random() * 5 + 3).toFixed(1)}%`,
        change: '+0.8%',
        trend: 'up'
      },
      {
        name: 'Revenue Generated',
        value: `$${(Math.random() * 10000 + 5000).toFixed(0)}`,
        change: '+24%',
        trend: 'up'
      },
      {
        name: 'System Efficiency',
        value: `${(Math.random() * 10 + 90).toFixed(0)}%`,
        change: '+5%',
        trend: 'up'
      }
    ]
    setMetrics(currentMetrics)
  }

  const runControllerTask = async (taskId: string) => {
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
      
      // Update agent statuses during sync
      if (taskId === 'agent-sync' && progress === 60) {
        setAgents(prev => prev.map(agent => ({
          ...agent,
          status: 'active',
          lastAction: 'Connected and ready',
          performance: Math.floor(Math.random() * 30) + 70
        })))
        addLog('All agents connected successfully', 'success')
      }
      
      await new Promise(resolve => setTimeout(resolve, 300))
    }

    updatedTasks[taskIndex].status = 'completed'
    setTasks(updatedTasks)
    
    addLog(`Completed ${updatedTasks[taskIndex].name}`, 'success')

    // Task-specific updates
    if (taskId === 'performance-baseline') {
      updateMetrics()
      setOverallHealth(95)
    }
    
    if (taskId === 'monitoring-active') {
      // Start simulating real-time updates
      startRealtimeMonitoring()
    }
  }

  const startRealtimeMonitoring = () => {
    const interval = setInterval(() => {
      if (!systemActive) {
        clearInterval(interval)
        return
      }
      
      // Randomly update an agent's action
      const randomAgent = Math.floor(Math.random() * agents.length)
      const actions = [
        'Optimizing keywords',
        'Analyzing competitors',
        'Updating campaigns',
        'Processing emails',
        'Generating reports',
        'Monitoring performance'
      ]
      
      setAgents(prev => prev.map((agent, index) => 
        index === randomAgent 
          ? {
              ...agent,
              lastAction: actions[Math.floor(Math.random() * actions.length)],
              performance: Math.min(100, agent.performance + Math.floor(Math.random() * 5))
            }
          : agent
      ))
      
      // Update metrics periodically
      if (Math.random() > 0.7) {
        updateMetrics()
      }
      
      // Add random log entries
      if (Math.random() > 0.8) {
        const logMessages = [
          'SEO rankings improved for 3 keywords',
          'New email campaign launched',
          'Ad spend optimized by 15%',
          'Lead capture form conversion up 2%',
          'Competitor analysis completed'
        ]
        addLog(logMessages[Math.floor(Math.random() * logMessages.length)], 'info')
      }
    }, 3000)
  }

  const startAIController = async () => {
    setSystemActive(true)
    setTasks(controllerTasks)
    initializeAgents()
    addLog('🚀 AI Agent Controller initializing...', 'info')

    // Run all tasks sequentially
    for (const task of controllerTasks) {
      if (!systemActive) break
      await runControllerTask(task.id)
    }

    addLog('🎉 Birmingham Market Domination System fully operational!', 'success')
    
    // Update project data
    setProjectData({
      ...projectData,
      aiControllerActive: true,
      systemHealth: overallHealth,
      activeAgents: agents.filter(a => a.status === 'active').length
    })
    
    if (autoMode) {
      setTimeout(() => onNext(), 3000)
    }
  }

  const stopAIController = () => {
    setSystemActive(false)
    setAgents(prev => prev.map(agent => ({ ...agent, status: 'idle' })))
    addLog('⏸️ AI Controller paused', 'info')
  }

  useEffect(() => {
    if (autoMode && projectData.emailCampaigns && !systemActive) {
      startAIController()
    }
  }, [autoMode])

  const allTasksComplete = tasks.every(t => t.status === 'completed')

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">
          AI Agent Controller - Master Control System
        </h2>
        <p className="text-gray-400">
          Orchestrating all agents for {projectData.selectedDomain || 'Birmingham business'}
        </p>
      </div>

      {/* System Control */}
      <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={systemActive ? stopAIController : startAIController}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                systemActive 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {systemActive ? (
                <>
                  <Pause className="w-5 h-5" />
                  Stop AI Controller
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start AI Controller
                </>
              )}
            </button>
            {systemActive && (
              <div className="flex items-center gap-2 text-green-400">
                <Activity className="w-5 h-5 animate-pulse" />
                <span className="text-sm">System Active</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">System Health</p>
                <p className="text-2xl font-semibold text-white">{overallHealth}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Metrics */}
      {metrics.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">{metric.name}</span>
                <span className={`text-xs ${
                  metric.trend === 'up' ? 'text-green-400' : 
                  metric.trend === 'down' ? 'text-red-400' : 
                  'text-gray-400'
                }`}>
                  {metric.change}
                </span>
              </div>
              <p className="text-2xl font-semibold text-white">{metric.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks and Agents Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Initialization Tasks */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">System Tasks</h3>
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

          {/* Agent Status */}
          {agents.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Agent Network Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {agents.map((agent) => {
                  const Icon = agent.icon
                  return (
                    <div key={agent.id} className="bg-gray-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon className="w-5 h-5 text-indigo-400" />
                          <h4 className="font-medium text-white">{agent.name}</h4>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          agent.status === 'active' ? 'bg-green-500 animate-pulse' :
                          agent.status === 'error' ? 'bg-red-500' :
                          'bg-gray-500'
                        }`} />
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{agent.lastAction}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Performance</span>
                        <span className="text-sm font-medium text-white">{agent.performance}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Activity Log */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">System Activity</h4>
          <div className="bg-gray-800/50 rounded-lg p-3 h-[500px] overflow-y-auto">
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
      {allTasksComplete && (
        <div className="mt-6 p-6 bg-gradient-to-r from-green-900/30 to-indigo-900/30 border border-green-700 rounded-lg">
          <div className="flex items-start gap-4">
            <Rocket className="w-8 h-8 text-green-400 mt-1" />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-green-400 mb-2">
                🎉 Birmingham Market Domination System Active!
              </h3>
              <p className="text-green-300 mb-4">
                Congratulations! Your AI-powered local domination system is now fully operational. 
                All agents are synchronized and actively working to dominate the Birmingham market for {projectData.selectedNiche?.name}.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-sm text-gray-400">Active Agents</p>
                  <p className="text-xl font-semibold text-white">{agents.filter(a => a.status === 'active').length}/3</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-sm text-gray-400">Total Campaigns</p>
                  <p className="text-xl font-semibold text-white">
                    {(projectData.adCampaigns?.length || 0) + (projectData.emailCampaigns?.length || 0)}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-sm text-gray-400">Domain</p>
                  <p className="text-xl font-semibold text-white">{projectData.selectedDomain}</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="text-xl font-semibold text-green-400">Live</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Settings
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  View Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}