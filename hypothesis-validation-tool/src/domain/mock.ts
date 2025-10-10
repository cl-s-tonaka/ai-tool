import { z } from "zod"

export const SectionSpecSchema = z.object({
  id: z.string(),
  type: z.enum(['header', 'hero', 'features', 'cta', 'footer', 'form', 'list', 'card']),
  title: z.string().optional(),
  content: z.string().optional(),
  props: z.record(z.any()).optional(),
  order: z.number(),
})

export type SectionSpec = z.infer<typeof SectionSpecSchema>

export const PageSpecSchema = z.object({
  id: z.string(),
  route: z.string(),
  title: z.string(),
  description: z.string(),
  sections: z.array(SectionSpecSchema),
  ideaId: z.string(),
})

export type PageSpec = z.infer<typeof PageSpecSchema>

export interface GeneratedUIMock {
  pages: PageSpec[]
  ideaId: string
}

export function createSectionSpec(
  type: SectionSpec['type'],
  order: number,
  title?: string,
  content?: string,
  props?: Record<string, any>
): SectionSpec {
  return {
    id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    title,
    content,
    props,
    order,
  }
}

export function createPageSpec(
  route: string,
  title: string,
  description: string,
  ideaId: string,
  sections: Omit<SectionSpec, 'id'>[]
): PageSpec {
  return {
    id: `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    route,
    title,
    description,
    ideaId,
    sections: sections.map((section, index) => ({
      ...section,
      id: `section-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
    })),
  }
}
