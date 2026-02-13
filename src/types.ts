export interface Phase {
  id: number
  name: string
  description: string
  status: 'completed' | 'active' | 'upcoming'
  progress: number
}

export interface Idea {
  id: string
  title: string
  description: string
  status: 'new' | 'evaluating' | 'active' | 'parked' | 'killed'
  scores: {
    moat: number
    aiDriftbar: number
    revenue: number
    passiv: number
    speed: number
    fit: number
    glede: number
  }
  pros: string[]
  cons: string[]
  nextSteps: string[]
  createdAt: string
}

export interface Project {
  id: string
  name: string
  description: string
  stage: 'exploring' | 'building' | 'growing' | 'maintaining' | 'exiting'
  progress: number
  nextAction: string
  blockers: string[]
  color: string
}

export interface ActivityItem {
  id: string
  type: 'research' | 'calendar' | 'reminder' | 'code' | 'analysis'
  title: string
  description: string
  timestamp: string
  reaction?: 'approve' | 'revise' | 'cancel'
}

export interface HealthEntry {
  date: string
  neckTension: number
  psoasTraining: boolean
  spleniusTraining: boolean
}

export interface WeeklyReview {
  weekOf: string
  accomplished: string[]
  nextWeek: string[]
  momentum: 'rising' | 'steady' | 'declining'
  score: number
}
