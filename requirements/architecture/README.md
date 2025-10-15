# アーキテクチャ概要

## 技術スタック
- Next.js (App Router)
- TypeScript
- Zod (スキーマ/バリデーション)
- C# (.NET 8) Web API + Semantic Kernel

## レイヤリング
- frontend
  - domain: コアモデル/ロジック（副作用なし）
  - infrastructure: 外部I/Oの抽象化（storage/exporter/llmGateway mock）
  - components: UIコンポーネント（CanvasBuilder など）
  - app: 画面/ルーティング
- backend
  - Controllers: API エンドポイント
  - Services: 生成/要約など Semantic Kernel 連携
  - Models: 契約（BriefInput / IdeaResponse 等）

## データフロー（概念）
Brief入力 → Idea生成/評価 → 並べ替え/比較 → Flow/Spec生成 → Export
- 現状: frontend のモック/ローカル処理
- 変更: `/api/brief/ideas` でアイデア生成をバックエンドに委譲

## API（暫定）
- POST `/api/brief/ideas`
  - req: BriefInput { domain, target, strength, hint? }
  - res: IdeaResponse { briefHash, ideas[] }
  - openapi: `backend/semantic-kernel-api/openapi.yaml`

## 依存関係と制約
- Semantic Kernel のモデル/API キーが必要（OPENAI_API_KEY など）
- コスト/セキュリティ観点の承認が必要

## 非機能要件（初期）
- パフォーマンス: 初回レスポンス < 2s 目標（生成時間は除く）
- セキュリティ: API キーはサーバー側で保持、CORS 制限
- 品質: 型安全（any禁止）、linter/formatter 準拠
