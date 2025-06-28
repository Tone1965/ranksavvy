'use client'

interface EMDFinderProps {
  projectData: any
  setProjectData: (data: any) => void
  autoMode: boolean
  onNext: () => void
}

export default function EMDFinder({ projectData, setProjectData, autoMode, onNext }: EMDFinderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">EMD Finder</h2>
      <p className="text-gray-600 mb-4">Find exact match domains for your selected niche.</p>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">🚧 Component ready for development</p>
        <p className="text-sm text-yellow-600 mt-1">Will search for available domains matching your Birmingham niche</p>
      </div>
      <button onClick={onNext} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
        Continue to SEO Tool →
      </button>
    </div>
  )
}