# IOL選択サポート v3

eye-meetings.com の白内障手術向けレンズ選択サポートアプリ（v3）

## 主な変更点（v2からv3）

| 項目 | v2 | v3 |
|------|-----|-----|
| Q8 | 3択（遠/中/近） | **6択**（5m/2m/1m/70cm/40cm/33cm） |
| 質問番号 | Q1〜Q12（Q9あり） | **Q1〜Q11**（連番に整理） |
| Q5/Q9/Q10 | スコア影響あり | **スコア影響なし**（extraトリガーのみ） |
| 画面構成 | 複数質問を1ページ | **1問1ページ** |
| /mono | 複合的な画面 | **/extra** にリネーム |
| localStorage | `iolapp_print_logs_v2` | `iolapp_print_logs_v3` |

## セットアップ

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
```

## publicフォルダに必要な画像

以下の画像をv2から `/public` フォルダにコピーしてください：

- `iol_icon.png` - ヘッダーロゴ
- `iol_pink.png` - Q1, Q6, Q10用アイコン
- `iol_green.png` - Q2, Q5, Q9用アイコン
- `iol_blue.png` - Q3, Q7, Q8, Q11用アイコン
- `iol_y.png` - Q4用アイコン（黄色）

## フォルダ構成

```
iol_app_v3/
├── app/
│   ├── q1/ ~ q11/     # 各質問ページ（1問1ページ）
│   ├── extra/          # 追加質問（旧mono）
│   ├── result/         # 最終結果＋印刷
│   ├── staff-logs/     # スタッフ用ログ閲覧
│   ├── components/     # 共通コンポーネント
│   └── contexts/       # AnswersContext
└── src/
    ├── domain/lens/    # スコア計算・フラグ・理由文
    ├── data/questions/ # 質問文言・選択肢・注釈
    ├── state/          # 型定義
    └── lib/storage/    # localStorage
```

## Vercelデプロイ

v2とは別プロジェクトとしてデプロイしてください。
