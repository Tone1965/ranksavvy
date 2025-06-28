'use client'

interface ADSAgentProps {
  projectData: any
  autoMode: boolean
}

export default function ADSAgent({ projectData, autoMode }: ADSAgentProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">ADS Agent</h3>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Monitoring</span>
        </div>
      </div>
      <p className="text-gray-600 mb-4">Automated advertising campaign management.</p>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium">Google Ads</span>
          <span className="text-sm text-green-600">Active</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium">Facebook Ads</span>
          <span className="text-sm text-orange-600">Paused</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium">Local Directory Ads</span>
          <span className="text-sm text-green-600">Active</span>
        </div>
      </div>

      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-sm text-yellow-800">🚧 Agent ready for development</p>
      </div>
    </div>
  )
}