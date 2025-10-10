"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IdeaCandidate, calculateTotalScore } from "@/domain/idea"
import { ScoreBar } from "@/components/ScoreBar"

interface IdeaCardProps {
  idea: IdeaCandidate
  onSelect: (idea: IdeaCandidate) => void
  onCompare: (idea: IdeaCandidate) => void
  isSelected?: boolean
  isComparing?: boolean
}

export function IdeaCard({ idea, onSelect, onCompare, isSelected, isComparing }: IdeaCardProps) {
  const ideaWithScore = calculateTotalScore(idea)

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${
      isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
    } ${isComparing ? "ring-2 ring-green-500 bg-green-50" : ""}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{idea.title}</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              {idea.pitch}
            </CardDescription>
          </div>
          <div className="ml-4 text-right">
            <div className="text-2xl font-bold text-blue-600">
              {ideaWithScore.totalScore}
            </div>
            <div className="text-xs text-gray-500">総合スコア</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <ScoreBar scores={idea.scores} />
        
        <div className="flex flex-wrap gap-2">
          {idea.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onSelect(idea)}
            className="flex-1"
            variant={isSelected ? "default" : "outline"}
          >
            {isSelected ? "選択済み" : "選択"}
          </Button>
          <Button
            onClick={() => onCompare(idea)}
            variant="outline"
            className="flex-1"
          >
            {isComparing ? "比較中" : "比較"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
