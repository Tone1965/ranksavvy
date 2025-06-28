'use client'

import { useState, useEffect } from 'react'
import { Search, TrendingUp, BarChart3, Globe, Zap, Check, Loader, Play, Pause, AlertCircle } from 'lucide-react'

interface SEOAgentProps {
  projectData: any
  setProjectData: (data: any) => void
  autoMode: boolean
  onNext: () => void
}

interface SEOTask {
  id: string
  name: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  result?: any
  error?: string
}

interface SEOMetrics {
  domainAuthority: number
  pageSpeed: number
  mobileScore: number
  backlinks: number
  indexedPages: number
  organicTraffic: number
  rankingKeywords: number
}

export default function SEOAgent({ projectData, setProjectData, autoMode, onNext }: SEOAgentProps) {
  const [agentActive, setAgentActive] = useState(false)
  const [tasks, setTasks] = useState<SEOTask[]>([])
  const [metrics, setMetrics] = useState<SEOMetrics | null>(null)
  const [currentTask, setCurrentTask] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  
  const { selectedDomain, seoAnalysis, siteStructure } = projectData

  const seoTasks: SEOTask[] = [
    {
      id: 'technical-seo',
      name: 'Technical SEO Audit',
      description: 'Analyzing site structure, meta tags, and technical elements',
      status: 'pending',
      progress: 0
    },
    {
      id: 'content-optimization',
      name: 'Content Optimization',
      description: 'Optimizing content for target keywords and user intent',
      status: 'pending',
      progress: 0
    },
    {
      id: 'link-building',
      name: 'Link Building Strategy',
      description: 'Identifying and securing high-quality backlink opportunities',
      status: 'pending',
      progress: 0
    },
    {
      id: 'local-seo',
      name: 'Local SEO Enhancement',
      description: 'Optimizing for Birmingham local search results',
      status: 'pending',
      progress: 0
    },
    {
      id: 'monitoring',
      name: 'Performance Monitoring',
      description: 'Setting up tracking and monitoring systems',
      status: 'pending',
      progress: 0
    }
  ]

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev])
  }

  const runSEOTask = async (taskId: string) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId)
    if (taskIndex === -1) return

    const updatedTasks = [...tasks]
    updatedTasks[taskIndex].status = 'running'
    setTasks(updatedTasks)
    setCurrentTask(taskId)

    addLog(`Starting ${updatedTasks[taskIndex].name}...`)

    // Simulate task progress
    for (let progress = 0; progress <= 100; progress += 20) {
      updatedTasks[taskIndex].progress = progress
      setTasks([...updatedTasks])
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    // Task-specific results
    let result = null
    switch (taskId) {
      case 'technical-seo':
        result = {
          issues: ['Missing alt tags on 5 images', 'No schema markup detected', 'Slow server response time'],
          fixes: ['Added alt tags to all images', 'Implemented LocalBusiness schema', 'Enabled caching'],
          score: 85
        }
        break
      case 'content-optimization':
        result = {
          optimizedPages: siteStructure?.pages.length || 8,
          keywordDensity: '2.3%',
          readabilityScore: 72,
          improvements: ['Added LSI keywords', 'Improved meta descriptions', 'Enhanced content structure']
        }
        break
      case 'link-building':
        result = {
          opportunities: 15,
          outreachSent: 8,
          secured: 3,
          domains: ['birminghambusiness.org', 'albusiness.com', 'localdirectory.al']
        }
        break
      case 'local-seo':
        result = {
          citations: 25,
          gmb: 'Optimized',
          reviews: 12,
          localRanking: 'Top 3 for main keywords'
        }
        break
      case 'monitoring':
        result = {
          analyticsSetup: true,
          searchConsole: true,
          rankTracking: true,
          alerts: ['Keyword ranking changes', 'Technical issues', 'Backlink monitoring']
        }
        break
    }

    updatedTasks[taskIndex].status = 'completed'
    updatedTasks[taskIndex].result = result
    setTasks(updatedTasks)
    
    addLog(`✅ Completed ${updatedTasks[taskIndex].name}`)
    setCurrentTask(null)
  }

  const startSEOAgent = async () => {
    setAgentActive(true)
    setTasks(seoTasks)
    addLog('🚀 SEO Agent activated - Beginning optimization process')

    // Initialize metrics
    setMetrics({
      domainAuthority: 0,
      pageSpeed: 45,
      mobileScore: 62,
      backlinks: 0,
      indexedPages: 0,
      organicTraffic: 0,
      rankingKeywords: 0
    })

    // Run all tasks sequentially
    for (const task of seoTasks) {
      if (!agentActive) break
      await runSEOTask(task.id)
      
      // Update metrics after each task
      setMetrics(prev => ({
        domainAuthority: Math.min((prev?.domainAuthority || 0) + 10, 45),
        pageSpeed: Math.min((prev?.pageSpeed || 45) + 10, 95),
        mobileScore: Math.min((prev?.mobileScore || 62) + 8, 98),
        backlinks: (prev?.backlinks || 0) + Math.floor(Math.random() * 10) + 5,
        indexedPages: Math.min((prev?.indexedPages || 0) + 2, siteStructure?.pages.length || 8),
        organicTraffic: (prev?.organicTraffic || 0) + Math.floor(Math.random() * 100) + 50,
        rankingKeywords: (prev?.rankingKeywords || 0) + Math.floor(Math.random() * 5) + 2
      }))
    }

    addLog('🎉 SEO optimization complete!')
    
    if (autoMode) {
      setTimeout(() => onNext(), 2000)
    }
  }

  const stopSEOAgent = () => {
    setAgentActive(false)
    addLog('⏸️ SEO Agent paused')
  }

  useEffect(() => {
    if (autoMode && selectedDomain && seoAnalysis && siteStructure && !agentActive) {
      startSEOAgent()
    }
  }, [autoMode])

  if (!selectedDomain || !seoAnalysis || !siteStructure) {
    return (
      <div className="text-center py-8">
        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">Please complete Phase 1 before activating SEO Agent</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">
          SEO Agent - Automated Optimization
        </h2>
        <p className="text-gray-400">
          AI-powered SEO optimization for {selectedDomain}
        </p>
      </div>

      {/* Agent Control */}
      <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={agentActive ? stopSEOAgent : startSEOAgent}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                agentActive 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {agentActive ? (
                <>
                  <Pause className="w-5 h-5" />
                  Stop SEO Agent
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start SEO Agent
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
          <div className="text-sm text-gray-400">
            {tasks.filter(t => t.status === 'completed').length}/{tasks.length} tasks completed
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Panel */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-medium text-white">SEO Tasks</h3>
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
                      : task.status === 'failed'
                      ? 'bg-red-900/50 text-red-400'
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
                
                {task.result && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <p className="text-sm text-gray-300 font-medium mb-2">Results:</p>
                    <div className="text-xs text-gray-400 space-y-1">
                      {Object.entries(task.result).slice(0, 3).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <span className="text-gray-300">
                            {typeof value === 'number' ? value : Array.isArray(value) ? value.length : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Panel */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">SEO Metrics</h3>
          {metrics && (
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Domain Authority</span>
                    <span className="text-white">{metrics.domainAuthority}/100</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${metrics.domainAuthority}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Page Speed</span>
                    <span className="text-white">{metrics.pageSpeed}/100</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${metrics.pageSpeed}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Mobile Score</span>
                    <span className="text-white">{metrics.mobileScore}/100</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${metrics.mobileScore}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-700 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400">Backlinks</p>
                  <p className="text-xl font-semibold text-white">{metrics.backlinks}</p>
                </div>
                <div>
                  <p className="text-gray-400">Indexed Pages</p>
                  <p className="text-xl font-semibold text-white">{metrics.indexedPages}</p>
                </div>
                <div>
                  <p className="text-gray-400">Organic Traffic</p>
                  <p className="text-xl font-semibold text-white">{metrics.organicTraffic}</p>
                </div>
                <div>
                  <p className="text-gray-400">Keywords</p>
                  <p className="text-xl font-semibold text-white">{metrics.rankingKeywords}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Activity Log */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Activity Log</h4>
            <div className="bg-gray-800/50 rounded-lg p-3 h-48 overflow-y-auto">
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
                SEO Optimization Complete!
              </h3>
              <p className="text-green-300 text-sm mt-1">
                Your site is now optimized for Birmingham local search with improved technical SEO, content, and backlinks
              </p>
            </div>
            <button
              onClick={onNext}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Continue to ADS Agent →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}