import { InputBrief } from "@/domain/brief"
import { IdeaCandidate, Score } from "@/domain/idea"
import { UserFlow } from "@/domain/flow"
import { GeneratedUIMock, PageSpec, SectionSpec } from "@/domain/mock"
import { SeedService } from "./seed.service"

export interface LLMGateway {
  generateIdeas(brief: InputBrief): Promise<IdeaCandidate[]>
  proposeFlows(ideaId: string, ideaTitle: string): Promise<UserFlow[]>
  generateUIMock(flows: UserFlow[]): Promise<GeneratedUIMock>
}

export class LLMGatewayMock implements LLMGateway {
  private seedService = SeedService.getInstance()

  async generateIdeas(brief: InputBrief): Promise<IdeaCandidate[]> {
    // 決定的な10案を生成
    const ideas: IdeaCandidate[] = []
    const briefHash = `${brief.domain}-${brief.target}-${brief.strength}`

    for (let i = 0; i < 10; i++) {
      const idea = this.generateIdea(brief, i, briefHash)
      ideas.push(idea)
    }

    return ideas
  }

  async proposeFlows(ideaId: string, ideaTitle: string): Promise<UserFlow[]> {
    const flows: UserFlow[] = []
    const flowTemplates = this.getFlowTemplates(ideaTitle)

    for (let i = 0; i < flowTemplates.length; i++) {
      const template = flowTemplates[i]
      const flow: UserFlow = {
        id: this.seedService.generateDeterministicId(`flow-${i}`),
        title: template.title,
        description: template.description,
        ideaId,
        steps: template.steps.map((step, stepIndex) => ({
          id: this.seedService.generateDeterministicId(`step-${i}-${stepIndex}`),
          title: step.title,
          description: step.description,
          order: stepIndex + 1,
        })),
      }
      flows.push(flow)
    }

    return flows
  }

  async generateUIMock(flows: UserFlow[]): Promise<GeneratedUIMock> {
    const pages: PageSpec[] = []
    const ideaId = flows[0]?.ideaId || 'unknown'

    // 基本的なページを生成
    const pageTemplates = [
      {
        route: '/',
        title: 'ホーム',
        description: 'メインページ',
        sections: [
          { type: 'header' as const, title: 'ナビゲーション', order: 1 },
          { type: 'hero' as const, title: 'メインビジュアル', order: 2 },
          { type: 'features' as const, title: '特徴', order: 3 },
          { type: 'cta' as const, title: '行動喚起', order: 4 },
        ],
      },
      {
        route: '/dashboard',
        title: 'ダッシュボード',
        description: 'ユーザーダッシュボード',
        sections: [
          { type: 'header' as const, title: 'ナビゲーション', order: 1 },
          { type: 'card' as const, title: '統計', order: 2 },
          { type: 'list' as const, title: 'アクティビティ', order: 3 },
        ],
      },
    ]

    for (let i = 0; i < pageTemplates.length; i++) {
      const template = pageTemplates[i]
      const page: PageSpec = {
        id: this.seedService.generateDeterministicId(`page-${i}`),
        route: template.route,
        title: template.title,
        description: template.description,
        ideaId,
        sections: template.sections.map((section, sectionIndex) => ({
          id: this.seedService.generateDeterministicId(`section-${i}-${sectionIndex}`),
          type: section.type,
          title: section.title,
          order: section.order,
        })),
      }
      pages.push(page)
    }

    return { pages, ideaId }
  }

  private generateIdea(brief: InputBrief, index: number, briefHash: string): IdeaCandidate {
    const templates = this.getIdeaTemplates(brief)
    const template = templates[index % templates.length]

    // 決定的なスコアを生成
    const scores: Score = {
      desirability: this.seedService.getDeterministicRandom(60, 95, index * 4 + 0),
      feasibility: this.seedService.getDeterministicRandom(40, 90, index * 4 + 1),
      viability: this.seedService.getDeterministicRandom(50, 85, index * 4 + 2),
      novelty: this.seedService.getDeterministicRandom(30, 95, index * 4 + 3),
    }

    return {
      id: this.seedService.generateDeterministicId(`idea-${index}`),
      title: template.title,
      pitch: template.pitch,
      scores,
      tags: template.tags,
      briefHash,
    }
  }

  private getIdeaTemplates(brief: InputBrief) {
    return [
      {
        title: `${brief.domain}向けAIアシスタント`,
        pitch: `${brief.target}の課題を解決するAIアシスタント。${brief.strength}を活用して効率化を実現。`,
        tags: ['AI', '自動化', '効率化'],
      },
      {
        title: `${brief.domain}コミュニティプラットフォーム`,
        pitch: `${brief.target}が集まるコミュニティプラットフォーム。${brief.strength}を活かした交流促進。`,
        tags: ['コミュニティ', 'SNS', '交流'],
      },
      {
        title: `${brief.domain}マッチングサービス`,
        pitch: `${brief.target}同士をマッチングするサービス。${brief.strength}を活用した最適な組み合わせ。`,
        tags: ['マッチング', 'プラットフォーム', 'B2B'],
      },
      {
        title: `${brief.domain}学習プラットフォーム`,
        pitch: `${brief.target}向けの学習プラットフォーム。${brief.strength}を活かした効果的な学習体験。`,
        tags: ['教育', '学習', 'スキルアップ'],
      },
      {
        title: `${brief.domain}分析ツール`,
        pitch: `${brief.target}のデータを分析するツール。${brief.strength}を活用した洞察提供。`,
        tags: ['分析', 'データ', 'BI'],
      },
      {
        title: `${brief.domain}予約システム`,
        pitch: `${brief.target}向けの予約システム。${brief.strength}を活かしたスムーズな予約体験。`,
        tags: ['予約', 'システム', '効率化'],
      },
      {
        title: `${brief.domain}決済プラットフォーム`,
        pitch: `${brief.target}向けの決済プラットフォーム。${brief.strength}を活用した安全な取引。`,
        tags: ['決済', 'FinTech', 'セキュリティ'],
      },
      {
        title: `${brief.domain}配送最適化`,
        pitch: `${brief.target}の配送を最適化するサービス。${brief.strength}を活かした効率的な配送。`,
        tags: ['物流', '最適化', '効率化'],
      },
      {
        title: `${brief.domain}品質管理システム`,
        pitch: `${brief.target}の品質を管理するシステム。${brief.strength}を活用した品質向上。`,
        tags: ['品質管理', 'システム', '改善'],
      },
      {
        title: `${brief.domain}カスタマーサポート`,
        pitch: `${brief.target}向けのカスタマーサポート。${brief.strength}を活かした迅速な対応。`,
        tags: ['サポート', 'カスタマー', '対応'],
      },
    ]
  }

  private getFlowTemplates(ideaTitle: string) {
    return [
      {
        title: '新規ユーザー登録フロー',
        description: '初回利用者の登録からサービス開始までの流れ',
        steps: [
          { title: 'ランディングページ訪問', description: 'サービス紹介ページで価値提案を確認' },
          { title: 'アカウント作成', description: 'メールアドレスとパスワードでアカウント作成' },
          { title: 'プロフィール設定', description: '基本情報と設定項目を入力' },
          { title: 'オンボーディング', description: 'サービス機能の説明とチュートリアル' },
          { title: '初回利用', description: '実際にサービスを利用開始' },
        ],
      },
      {
        title: '日常利用フロー',
        description: '既存ユーザーの日常的なサービス利用の流れ',
        steps: [
          { title: 'ログイン', description: 'アカウント情報でログイン' },
          { title: 'ダッシュボード確認', description: '最新情報とアクション項目を確認' },
          { title: '機能利用', description: '必要な機能を選択して利用' },
          { title: '結果確認', description: '処理結果や出力内容を確認' },
          { title: '次回予約', description: '継続利用のための設定や予約' },
        ],
      },
      {
        title: '問題解決フロー',
        description: '問題が発生した際の解決までの流れ',
        steps: [
          { title: '問題認識', description: '利用中に問題やエラーを発見' },
          { title: 'ヘルプ確認', description: 'FAQやヘルプドキュメントを確認' },
          { title: 'サポート連絡', description: '必要に応じてサポートに連絡' },
          { title: '解決対応', description: 'サポートからの指示に従って対応' },
          { title: '確認・完了', description: '問題解決を確認して利用再開' },
        ],
      },
    ]
  }
}
