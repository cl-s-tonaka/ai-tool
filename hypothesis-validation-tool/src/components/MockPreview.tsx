"use client"

import { PageSpec, SectionSpec } from "@/domain/mock"

interface MockPreviewProps {
  pageSpec: PageSpec
}

export function MockPreview({ pageSpec }: MockPreviewProps) {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* Header */}
      {pageSpec.sections.filter(s => s.type === 'header').map(section => (
        <HeaderSection key={section.id} title={section.title} />
      ))}

      {/* Main content */}
      <main className="space-y-8 p-6">
        {pageSpec.sections.filter(s => s.type !== 'header' && s.type !== 'footer').map(section => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </main>

      {/* Footer */}
      {pageSpec.sections.filter(s => s.type === 'footer').map(section => (
        <FooterSection key={section.id} content={section.content} />
      ))}
    </div>
  )
}

function HeaderSection({ title }: { title?: string }) {
  return (
    <header className="border-b bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="font-semibold">{title || "Site"}</div>
        <nav className="hidden sm:flex gap-4 text-sm text-gray-600">
          <a className="hover:text-gray-900" href="#">Features</a>
          <a className="hover:text-gray-900" href="#">Pricing</a>
          <a className="hover:text-gray-900" href="#">Contact</a>
        </nav>
      </div>
    </header>
  )
}

function FooterSection({ content }: { content?: string }) {
  return (
    <footer className="border-t bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-6 text-sm text-gray-600">
        {content || "© 2025 Example Inc."}
      </div>
    </footer>
  )
}

function SectionRenderer({ section }: { section: SectionSpec }) {
  switch (section.type) {
    case 'hero':
      return (
        <section className="text-center py-10 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">{section.title || 'ヒーローセクション'}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">{section.content || '魅力的なキャッチコピーや補足説明を配置します。'}</p>
          <div className="flex gap-3 justify-center">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">今すぐ始める</button>
            <button className="px-4 py-2 border rounded-md hover:bg-white/60">詳細を見る</button>
          </div>
        </section>
      )
    case 'features':
      return (
        <section>
          <h3 className="text-xl font-semibold mb-4">{section.title || '特徴'}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0,1,2].map(i => (
              <div key={i} className="border rounded-lg p-4">
                <div className="font-medium mb-1">特徴 {i+1}</div>
                <p className="text-sm text-gray-600">{section.content || '機能や利点の要約説明を記載します。'}</p>
              </div>
            ))}
          </div>
        </section>
      )
    case 'cta':
      return (
        <section className="text-center">
          <h3 className="text-xl font-semibold mb-2">{section.title || '今すぐ始めましょう'}</h3>
          <p className="text-gray-600 mb-4">{section.content || '短いサポートテキスト'}</p>
          <button className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">無料で試す</button>
        </section>
      )
    case 'form':
      return (
        <section className="max-w-md">
          <h3 className="text-xl font-semibold mb-4">{section.title || 'お問い合わせ'}</h3>
          <form className="space-y-3">
            <input className="w-full border rounded-md px-3 py-2" placeholder="お名前" />
            <input className="w-full border rounded-md px-3 py-2" placeholder="メールアドレス" />
            <textarea className="w-full border rounded-md px-3 py-2" rows={3} placeholder="ご用件" />
            <button type="button" className="px-4 py-2 bg-gray-900 text-white rounded-md">送信</button>
          </form>
        </section>
      )
    case 'list':
      return (
        <section>
          <h3 className="text-xl font-semibold mb-2">{section.title || 'リスト'}</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>{section.content || '項目 1'}</li>
            <li>項目 2</li>
            <li>項目 3</li>
          </ul>
        </section>
      )
    case 'card':
      return (
        <section>
          <h3 className="text-xl font-semibold mb-4">{section.title || 'カード'}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[0,1,2,3].map(i => (
              <div key={i} className="border rounded-lg p-4">
                <div className="font-medium mb-1">{section.title || `カード ${i+1}`}</div>
                <p className="text-sm text-gray-600">{section.content || '概要テキスト。'}</p>
                <button className="mt-3 text-sm px-3 py-1 border rounded-md hover:bg-gray-50">詳細</button>
              </div>
            ))}
          </div>
        </section>
      )
    default:
      return null
  }
}


