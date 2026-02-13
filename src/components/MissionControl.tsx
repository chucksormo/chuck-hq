import type { Phase } from '../types'

interface Props {
  phases: Phase[]
  metrics: {
    daysToGoal: number
    activeProjects: number
    ideasInPipeline: number
    currentPhase: number
  }
}

function MetricCard({ label, value, accent = 'arc' }: { label: string; value: number | string; accent?: string }) {
  const colorMap: Record<string, string> = {
    arc: 'text-arc',
    amber: 'text-amber',
    success: 'text-success',
  }
  return (
    <div className="glass-panel p-4 text-center">
      <div className={`text-3xl font-bold font-[JetBrains_Mono] ${colorMap[accent] || 'text-arc'}`}>
        {value}
      </div>
      <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">{label}</div>
    </div>
  )
}

export default function MissionControl({ phases, metrics }: Props) {
  return (
    <section className="animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-3 rounded-full bg-arc animate-pulse-glow" />
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          <span className="text-arc">CHUCK</span>{' '}
          <span className="text-gray-400 font-light">HQ</span>
        </h1>
        <div className="flex-1 h-px bg-gradient-to-r from-arc/30 to-transparent" />
        <span className="text-xs text-gray-500 font-[JetBrains_Mono]">
          SYSTEM ONLINE
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <MetricCard label="Days to Goal" value={metrics.daysToGoal} accent="amber" />
        <MetricCard label="Active Projects" value={metrics.activeProjects} accent="arc" />
        <MetricCard label="Ideas Pipeline" value={metrics.ideasInPipeline} accent="success" />
      </div>

      {/* Phase Timeline */}
      <div className="glass-panel p-5 md:p-6">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-sm text-gray-500 uppercase tracking-widest">Mission Phases</span>
          <div className="flex-1 h-px bg-stark-600" />
        </div>

        <div className="space-y-3">
          {phases.map((phase, index) => (
            <div
              key={phase.id}
              className={`relative flex items-start gap-4 p-3 rounded-xl transition-all duration-300 ${
                phase.status === 'active'
                  ? 'bg-arc/5 glow-border'
                  : 'hover:bg-stark-700/50'
              }`}
            >
              {/* Phase indicator */}
              <div className="flex flex-col items-center mt-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                    phase.status === 'completed'
                      ? 'bg-success/20 border-success text-success'
                      : phase.status === 'active'
                        ? 'bg-arc/20 border-arc text-arc animate-pulse'
                        : 'bg-stark-700 border-stark-500 text-gray-500'
                  }`}
                >
                  {phase.status === 'completed' ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    phase.id
                  )}
                </div>
                {index < phases.length - 1 && (
                  <div
                    className={`w-0.5 h-6 mt-1 ${
                      phase.status === 'completed' ? 'bg-success/40' : 'bg-stark-600'
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-semibold ${
                      phase.status === 'active' ? 'text-arc' : phase.status === 'completed' ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    {phase.name}
                  </span>
                  {phase.status === 'active' && (
                    <span className="text-[10px] bg-arc/20 text-arc px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-0.5">{phase.description}</p>

                {/* Progress bar */}
                {(phase.status === 'active' || phase.status === 'completed') && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-stark-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          phase.status === 'completed'
                            ? 'bg-success'
                            : 'bg-gradient-to-r from-arc to-arc-dim'
                        }`}
                        style={{ width: `${phase.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-[JetBrains_Mono] text-gray-500">
                      {phase.progress}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
