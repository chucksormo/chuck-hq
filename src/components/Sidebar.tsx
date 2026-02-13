import { useState } from 'react'
import type { Project, HealthEntry } from '../types'

interface Props {
  projects: Project[]
  healthEntries: HealthEntry[]
  onSaveHealth: (entry: HealthEntry) => Promise<void>
}

const stageConfig: Record<string, { label: string }> = {
  exploring: { label: 'Exploring' },
  building: { label: 'Building' },
  growing: { label: 'Growing' },
  maintaining: { label: 'Maintaining' },
  exiting: { label: 'Exiting' },
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

type Tab = 'projects' | 'health'

export default function Sidebar({ projects, healthEntries, onSaveHealth }: Props) {
  const [tab, setTab] = useState<Tab>('projects')

  return (
    <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      {/* Tab switcher */}
      <div className="flex items-center gap-1 mb-4">
        <button
          onClick={() => setTab('projects')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
            tab === 'projects' ? 'bg-arc/15 text-arc border border-arc/20' : 'text-gray-400 hover:text-gray-200 bg-stark-700/30 border border-transparent'
          }`}
        >
          Projects
          <span className="text-[10px] opacity-60">{projects.length}</span>
        </button>
        <button
          onClick={() => setTab('health')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
            tab === 'health' ? 'bg-arc/15 text-arc border border-arc/20' : 'text-gray-400 hover:text-gray-200 bg-stark-700/30 border border-transparent'
          }`}
        >
          Health
        </button>
        <div className="flex-1 h-px bg-stark-600" />
      </div>

      {tab === 'projects' ? (
        <ProjectsPanel projects={projects} />
      ) : (
        <HealthPanel entries={healthEntries} onSave={onSaveHealth} />
      )}
    </section>
  )
}

function ProjectsPanel({ projects }: { projects: Project[] }) {
  return (
    <div className="space-y-2">
      {projects.length === 0 && (
        <div className="glass-panel p-4 text-center">
          <p className="text-gray-500 text-sm">No projects yet.</p>
        </div>
      )}
      {projects.map((project) => (
        <div key={project.id} className="glass-panel p-3 hover:border-stark-500 transition-all">
          <div className="flex items-start gap-2.5">
            <div
              className="w-2 h-2 rounded-full mt-1.5 shrink-0"
              style={{ backgroundColor: project.color, boxShadow: `0 0 8px ${project.color}60` }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm text-gray-200">{project.name}</span>
                <span className="text-[10px] bg-stark-700 text-gray-400 px-1.5 py-0.5 rounded-full uppercase">
                  {stageConfig[project.stage]?.label}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1 bg-stark-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${project.progress}%`,
                      backgroundColor: project.color,
                    }}
                  />
                </div>
                <span className="text-[10px] font-[JetBrains_Mono] text-gray-500">{project.progress}%</span>
              </div>

              <div className="mt-1.5 flex items-start gap-1">
                <span className="text-arc text-[10px] mt-0.5">&#8594;</span>
                <span className="text-[11px] text-gray-400">{project.nextAction}</span>
              </div>

              {project.blockers.length > 0 && (
                <div className="mt-1">
                  {project.blockers.map((b, i) => (
                    <div key={i} className="flex items-start gap-1">
                      <span className="text-danger text-[10px] mt-0.5">!</span>
                      <span className="text-[11px] text-danger/80">{b}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function HealthPanel({ entries, onSave }: { entries: HealthEntry[]; onSave: (entry: HealthEntry) => Promise<void> }) {
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
    <div className="glass-panel p-4">
      {/* Today's input */}
      <div className="mb-4">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Log Today</span>

        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-gray-400">Neck Tension</span>
            <span className={`text-sm font-bold font-[JetBrains_Mono] ${getTensionColor(neckTension)}`}>
              {neckTension}<span className="text-[10px] text-gray-500 font-normal">/10</span>
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={neckTension}
            onChange={(e) => setNeckTension(Number(e.target.value))}
            className="w-full h-1 rounded-full appearance-none cursor-pointer accent-arc bg-stark-700"
          />
        </div>

        <div className="flex gap-3 mt-3">
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={psoasTraining} onChange={(e) => setPsoasTraining(e.target.checked)} className="sr-only" />
            <div className={`w-4 h-4 rounded flex items-center justify-center text-[9px] transition-all ${
              psoasTraining ? 'bg-success/20 text-success border border-success/30' : 'bg-stark-700/50 text-gray-600 border border-stark-600'
            }`}>
              {psoasTraining ? '&#10003;' : ''}
            </div>
            <span className="text-[11px] text-gray-300">PSOAS</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" checked={spleniusTraining} onChange={(e) => setSpleniusTraining(e.target.checked)} className="sr-only" />
            <div className={`w-4 h-4 rounded flex items-center justify-center text-[9px] transition-all ${
              spleniusTraining ? 'bg-arc/20 text-arc border border-arc/30' : 'bg-stark-700/50 text-gray-600 border border-stark-600'
            }`}>
              {spleniusTraining ? '&#10003;' : ''}
            </div>
            <span className="text-[11px] text-gray-300">Splenius</span>
          </label>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-3 w-full py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all bg-arc/15 text-arc border border-arc/30 hover:bg-arc/25 disabled:opacity-50"
        >
          {saving ? 'Saving...' : todayEntry ? 'Update' : 'Log Today'}
        </button>
      </div>

      {/* Compact stats */}
      {entries.length > 0 && (
        <div className="border-t border-stark-600/50 pt-3">
          <div className="flex items-center justify-between mb-3">
            <div className="text-center">
              <span className="text-[10px] text-gray-500 uppercase block">Streak</span>
              <span className="text-lg font-bold font-[JetBrains_Mono] text-amber">{streak}</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-gray-500 uppercase block">Avg</span>
              <span className={`text-lg font-bold font-[JetBrains_Mono] ${getTensionColor(avgTension)}`}>{avgTension}</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-gray-500 uppercase block">Entries</span>
              <span className="text-lg font-bold font-[JetBrains_Mono] text-arc">{entries.length}</span>
            </div>
          </div>

          {/* Mini chart */}
          {recentEntries.length > 0 && (
            <div className="flex items-end gap-1 h-12 justify-between">
              {recentEntries.map((entry) => (
                <div key={entry.date} className="flex-1 flex flex-col items-center gap-0.5">
                  <div className="w-full max-w-[20px] relative rounded-t-sm overflow-hidden" style={{ height: `${entry.neckTension * 10}%` }}>
                    <div className={`absolute inset-0 ${getTensionBg(entry.neckTension)} opacity-60 rounded-t-sm`} />
                  </div>
                  <span className="text-[8px] text-gray-600">{getDayName(entry.date)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
