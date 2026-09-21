// Picks the project (and its real photos) that the homepage leads with.
// Today that's the one real project with a photo showcase; as more real
// projects are added the first one with photos is used automatically.
import { getProjects } from '@/lib/data'
import { resolveEventCategory } from '@/lib/event-categories'
import type { Project, ProjectImage } from '@/content/types'

export function getFeaturedProject(): Project | undefined {
  const projects = getProjects()
  return projects.find((p) => p.images && p.images.length > 0) ?? projects[0]
}

/** nth image of a category key (see event-categories.ts), or undefined. */
export function pickImage(project: Project | undefined, key: string, nth = 0): ProjectImage | undefined {
  const matches = (project?.images ?? []).filter((img) => resolveEventCategory(img.category).key === key)
  return matches[nth]
}

/** Deep link into a project's gallery pre-filtered to a category. */
export function projectViewPath(project: Project, key?: string): string {
  return `/portfolio/${project.slug}${key ? `?view=${key}` : ''}`
}
