'use client'

interface DesignScraperProps {
  projectData: any
  setProjectData: (data: any) => void
  autoMode: boolean
  onNext: () => void
}

export default function DesignScraper({ projectData, setProjectData, autoMode, onNext }: DesignScraperProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Design Scraper</h2>
      <p className="text-gray-600 mb-4">Analyze competitor designs and trends.</p>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">🚧 Component ready for development</p>
        <p className="text-sm text-yellow-600 mt-1">Will scrape and analyze Birmingham competitor websites</p>
      </div>
      <button onClick={onNext} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
        Continue to Visual Content →
      </button>
    </div>
  )
}