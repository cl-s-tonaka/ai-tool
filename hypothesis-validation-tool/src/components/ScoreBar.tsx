"use client"

import { Score } from "@/domain/idea"

interface ScoreBarProps {
  scores: Score
  showLabels?: boolean
}

export function ScoreBar({ scores, showLabels = true }: ScoreBarProps) {
  const scoreItems = [
    { label: "望ましさ", value: scores.desirability, color: "bg-green-500" },
    { label: "実現性", value: scores.feasibility, color: "bg-blue-500" },
    { label: "事業性", value: scores.viability, color: "bg-purple-500" },
    { label: "新規性", value: scores.novelty, color: "bg-orange-500" },
  ]

  return (
    <div className="space-y-2">
      {scoreItems.map((item, index) => (
        <div key={index} className="space-y-1">
          {showLabels && (
            <div className="flex justify-between text-xs text-gray-600">
              <span>{item.label}</span>
              <span>{item.value}/100</span>
            </div>
          )}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${item.color}`}
              style={{ width: `${item.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
