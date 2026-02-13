import { useState, useEffect } from 'react'
import MissionControl from './components/MissionControl'
import IdeaInbox from './components/IdeaInbox'
import ActiveProjects from './components/ActiveProjects'
import ActivityFeed from './components/ActivityFeed'
import HealthTracker from './components/HealthTracker'
import WeeklyReview from './components/WeeklyReview'
import type { Phase, Idea, Project, ActivityItem, HealthEntry, WeeklyReview as WeeklyReviewType } from './types'

const navItems = [
  { id: 'mission', label: 'Mission', icon: '🎯' },
  { id: 'ideas', label: 'Ideas', icon: '💡' },
  { id: 'projects', label: 'Projects', icon: '🚀' },
  { id: 'activity', label: 'Activity', icon: '📋' },
  { id: 'health', label: 'Health', icon: '💪' },
  { id: 'review', label: 'Review', icon: '📊' },
]

export default function App() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [phases, setPhases] = useState<Phase[]>([])
  const [metrics, setMetrics] = useState({ daysToGoal: 0, activeProjects: 0, ideasInPipeline: 0, currentPhase: 1 })
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [healthEntries, setHealthEntries] = useState<HealthEntry[]>([])
  const [review, setReview] = useState<WeeklyReviewType>({ weekOf: '', accomplished: [], nextWeek: [], momentum: 'steady', score: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/mission').then(r => r.json()),
      fetch('/api/ideas').then(r => r.json()),
      fetch('/api/projects').then(r => r.json()),
      fetch('/api/activities').then(r => r.json()),
      fetch('/api/health').then(r => r.json()),
      fetch('/api/review').then(r => r.json()),
    ]).then(([mission, ideasData, projectsData, activitiesData, healthData, reviewData]) => {
      setPhases(mission.phases)
      setMetrics(mission.metrics)
      setIdeas(ideasData)
      setProjects(projectsData)
      setActivities(activitiesData)
      setHealthEntries(healthData)
      setReview(reviewData)
      setLoading(false)
    })
  }, [])

  function scrollTo(id: string) {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => setActiveSection(null), 1000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stark-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-arc animate-pulse" />
          <span className="text-arc text-sm tracking-widest uppercase">Loading systems...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stark-900">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-arc/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber/3 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-arc/2 rounded-full blur-3xl" />
      </div>

      {/* Navigation bar */}
      <nav className="sticky top-0 z-50 bg-stark-900/80 backdrop-blur-xl border-b border-stark-700/50">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-1 overflow-x-auto">
          <div className="flex items-center gap-2 mr-4 shrink-0">
            <div className="w-2 h-2 rounded-full bg-arc animate-pulse" />
            <span className="text-xs font-bold text-arc tracking-widest hidden sm:block">CHUCK HQ</span>
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap ${
                activeSection === item.id
                  ? 'bg-arc/15 text-arc'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-stark-700/50'
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main className="relative max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left column — primary content */}
          <div className="lg:col-span-7 space-y-10">
            <div id="mission">
              <MissionControl phases={phases} metrics={metrics} />
            </div>

            <div id="ideas">
              <IdeaInbox ideas={ideas} />
            </div>

            <div id="projects">
              <ActiveProjects projects={projects} />
            </div>
          </div>

          {/* Right column — sidebar */}
          <div className="lg:col-span-5 space-y-10">
            <div id="activity">
              <ActivityFeed items={activities} />
            </div>

            <div id="health">
              <HealthTracker entries={healthEntries} />
            </div>

            <div id="review">
              <WeeklyReview review={review} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pb-8 text-center">
          <div className="h-px bg-gradient-to-r from-transparent via-stark-600/50 to-transparent mb-6" />
          <p className="text-xs text-gray-600">
            <span className="text-arc/50">⚡</span>{' '}
            Chuck HQ — Fredrik & Chuck, building the future
          </p>
        </footer>
      </main>
    </div>
  )
}
