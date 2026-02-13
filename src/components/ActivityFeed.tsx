import { useState } from 'react'
import type { ActivityItem } from '../types'

interface Props {
  items: ActivityItem[]
}

const typeIcons: Record<string, string> = {
  research: '🔍',
  calendar: '📅',
  reminder: '🔔',
  code: '💻',
  analysis: '📊',
}

const typeColors: Record<string, string> = {
  research: 'border-arc/30 bg-arc/5',
  calendar: 'border-amber/30 bg-amber/5',
  reminder: 'border-amber/30 bg-amber/5',
  code: 'border-success/30 bg-success/5',
  analysis: 'border-arc/30 bg-arc/5',
}

function timeAgo(timestamp: string): string {
  const now = new Date()
  const date = new Date(timestamp)
  const hours = Math.floor((now.getTime() - date.getTime()) / 3600000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function ActivityFeed({ items }: Props) {
  const [reactions, setReactions] = useState<Record<string, string | undefined>>(() => {
    const initial: Record<string, string | undefined> = {}
    items.forEach((item) => {
      if (item.reaction) initial[item.id] = item.reaction
    })
    return initial
  })

  function setReaction(id: string, reaction: string) {
    setReactions((prev) => ({
      ...prev,
      [id]: prev[id] === reaction ? undefined : reaction,
    }))
  }

  return (
    <section className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📋</span>
        <h2 className="section-title">Chuck's Activity</h2>
        <div className="flex-1 h-px bg-stark-600" />
      </div>

      <div className="space-y-2">
        {items.map((item) => {
          const currentReaction = reactions[item.id]
          return (
            <div
              key={item.id}
              className={`glass-panel p-4 border-l-2 transition-all hover:border-stark-500 ${typeColors[item.type]}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-base mt-0.5">{typeIcons[item.type]}</span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-sm text-gray-200">{item.title}</span>
                    <span className="text-[10px] text-gray-500 font-[JetBrains_Mono] shrink-0">
                      {timeAgo(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item.description}</p>

                  {/* Reaction buttons */}
                  <div className="flex gap-1.5 mt-2">
                    {[
                      { key: 'approve', emoji: '👍', label: 'Approve' },
                      { key: 'revise', emoji: '🔄', label: 'Revise' },
                      { key: 'cancel', emoji: '❌', label: 'Cancel' },
                    ].map(({ key, emoji, label }) => (
                      <button
                        key={key}
                        onClick={() => setReaction(item.id, key)}
                        title={label}
                        className={`px-2 py-0.5 rounded-md text-xs transition-all ${
                          currentReaction === key
                            ? key === 'approve'
                              ? 'bg-success/20 border border-success/30'
                              : key === 'revise'
                                ? 'bg-amber/20 border border-amber/30'
                                : 'bg-danger/20 border border-danger/30'
                            : 'bg-stark-700/50 border border-transparent hover:border-stark-500'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
