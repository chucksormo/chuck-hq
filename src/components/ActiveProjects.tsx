import type { Project } from '../types'

interface Props {
  projects: Project[]
}

const stageConfig: Record<string, { label: string; ring: number }> = {
  exploring: { label: 'Exploring', ring: 4 },
  building: { label: 'Building', ring: 3 },
  growing: { label: 'Growing', ring: 2 },
  maintaining: { label: 'Maintaining', ring: 1 },
  exiting: { label: 'Exiting', ring: 0 },
}

const stageOrder = ['exploring', 'building', 'growing', 'maintaining', 'exiting']

export default function ActiveProjects({ projects }: Props) {
  return (
    <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🚀</span>
        <h2 className="section-title">Active Projects</h2>
        <div className="flex-1 h-px bg-stark-600" />
      </div>

      {/* Radar visualization */}
      <div className="glass-panel p-5 mb-4">
        <div className="relative mx-auto w-full max-w-[280px] aspect-square">
          {/* Radar rings */}
          {[1, 2, 3, 4].map((ring) => (
            <div
              key={ring}
              className="absolute border border-stark-600/40 rounded-full"
              style={{
                width: `${ring * 25}%`,
                height: `${ring * 25}%`,
                top: `${50 - ring * 12.5}%`,
                left: `${50 - ring * 12.5}%`,
              }}
            />
          ))}

          {/* Crosshairs */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-stark-600/30" />
          <div className="absolute left-0 right-0 top-1/2 h-px bg-stark-600/30" />

          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-arc/50" />

          {/* Project dots */}
          {projects.map((project, index) => {
            const config = stageConfig[project.stage]
            const angle = (index * 120 + 30) * (Math.PI / 180)
            const distance = ((5 - config.ring) / 5) * 42
            const x = 50 + Math.cos(angle) * distance
            const y = 50 + Math.sin(angle) * distance

            return (
              <div
                key={project.id}
                className="absolute group"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div
                  className="w-4 h-4 rounded-full border-2 cursor-pointer transition-transform hover:scale-150"
                  style={{
                    backgroundColor: `${project.color}30`,
                    borderColor: project.color,
                    boxShadow: `0 0 12px ${project.color}40`,
                  }}
                />
                <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden group-hover:block z-10">
                  <div className="bg-stark-800 border border-stark-600 rounded-lg px-3 py-1.5 whitespace-nowrap shadow-xl">
                    <span className="text-xs font-medium" style={{ color: project.color }}>
                      {project.name}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Stage labels */}
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-gray-600 uppercase tracking-widest">
            Radar View
          </span>
        </div>
      </div>

      {/* Stage legend */}
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        {stageOrder.map((stage) => {
          const hasProjects = projects.some((p) => p.stage === stage)
          return (
            <span
              key={stage}
              className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${
                hasProjects ? 'bg-arc/10 text-arc border border-arc/20' : 'bg-stark-700/50 text-gray-600'
              }`}
            >
              {stageConfig[stage].label}
            </span>
          )
        })}
      </div>

      {/* Project cards */}
      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project.id} className="glass-panel p-4 hover:border-stark-500 transition-all">
            <div className="flex items-start gap-3">
              <div
                className="w-2 h-2 rounded-full mt-2 shrink-0"
                style={{ backgroundColor: project.color, boxShadow: `0 0 8px ${project.color}60` }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-200">{project.name}</span>
                  <span className="text-[10px] bg-stark-700 text-gray-400 px-2 py-0.5 rounded-full uppercase">
                    {stageConfig[project.stage].label}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{project.description}</p>

                {/* Progress */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-stark-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${project.progress}%`,
                        backgroundColor: project.color,
                        boxShadow: `0 0 8px ${project.color}60`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-[JetBrains_Mono] text-gray-500">{project.progress}%</span>
                </div>

                {/* Next action */}
                <div className="mt-2 flex items-start gap-1.5">
                  <span className="text-arc text-xs mt-0.5">→</span>
                  <span className="text-xs text-gray-300">{project.nextAction}</span>
                </div>

                {/* Blockers */}
                {project.blockers.length > 0 && (
                  <div className="mt-2">
                    {project.blockers.map((b, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="text-danger text-xs mt-0.5">!</span>
                        <span className="text-xs text-danger/80">{b}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
