import { InputBrief } from "@/domain/brief"
import { IdeaCandidate } from "@/domain/idea"
import { UserFlow } from "@/domain/flow"
import { GeneratedUIMock } from "@/domain/mock"

export interface ExporterService {
  exportRequirements(brief: InputBrief, selectedIdea: IdeaCandidate, flows: UserFlow[], mock: GeneratedUIMock): string
  exportTasks(brief: InputBrief, selectedIdea: IdeaCandidate, flows: UserFlow[], mock: GeneratedUIMock): string
  downloadMarkdown(content: string, filename: string): void
}

export class MarkdownExporter implements ExporterService {
  exportRequirements(brief: InputBrief, selectedIdea: IdeaCandidate, flows: UserFlow[], mock: GeneratedUIMock): string {
    const content = `# 要件定義書

## プロジェクト概要

${selectedIdea.title} - ${selectedIdea.pitch}

## 入力ブリーフ

- **ドメイン**: ${brief.domain}
- **ターゲット**: ${brief.target}
- **強み**: ${brief.strength}
${brief.hint ? `- **ヒント**: ${brief.hint}` : ''}

## 選択されたアイデア

### ${selectedIdea.title}

**エレベーターピッチ**: ${selectedIdea.pitch}

**スコア**:
- 望ましさ: ${selectedIdea.scores.desirability}/100
- 実現性: ${selectedIdea.scores.feasibility}/100
- 事業性: ${selectedIdea.scores.viability}/100
- 新規性: ${selectedIdea.scores.novelty}/100

**タグ**: ${selectedIdea.tags.join(', ')}

## ユーザーフロー

${flows.map(flow => `
### ${flow.title}

${flow.description}

**ステップ**:
${flow.steps.map((step, index) => `${index + 1}. ${step.title} - ${step.description}`).join('\n')}
`).join('\n')}

## 主要画面仕様

${mock.pages.map(page => `
### ${page.title} (${page.route})

${page.description}

**セクション構成**:
${page.sections.map(section => `- ${section.title} (${section.type})`).join('\n')}
`).join('\n')}

## 非機能要件

- **パフォーマンス**: LCP < 2.5s、初期JSバンドル < 300KB
- **セキュリティ**: 適切な認証・認可、データ暗号化
- **使いやすさ**: WCAG 2.1 AA準拠、レスポンシブデザイン
- **可用性**: 99.9%の稼働率、PWA対応

---

*この文書は仮説検証ツールにより自動生成されました。*
`

    return content
  }

  exportTasks(brief: InputBrief, selectedIdea: IdeaCandidate, flows: UserFlow[], mock: GeneratedUIMock): string {
    const content = `# タスク一覧

## プロジェクト概要

${selectedIdea.title} - ${selectedIdea.pitch}

## フェーズ1: 基盤構築

- [ ] **Task 1**: プロジェクトセットアップ
  - パッケージマネージャーの初期化
  - 基本的なディレクトリ構造の作成
  - 依存関係: なし

- [ ] **Task 2**: 開発環境の設定
  - Linter、Formatterの設定
  - TypeScriptの設定
  - 依存関係: Task 1

- [ ] **Task 3**: 認証システムの実装
  - ユーザー登録・ログイン機能
  - セッション管理
  - 依存関係: Task 2

## フェーズ2: コア機能実装

${flows.map((flow, index) => `
- [ ] **Task ${index + 4}**: ${flow.title}の実装
  - ${flow.steps.map(step => `- ${step.title}: ${step.description}`).join('\n  ')}
  - 依存関係: Task 3
`).join('')}

## フェーズ3: UI実装

${mock.pages.map((page, index) => `
- [ ] **Task ${flows.length + index + 4}**: ${page.title}画面の実装
  - ルート: ${page.route}
  - セクション: ${page.sections.map(s => s.title).join(', ')}
  - 依存関係: Task ${flows.length + 3}
`).join('')}

## フェーズ4: テストと品質保証

- [ ] **Task ${flows.length + mock.pages.length + 4}**: ユニットテストの作成
  - 各コンポーネントのテスト
  - 依存関係: Task ${flows.length + mock.pages.length + 3}

- [ ] **Task ${flows.length + mock.pages.length + 5}**: 統合テストの実施
  - システム全体の動作確認
  - 依存関係: Task ${flows.length + mock.pages.length + 4}

- [ ] **Task ${flows.length + mock.pages.length + 6}**: パフォーマンステスト
  - 負荷テストの実施
  - 依存関係: Task ${flows.length + mock.pages.length + 5}

## 進捗追跡

- 完了: 0/${flows.length + mock.pages.length + 6}
- 進行中: 0
- 未着手: ${flows.length + mock.pages.length + 6}

---

*この文書は仮説検証ツールにより自動生成されました。*
`

    return content
  }

  downloadMarkdown(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

export const exporter = new MarkdownExporter()
