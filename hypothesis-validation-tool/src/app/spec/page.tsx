"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { storage, STORAGE_KEYS } from "@/infrastructure/storage"
import { exporter } from "@/infrastructure/exporter"

export default function SpecPage() {
  const [requirements, setRequirements] = useState<string>("")
  const [tasks, setTasks] = useState<string>("")

  const build = () => {
    const brief = storage.load<any>(STORAGE_KEYS.BRIEF)
    const idea = storage.load<any>(STORAGE_KEYS.SELECTED_IDEA)
    const flows = storage.load<any>(STORAGE_KEYS.FLOWS) || []
    const mock = storage.load<any>(STORAGE_KEYS.MOCK)
    if (!brief || !idea || !mock) return
    setRequirements(exporter.exportRequirements(brief, idea, flows, mock))
    setTasks(exporter.exportTasks(brief, idea, flows, mock))
  }

  useEffect(() => {
    build()
  }, [])

  const downloadReq = () => {
    if (requirements) exporter.downloadMarkdown(requirements, "requirements.md")
  }
  const downloadTasks = () => {
    if (tasks) exporter.downloadMarkdown(tasks, "tasks.md")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">仕様/タスク下書き</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={build}>再生成</Button>
            <Button variant="outline" onClick={downloadReq}>requirements.md</Button>
            <Button variant="outline" onClick={downloadTasks}>tasks.md</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>requirements.md</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm">{requirements || 'データ不足のため生成できません'}</pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>tasks.md</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm">{tasks || 'データ不足のため生成できません'}</pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
