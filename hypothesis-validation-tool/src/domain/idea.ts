import { z } from "zod"

export const ScoreSchema = z.object({
  desirability: z.number().min(0).max(100), // 望ましさ
  feasibility: z.number().min(0).max(100),  // 実現性
  viability: z.number().min(0).max(100),    // 事業性
  novelty: z.number().min(0).max(100),      // 新規性
})

export type Score = z.infer<typeof ScoreSchema>

export const IdeaCandidateSchema = z.object({
  id: z.string(),
  title: z.string(),
  pitch: z.string(),
  scores: ScoreSchema,
  tags: z.array(z.string()),
  briefHash: z.string(),
})

export type IdeaCandidate = z.infer<typeof IdeaCandidateSchema>

export interface IdeaWithTotalScore extends IdeaCandidate {
  totalScore: number
}

export function calculateTotalScore(idea: IdeaCandidate): IdeaWithTotalScore {
  const totalScore = (
    idea.scores.desirability * 0.3 +
    idea.scores.feasibility * 0.25 +
    idea.scores.viability * 0.25 +
    idea.scores.novelty * 0.2
  )
  
  return {
    ...idea,
    totalScore: Math.round(totalScore * 100) / 100
  }
}

export type SortOption = 'total' | 'desirability' | 'feasibility' | 'viability' | 'novelty'
