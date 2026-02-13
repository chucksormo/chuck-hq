export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-stark-900">
      {/* Nav skeleton */}
      <nav className="sticky top-0 z-50 bg-stark-900/80 backdrop-blur-xl border-b border-stark-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <div className="skeleton w-2 h-2 rounded-full" />
          <div className="skeleton w-20 h-3" />
          <div className="flex-1" />
          <div className="skeleton w-16 h-6 rounded-lg" />
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Mission skeleton */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="skeleton w-3 h-3 rounded-full" />
            <div className="skeleton w-32 h-6" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-panel p-4">
                <div className="skeleton w-12 h-8 mx-auto mb-2" />
                <div className="skeleton w-20 h-3 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main content skeleton */}
          <div className="lg:col-span-8 space-y-4">
            <div className="glass-panel p-4">
              <div className="skeleton w-24 h-5 mb-4" />
              <div className="skeleton w-full h-10 mb-3 rounded-xl" />
              <div className="flex gap-2 mb-4">
                {[1, 2, 3].map(i => <div key={i} className="skeleton w-16 h-6 rounded-lg" />)}
              </div>
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton w-full h-16 mb-2 rounded-xl" />
              ))}
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="lg:col-span-4 space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="glass-panel p-4">
                <div className="skeleton w-24 h-5 mb-4" />
                {[1, 2, 3].map(j => (
                  <div key={j} className="skeleton w-full h-12 mb-2 rounded-xl" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
