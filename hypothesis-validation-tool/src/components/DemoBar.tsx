"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SeedService } from "@/infrastructure/seed.service"
import { storage, STORAGE_KEYS } from "@/infrastructure/storage"
import { Badge } from "@/components/ui/badge"

export function DemoBar() {
  const [seed, setSeed] = useState("default")
  const [isEditing, setIsEditing] = useState(false)
  const seedService = SeedService.getInstance()

  useEffect(() => {
    const savedSeed = storage.load<string>(STORAGE_KEYS.SEED) || "default"
    setSeed(savedSeed)
    seedService.setSeed(savedSeed)
  }, [seedService])

  const handleSeedChange = (newSeed: string) => {
    setSeed(newSeed)
    seedService.setSeed(newSeed)
    storage.save(STORAGE_KEYS.SEED, newSeed)
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  const handleCancel = () => {
    const currentSeed = seedService.getSeed()
    setSeed(currentSeed)
    setIsEditing(false)
  }

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            AI: Mock
          </Badge>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Seed:</span>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  className="h-8 w-32 text-sm"
                  placeholder="seed value"
                />
                <Button size="sm" onClick={handleSave} className="h-8">
                  保存
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel} className="h-8">
                  キャンセル
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {seed}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-8 text-xs"
                >
                  編集
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="text-xs text-gray-500">
          決定的な結果生成のため、同一seedで同一結果が得られます
        </div>
      </div>
    </div>
  )
}
