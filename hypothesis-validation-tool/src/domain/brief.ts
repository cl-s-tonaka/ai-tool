import { z } from "zod"

export const InputBriefSchema = z.object({
  domain: z.string().min(1, "ドメインは必須です"),
  target: z.string().min(1, "ターゲットは必須です"),
  strength: z.string().min(1, "強みは必須です"),
  hint: z.string().optional(),
})

export type InputBrief = z.infer<typeof InputBriefSchema>

export interface BriefWithHash extends InputBrief {
  hash: string
}

export function createBriefWithHash(brief: InputBrief): BriefWithHash {
  const hash = `${brief.domain}-${brief.target}-${brief.strength}-${brief.hint || ''}`
  return {
    ...brief,
    hash: hash.replace(/\s+/g, '-').toLowerCase()
  }
}
