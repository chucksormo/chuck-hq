import type { ActivityItem } from '../types'

interface Props {
  items: ActivityItem[]
  onReaction: (id: string, reaction: string | undefined) => Promise<void>
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
  const diffMs = now.getTime() - date.getTime()
  if (diffMs < 0) return 'just now'
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  return `${weeks}w ago`
}

export default function ActivityFeed({ items, onReaction }: Props) {
  const sorted = [...items].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return (
    <section className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">📋</span>
        <h2 className="section-title">Chuck's Activity</h2>
        <div className="flex-1 h-px bg-stark-600" />
        <span className="text-xs font-[JetBrains_Mono] text-gray-500">{items.length} events</span>
      </div>

      <div className="space-y-2">
        {sorted.length === 0 && (
          <div className="glass-panel p-5 text-center">
            <p className="text-gray-500 text-sm">No activity yet.</p>
          </div>
        )}
        {sorted.map((item) => {
          const currentReaction = item.reaction
          return (
            <div
              key={item.id}
              className={`glass-panel p-4 border-l-2 transition-all hover:border-stark-500 ${typeColors[item.type] || ''}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-base mt-0.5">{typeIcons[item.type] || '📌'}</span>

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
                        onClick={() => onReaction(item.id, currentReaction === key ? undefined : key)}
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
