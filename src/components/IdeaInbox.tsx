import { useState } from 'react'
import type { Idea } from '../types'

interface Props {
  ideas: Idea[]
}

const statusColors: Record<string, string> = {
  new: 'bg-arc/20 text-arc',
  evaluating: 'bg-amber/20 text-amber',
  active: 'bg-success/20 text-success',
  parked: 'bg-gray-500/20 text-gray-400',
  killed: 'bg-danger/20 text-danger',
}

const scoreLabels: Record<string, string> = {
  moat: 'Moat',
  aiDriftbar: 'AI-Drift',
  revenue: 'Revenue',
  passiv: 'Passive',
  speed: 'Speed',
  fit: 'Fit',
  glede: 'Glede',
}

function totalScore(scores: Idea['scores']): number {
  const values = Object.values(scores)
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10)
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 7 ? 'bg-success' : value >= 5 ? 'bg-amber' : 'bg-danger/70'
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-gray-400 w-14 text-right uppercase">{label}</span>
      <div className="flex-1 h-1.5 bg-stark-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value * 10}%` }} />
      </div>
      <span className="text-[10px] font-[JetBrains_Mono] text-gray-500 w-4">{value}</span>
    </div>
  )
}

export default function IdeaInbox({ ideas }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [inputValue, setInputValue] = useState('')

  const filtered = ideas
    .filter((i) => filter === 'all' || i.status === filter)
    .sort((a, b) => totalScore(b.scores) - totalScore(a.scores))

  const statuses = ['all', 'new', 'evaluating', 'active', 'parked', 'killed']

  return (
    <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">💡</span>
        <h2 className="section-title">Idea Inbox</h2>
        <div className="flex-1 h-px bg-stark-600" />
        <span className="text-xs font-[JetBrains_Mono] text-gray-500">{ideas.length} ideas</span>
      </div>

      {/* Quick capture */}
      <div className="glass-panel p-3 mb-4 flex items-center gap-2">
        <div className="text-arc text-lg">⚡</div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Drop an idea..."
          className="flex-1 bg-transparent outline-none text-sm text-gray-200 placeholder-gray-600"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && inputValue.trim()) {
              setInputValue('')
            }
          }}
        />
        <span className="text-[10px] text-gray-600 hidden sm:block">ENTER ↵</span>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-lg text-xs capitalize transition-all whitespace-nowrap ${
              filter === s
                ? 'bg-arc/20 text-arc border border-arc/30'
                : 'bg-stark-700/50 text-gray-400 border border-transparent hover:border-stark-500'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Ideas list */}
      <div className="space-y-2">
        {filtered.map((idea) => {
          const score = totalScore(idea.scores)
          const isExpanded = expandedId === idea.id
          return (
            <div
              key={idea.id}
              className={`glass-panel transition-all duration-300 cursor-pointer ${
                isExpanded ? 'glow-border' : 'hover:border-stark-500'
              }`}
              onClick={() => setExpandedId(isExpanded ? null : idea.id)}
            >
              <div className="p-4 flex items-start gap-3">
                {/* Score circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-[JetBrains_Mono] shrink-0 ${
                    score >= 70
                      ? 'bg-success/15 text-success border border-success/30'
                      : score >= 50
                        ? 'bg-amber/15 text-amber border border-amber/30'
                        : 'bg-gray-500/15 text-gray-400 border border-gray-500/30'
                  }`}
                >
                  {score}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-200">{idea.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-medium ${statusColors[idea.status]}`}>
                      {idea.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-1">{idea.description}</p>
                </div>

                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform shrink-0 mt-1 ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-stark-600/50 pt-3 space-y-4">
                  {/* Score breakdown */}
                  <div className="space-y-1.5">
                    {Object.entries(idea.scores).map(([key, value]) => (
                      <ScoreBar key={key} label={scoreLabels[key] || key} value={value} />
                    ))}
                  </div>

                  {/* Pros & Cons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] uppercase text-success tracking-wider font-semibold">Pros</span>
                      <ul className="mt-1 space-y-0.5">
                        {idea.pros.map((p, i) => (
                          <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                            <span className="text-success mt-0.5">+</span> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-danger tracking-wider font-semibold">Cons</span>
                      <ul className="mt-1 space-y-0.5">
                        {idea.cons.map((c, i) => (
                          <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                            <span className="text-danger mt-0.5">-</span> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Next steps */}
                  <div>
                    <span className="text-[10px] uppercase text-arc tracking-wider font-semibold">Next Steps</span>
                    <ul className="mt-1 space-y-0.5">
                      {idea.nextSteps.map((s, i) => (
                        <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                          <span className="text-arc mt-0.5">→</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
