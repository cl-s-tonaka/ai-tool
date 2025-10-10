import { z } from "zod"

export const FlowStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  order: z.number(),
})

export type FlowStep = z.infer<typeof FlowStepSchema>

export const UserFlowSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  steps: z.array(FlowStepSchema),
  ideaId: z.string(),
})

export type UserFlow = z.infer<typeof UserFlowSchema>

export function createFlowStep(title: string, description: string, order: number): FlowStep {
  return {
    id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    description,
    order,
  }
}

export function createUserFlow(title: string, description: string, ideaId: string, steps: Omit<FlowStep, 'id'>[]): UserFlow {
  return {
    id: `flow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    description,
    ideaId,
    steps: steps.map((step, index) => ({
      ...step,
      id: `step-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
    })),
  }
}
