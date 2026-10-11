# Critical Care Papers

このプロジェクトは、集中治療分野の研究論文を要約し、批判的に評価するためのウェブアプリケーションです。医療従事者が重要な研究の主要な知見と限界を迅速に理解できるよう設計されています。

## プロジェクト概要

このアプリケーションは、研究論文のリストを表示します。ユーザーは論文をクリックすると、以下の詳細な要約を閲覧できます。

*   研究の簡潔な要約
*   PICO（Patient, Intervention, Comparison, Outcome）フレームワーク
*   インタラクティブなチャートを含む詳細な結果
*   研究の強みと弱みに関する批判的吟味

## 新しい論文を追加する方法

アプリケーションに新しい論文を追加するには、以下の手順に従ってください。

### Gemini CLI・Codex・OpenCodeで登録する場合

このリポジトリのルートで各エージェントを起動し、登録したいPDFを `raw_pdfs/` に置いて「このPDFを登録して」と依頼してください。`go ahead` も登録指示として扱います。共通の詳細手順は [docs/paper-ingestion.md](docs/paper-ingestion.md) にあります。Codex と OpenCode は `AGENTS.md` から、Gemini CLI は `GEMINI.md` からこの手順を参照します。

`raw_pdfs/` と `processed_pdfs/` は Git の管理対象外です。別の clone で作業する場合、PDFは自動では引き継がれません。複数のエージェントで同時に論文を登録するとIDが衝突する可能性があるため、登録作業は1件ずつ行ってください。

1.  **論文のJSONファイルを作成します。** 論文の内容を構造化されたJSON形式で記述し、`src/data/papers/`ディレクトリに保存します。ファイル名は `paper_ID.json` (例: `paper_33.json`) としてください。
    *   **IDの管理:** `src/data/papers/metadata.json`ファイルに`"lastId"`が保持されています。新しい論文のIDには、この`"lastId"`の次の数値を使用し、JSONファイル作成後に`metadata.json`の`"lastId"`を更新してください。
    *   **サマリーデータの更新:** `src/data/papers/papers_summary.json`ファイルには、各論文の概要情報が格納されています。新しい論文を追加するたびに、以下の形式でこのファイルに論文情報を追記してください。

    ```json
     {
        "id": 34,
        "登録日": "2025-07-03",
        "original_title": "Targeted Normoxemia and Supplemental Oxygen-Free Days in Critically Injured Adults: A Stepped-Wedge Cluster Randomized Clinical Trial",
        "雑誌名_巻号_出版年_ページ": "JAMA Network Open. 2025;8(3):e252093",
        "pmid": 40163121,
        "pubmed_link": "https://pubmed.ncbi.nlm.nih.gov/40163121"
      }
    ```

2.  **アプリケーションで新しい論文が正しく表示されることを確認します。**

## プロジェクト構造

*   `public/`: メインのHTMLファイルやその他の静的アセットが含まれています。
*   `src/`: Reactアプリケーションのソースコードが含まれています。
    *   `components/`: アプリケーションを構築するために使用されるReactコンポーネント。
    *   `data/papers/`: 各研究論文のJSONデータが含まれています。

## 利用可能なスクリプト

プロジェクトディレクトリでは、以下を実行できます。

### `npm start`

開発モードでアプリを実行します。
ブラウザで[http://localhost:3000](http://localhost:3000)を開いて表示します。

### `npm test`

インタラクティブなウォッチモードでテストランナーを起動します。

### `npm run build`

`build`フォルダーに本番用のアプリをビルドします。

### `npm run deploy`

アプリをビルドし、GitHub Pagesにデプロイします。
内部で自動的に `npm run build` が実行され、その後 `gh-pages` ブランチへのデプロイが行われます。
