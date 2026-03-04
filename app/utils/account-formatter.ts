import type { Tag } from '~/types/Tag'

export const tagsToString = (tags: Tag[]): string => {
  return tags.map(t => t.text).join(';')
}

export const stringToTags = (tagsString: string): Tag[] => {
  if (!tagsString) return []
  return tagsString
    .split(';')
    .filter(t => t.trim() !== '')
    .map(t => ({ text: t.trim() }))
}
