# TOKOLOG-WEB Git操作・ビルド手順マニュアル

## 目次
1. [事前準備](#事前準備)
2. [基本的なGit操作手順](#基本的なgit操作手順)
3. [ビルド手順](#ビルド手順)
4. [デプロイ手順](#デプロイ手順)
5. [トラブルシューティング](#トラブルシューティング)
6. [よく使うコマンド一覧](#よく使うコマンド一覧)

---

## 事前準備

### 1. 必要なツールの確認
以下のツールがインストールされていることを確認してください：

```bash
# Node.jsのバージョン確認
node --version
# 推奨: v18.0.0以上

# npmのバージョン確認
npm --version
# 推奨: v8.0.0以上

# Gitのバージョン確認
git --version
# 推奨: v2.0以上
```

### 2. プロジェクトディレクトリへの移動
```bash
cd /Users/imanishi_natsuki/Desktop/tokolog-web
```

### 3. 環境変数の確認
`.env.local`ファイルが正しく設定されていることを確認：
```bash
cat .env.local
```

---

## 基本的なGit操作手順

### ステップ1: 現在の状態を確認

```bash
# 現在のブランチと変更状況を確認
git status

# 現在のブランチを確認
git branch

# リモートリポジトリの状態を確認
git remote -v
```

### ステップ2: 変更をステージングに追加

```bash
# 全ての変更をステージングに追加
git add .

# 特定のファイルのみ追加する場合
git add ファイル名

# 追加された変更を確認
git status
```

### ステップ3: コミット作成

```bash
# コミットメッセージと共に変更をコミット
git commit -m "feat: カメラ機能とOCR機能の実装完了"

# より詳細なコミットメッセージを書く場合（エディタが開きます）
git commit
```

#### コミットメッセージのガイドライン
- `feat:` - 新機能の追加
- `fix:` - バグ修正
- `docs:` - ドキュメントの変更
- `style:` - コードスタイルの変更
- `refactor:` - リファクタリング
- `test:` - テストの追加・修正

### ステップ4: リモートリポジトリにプッシュ

```bash
# mainブランチにプッシュ
git push origin main

# 初回プッシュの場合（アップストリームを設定）
git push -u origin main

# 強制プッシュ（注意：他の人の変更を上書きする可能性があります）
git push --force origin main
```

---

## ビルド手順

### ステップ1: 依存関係のインストール

```bash
# package.jsonに記載された依存関係をインストール
npm install

# 特定のパッケージを追加する場合
npm install パッケージ名

# 開発用依存関係を追加する場合
npm install --save-dev パッケージ名
```

### ステップ2: 開発サーバーの起動

```bash
# 開発サーバーを起動
npm run dev

# サーバーが起動したら以下のURLでアクセス可能
# http://localhost:3000
```

### ステップ3: 本番用ビルド

```bash
# TypeScriptの型チェック
npm run type-check

# ESLintによるコード品質チェック
npm run lint

# 本番用にビルド
npm run build

# ビルド結果のテスト起動
npm start
```

### ステップ4: ビルド結果の確認

```bash
# ビルドが成功した場合、.next/ディレクトリが作成される
ls -la .next/

# ビルドエラーがある場合は以下で詳細を確認
npm run build 2>&1 | tee build.log
```

---

## デプロイ手順

### Vercelでのデプロイ（推奨）

#### 1. Vercel CLIを使用する場合

```bash
# Vercel CLIのインストール（初回のみ）
npm install -g vercel

# Vercelにログイン
vercel login

# デプロイ実行
vercel

# 本番環境にデプロイ
vercel --prod
```

#### 2. Gitリポジトリ連携（自動デプロイ）

1. Vercelダッシュボード（https://vercel.com/dashboard）にアクセス
2. 「New Project」をクリック
3. GitHubリポジトリを選択
4. 環境変数を設定：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GOOGLE_CLOUD_PROJECT_ID`
   - `GOOGLE_CLOUD_CLIENT_EMAIL`
   - `GOOGLE_CLOUD_PRIVATE_KEY`
5. 「Deploy」をクリック

### 環境変数の設定

Vercelでの環境変数設定：
```bash
# Vercel CLIで環境変数を設定
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add GOOGLE_CLOUD_PROJECT_ID
vercel env add GOOGLE_CLOUD_CLIENT_EMAIL
vercel env add GOOGLE_CLOUD_PRIVATE_KEY
```

---

## トラブルシューティング

### よくある問題と解決策

#### 1. `npm install`でエラーが発生する

```bash
# キャッシュをクリア
npm cache clean --force

# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

#### 2. TypeScriptエラー

```bash
# 型定義を確認
npm run type-check

# 型エラーの詳細を表示
npx tsc --noEmit
```

#### 3. ESLintエラー

```bash
# ESLintエラーを自動修正
npm run lint -- --fix

# 特定のファイルのみチェック
npx eslint ファイル名
```

#### 4. ビルドエラー

```bash
# 詳細なエラー情報を表示
npm run build -- --verbose

# キャッシュをクリアしてビルド
rm -rf .next
npm run build
```

#### 5. Gitプッシュエラー

```bash
# リモートの最新状態を取得
git fetch origin

# リベースして競合を解決
git rebase origin/main

# 競合が発生した場合は手動で解決後
git add .
git rebase --continue
```

### 緊急時の対応

#### 変更を元に戻す

```bash
# 最後のコミットを取り消す（変更は保持）
git reset --soft HEAD~1

# 最後のコミットを完全に取り消す（注意！）
git reset --hard HEAD~1

# 特定のファイルを元に戻す
git checkout HEAD -- ファイル名
```

---

## よく使うコマンド一覧

### Git操作

```bash
# 基本操作
git status                    # 変更状況確認
git add .                     # 全ての変更をステージング
git commit -m "メッセージ"     # コミット作成
git push origin main          # リモートにプッシュ
git pull origin main          # リモートから取得

# ブランチ操作
git branch                    # ブランチ一覧
git checkout -b new-feature   # 新しいブランチを作成して切り替え
git checkout main             # mainブランチに切り替え
git merge feature-branch      # ブランチをマージ

# 履歴確認
git log --oneline            # コミット履歴を簡潔表示
git diff                     # 変更差分を表示
git show HEAD                # 最新コミットの詳細
```

### NPM操作

```bash
# 基本操作
npm install                  # 依存関係インストール
npm run dev                  # 開発サーバー起動
npm run build                # 本番ビルド
npm start                    # ビルド後のアプリ起動
npm run lint                 # コード品質チェック
npm run type-check           # TypeScript型チェック

# パッケージ管理
npm list                     # インストール済みパッケージ一覧
npm outdated                 # 古いパッケージの確認
npm update                   # パッケージ更新
npm audit                    # セキュリティ監査
npm audit fix                # 脆弱性自動修正
```

### プロジェクト固有

```bash
# 環境確認
cat .env.local               # 環境変数確認
npm run dev                  # http://localhost:3000で開発サーバー起動

# データベース関連（Supabase）
# ※ブラウザでSupabaseダッシュボードにアクセス
open https://app.supabase.com/

# デプロイ関連
vercel                       # Vercelにデプロイ
vercel --prod                # 本番環境にデプロイ
vercel logs                  # デプロイログ確認
```

---

## 定期メンテナンス

### 毎週実施することを推奨

```bash
# 1. セキュリティ監査
npm audit

# 2. パッケージ更新チェック
npm outdated

# 3. 型チェック
npm run type-check

# 4. コード品質チェック
npm run lint

# 5. テストビルド
npm run build
```

### 毎月実施することを推奨

```bash
# 1. 依存関係の更新
npm update

# 2. 不要なパッケージのクリーンアップ
npm prune

# 3. キャッシュのクリア
npm cache clean --force

# 4. Git履歴の確認
git log --oneline --graph --decorate
```

---

## 注意事項

### セキュリティ
- `.env.local`ファイルは絶対にGitリポジトリにコミットしない
- APIキーや秘密鍵は環境変数として管理する
- `node_modules/`ディレクトリはGitに含めない

### バックアップ
- 重要な変更前は必ずブランチを作成する
- 定期的にリモートリポジトリにプッシュする
- `.env.local`ファイルは別途安全な場所に保存する

### パフォーマンス
- 不要なパッケージは削除する
- ビルド時間を監視し、必要に応じて最適化する
- 画像ファイルは適切なサイズに最適化する

---

このマニュアルを参考に、安全で効率的な開発・デプロイを行ってください。
質問がある場合は、具体的なエラーメッセージと実行したコマンドを含めて相談してください。