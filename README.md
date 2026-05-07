<div id="top"></div>

## 使用技術一覧

<p style="display: inline">
  <img src="https://img.shields.io/badge/-Next.js-000000.svg?logo=nextdotjs&style=for-the-badge">
  <img src="https://img.shields.io/badge/-React-61DAFB.svg?logo=react&style=for-the-badge&logoColor=black">
  <img src="https://img.shields.io/badge/-TypeScript-3178C6.svg?logo=typescript&style=for-the-badge&logoColor=white">
  <img src="https://img.shields.io/badge/-Tailwind_CSS-38B2AC.svg?logo=tailwindcss&style=for-the-badge&logoColor=white">
  <img src="https://img.shields.io/badge/-Gemini_API-8E75B2.svg?logo=googlegemini&style=for-the-badge&logoColor=white">
  <img src="https://img.shields.io/badge/-Framer_Motion-0055FF.svg?logo=framermotion&style=for-the-badge&logoColor=white">
  <img src="https://img.shields.io/badge/-Vercel-000000.svg?logo=vercel&style=for-the-badge&logoColor=white">
</p>

## 目次

1. [プロジェクトについて](#プロジェクトについて)
2. [環境](#環境)
3. [ディレクトリ構成](#ディレクトリ構成)
4. [主な機能](#主な機能)
5. [セットアップ](#セットアップ)

## プロジェクト名

ちゃうちゃう君

## プロジェクトについて

「ちゃうちゃう君」は、作成した報告資料などのPDFをアップロードし、個性豊かな「教授」キャラクターから論理的なツッコミやフィードバックをもらうことができるAI対話型アプリケーションです。
Google Gemini 2.5 Flashの高度なマルチモーダル機能を活用し、資料の内容を深く理解した上での対話を実現しています。提出前の資料のブラッシュアップや、客観的な視点での検証をサポートします。

<p align="right">(<a href="#top">トップへ</a>)</p>

## 環境

| カテゴリ | 技術・ライブラリ |
| --------------------- | ---------- |
| Frontend | Next.js (App Router), React, Tailwind CSS |
| AI / Backend | Google Generative AI (Gemini 2.5 Flash) |
| UI Components | Lucide React, Framer Motion |
| Language | TypeScript |

<p align="right">(<a href="#top">トップへ</a>)</p>

## ディレクトリ構成
```
.
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts        # Gemini API連携・プロンプト制御
│   ├── layout.tsx              # 全体レイアウト定義
│   └── page.tsx                # チャットUI・ファイルアップロード処理
├── constants/
│   └── personas.ts             # 教授キャラクター（ペルソナ）定義
├── public/                     # アイコン・画像資産
├── .env.local                  # 環境変数（APIキー等）
└── README.md
```

<p align="right">(<a href="#top">トップへ</a>)</p>

## 主な機能

### 1．高度な資料解析機能
* **PDF直接解析**: 最大6MBのPDFファイルをアップロードし、AIがその内容を直接読み取ります。
* **文脈維持チャット**: 過去の会話履歴を保持しつつ、資料の内容に基づいた一貫性のある対話が可能です。
* **最新モデルの活用**: 最新の `gemini-2.5-flash` モデルを採用し、高速かつ的確なフィードバックを提供します。

### 2．パーソナライズされたフィードバック
* **教授選択システム**: 「論理派教授（ひろゆき風）」など、異なる専門性や性格を持つペルソナを選択し、多角的なアドバイスを得られます。
* **即時リセット機能**: 教授を切り替えると会話履歴がリセットされ、即座に新しいキャラクターとのセッションを開始できます。

### 3．洗練されたUX/UI
* **インタラクティブなUI**: Framer Motionによるアニメーションと、Lucide Reactのアイコンを用いた直感的な操作感を提供します。
* **自動スクロール**: 新しいメッセージを受信した際、自動的に最新のやり取りまでスクロールされます。
* **エラーハンドリング**: クォータ制限や接続エラー時、ユーザーに分かりやすいメッセージを表示します。

<p align="right">(<a href="#top">トップへ</a>)</p>

## セットアップ

1. リポジトリをクローンします。
2. `.env.local` を作成し、Gemini APIキーを設定します。
   ```
   GEMINI_API_KEY=あなたのAPIキー
   ```
3. 依存関係をインストールし、開発サーバーを起動します。
   ```bash
   npm install
   npm run dev
   ```

<p align="right">(<a href="#top">トップへ</a>)</p>

## 開発者情報
* **Name**: Takato Ishii
* **Portfolio**: [https://takato-ishii.vercel.app/](https://takato-ishii.vercel.app/)


<p align="right">(<a href="#top">トップへ</a>)</p>