import { useState } from 'react'
import type { HealthEntry } from '../types'

interface Props {
  entries: HealthEntry[]
  onSave: (entry: HealthEntry) => Promise<void>
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

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

export default function HealthTracker({ entries, onSave }: Props) {
  const today = todayStr()
  const todayEntry = entries.find(e => e.date === today)

  const [neckTension, setNeckTension] = useState(todayEntry?.neckTension ?? 5)
  const [psoasTraining, setPsoasTraining] = useState(todayEntry?.psoasTraining ?? false)
  const [spleniusTraining, setSpleniusTraining] = useState(todayEntry?.spleniusTraining ?? false)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (saving) return
    setSaving(true)
    await onSave({ date: today, neckTension, psoasTraining, spleniusTraining })
    setSaving(false)
  }

  const streak = (() => {
    let count = 0
    const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))
    for (const entry of sorted) {
      if (entry.psoasTraining || entry.spleniusTraining) count++
      else break
    }
    return count
  })()

  const avgTension = entries.length > 0
    ? Math.round((entries.reduce((sum, e) => sum + e.neckTension, 0) / entries.length) * 10) / 10
    : 0

  const recentEntries = [...entries].sort((a, b) => a.date.localeCompare(b.date)).slice(-7)

  return (
    <section className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">💪</span>
        <h2 className="section-title">Health Tracker</h2>
        <div className="flex-1 h-px bg-stark-600" />
      </div>

      <div className="glass-panel p-5">
        {/* Today's input */}
        <div className="mb-5">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Log Today</span>

          {/* Neck tension slider */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Neck Tension</span>
              <span className={`text-lg font-bold font-[JetBrains_Mono] ${getTensionColor(neckTension)}`}>
                {neckTension}
                <span className="text-xs text-gray-500 font-normal"> / 10</span>
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={neckTension}
              onChange={(e) => setNeckTension(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-arc bg-stark-700"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-success">Low</span>
              <span className="text-[9px] text-danger">High</span>
            </div>
          </div>

          {/* Training checkboxes */}
          <div className="flex gap-4 mt-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={psoasTraining}
                onChange={(e) => setPsoasTraining(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] transition-all ${
                psoasTraining
                  ? 'bg-success/20 text-success border border-success/30'
                  : 'bg-stark-700/50 text-gray-600 border border-stark-600 group-hover:border-stark-500'
              }`}>
                {psoasTraining ? '✓' : '·'}
              </div>
              <span className="text-xs text-gray-300">PSOAS</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={spleniusTraining}
                onChange={(e) => setSpleniusTraining(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] transition-all ${
                spleniusTraining
                  ? 'bg-arc/20 text-arc border border-arc/30'
                  : 'bg-stark-700/50 text-gray-600 border border-stark-600 group-hover:border-stark-500'
              }`}>
                {spleniusTraining ? '✓' : '·'}
              </div>
              <span className="text-xs text-gray-300">Splenius Capitis</span>
            </label>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-4 w-full py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all bg-arc/15 text-arc border border-arc/30 hover:bg-arc/25 disabled:opacity-50"
          >
            {saving ? 'Saving...' : todayEntry ? 'Update Today' : 'Log Today'}
          </button>
        </div>

        {/* Stats */}
        {entries.length > 0 && (
          <>
            <div className="border-t border-stark-600/50 pt-4 flex items-center justify-between mb-5">
              <div className="text-center">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Streak</span>
                <div className="flex items-baseline gap-1 mt-1 justify-center">
                  <span className="text-3xl font-bold font-[JetBrains_Mono] text-amber">{streak}</span>
                  <span className="text-sm text-gray-500">days</span>
                </div>
              </div>

              <div className="text-center">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Avg Tension</span>
                <div className="flex items-baseline gap-1 mt-1 justify-center">
                  <span className={`text-3xl font-bold font-[JetBrains_Mono] ${getTensionColor(avgTension)}`}>
                    {avgTension}
                  </span>
                </div>
              </div>

              <div className="text-center">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Entries</span>
                <div className="flex items-baseline gap-1 mt-1 justify-center">
                  <span className="text-3xl font-bold font-[JetBrains_Mono] text-arc">{entries.length}</span>
                </div>
              </div>
            </div>

            {/* Tension chart */}
            {recentEntries.length > 0 && (
              <div className="mb-5">
                <div className="flex items-end gap-1.5 h-20 justify-between">
                  {recentEntries.map((entry) => (
                    <div key={entry.date} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full max-w-[28px] relative rounded-t-sm overflow-hidden" style={{ height: `${entry.neckTension * 10}%` }}>
                        <div className={`absolute inset-0 ${getTensionBg(entry.neckTension)} opacity-60 rounded-t-sm`} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-1.5 justify-between mt-1">
                  {recentEntries.map((entry) => (
                    <div key={entry.date} className="flex-1 text-center">
                      <span className="text-[9px] text-gray-500">{getDayName(entry.date)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Training log */}
            {recentEntries.length > 0 && (
              <div className="border-t border-stark-600/50 pt-4">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Recent Training</span>
                <div className="grid grid-cols-7 gap-1 mt-3">
                  {recentEntries.map((entry) => (
                    <div key={entry.date} className="text-center space-y-1">
                      <span className="text-[9px] text-gray-500 block">{getDayName(entry.date)}</span>
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
            )}
          </>
        )}
      </div>
    </section>
  )
}
