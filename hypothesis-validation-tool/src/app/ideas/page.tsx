"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DemoBar } from "@/components/DemoBar"
import { IdeaCard } from "@/components/IdeaCard"
import { IdeaCompareDialog } from "@/components/IdeaCompareDialog"
import { InputBrief, type InputBrief as InputBriefType } from "@/domain/brief"
import { IdeaCandidate, calculateTotalScore, SortOption } from "@/domain/idea"
import { LLMGatewayMock } from "@/infrastructure/llmGateway.mock"
import { storage, STORAGE_KEYS } from "@/infrastructure/storage"

export default function IdeasPage() {
  const router = useRouter()
  const [brief, setBrief] = useState<InputBriefType | null>(null)
  const [ideas, setIdeas] = useState<IdeaCandidate[]>([])
  const [selectedIdea, setSelectedIdea] = useState<IdeaCandidate | null>(null)
  const [comparingIdeas, setComparingIdeas] = useState<IdeaCandidate[]>([])
  const [isCompareDialogOpen, setIsCompareDialogOpen] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>("total")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const savedBrief = storage.load<InputBriefType>(STORAGE_KEYS.BRIEF)
    const savedIdeas = storage.load<IdeaCandidate[]>(STORAGE_KEYS.IDEAS)
    const savedSelectedIdea = storage.load<IdeaCandidate>(STORAGE_KEYS.SELECTED_IDEA)

    if (!savedBrief) {
      router.push("/")
      return
    }

    setBrief(savedBrief)
    setSelectedIdea(savedSelectedIdea)

    if (savedIdeas && savedIdeas.length > 0) {
      setIdeas(savedIdeas)
    } else {
      generateIdeas(savedBrief)
    }
  }, [router])

  const generateIdeas = async (briefData: InputBriefType) => {
    setIsLoading(true)
    try {
      const llmGateway = new LLMGatewayMock()
      const generatedIdeas = await llmGateway.generateIdeas(briefData)
      setIdeas(generatedIdeas)
      storage.save(STORAGE_KEYS.IDEAS, generatedIdeas)
    } catch (error) {
      console.error("Failed to generate ideas:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectIdea = (idea: IdeaCandidate) => {
    setSelectedIdea(idea)
    storage.save(STORAGE_KEYS.SELECTED_IDEA, idea)
  }

  const handleCompareIdea = (idea: IdeaCandidate) => {
    setComparingIdeas(prev => {
      const isAlreadyComparing = prev.some(i => i.id === idea.id)
      if (isAlreadyComparing) {
        return prev.filter(i => i.id !== idea.id)
      } else if (prev.length < 3) {
        return [...prev, idea]
      } else {
        return prev
      }
    })
  }

  const handleOpenCompareDialog = () => {
    setIsCompareDialogOpen(true)
  }

  const handleCloseCompareDialog = () => {
    setIsCompareDialogOpen(false)
  }

  const handleProceedToFlows = () => {
    if (selectedIdea) {
      router.push(`/ideas/${selectedIdea.id}`)
    }
  }

  const sortedIdeas = [...ideas].sort((a, b) => {
    const aWithScore = calculateTotalScore(a)
    const bWithScore = calculateTotalScore(b)
    
    switch (sortBy) {
      case "total":
        return bWithScore.totalScore - aWithScore.totalScore
      case "desirability":
        return b.scores.desirability - a.scores.desirability
      case "feasibility":
        return b.scores.feasibility - a.scores.feasibility
      case "viability":
        return b.scores.viability - a.scores.viability
      case "novelty":
        return b.scores.novelty - a.scores.novelty
      default:
        return 0
    }
  })

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "total", label: "総合スコア" },
    { value: "desirability", label: "望ましさ" },
    { value: "feasibility", label: "実現性" },
    { value: "viability", label: "事業性" },
    { value: "novelty", label: "新規性" },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <DemoBar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">アイデアを生成中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <DemoBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              生成されたアイデア
            </h1>
            <p className="text-gray-600">
              {brief && (
                <>
                  <strong>ドメイン:</strong> {brief.domain} | 
                  <strong> ターゲット:</strong> {brief.target}
                </>
              )}
            </p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">並び替え:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-4">
              {comparingIdeas.length > 0 && (
                <Button
                  onClick={handleOpenCompareDialog}
                  variant="outline"
                >
                  比較 ({comparingIdeas.length})
                </Button>
              )}
              
              {selectedIdea && (
                <Button onClick={handleProceedToFlows}>
                  フローを確認
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onSelect={handleSelectIdea}
                onCompare={handleCompareIdea}
                isSelected={selectedIdea?.id === idea.id}
                isComparing={comparingIdeas.some(i => i.id === idea.id)}
              />
            ))}
          </div>

          {selectedIdea && (
            <Card className="mt-8 bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">選択されたアイデア</CardTitle>
                <CardDescription className="text-green-700">
                  {selectedIdea.title} - {selectedIdea.pitch}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleProceedToFlows} className="bg-green-600 hover:bg-green-700">
                  ユーザーフローを確認する
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <IdeaCompareDialog
        ideas={comparingIdeas}
        isOpen={isCompareDialogOpen}
        onClose={handleCloseCompareDialog}
        onSelect={handleSelectIdea}
      />
    </div>
  )
}
