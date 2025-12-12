# Vercel環境変数設定手順

## 1. ファイルからの一括設定方法

### 方法1: Vercel CLIを使用
```bash
# プロジェクトディレクトリで実行
vercel env pull .env.production

# または個別に設定
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add GOOGLE_CLOUD_PROJECT_ID production
vercel env add GOOGLE_CLOUD_CLIENT_EMAIL production
vercel env add GOOGLE_CLOUD_PRIVATE_KEY production
```

### 方法2: ダッシュボードからファイルインポート
1. Vercelダッシュボード → プロジェクト → Settings → Environment Variables
2. "Import from .env" ボタンをクリック
3. `.env.production` ファイルを選択してアップロード

## 2. 設定する環境変数一覧

### Supabase設定
```
NEXT_PUBLIC_SUPABASE_URL=https://wklytovmgcinbzqvxtdg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbHl0b3ZtZ2NpbmJ6cXZ4dGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNjEzMjksImV4cCI6MjA4MDgzNzMyOX0._7n9HjuqLlvhw6xTi9Chc4JMQGXKonHw9jIuz7rnXc0
```

### Google Cloud Vision API設定
```
GOOGLE_CLOUD_PROJECT_ID=tokolog-web-vision
GOOGLE_CLOUD_CLIENT_EMAIL=tokolog-vision-service@tokolog-web-vision.iam.gserviceaccount.com
GOOGLE_CLOUD_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCoeh1g9C9BpGjY
iALLQ74GxgtsF0RzIt4s0IivvQtO8CchjkHiMeEFFXDj0dzMYOwPmsTlLoKPwx+5
9OUiaAEM68tGWTslHiEz6WACbA9u/hClW6t+E78FIcYep5AX8rm/kDsQN42kuJrO
st8pTv9FI6htymFoAIUHhoKLnuGlPPL5221sKgcqteIfjgO/zHt07dnmlBhBW8XX
Skp5pYw/NOOn3cVYla/M9mYg6kHtd+V/eqAQBmLuPhHKJ4TagwuLNOqwElvxNrHM
wqNS8bOoYOWt79rOOyuIE1n0RxtWpbANZ5u9fRQgpnyZ3y7X6CC5AByT/jT8zKuA
fNZF1oH1AgMBAAECggEAEsm/cfr5NCRODuuoCBvvWpkGWBEGMKLQTQYaYCLAWpa8
fmj7Xuq6EdOQyc8zBNXALYNQdtBnffnAFYBCd0JK77Jx8k/sIRkJkdzyOILte664
k4A0ETTJhhx8mBmOn6URYtQGSiov0RFHLkrTSSuGmyK9WzUJBMyeCTdOYpyexErn
psbJ8yg6fZ14jSEeVgO5E8dn+TPHjztB2ifVzjE4pBVgADpEG/tXrAsId0g37cvW
fRSqSmqBlRtQDfb3Jb4xNtC+Dm7cGFQEHqzOCMr13G3JLoe9imvx9gYz0Bqa0sRk
z/R4VTH4A7JcBwJDnKXyMYg5KFd/Xs1FNEe+2rRtEQKBgQDm+TUkq4crXGw+RvEo
jwjGMTckd7AL9pdWeNzJgn4DEaBgCLf2VTip823o3k80RHREl7nPTam+Bpvr5fNt
DqW5qhRaF2DcPTEMgbmzPtO5prfvXG6h7KpS4AttkcE0HZaIl15fNHRLa2F/r1UD
29a/Apga3D07LCau0svPQbtdXQKBgQC6u13otVnbDuXJp7DJxu0bi5vQ7RY3TkJN
3i9LweTU2ECIQl4RoI1JH9ySr6P15LWlmhLoS4UeZPvUr/52K9Qb60BxzQuSVNSS
3KFWBfdRcIR+lSVghtyvdwEC2CqfoXgcpI980qboxSix+p/u80GjTXvTZDCVjiSz
FWAS223VeQKBgH9fXLQtN2xtGnA5lRIl1tPdHiipLFdclFambjNeF/m/Ra7QAAsD
Mi1exfTOa+VJ/sg418n/bSUS5fdwJw60LiY2KeUI0WyC/kKEY5D6i63sx7BjS8tW
BROQ5Bx3bZE849/NgciE18EjpW/Rk9N9724Ekzb0z3uLPIXaT3SrLhUtAoGAFQ/N
J9JMsEid4oDnj9rAI7s7d/VF7DcHg4DsFL9p8Bf0L2pM8fAJ/5V4a5MkCzggxOz7
9PePrD33qaWwLeQDqKKAQlW+WGL5FxeLmwhRPP5T83MfJCQSADiMBKYdKKQtyA1H
oeygpuCWFn0OTQVjAehbbxx93mCKAykGDRpy6QECgYA9SSJU+Ukr7OnTaDSlpnkd
BDoUPNmFv2s/yty7XDnF2ww5rFguHtu2u5NizXGdS81mF5AhP9QLFZatus0dVTcI
onRJp5DjMWr6PuwcgClzYcItmoFhGIj78N/oacixPUhY38oi4GdFHE0ur3oDibYF
dAoHfCNzrSU5cteOQE7I6g==
-----END PRIVATE KEY-----
```

## 3. 設定確認方法

### CLI確認
```bash
vercel env ls
```

### ダッシュボード確認
1. Vercelダッシュボード → プロジェクト → Settings → Environment Variables
2. 設定された変数一覧を確認

## 4. 再デプロイ
環境変数設定後は必ず再デプロイを実行：
```bash
vercel --prod
```

または、ダッシュボードの Deployments → Redeploy

## 注意事項

### セキュリティ
- `.env.production` は本番用機密情報が含まれるため、必ず `.gitignore` に追加
- GitHub等のパブリックリポジトリにはコミットしない

### ファイル管理
- `.env.example` はテンプレートとしてリポジトリに含める
- `.env.production` は機密情報のためリポジトリに含めない