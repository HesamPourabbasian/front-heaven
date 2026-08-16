import type { Difficulty } from './content'

export type NodeImportance = 'essential' | 'core' | 'specialization' | 'milestone'

export interface DiagramTopicItem {
  name: string
  description?: string
  isEssential: boolean
}

export interface DiagramProjectItem {
  title: string
  description: string
  difficulty: Difficulty
  deliverables: string[]
}

export interface DiagramNode {
  id: string
  stepNumber: number
  title: string
  shortTitle: string
  subtitle: string
  description: string
  whyItMatters: string
  difficulty: Difficulty
  importance: NodeImportance
  estimatedWeeks: string
  color: string
  icon: string
  prerequisites: {
    id: string
    title: string
    reason: string
  }[]
  nextStep: {
    id: string
    title: string
    reason: string
  }
  topics: DiagramTopicItem[]
  practiceProjects: DiagramProjectItem[]
  readinessChecklist: string[]
  learnRoute?: string
  trackSlug?: string
  status: 'available' | 'coming-soon' | 'guideline'
}

export interface DiagramFilterOptions {
  difficulty?: Difficulty | 'all'
  importance?: NodeImportance | 'all'
  searchQuery?: string
}
