# プロジェクト概要

## 名称
Hypothesis Validation Tool

## 目的
プロダクト/機能アイデアの仮説を短時間で可視化・評価し、比較検証する。

## 対象読者
- 事業企画/PM
- デザイナー/エンジニア

## スコープ
- ブリーフ入力→アイデア候補生成→スコア評価→比較→UIモック生成の一連の流れ
- LLM ゲートウェイは現状モック（infrastructure/llmGateway.mock.ts）

## 主要ドメイン
- brief: 入力ブリーフ（domain/brief.ts）
- idea: アイデア候補/スコア（domain/idea.ts）
- flow: ユーザーフロー（domain/flow.ts）
- mock(page spec): UIセクション仕様（domain/mock.ts）

## 主要画面
- /: トップ/説明
- /ideas: アイデア一覧/比較
- /ideas/[id]: 詳細・比較ダイアログ
- /spec: 生成UI仕様
- /mock: モックUI
