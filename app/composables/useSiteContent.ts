export function useSiteContent() {
  const { data: rawTechnologies } = useAsyncData('fh-technologies', () =>
    queryCollection('technologies')
      .select('path', 'title', 'description', 'order', 'difficulty', 'estimatedHours', 'status', 'track', 'parentFramework', 'color', 'icon', 'prerequisites')
      .all(),
  )

  const { data: rawLessons } = useAsyncData('fh-lessons', () =>
    queryCollection('learn')
      .select('path', 'title', 'description', 'order', 'difficulty', 'category', 'estimatedMinutes', 'prerequisites')
      .all(),
  )

  const technologies = computed(() => (rawTechnologies.value ?? []).map(toTechnologySummary))
  const lessons = computed(() => (rawLessons.value ?? []).map(toLessonSummary))
  const sequence = computed(() => buildSequence(technologies.value, lessons.value))
  const totalMinutes = computed(() => lessons.value.reduce((sum, l) => sum + l.estimatedMinutes, 0))

  return { technologies, lessons, sequence, totalMinutes }
}

export function useSearchIndex() {
  const { lessons, technologies } = useSiteContent()
  return computed(() => ({
    lessons: lessons.value.map(l => ({
      path: l.path,
      title: l.title,
      description: l.description,
      category: l.category,
      order: l.order,
    })),
    technologies: technologies.value.map(t => ({
      path: technologyRoute(t.slug),
      title: t.title,
      description: t.description,
      color: t.color,
      icon: t.icon,
      status: t.status,
    })),
  }))
}
