"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PageSpec, SectionSpec, createSectionSpec } from "@/domain/mock"

interface CanvasBuilderProps {
  pageSpec: PageSpec
  onUpdate: (pageSpec: PageSpec) => void
}

export function CanvasBuilder({ pageSpec, onUpdate }: CanvasBuilderProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null)

  const moveSection = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= pageSpec.sections.length) return
    const newSections = Array.from(pageSpec.sections)
    const [moved] = newSections.splice(fromIndex, 1)
    newSections.splice(toIndex, 0, moved)
    const updatedSections = newSections.map((section, index) => ({ ...section, order: index + 1 }))
    onUpdate({ ...pageSpec, sections: updatedSections })
  }

  const handleAddSection = (type: SectionSpec['type']) => {
    const newSection = createSectionSpec(
      type,
      pageSpec.sections.length + 1,
      `${type}セクション`,
      `${type}の説明`
    )

    onUpdate({
      ...pageSpec,
      sections: [...pageSpec.sections, newSection]
    })
  }

  const handleUpdateSection = (sectionId: string, updates: Partial<SectionSpec>) => {
    const updatedSections = pageSpec.sections.map(section =>
      section.id === sectionId ? { ...section, ...updates } : section
    )

    onUpdate({
      ...pageSpec,
      sections: updatedSections
    })
  }

  const handleRemoveSection = (sectionId: string) => {
    const updatedSections = pageSpec.sections
      .filter(section => section.id !== sectionId)
      .map((section, index) => ({ ...section, order: index + 1 }))

    onUpdate({
      ...pageSpec,
      sections: updatedSections
    })
  }

  const getSectionIcon = (type: SectionSpec['type']) => {
    const icons = {
      header: '📋',
      hero: '🎯',
      features: '⭐',
      cta: '🚀',
      form: '📝',
      list: '📋',
      card: '🃏',
      footer: '🔗'
    }
    return icons[type] || '📄'
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">ページ構成</h3>
        <div className="text-sm text-gray-500">
          {pageSpec.sections.length} セクション
        </div>
      </div>

      <div className="space-y-2">
        {pageSpec.sections.map((section, index) => (
          <Card key={section.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getSectionIcon(section.type)}</span>
                  <CardTitle className="text-base">
                    {section.title || `${section.type}セクション`}
                  </CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => moveSection(index, index - 1)}>↑</Button>
                  <Button size="sm" variant="outline" onClick={() => moveSection(index, index + 1)}>↓</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}>
                    {editingSection === section.id ? '保存' : '編集'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleRemoveSection(section.id)}>削除</Button>
                </div>
              </div>
            </CardHeader>
            {editingSection === section.id ? (
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium">タイトル</label>
                  <Input value={section.title || ''} onChange={(e) => handleUpdateSection(section.id, { title: e.target.value })} placeholder="セクションタイトル" />
                </div>
                <div>
                  <label className="text-sm font-medium">説明</label>
                  <Textarea value={section.content || ''} onChange={(e) => handleUpdateSection(section.id, { content: e.target.value })} placeholder="セクションの説明" rows={2} />
                </div>
              </CardContent>
            ) : (
              <CardContent>
                <p className="text-sm text-gray-600">{section.content || '説明がありません'}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button
          variant="outline"
          onClick={() => {
            // This will be handled by the parent component
            console.log('Add section clicked')
          }}
        >
          + セクションを追加
        </Button>
      </div>
    </div>
  )
}
