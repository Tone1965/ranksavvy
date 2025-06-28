'use client'

interface AuthoritySiteAssemblyProps {
  projectData: any
  setProjectData: (data: any) => void
  autoMode: boolean
  onNext: () => void
}

export default function AuthoritySiteAssembly({ projectData, setProjectData, autoMode, onNext }: AuthoritySiteAssemblyProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Authority Site Assembly</h2>
      <p className="text-gray-600 mb-4">Build the complete authority website.</p>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">🚧 Component ready for development</p>
        <p className="text-sm text-yellow-600 mt-1">Will assemble complete website code and structure</p>
      </div>
      <button onClick={onNext} className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg">
        Complete Phase 1 → Go to Phase 2
      </button>
    </div>
  )
}