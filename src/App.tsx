import { useState, useEffect, useCallback } from 'react'
import MissionControl from './components/MissionControl'
import IdeaInbox from './components/IdeaInbox'
import ActivityFeed from './components/ActivityFeed'
import Sidebar from './components/Sidebar'
import WeeklyReview from './components/WeeklyReview'
import LoadingSkeleton from './components/LoadingSkeleton'
import type { Phase, Idea, Project, ActivityItem, HealthEntry, WeeklyReview as WeeklyReviewType } from './types'

const navItems = [
  { id: 'mission', label: 'Mission' },
  { id: 'ideas', label: 'Ideas' },
  { id: 'activity', label: 'Activity' },
  { id: 'sidebar', label: 'Projects' },
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
  const [showReview, setShowReview] = useState(false)

  const fetchAll = useCallback(() => {
    return Promise.all([
      fetch('/api/mission').then(r => r.json()),
      fetch('/api/ideas').then(r => r.json()),
      fetch('/api/projects').then(r => r.json()),
      fetch('/api/activities').then(r => r.json()),
      fetch('/api/health').then(r => r.json()),
      fetch('/api/review').then(r => r.json()),
    ]).then(([mission, ideasData, projectsData, activitiesData, healthData, reviewData]) => {
      setPhases(mission.phases || [])
      setMetrics(mission.metrics || { daysToGoal: 0, activeProjects: 0, ideasInPipeline: 0, currentPhase: 1 })
      setIdeas(ideasData || [])
      setProjects(projectsData || [])
      setActivities(activitiesData || [])
      setHealthEntries(healthData || [])
      if (reviewData && reviewData.weekOf !== undefined) setReview(reviewData)
      setLoading(false)
    }).catch(err => {
      console.error('Failed to fetch data:', err)
      setLoading(false)
    })
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // --- Idea callbacks ---
  const addIdea = useCallback(async (title: string) => {
    const newIdea: Omit<Idea, 'id'> = {
      title,
      description: '',
      status: 'new',
      scores: { moat: 0, aiDriftbar: 0, revenue: 0, passiv: 0, speed: 0, fit: 0, glede: 0 },
      pros: [],
      cons: [],
      nextSteps: [],
      createdAt: new Date().toISOString(),
    }
    const res = await fetch('/api/ideas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newIdea),
    })
    if (res.ok) {
      const created = await res.json()
      setIdeas(prev => [...prev, created])
    }
  }, [])

  // --- Activity reaction callback ---
  const setActivityReaction = useCallback(async (id: string, reaction: string | undefined) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, reaction: reaction as ActivityItem['reaction'] } : a))
    await fetch(`/api/activities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reaction }),
    })
  }, [])

  // --- Health callbacks ---
  const saveHealthEntry = useCallback(async (entry: HealthEntry) => {
    const existing = healthEntries.find(e => e.date === entry.date)
    if (existing) {
      const res = await fetch(`/api/health/${entry.date}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      })
      if (res.ok) {
        setHealthEntries(prev => prev.map(e => e.date === entry.date ? entry : e))
      }
    } else {
      const res = await fetch('/api/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...entry, id: entry.date }),
      })
      if (res.ok) {
        setHealthEntries(prev => [...prev, entry])
      }
    }
  }, [healthEntries])

  function scrollTo(id: string) {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => setActiveSection(null), 1000)
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="min-h-screen bg-stark-900">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-arc/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber/3 rounded-full blur-3xl" />
      </div>

      {/* Navigation bar */}
      <nav className="sticky top-0 z-40 bg-stark-900/80 backdrop-blur-xl border-b border-stark-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-2">
          <div className="flex items-center gap-2 mr-3 shrink-0">
            <div className="w-2 h-2 rounded-full bg-arc animate-pulse" />
            <span className="text-xs font-bold text-arc tracking-widest hidden sm:block">CHUCK HQ</span>
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap ${
                activeSection === item.id
                  ? 'bg-arc/15 text-arc'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-stark-700/50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="flex-1" />
          <button
            onClick={() => setShowReview(true)}
            className="px-3 py-1.5 rounded-lg text-xs transition-all text-amber hover:bg-amber/10 border border-amber/20 hover:border-amber/40"
          >
            Review
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Mission Control — full width, compact */}
        <div id="mission" className="mb-8">
          <MissionControl phases={phases} metrics={metrics} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left column — Idea Inbox + Activity Feed */}
          <div className="lg:col-span-8 space-y-8">
            <div id="ideas">
              <IdeaInbox ideas={ideas} onAddIdea={addIdea} />
            </div>

            <div id="activity">
              <ActivityFeed items={activities} onReaction={setActivityReaction} />
            </div>
          </div>

          {/* Right column — Combined sidebar */}
          <div className="lg:col-span-4" id="sidebar">
            <div className="lg:sticky lg:top-16">
              <Sidebar
                projects={projects}
                healthEntries={healthEntries}
                onSaveHealth={saveHealthEntry}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pb-8 text-center">
          <div className="h-px bg-gradient-to-r from-transparent via-stark-600/50 to-transparent mb-6" />
          <p className="text-xs text-gray-600">
            Chuck HQ — Fredrik & Chuck, building the future
          </p>
        </footer>
      </main>

      {/* Weekly Review Modal */}
      {showReview && (
        <WeeklyReview
          review={review}
          activityCount={activities.length}
          onClose={() => setShowReview(false)}
        />
      )}
    </div>
  )
}
