import type { Difficulty, LessonSummary, SequenceItem, TechnologyProgress, TechnologySummary, TocItem } from '~/types/content'

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export function technologySlugFromPath(path: string): string {
  return path.replace(/^\//, '').split('/')[1] ?? ''
}

export function lessonSlugFromPath(path: string): string {
  return path.replace(/^\//, '').split('/')[2] ?? ''
}

export function lessonRoute(lesson: Pick<LessonSummary, 'path'>): string {
  const cleaned = lesson.path.replace(/^\//, '')
  return cleaned ? `/${cleaned}` : '/'
}

export function technologyRoute(slug: string): string {
  return `/learn/${slug}`
}

export function toLessonSummary(raw: { path: string; title: string; description: string; order: number; difficulty: Difficulty; category: string; estimatedMinutes: number; prerequisites?: string[] }): LessonSummary {
  return {
    ...raw,
    order: Number(raw.order),
    estimatedMinutes: Number(raw.estimatedMinutes),
    prerequisites: (raw.prerequisites ?? []).map(path => path.startsWith('/') ? path : `/${path}`),
    technology: technologySlugFromPath(raw.path),
    slug: lessonSlugFromPath(raw.path),
  }
}

export function toTechnologySummary(raw: { path: string; title: string; description: string; order: number; difficulty: Difficulty; estimatedHours: number; status?: 'available' | 'coming-soon'; color: string; icon: string; prerequisites?: string[] }): TechnologySummary {
  return {
    ...raw,
    order: Number(raw.order),
    estimatedHours: Number(raw.estimatedHours),
    status: raw.status ?? 'coming-soon',
    prerequisites: raw.prerequisites ?? [],
    slug: technologySlugFromPath(raw.path),
  }
}

export function sortLessons<T extends LessonSummary>(lessons: T[]): T[] {
  return [...lessons].sort((a, b) => a.order - b.order)
}

export function sortTechnologies<T extends TechnologySummary>(technologies: T[]): T[] {
  return [...technologies].sort((a, b) => a.order - b.order)
}

export function availableTechnologies(technologies: TechnologySummary[]): TechnologySummary[] {
  return sortTechnologies(technologies.filter(t => t.status === 'available'))
}

export function buildSequence(technologies: TechnologySummary[], lessons: LessonSummary[]): SequenceItem[] {
  const sequence: SequenceItem[] = []
  for (const technology of sortTechnologies(technologies)) {
    for (const lesson of sortLessons(lessons.filter(l => l.technology === technology.slug))) {
      sequence.push({ technology, lesson })
    }
  }
  return sequence
}

export function computeReadingMinutes(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const words = text.split(' ').length
  return Math.max(1, Math.round(words / 200))
}

export function computeTechnologyProgress(technology: TechnologySummary, lessons: LessonSummary[], completedPaths: Record<string, unknown>): TechnologyProgress {
  const total = lessons.filter(l => l.technology === technology.slug).length
  const completed = lessons.filter(l => l.technology === technology.slug && completedPaths[l.path]).length
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)
  return { technology, lessons: sortLessons(lessons.filter(l => l.technology === technology.slug)), completed, total, percent }
}

export function computeOverallProgress(sequence: SequenceItem[], completedPaths: Record<string, unknown>): number {
  if (sequence.length === 0) return 0
  const completed = sequence.filter(s => completedPaths[s.lesson.path]).length
  return Math.round((completed / sequence.length) * 100)
}

export function findNextLesson(sequence: SequenceItem[], completedPaths: Record<string, unknown>): SequenceItem | null {
  return sequence.find(s => !completedPaths[s.lesson.path]) ?? null
}

export function formatDuration(minutes: number): string {
  if (minutes >= 60) {
    const hours = Math.round(minutes / 60 * 10) / 10
    return `${hours}h`
  }
  return `${minutes}m`
}

export function extractToc(markdown: string): TocItem[] {
  const toc: TocItem[] = []
  const lines = markdown.split('\n')
  let inFence = false

  for (const line of lines) {
    const fence = line.trim().match(/^```/)
    if (fence) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const match = line.match(/^(#{2,3})\s+(.+)$/)
    if (!match) continue
    const depth = (match[1] ?? '').length
    const raw = (match[2] ?? '').replace(/[`*_]/g, '').trim()
    toc.push({ id: slugifyHeading(raw), text: raw, depth })
  }
  return toc
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
