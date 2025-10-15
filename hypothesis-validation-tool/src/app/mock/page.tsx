"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionPalette } from "@/components/SectionPalette"
import { MockPreview } from "@/components/MockPreview"
import { CanvasBuilder } from "@/components/CanvasBuilder"
import { UserFlow } from "@/domain/flow"
import { GeneratedUIMock, PageSpec } from "@/domain/mock"
import { LLMGatewayMock } from "@/infrastructure/llmGateway.mock"
import { exporter } from "@/infrastructure/exporter"
import { storage, STORAGE_KEYS } from "@/infrastructure/storage"

export default function MockPage() {
  const router = useRouter()
  const [flows, setFlows] = useState<UserFlow[]>([])
  const [mock, setMock] = useState<GeneratedUIMock | null>(null)
  const [selectedPageIndex, setSelectedPageIndex] = useState(0)

  useEffect(() => {
    const savedFlows = storage.load<UserFlow[]>(STORAGE_KEYS.FLOWS)
    if (!savedFlows || savedFlows.length === 0) {
      router.push("/")
      return
    }
    setFlows(savedFlows)

    const savedMock = storage.load<GeneratedUIMock>(STORAGE_KEYS.MOCK)
    if (savedMock) {
      setMock(savedMock)
    } else {
      generateMock(savedFlows)
    }
  }, [router])

  const generateMock = async (flowsData: UserFlow[]) => {
    const llm = new LLMGatewayMock()
    const generated = await llm.generateUIMock(flowsData)
    setMock(generated)
    storage.save(STORAGE_KEYS.MOCK, generated)
  }

  const updatePage = (updated: PageSpec) => {
    if (!mock) return
    const pages = mock.pages.map((p) => (p.id === updated.id ? updated : p))
    const newMock = { ...mock, pages }
    setMock(newMock)
    storage.save(STORAGE_KEYS.MOCK, newMock)
  }

  const addSection = (type: PageSpec["sections"][number]["type"]) => {
    if (!mock) return
    const page = mock.pages[selectedPageIndex]
    const newSection = {
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title: `${type}セクション`,
      content: `${type}の説明`,
      order: page.sections.length + 1,
    } as any
    const updatedPage: PageSpec = { ...page, sections: [...page.sections, newSection] }
    updatePage(updatedPage)
  }

  const applyPreset = (preset: "landing-basic" | "feature-focused") => {
    if (!mock) return
    const base = mock.pages[selectedPageIndex]
    const make = (type: PageSpec["sections"][number]["type"], order: number, title?: string, content?: string) => ({
      id: `section-${Date.now()}-${order}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      content,
      order,
    })
    const sections = preset === "landing-basic"
      ? [
          make('header', 1, '製品名', ''),
          make('hero', 2, '価値提案', '一言で伝えるキャッチコピー'),
          make('features', 3, '特徴', '3つの強みを紹介'),
          make('cta', 4, '今すぐ始める', '無料トライアルはこちら'),
          make('footer', 5, 'フッター', '© 2025 Example Inc.'),
        ]
      : [
          make('header', 1, '製品名', ''),
          make('features', 2, '機能一覧', '主要機能をカードで紹介'),
          make('card', 3, 'ユースケース', '導入事例をカード表示'),
          make('cta', 4, 'お問い合わせ', 'デモ依頼はこちら'),
          make('footer', 5, 'フッター', '© 2025 Example Inc.'),
        ]
    updatePage({ ...base, sections })
  }

  const handleExportRequirements = () => {
    const brief = storage.load<any>(STORAGE_KEYS.BRIEF)
    const idea = storage.load<any>(STORAGE_KEYS.SELECTED_IDEA)
    if (!brief || !idea || !mock) return
    const content = exporter.exportRequirements(brief, idea, flows, mock)
    exporter.downloadMarkdown(content, "requirements.md")
  }

  const handleExportTasks = () => {
    const brief = storage.load<any>(STORAGE_KEYS.BRIEF)
    const idea = storage.load<any>(STORAGE_KEYS.SELECTED_IDEA)
    if (!brief || !idea || !mock) return
    const content = exporter.exportTasks(brief, idea, flows, mock)
    exporter.downloadMarkdown(content, "tasks.md")
  }

  if (!mock) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600">モックを準備中...</p>
        </div>
      </div>
    )
  }

  const currentPage = mock.pages[selectedPageIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">UIモック生成</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>ページ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mock.pages.map((p, idx) => (
                    <Button
                      key={p.id}
                      variant={idx === selectedPageIndex ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setSelectedPageIndex(idx)}
                    >
                      {p.title}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <SectionPalette onAddSection={addSection} />
          </div>

          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{currentPage.title}</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => applyPreset("landing-basic")}>ランディング(基本)</Button>
                    <Button size="sm" variant="outline" onClick={() => applyPreset("feature-focused")}>機能重視</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <CanvasBuilder pageSpec={currentPage} onUpdate={updatePage} />
                  <div>
                    <div className="text-sm text-gray-500 mb-2">プレビュー</div>
                    <MockPreview pageSpec={currentPage} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
