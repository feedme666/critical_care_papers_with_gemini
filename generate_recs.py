import json

recs = [
  {
    "cq": "血管収縮薬",
    "recommendation_statement": "敗血症性ショックの成人患者において、ドパミン、エピネフリン、またはセレプレシンよりも第一選択薬としてノルエピネフリンを使用することを「推奨」する。",
    "strength_of_recommendation": "強い推奨",
    "level_of_evidence": "高い〜低い",
    "remarks": None
  },
  {
    "cq": "血管収縮薬",
    "recommendation_statement": "敗血症性ショックの成人患者において、テルリプレシンの使用を「行わないよう提案」する。",
    "strength_of_recommendation": "条件付き推奨",
    "level_of_evidence": "低い",
    "remarks": None
  },
  {
    "cq": "血管収縮薬",
    "recommendation_statement": "敗血症性ショックの成人患者において、バソプレシンまたはアンジオテンシンIIよりも第一選択薬としてノルエピネフリンを使用することを「提案」する。",
    "strength_of_recommendation": "条件付き推奨",
    "level_of_evidence": "低い〜非常に低い",
    "remarks": None
  },
  {
    "cq": "血管収縮薬",
    "recommendation_statement": "ノルエピネフリンが増量されている敗血症性ショックの成人患者において、バソプレシンを追加することを「提案」する。",
    "strength_of_recommendation": "条件付き推奨",
    "level_of_evidence": "中程度",
    "remarks": None
  },
  {
    "cq": "血管収縮薬",
    "recommendation_statement": "ノルエピネフリンおよびバソプレシンを使用しても平均動脈圧（MAP）が不十分な敗血症性ショックの成人患者において、エピネフリンを追加することを「提案」する。",
    "strength_of_recommendation": "条件付き推奨",
    "level_of_evidence": "非常に低い",
    "remarks": "バソプレシンが利用できない環境では、ノルエピネフリン単独にエピネフリンを追加することができる。"
  },
  {
    "cq": "血管収縮薬",
    "recommendation_statement": "心機能障害を合併する敗血症性ショックの成人患者において、第一選択の血管収縮薬としてノルエピネフリンまたはエピネフリンのいずれかを使用することを「提案」する。",
    "strength_of_recommendation": "条件付き推奨",
    "level_of_evidence": "非常に低い",
    "remarks": "頻脈性不整脈または有意な洞性頻脈を有する患者ではノルエピネフリンが好ましい場合がある。逆に、徐脈性不整脈または有意な洞性徐脈を有する患者ではエピネフリンが好ましい場合がある。"
  },
  {
    "cq": "メチレンブルー",
    "recommendation_statement": "難治性の敗血症性ショックで血管収縮薬の必要量が増加している成人患者に対して、静注メチレンブルーの使用を推奨するための「十分なエビデンスはない」。",
    "strength_of_recommendation": "推奨なし",
    "level_of_evidence": None,
    "remarks": "メチレンブルーは血圧を改善する可能性があるが、レスキュー療法としての使用が生存率を改善するかどうかを判断するための十分なエビデンスはない。治療可能な疾患の可能性がある患者の中には、試みる価値を見出す者もいるかもしれない。「我々の診療では」、パネリストの69%はレスキュー療法としてメチレンブルーを「全く」または「ほとんど」使用せず、23%が「時々」使用し、6%が「通常」使用し、1.5%が「ほぼ常に」使用している。"
  },
  {
    "cq": "強心薬",
    "recommendation_statement": "適切な輸液状態および動脈圧にもかかわらず持続的な低灌流を伴う心機能障害を有する敗血症性ショックの成人患者において、強心薬を使用しないことよりも強心薬を使用することを「提案」する。",
    "strength_of_recommendation": "条件付き推奨",
    "level_of_evidence": "非常に低い",
    "remarks": "目標の平均動脈圧を維持するために血管収縮薬を必要とする患者に対しては、血管収縮薬の「代わりに」ではなく、「追加して」強心薬を使用すべきである。"
  },
  {
    "cq": "強心薬",
    "recommendation_statement": "適切な輸液蘇生および動脈圧にもかかわらず持続的な低灌流と心機能障害を有する敗血症性ショックの成人患者において、ノルエピネフリンにドブタミンを追加するか、またはエピネフリンを単独で使用することを「提案」する。",
    "strength_of_recommendation": "条件付き推奨",
    "level_of_evidence": "非常に低い",
    "remarks": "ドブタミンとミルリノンの比較に関する推奨を行うにはデータが不十分であった。"
  },
  {
    "cq": "強心薬",
    "recommendation_statement": "適切な循環血液量および動脈圧にもかかわらず持続的な低灌流を伴う心機能障害を有する敗血症性ショックの成人患者において、レボシメンダンの使用を「行わないよう提案」する。",
    "strength_of_recommendation": "条件付き推奨",
    "level_of_evidence": "低い",
    "remarks": None
  },
  {
    "cq": "ミドドリン",
    "recommendation_statement": "血管収縮薬を継続して必要とする敗血症性ショックの成人患者において、経口ミドドリンの使用に関する推奨を行うための「十分なエビデンスはない」。",
    "strength_of_recommendation": "推奨なし",
    "level_of_evidence": None,
    "remarks": None
  },
  {
    "cq": "β遮断薬",
    "recommendation_statement": "敗血症性ショックの成人患者において、敗血症性ショックの治療としてβ遮断薬を使用することを「行わないよう提案」する。",
    "strength_of_recommendation": "条件付き推奨",
    "level_of_evidence": "非常に低い",
    "remarks": "この推奨は、敗血症性ショックの治療として処方された短時間作用型の静注β遮断薬（エスモロールおよびランジオロール）のエビデンスに基づいている。"
  },
  {
    "cq": "低酸素血症のモニタリング",
    "recommendation_statement": "敗血症の成人患者において、身体診察および臨床的洞察と併せて、パルスオキシメーター（SpO2）または動脈血ガス（SaO2）のいずれかによって酸素化を測定することを「提案」する。",
    "strength_of_recommendation": "条件付き推奨",
    "level_of_evidence": "非常に低い",
    "remarks": "動脈血ガス測定は酸素化を評価するためのゴールドスタンダードであり、pH、PaCO2、乳酸、重炭酸塩などの他の重要な情報を含み、利用可能な場合は好ましい。パルスオキシメーターによるSpO2/FiO2はPaO2/FiO2比の代わりになり得るが、ショック状態の患者、肌の色が濃い患者、および/または酸素飽和度が90%未満または97%を超える患者では精度が低い。"
  },
  {
    "cq": "酸素化の目標",
    "recommendation_statement": "敗血症および急性低酸素血症性呼吸不全の成人患者において、患者の要因およびリソースの制限に応じて、より高いリベラルな酸素化目標またはより低い保守的な酸素化目標のいずれかをターゲットとしてFiO2を滴定することを「提案」する。",
    "strength_of_recommendation": "条件付き推奨",
    "level_of_evidence": "低い",
    "remarks": "この推奨の根拠となった試験間でばらつきがあったが、多くは下限目標として約90〜93%のSpO2、上限目標としてSpO2 96%以上を使用していた。「我々の診療では」、パネリストは敗血症および急性低酸素血症性呼吸不全の患者に対して90%（IQR 90〜92%）から96%（IQR 94〜98%）の間のSpO2を目標としている。"
  },
  {
    "cq": "非侵襲的呼吸管理",
    "recommendation_statement": "敗血症および急性低酸素血症性呼吸不全の成人患者において、従来の酸素療法よりもネーザルハイフロー（HFNC）療法を使用することを「提案」する。",
    "strength_of_recommendation": "条件付き推奨",
    "level_of_evidence": "非常に低い",
    "remarks": "この推奨は、PaO2/FiO2比が200未満またはSpO2/FiO2比が235未満の患者に関するものである。"
  },
  {
    "cq": "非侵襲的呼吸管理",
    "recommendation_statement": "敗血症および急性低酸素血症性呼吸不全の成人患者において、非侵襲的陽圧換気（NIPPV）よりもHFNCを初期治療として使用することを「提案」する。",
    "strength_of_recommendation": "条件付き推奨",
    "level_of_evidence": "低い",
    "remarks": None
  },
  {
    "cq": "非侵襲的呼吸管理",
    "recommendation_statement": "敗血症および急性低酸素血症性呼吸不全の成人患者において、HFNCと非侵襲的陽圧換気（NIPPV）を交互に行うよりもHFNCを単独で使用することを「提案」する。",
    "strength_of_recommendation": "条件付き推奨",
    "level_of_evidence": "非常に低い",
    "remarks": None
  },
  {
    "cq": "覚醒下腹臥位療法",
    "recommendation_statement": "挿管されていない敗血症および急性低酸素血症性呼吸不全の成人患者において、覚醒下腹臥位療法の試みを「提案」する。",
    "strength_of_recommendation": "条件付き推奨",
    "level_of_evidence": "非常に低い",
    "remarks": "腹臥位の期間および頻度は患者の忍容性に依存する。非挿管患者において腹臥位の忍容性を高める目的で鎮静を使用すべきではない。"
  },
  {
    "cq": "侵襲的機械換気",
    "recommendation_statement": "敗血症およびARDSの成人患者において、高一回換気量（> 10 mL/kg）戦略よりも低一回換気量換気戦略（6 mL/kg）を使用することを「推奨」する。",
    "strength_of_recommendation": "強い推奨",
    "level_of_evidence": "高い",
    "remarks": None
  },
  {
    "cq": "侵襲的機械換気",
    "recommendation_statement": "ARDSを伴わない敗血症関連の低酸素血症性呼吸不全の成人患者において、より低い一回換気量（4から6 mL/kg未満の予測体重[IBW]）よりも、6〜8 mL/kg IBWの一回換気量を使用することを「提案」する。",
    "strength_of_recommendation": "条件付き推奨",
    "level_of_evidence": "低い",
    "remarks": "臨床現場ではARDSの診断が見逃されたり遅れたりすることが多いため、患者はARDSの発症について定期的にスクリーニングされるべきである。"
  },
  {
    "cq": "侵襲的機械換気",
    "recommendation_statement": "敗血症およびARDSの成人患者において、より高いプラトー圧よりも、プラトー圧の上限目標を30 cmH2Oとして使用することを「推奨」する。",
    "strength_of_recommendation": "強い推奨",
    "level_of_evidence": "高い",
    "remarks": None
  },
  {
    "cq": "侵襲的機械換気",
    "recommendation_statement": "敗血症および中等症から重症のARDSの成人患者において、低いPEEPよりも高い呼気終末陽圧（PEEP）を使用することを「提案」する。",
    "strength_of_recommendation": "条件付き推奨",
    "level_of_evidence": "中程度",
    "remarks": None
  },
  {
    "cq": "侵襲的機械換気",
    "recommendation_statement": "敗血症および中等症から重症のARDSの成人患者において、漸増的なPEEP滴定戦略の使用を「行わないよう推奨」する。",
    "strength_of_recommendation": "強い推奨",
    "level_of_evidence": "中程度",
    "remarks": None
  },
  {
    "cq": "侵襲的機械換気",
    "recommendation_statement": "敗血症および中等症から重症のARDSの成人患者において、1日12時間以上の腹臥位換気を使用することを「提案」する。",
    "strength_of_recommendation": "条件付き推奨",
    "level_of_evidence": "中程度",
    "remarks": None
  },
  {
    "cq": "侵襲的機械換気",
    "recommendation_statement": "敗血症および中等症から重症のARDSの成人患者において、持続的な神経筋遮断薬（NMBA）の注入よりも、NMBAの間欠的ボーラス投与を使用することを「提案」する。",
    "strength_of_recommendation": "条件付き推奨",
    "level_of_evidence": "中程度",
    "remarks": None
  },
  {
    "cq": "静脈脱血静脈送血ECMO",
    "recommendation_statement": "敗血症による重症ARDSの成人患者において、従来の機械換気が失敗した場合には、その使用をサポートするインフラが整った経験豊富な施設で静脈脱血静脈送血（veno-venous）ECMOを使用することを「提案」する。",
    "strength_of_recommendation": "条件付き推奨",
    "level_of_evidence": "低い",
    "remarks": None
  }
]

with open("recs_53_78.json", "w", encoding="utf-8") as f:
    json.dump(recs, f, ensure_ascii=False, indent=2)

