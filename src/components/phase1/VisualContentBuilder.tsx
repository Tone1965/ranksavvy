'use client'

interface VisualContentBuilderProps {
  projectData: any
  setProjectData: (data: any) => void
  autoMode: boolean
  onNext: () => void
}

export default function VisualContentBuilder({ projectData, setProjectData, autoMode, onNext }: VisualContentBuilderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Visual Content Builder</h2>
      <p className="text-gray-600 mb-4">Create visual assets and content.</p>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">🚧 Component ready for development</p>
        <p className="text-sm text-yellow-600 mt-1">Will generate images, logos, and visual content</p>
      </div>
      <button onClick={onNext} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
        Continue to Site Assembly →
      </button>
    </div>
  )
}