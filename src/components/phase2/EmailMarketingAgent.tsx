'use client'

interface EmailMarketingAgentProps {
  projectData: any
  autoMode: boolean
}

export default function EmailMarketingAgent({ projectData, autoMode }: EmailMarketingAgentProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Email Marketing Agent</h3>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Scheduling</span>
        </div>
      </div>
      <p className="text-gray-600 mb-4">Automated email campaigns and nurture sequences.</p>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium">Welcome Series</span>
          <span className="text-sm text-green-600">Active</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium">Weekly Newsletter</span>
          <span className="text-sm text-blue-600">Scheduled</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium">Lead Nurture</span>
          <span className="text-sm text-green-600">Active</span>
        </div>
      </div>

      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-sm text-yellow-800">🚧 Agent ready for development</p>
      </div>
    </div>
  )
}