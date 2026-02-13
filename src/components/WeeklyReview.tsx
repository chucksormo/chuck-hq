import type { WeeklyReview as WeeklyReviewType } from '../types'

interface Props {
  review: WeeklyReviewType
}

const momentumConfig = {
  rising: { label: 'Rising', color: 'text-success', bg: 'bg-success', icon: '↗' },
  steady: { label: 'Steady', color: 'text-amber', bg: 'bg-amber', icon: '→' },
  declining: { label: 'Declining', color: 'text-danger', bg: 'bg-danger', icon: '↘' },
}

export default function WeeklyReview({ review }: Props) {
  const momentum = momentumConfig[review.momentum]

  if (!review.weekOf) {
    return (
      <section className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📊</span>
          <h2 className="section-title">Weekly Review</h2>
          <div className="flex-1 h-px bg-stark-600" />
        </div>
        <div className="glass-panel p-5 text-center">
          <p className="text-gray-500 text-sm">First week — no review yet. Check back Sunday.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📊</span>
        <h2 className="section-title">Weekly Review</h2>
        <div className="flex-1 h-px bg-stark-600" />
        <span className="text-xs font-[JetBrains_Mono] text-gray-500">
          Week of {new Date(review.weekOf).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      <div className="glass-panel p-5">
        {/* Momentum and Score */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`text-3xl ${momentum.color}`}>{momentum.icon}</div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Momentum</span>
              <div className={`font-semibold ${momentum.color}`}>{momentum.label}</div>
            </div>
          </div>

          <div className="text-center">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Week Score</span>
            <div className="relative w-16 h-16 mx-auto mt-1">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="text-stark-700"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeDasharray={`${review.score}, 100`}
                  strokeLinecap="round"
                  className={momentum.color}
                />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-lg font-bold font-[JetBrains_Mono] ${momentum.color}`}>
                {review.score}
              </span>
            </div>
          </div>
        </div>

        {/* Accomplished */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-success" />
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Accomplished</span>
          </div>
          <ul className="space-y-1.5">
            {review.accomplished.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <svg className="w-4 h-4 text-success shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Coming Up */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-arc" />
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Next Week</span>
          </div>
          <ul className="space-y-1.5">
            {review.nextWeek.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-arc shrink-0">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
