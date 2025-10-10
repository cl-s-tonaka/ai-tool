"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DemoBar } from "@/components/DemoBar"
import { ScoreBar } from "@/components/ScoreBar"
import { IdeaCandidate } from "@/domain/idea"
import { UserFlow, FlowStep } from "@/domain/flow"
import { LLMGatewayMock } from "@/infrastructure/llmGateway.mock"
import { storage, STORAGE_KEYS } from "@/infrastructure/storage"

export default function IdeaDetailPage() {
  const router = useRouter()
  const params = useParams()
  const ideaId = params.id as string

  const [selectedIdea, setSelectedIdea] = useState<IdeaCandidate | null>(null)
  const [flows, setFlows] = useState<UserFlow[]>([])
  const [editingFlow, setEditingFlow] = useState<UserFlow | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingFlows, setIsGeneratingFlows] = useState(false)

  useEffect(() => {
    const savedIdea = storage.load<IdeaCandidate>(STORAGE_KEYS.SELECTED_IDEA)
    const savedFlows = storage.load<UserFlow[]>(STORAGE_KEYS.FLOWS)

    if (!savedIdea || savedIdea.id !== ideaId) {
      router.push("/ideas")
      return
    }

    setSelectedIdea(savedIdea)
    setFlows(savedFlows || [])
  }, [ideaId, router])

  const generateFlows = async () => {
    if (!selectedIdea) return

    setIsGeneratingFlows(true)
    try {
      const llmGateway = new LLMGatewayMock()
      const generatedFlows = await llmGateway.proposeFlows(selectedIdea.id, selectedIdea.title)
      setFlows(generatedFlows)
      storage.save(STORAGE_KEYS.FLOWS, generatedFlows)
    } catch (error) {
      console.error("Failed to generate flows:", error)
    } finally {
      setIsGeneratingFlows(false)
    }
  }

  const handleEditFlow = (flow: UserFlow) => {
    setEditingFlow({ ...flow })
  }

  const handleSaveFlow = (flow: UserFlow) => {
    setFlows(prev => prev.map(f => f.id === flow.id ? flow : f))
    storage.save(STORAGE_KEYS.FLOWS, flows)
    setEditingFlow(null)
  }

  const handleCancelEdit = () => {
    setEditingFlow(null)
  }

  const handleEditStep = (flowId: string, stepId: string, field: keyof FlowStep, value: string) => {
    if (!editingFlow) return

    const updatedFlow = {
      ...editingFlow,
      steps: editingFlow.steps.map(step =>
        step.id === stepId ? { ...step, [field]: value } : step
      )
    }
    setEditingFlow(updatedFlow)
  }

  const handleProceedToMock = () => {
    if (flows.length > 0) {
      router.push("/mock")
    }
  }

  if (!selectedIdea) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <DemoBar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-lg text-gray-600">アイデアを読み込み中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <DemoBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => router.push("/ideas")}
              className="mb-4"
            >
              ← アイデア一覧に戻る
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedIdea.title}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {selectedIdea.pitch}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* アイデア詳細 */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>アイデア詳細</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ScoreBar scores={selectedIdea.scores} />
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">タグ</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedIdea.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ユーザーフロー */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>ユーザーフロー</CardTitle>
                      <CardDescription>
                        ユーザーの行動を段階的に可視化します
                      </CardDescription>
                    </div>
                    {flows.length === 0 && (
                      <Button
                        onClick={generateFlows}
                        disabled={isGeneratingFlows}
                      >
                        {isGeneratingFlows ? "生成中..." : "フローを生成"}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {flows.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>ユーザーフローが生成されていません</p>
                      <p className="text-sm mt-2">「フローを生成」ボタンをクリックしてください</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {flows.map((flow) => (
                        <div key={flow.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{flow.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{flow.description}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditFlow(flow)}
                            >
                              編集
                            </Button>
                          </div>
                          
                          <div className="space-y-3">
                            {flow.steps.map((step, index) => (
                              <div key={step.id} className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  {editingFlow?.id === flow.id ? (
                                    <div className="space-y-2">
                                      <Input
                                        value={editingFlow.steps.find(s => s.id === step.id)?.title || step.title}
                                        onChange={(e) => handleEditStep(flow.id, step.id, 'title', e.target.value)}
                                        placeholder="ステップ名"
                                      />
                                      <Textarea
                                        value={editingFlow.steps.find(s => s.id === step.id)?.description || step.description}
                                        onChange={(e) => handleEditStep(flow.id, step.id, 'description', e.target.value)}
                                        placeholder="ステップの説明"
                                        rows={2}
                                      />
                                    </div>
                                  ) : (
                                    <div>
                                      <h4 className="font-medium">{step.title}</h4>
                                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {editingFlow?.id === flow.id && (
                            <div className="flex gap-2 mt-4">
                              <Button
                                size="sm"
                                onClick={() => handleSaveFlow(editingFlow)}
                              >
                                保存
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelEdit}
                              >
                                キャンセル
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {flows.length > 0 && (
            <div className="mt-8 text-center">
              <Button onClick={handleProceedToMock} size="lg">
                UIモックを生成
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
