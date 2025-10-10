"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputBriefSchema, type InputBrief } from "@/domain/brief"
import { storage, STORAGE_KEYS } from "@/infrastructure/storage"
import { DemoBar } from "@/components/DemoBar"

export default function IntakePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<InputBrief>({
    domain: "",
    target: "",
    strength: "",
    hint: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: keyof InputBrief, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    try {
      InputBriefSchema.parse(formData)
      setErrors({})
      return true
    } catch (error: any) {
      const newErrors: Record<string, string> = {}
      error.errors?.forEach((err: any) => {
        if (err.path) {
          newErrors[err.path[0]] = err.message
        }
      })
      setErrors(newErrors)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    try {
      // Save brief to storage
      storage.save(STORAGE_KEYS.BRIEF, formData)
      
      // Navigate to ideas page
      router.push("/ideas")
    } catch (error) {
      console.error("Failed to save brief:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <DemoBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              新規プロダクト仮説検証ツール
            </h1>
            <p className="text-lg text-gray-600">
              ブリーフを入力して、AIが生成する10案から最適なアイデアを選定しましょう
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>プロダクトブリーフ</CardTitle>
              <CardDescription>
                以下の項目を入力して、アイデア生成のためのブリーフを作成してください
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="domain" className="text-sm font-medium text-gray-700">
                    ドメイン *
                  </label>
                  <Input
                    id="domain"
                    value={formData.domain}
                    onChange={(e) => handleInputChange("domain", e.target.value)}
                    placeholder="例: ヘルスケア、教育、金融、EC、SaaS"
                    className={errors.domain ? "border-red-500" : ""}
                  />
                  {errors.domain && (
                    <p className="text-sm text-red-600">{errors.domain}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="target" className="text-sm font-medium text-gray-700">
                    ターゲット *
                  </label>
                  <Input
                    id="target"
                    value={formData.target}
                    onChange={(e) => handleInputChange("target", e.target.value)}
                    placeholder="例: 中小企業の経営者、大学生、子育て中の母親"
                    className={errors.target ? "border-red-500" : ""}
                  />
                  {errors.target && (
                    <p className="text-sm text-red-600">{errors.target}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="strength" className="text-sm font-medium text-gray-700">
                    強み・リソース *
                  </label>
                  <Textarea
                    id="strength"
                    value={formData.strength}
                    onChange={(e) => handleInputChange("strength", e.target.value)}
                    placeholder="例: AI技術、豊富なデータ、既存の顧客基盤、専門知識"
                    rows={3}
                    className={errors.strength ? "border-red-500" : ""}
                  />
                  {errors.strength && (
                    <p className="text-sm text-red-600">{errors.strength}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="hint" className="text-sm font-medium text-gray-700">
                    ヒント・追加情報
                  </label>
                  <Textarea
                    id="hint"
                    value={formData.hint}
                    onChange={(e) => handleInputChange("hint", e.target.value)}
                    placeholder="例: 競合他社の課題、市場のトレンド、技術的な制約"
                    rows={2}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="px-8"
                  >
                    {isLoading ? "生成中..." : "アイデアを生成"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              AIが決定的に10案のアイデアを生成します。同一のブリーフとseedで同じ結果が得られます。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}