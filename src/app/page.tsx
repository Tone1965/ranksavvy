export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🚀 RankSavvy Test Page
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Simple test to verify server is working
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-green-600 font-semibold">✅ If you see this, the server works!</p>
          <p className="text-gray-500 mt-2">Next.js is running correctly</p>
        </div>
      </div>
    </div>
  )
}