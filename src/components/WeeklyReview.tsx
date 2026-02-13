import { useEffect } from 'react'
import type { WeeklyReview as WeeklyReviewType } from '../types'

interface Props {
  review: WeeklyReviewType
  activityCount: number
  onClose: () => void
}

const momentumConfig = {
  rising: { label: 'Rising', color: 'text-success', icon: '\u2197' },
  steady: { label: 'Steady', color: 'text-amber', icon: '\u2192' },
  declining: { label: 'Declining', color: 'text-danger', icon: '\u2198' },
}

export default function WeeklyReview({ review, activityCount, onClose }: Props) {
  const momentum = momentumConfig[review.momentum]

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="glass-panel p-6 glow-border">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h2 className="section-title text-base">Weekly Review</h2>
              {review.weekOf && (
                <span className="text-xs font-[JetBrains_Mono] text-gray-500">
                  Week of {new Date(review.weekOf).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-300 transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!review.weekOf ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">First week — no review yet. Check back Sunday.</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Activities Logged</span>
                <span className="text-lg font-bold font-[JetBrains_Mono] text-arc">{activityCount}</span>
              </div>
            </div>
          ) : (
            <>
              {/* Momentum and Score */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`text-2xl ${momentum.color}`}>{momentum.icon}</div>
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Momentum</span>
                    <div className={`font-semibold text-sm ${momentum.color}`}>{momentum.label}</div>
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Score</span>
                  <div className="relative w-14 h-14 mx-auto mt-1">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
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
                    <span className={`absolute inset-0 flex items-center justify-center text-base font-bold font-[JetBrains_Mono] ${momentum.color}`}>
                      {review.score}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider">Activities</span>
                  <div className="text-lg font-bold font-[JetBrains_Mono] text-arc mt-1">{activityCount}</div>
                </div>
              </div>

              {/* Accomplished */}
              {review.accomplished.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-success" />
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Accomplished</span>
                  </div>
                  <ul className="space-y-1.5">
                    {review.accomplished.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <svg className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Coming Up */}
              {review.nextWeek.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-arc" />
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Next Week</span>
                  </div>
                  <ul className="space-y-1.5">
                    {review.nextWeek.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-arc shrink-0">{'\u2192'}</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {/* Close hint */}
          <div className="mt-6 text-center">
            <span className="text-[10px] text-gray-600">ESC to close</span>
          </div>
        </div>
      </div>
    </div>
  )
}
