import type { HealthEntry } from '../types'

interface Props {
  entries: HealthEntry[]
}

function getTensionColor(level: number): string {
  if (level <= 3) return 'text-success'
  if (level <= 5) return 'text-amber'
  if (level <= 7) return 'text-amber-dim'
  return 'text-danger'
}

function getTensionBg(level: number): string {
  if (level <= 3) return 'bg-success'
  if (level <= 5) return 'bg-amber'
  if (level <= 7) return 'bg-amber-dim'
  return 'bg-danger'
}

function getDayName(dateStr: string): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return days[new Date(dateStr).getDay()]
}

export default function HealthTracker({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <section className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">💪</span>
          <h2 className="section-title">Health Tracker</h2>
          <div className="flex-1 h-px bg-stark-600" />
        </div>
        <div className="glass-panel p-5 text-center">
          <p className="text-gray-500 text-sm">No health entries yet. Start tracking today.</p>
        </div>
      </section>
    )
  }

  const today = entries[0]
  const streak = (() => {
    let count = 0
    for (const entry of entries) {
      if (entry.psoasTraining || entry.spleniusTraining) count++
      else break
    }
    return count
  })()

  const avgTension = Math.round(
    (entries.reduce((sum, e) => sum + e.neckTension, 0) / entries.length) * 10
  ) / 10

  return (
    <section className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">💪</span>
        <h2 className="section-title">Health Tracker</h2>
        <div className="flex-1 h-px bg-stark-600" />
      </div>

      <div className="glass-panel p-5">
        {/* Today's status */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Today's Neck Tension</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-4xl font-bold font-[JetBrains_Mono] ${getTensionColor(today?.neckTension ?? 0)}`}>
                {today?.neckTension ?? '-'}
              </span>
              <span className="text-sm text-gray-500">/ 10</span>
            </div>
          </div>

          <div className="text-center">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Streak</span>
            <div className="flex items-baseline gap-1 mt-1 justify-center">
              <span className="text-3xl font-bold font-[JetBrains_Mono] text-amber">{streak}</span>
              <span className="text-sm text-gray-500">days</span>
            </div>
          </div>

          <div className="text-center">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Avg</span>
            <div className="flex items-baseline gap-1 mt-1 justify-center">
              <span className={`text-3xl font-bold font-[JetBrains_Mono] ${getTensionColor(avgTension)}`}>
                {avgTension}
              </span>
            </div>
          </div>
        </div>

        {/* Tension chart */}
        <div className="mb-5">
          <div className="flex items-end gap-1.5 h-20 justify-between">
            {[...entries].reverse().map((entry) => (
              <div key={entry.date} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full max-w-[28px] relative rounded-t-sm overflow-hidden" style={{ height: `${entry.neckTension * 10}%` }}>
                  <div className={`absolute inset-0 ${getTensionBg(entry.neckTension)} opacity-60 rounded-t-sm`} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-1.5 justify-between mt-1">
            {[...entries].reverse().map((entry) => (
              <div key={entry.date} className="flex-1 text-center">
                <span className="text-[9px] text-gray-500">{getDayName(entry.date)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Training log */}
        <div className="border-t border-stark-600/50 pt-4">
          <span className="text-xs text-gray-500 uppercase tracking-wider">This Week's Training</span>
          <div className="grid grid-cols-7 gap-1 mt-3">
            {[...entries].reverse().map((entry) => (
              <div key={entry.date} className="text-center space-y-1">
                <span className="text-[9px] text-gray-500 block">{getDayName(entry.date)}</span>

                {/* PSOAS */}
                <div
                  className={`w-5 h-5 mx-auto rounded-md flex items-center justify-center text-[10px] ${
                    entry.psoasTraining
                      ? 'bg-success/20 text-success border border-success/30'
                      : 'bg-stark-700/50 text-gray-600 border border-stark-600'
                  }`}
                  title="PSOAS"
                >
                  {entry.psoasTraining ? '✓' : '·'}
                </div>

                {/* Splenius */}
                <div
                  className={`w-5 h-5 mx-auto rounded-md flex items-center justify-center text-[10px] ${
                    entry.spleniusTraining
                      ? 'bg-arc/20 text-arc border border-arc/30'
                      : 'bg-stark-700/50 text-gray-600 border border-stark-600'
                  }`}
                  title="Splenius Capitis"
                >
                  {entry.spleniusTraining ? '✓' : '·'}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm bg-success/40" />
              <span className="text-[10px] text-gray-500">PSOAS</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm bg-arc/40" />
              <span className="text-[10px] text-gray-500">Splenius Capitis</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
