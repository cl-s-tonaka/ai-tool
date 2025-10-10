"use client"

import { Card, CardContent } from "@/components/ui/card"
import { SectionSpec } from "@/domain/mock"

interface SectionPaletteProps {
  onAddSection: (type: SectionSpec['type']) => void
}

const sectionTypes: { type: SectionSpec['type']; label: string; description: string; icon: string }[] = [
  { type: 'header', label: 'ヘッダー', description: 'ナビゲーションとロゴ', icon: '📋' },
  { type: 'hero', label: 'ヒーロー', description: 'メインビジュアルとCTA', icon: '🎯' },
  { type: 'features', label: '特徴', description: '機能や利点の紹介', icon: '⭐' },
  { type: 'cta', label: 'CTA', description: '行動喚起ボタン', icon: '🚀' },
  { type: 'form', label: 'フォーム', description: '入力フォーム', icon: '📝' },
  { type: 'list', label: 'リスト', description: '項目リスト', icon: '📋' },
  { type: 'card', label: 'カード', description: '情報カード', icon: '🃏' },
  { type: 'footer', label: 'フッター', description: 'フッター情報', icon: '🔗' },
]

export function SectionPalette({ onAddSection }: SectionPaletteProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-4">セクション</h3>
        <div className="grid grid-cols-2 gap-2">
          {sectionTypes.map((section) => (
            <button
              key={section.type}
              onClick={() => onAddSection(section.type)}
              className="p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-lg mb-1">{section.icon}</div>
              <div className="text-sm font-medium">{section.label}</div>
              <div className="text-xs text-gray-500">{section.description}</div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
