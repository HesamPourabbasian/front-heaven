export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface LessonSummary {
  path: string
  title: string
  description: string
  order: number
  difficulty: Difficulty
  category: string
  estimatedMinutes: number
  prerequisites: string[]
  technology: string
  slug: string
}

export type TrackCategory = 'core' | 'frontend-framework' | 'meta-framework' | 'css-framework' | 'advanced'

export interface TechnologySummary {
  path: string
  title: string
  description: string
  order: number
  difficulty: Difficulty
  estimatedHours: number
  status: 'available' | 'coming-soon'
  track?: TrackCategory
  parentFramework?: string
  color: string
  icon: string
  prerequisites: string[]
  slug: string
}

export interface SequenceItem {
  technology: TechnologySummary
  lesson: LessonSummary
}

export interface TechnologyProgress {
  technology: TechnologySummary
  lessons: LessonSummary[]
  completed: number
  total: number
  percent: number
}

export interface TocItem {
  id: string
  text: string
  depth: number
}
