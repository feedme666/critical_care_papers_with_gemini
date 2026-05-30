## Gemini Added Memories
- For the 'critical-care-papers' project, the workflow for adding a new paper is:
  1. The user places a research paper PDF in the `/Users/ryutaroseo/Documents/Dev_local/gemini/critical-care-papers/raw_pdfs/` directory, and after processing it according to the defined method, moves it to the `/Users/ryutaroseo/Documents/Dev_local/gemini/critical-care-papers/processed_pdfs/` directory. (その際に、".gitignore"は無視してディレクトリを確認する)
  2. **共通ルール (IDとメタデータ管理):**
    - 新しい論文JSONファイルを作成する際、`src/data/papers/metadata.json`ファイルを更新する。
      - `lastId`: 記録されている`lastId`の次の数値を新しいIDとして使用し、その新しいIDで更新します。
      - `lastUpdatedAt`: トップページに表示される最終更新日として、現在の日付を `YYYY-MM-DD`形式で更新します。
  3. **初期処理と重複チェック:**
    - PDFからテキストを抽出（OCR）し、以下の**PMIDおよびpubmed_linkの取得手順**に従ってPMIDを特定する。
    - **PMIDおよびpubmed_linkの取得手順:**
      PMIDの特定率を向上させるため、以下の改訂されたフローを厳格に遵守してください。Web検索を積極的に活用し、精度を高めます。
      1. **手順1: DOIの探索と利用（優先度：高）**
         - 論文PDFのテキストから**DOI** (`10.`から始まる文字列)を最優先で探索します。
         - DOIが見つかった場合、`google_web_search`を使い、そのDOIで直接Web検索を実行します。
             - **検索クエリ例:** `(見つかったDOI)`
         - 検索結果からPubMedのURL (`https://pubmed.ncbi.nlm.nih.gov/...`) を探し、PMIDを特定します。
      2. **手順2: Web検索による論文特定（DOIがない場合）**
         - DOIが見つからない場合、`google_web_search`を使い、論文のメタ情報でWeb検索を実行します。
         - 検索クエリには、`original_title`（英語題名）、`筆頭著者`、`雑誌名`、`出版年`を組み合わせ、最後に`"pubmed"`というキーワードを追加します。
             - **検索クエリ例:** `"[original_title]" "[筆頭著者]" "[雑誌名]" [出版年] "pubmed"`
         - 検索結果の上位から、該当する論文のPubMedページまたはDOIを探します。DOIが見つかった場合は、手順1に戻ってPMIDを特定します。
      3. **手順3: 必須の検証プロセス**
         - 上記いずれかの方法でPMIDの候補が見つかった場合、**必ず**そのPMIDに対応するPubMedのページ (`https://pubmed.ncbi.nlm.nih.gov/[PMID]`) の内容を`web_fetch`ツールで確認します。
         - **検証項目:** PubMedページに記載されている「論文の題名、著者リスト、雑誌情報」が、処理対象のPDFから抽出した情報と**完全に一致する**ことを検証します。
         - 一致が確認できた場合にのみ、そのPMIDを正しいものとして採用します。
      4. **手順4: 失敗した場合の処理**
         - 検証の結果、情報が一致しない場合、または信頼できるPMIDが見つからなかった場合は、`pmid`と`pubmed_link`の値を`null`に設定します。不正確な情報を提供するよりも、情報がない方が価値があります。
    - **重複チェック:**
      - PMIDが特定できたら、直ちに `src/data/papers/papers_summary.json` を読み込み、同じPMIDを持つ論文が既に登録されていないかを確認する。
      - **重複がある場合:** そこで全ての作業を中止し、ユーザーに対して「PMID: [PMID] は既に登録済みです。処理を中断します。」と報告する。
      - **重複がない場合:** 継続してテキストの内容分析を行い、構造化されたJSONデータを作成する。
  4. I save this new JSON file into the `src/data/papers/` directory, using the paper id like `paper_33.json`.
  5. After JSON generation, the original PDF file is moved from `raw_pdfs/` to `processed_pdfs/`. その際に、pdfファイルをidを使った名前に変更する（例: `paper_33.pdf`）.
  6. The React application dynamically loads all JSON files from this directory to display the list of papers.
  7. **JSON生成の基本ルール:**
     - 既存のJSONファイルの上書き禁止: src/data/papers/paper_*.json の形式で既に存在するJSONファイルを、内容を確認せずに上書きしてはならない。新しい論文を処理する際は、必ず metadata.json の lastIdを確認し、新しいユニークなIDを使用すること。
     - **ファイルタイプの判別:** PDFの内容から、それが「研究論文」か「ガイドライン」かを判断する。
     - **タイプ別プロパティ:** 生成するJSONのトップレベルに、文書の種類を示す`type`プロパティを必ず含める。
       - 研究論文の場合: `"type": "paper"`
       - ガイドラインの場合: `"type": "guideline"`
     - 以降のルールは、この`type`に基づいて適用する。

  8. **研究論文 (`type: "paper"`) の処理条件:**
    - **処理条件:**
      - 日本語で作成する。常体で記述する。
      - わかりやすさを心がけ、1論文あたり、10分程度で理解できるようにする
      - PICO、もしくはPECOに沿って記述する。inclusion criteriaやexclusion criteriaなども記載する。
      - `要約`は少なすぎてはいけない。
      - 結果は詳細に記載し、`結果`プロパティに格納する
      - 結果の主要な数値を基に、`chartData`プロパティを作成し、インタラクティブなグラフを描出する
      - 考察も記載する
      - 集中治療専門医、かつ集中治療のプロフェッショナルとして、この研究に対する批判的吟味を実施して、その内容も追加する。
      - 各論文に、タグ付けする
      - 記述する分量や記述するレベルは、`/Users/ryutaroseo/Documents/Dev_local/gemini/critical-care-papers/src/data/papers/paper_33.json`を参考にする。
      - 最初のページで、以下の内容を表示するようにする。
        - 題名 (日本語)
        - 筆頭著者
        - 雑誌名、巻号、出版年、ページ（pubmedで表示される形式と同様にする。例: `Crit Care Med . 2025 Mar 1;53(3):e555-e566.`）
        - タグ
        - 登録日
      - **タグのカテゴリー:**
        - ["呼吸器系", "循環器系", "腎尿路系", "脳神経系", "消化器系", "内分泌・代謝系", "血液・免疫系", "皮膚・軟部組織系", "感染・炎症系", "外傷", "医療安全・倫理系", "その他"]
        - ["ランダム化比較試験", "コホート研究", "症例対照研究", "システマティックレビュー・メタアナリシス", "観察研究", "基礎研究", "ガイドライン・提言"]
        - コメント: それぞれのカテゴリーのリストから、最低一つずつタグをつける
      - **RCTの試験タイプ判定と記録:**
        - PDF本文を読み込み、研究がランダム化比較試験に該当すると判断した場合は、試験の種類を判定して記録する。
        - 判定区分: ["非劣性試験", "優越性試験", "同等性試験", "容量反応関係試験", "その他"]。
        - 判定は、論文の記載（trial design/abstract/methods など）に基づいて行う。明確に判定ができない場合、「優越性試験」の可能性が高いと考えられる時は「優越性試験」とし、それ以外の場合は「その他」とする。
        - JSONには以下の構造で記録する:
          ```
          "研究の種類": {
            "判定": "優越性試験",
            "確度": "中",
            "根拠": [
              { "ソース": "pdf", "内容": "PDF全文のキーワード探索で分類", "位置": "全文検索" }
            ],
            "判定履歴": [
              { "日付": "YYYY-MM-DD", "判定": "優越性試験", "方法": "自動判定" }
            ]
          }
          ```
        - Web表示では、タグに「ランダム化比較試験」がある場合は `ランダム化比較試験（判定）` の形式で表示する。
    - **JSONプロパティ名規則:**
      - `id`: 数値 (ユニークな識別子)
      - `type`: "paper"
      - `題名`: 文字列 (日本語)
      - `original_title`: 文字列 (英語、元の英語の題名)
      - `筆頭著者`: 文字列
      - `雑誌名_巻号_出版年_ページ`: 文字列
      - `登録日`: 文字列 (YYYY-MM-DD形式を推奨)
      - `タグ`: 文字列の配列
      - `要約`: 文字列
      - `PICO`: オブジェクト (`P`, `I`, `C`, `O` をキーに持つ)
      - `考察`: 文字列
      - `結果`: 文字列
      - `chartData`: オブジェクト
      - `批判的吟味`: オブジェクト
      - `研究の種類`: オブジェクト (RCTの場合に付与。上記の構造を参照)
      - `pmid`: 数値 (PubMed ID) または null。以下の手順で特定する。
      - `pubmed_link`: 文字列 (PubMedのURL) または null。pmidが特定できた場合のみ生成する。
    - **「批判的吟味」の構造:** `{"title":"批判的吟味","points":[{"subtitle":"研究の背景と目的","content":""},{"subtitle":"研究デザイン・方法論","content":""},{"subtitle":"対象集団・サンプリング","content":""},{"subtitle":"介入（曝露）と比較群","content":""},{"subtitle":"アウトカムの定義と測定方法","content":""},{"subtitle":"統計解析の適切性","content":""},{"subtitle":"バイアスと交絡因子の評価","content":""},{"subtitle":"研究の強み","content":""},{"subtitle":"研究の弱みと限界","content":""},{"subtitle":"臨床的意義と今後の展望","content":""}]}`
    - 結果の主要な数値を基に、`chartData`プロパティを作成し、インタラクティブなグラフを描出します。chartData は、react-chartjs-2の棒グラフで正しく表示されるように、以下の規則に従って作成してください。
      * labels: グラフの各項目のラベル（例: "90日生存率 (%)", "7日死亡率 (%)"）を文字列の配列で指定します。
      * datasets: グラフに表示するデータセットをオブジェクトの配列で指定します。各データセットは、研究の異なる群（例: 介入群、対照群）に対応します。
      * label: データセットのラベル（例: "介入群", "対照群"）を文字列で指定します。このラベルは、論文間で意味的に共通する場合、必ず同じ文字列を使用してください。
      * data: labels で指定した各項目に対応する数値を配列で指定します。
      * backgroundColor: 棒グラフの背景色を rgba() 形式の文字列で指定します。
          * 介入群・治療群など: rgba(75, 192, 192, 0.6)
          * 対照群・プラセボ群など: rgba(255, 99, 132, 0.6)
          * その他の群は、これらの色と区別できる色を適宜使用してください。
      * borderColor: 棒グラフの枠線の色を rgba()形式の文字列で指定します。backgroundColor のアルファ値を 1にしたものを指定してください。
      * borderWidth: 棒グラフの枠線の太さを数値で指定します（通常は 1）。
      * 記述例:
        ```
        "chartData": {
          "labels": ["90日生存率 (%)", "7日死亡率 (%)"],
          "datasets": [
            {
              "label": "セボフルラン群",
              "data": [47.1, 19.4],
              "backgroundColor": "rgba(75, 192, 192, 0.6)",
              "borderColor": "rgba(75, 192, 192, 1)",
              "borderWidth": 1
            },
            {
              "label": "プロポフォール群",
              "data": [55.7, 13.5],
              "backgroundColor": "rgba(255, 99, 132, 0.6)",
              "borderColor": "rgba(255, 99, 132, 1)",
              "borderWidth": 1
            }
          ]
                }
                ```
        
          9. **ガイドライン (`type: "guideline"`) の処理条件:**
    - **JSONプロパティ名規則:**
      - `id`: 数値 (ユニークな識別子)
      - `type`: "guideline"
      - `題名`: 文字列 (日本語)
      - `original_title`: 文字列 (英語、元の英語の題名)
      - `作成団体`: 文字列 (学会名など)
      - `雑誌名_巻号_出版年_ページ`: 文字列
      - `登録日`: 文字列 (YYYY-MM-DD形式を推奨)
      - `タグ`: 文字列の配列 ("ガイドライン・提言")
      - `概要`: 文字列 (ガイドライン全体の目的、対象読者、全体像の要約)
      - `対象`: 文字列 (ガイドラインが対象とする患者集団や臨床状況)
      - `作成プロセス`: オブジェクト
         - `開発方法論`: 文字列 (例: GRADEフレームワーク)
         - `検索戦略と選定基準`: 文字列 (検索DB、キーワード、包含/除外基準)
      - `推奨事項`: オブジェクト
         - `title`: "主要な推奨事項"
         - `recommendations`: オブジェクトの配列
            - `cq`: 文字列 (Clinical Question)
            - `recommendation_statement`: 文字列 (推奨文)
            - `strength_of_recommendation`: 文字列 (推奨の強さ)
            - `level_of_evidence`: 文字列 (エビデンスのレベル)
            - `remarks`: 文字列 (補足事項)
      - `ガイドラインの批判的吟味`: オブジェクト
         - `title`: "ガイドラインの批判的吟味 (AGREE IIの観点を含む)"
         - `points`: オブジェクトの配列 (`subtitle`, `content` をキーに持つ)
      - `主要な改訂点`: 文字列 または `null`
      - `pmid`: 数値 (PubMed ID) または null
      - `pubmed_link`: 文字列 (PubMedのURL) または null
    - **以下のプロパティは含めない:** `PICO`, `結果`, `考察`, `chartData`
  10. 論文JSONの生成後、`src/data/papers/papers_summary.json`を以下の形式で更新する。
   - `papers_summary.json`の構造:
    [
      {
        "id": 1,
        "type": "paper",
        "題名": "論文Aの日本語題名",
        "original_title": "論文Aの英語題名",
        "筆頭著者": "著者A",
        "作成団体": null,
        "雑誌名_巻号_出版年_ページ": "雑誌A. 2024;1(1):1-10",
        "雑誌名巻号出版年_ページ": "雑誌A. 2024;1(1):1-10",
        "登録日": "YYYY-MM-DD",
        "タグ": ["呼吸器系", "ランダム化比較試験"],
        "研究の種類": {
          "判定": "優越性試験"
        },
        "pmid": 12345678,
        "pubmed_link": "https://pubmed.ncbi.nlm.nih.gov/12345678"
      },
      // ... 他の論文データ
    ]
  11. ユーザーが"go ahead"とプロンプトを入力したら、次のプロンプトを意味します。"未処理のpdfを1つ処理してください。.gitignoreで見えなくなっているディレクトリがあるので、lsコマンドでみてくだい。どのpdfを処理するかは、あなたが選んでください。pdfはReadFileで内容を確認してください。文献ページは、読者の理解が促進されるように、十分な分量を記載するようにしてください。作業は止まらずに続けてください。" このプロンプトに従って作業を開始してください。