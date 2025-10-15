# アーキテクチャ概要

## 技術スタック
- Next.js (App Router)
- TypeScript
- Zod (スキーマ/バリデーション)

## レイヤリング
- domain: コアモデル/ロジック（副作用なし）
- infrastructure: 外部I/Oの抽象化（storage/exporter/llmGateway mock）
- components: UIコンポーネント（CanvasBuilder など）
- app: 画面/ルーティング

## データフロー（概念）
Brief入力 → Idea生成/評価 → 並べ替え/比較 → Flow/Spec生成 → Export

## 依存関係と制約
- 生成系は現状モック/擬似。外部API導入時はセキュリティ・コスト承認必須。
- ブラウザセッションでの軽量データ保持（storage.ts）

## 非機能要件（初期）
- パフォーマンス: 初期描画<2s 目標
- アクセシビリティ: 主要操作にキーボードアクセス可能
- 品質: 型安全（any禁止）、linter準拠
