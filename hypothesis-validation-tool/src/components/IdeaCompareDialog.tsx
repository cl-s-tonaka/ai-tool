"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IdeaCandidate, calculateTotalScore, SortOption } from "@/domain/idea"
import { ScoreBar } from "@/components/ScoreBar"

interface IdeaCompareDialogProps {
  ideas: IdeaCandidate[]
  isOpen: boolean
  onClose: () => void
  onSelect: (idea: IdeaCandidate) => void
}

export function IdeaCompareDialog({ ideas, isOpen, onClose, onSelect }: IdeaCompareDialogProps) {
  const [sortBy, setSortBy] = useState<SortOption>("total")

  if (!isOpen) return null

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">アイデア比較</h2>
            <Button variant="outline" onClick={onClose}>
              閉じる
            </Button>
          </div>
          
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 mr-2">並び替え:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedIdeas.map((idea) => {
              const ideaWithScore = calculateTotalScore(idea)
              return (
                <Card key={idea.id} className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{idea.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {idea.pitch}
                    </CardDescription>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600">
                        {ideaWithScore.totalScore}
                      </div>
                      <div className="text-xs text-gray-500">総合スコア</div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ScoreBar scores={idea.scores} />
                    
                    <div className="flex flex-wrap gap-1">
                      {idea.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <Button
                      onClick={() => {
                        onSelect(idea)
                        onClose()
                      }}
                      className="w-full"
                    >
                      このアイデアを選択
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
