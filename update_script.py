import json
import os

# Update metadata
with open('src/data/papers/metadata.json', 'r', encoding='utf-8') as f:
    meta = json.load(f)

new_id = meta['lastId'] + 1
meta['lastId'] = new_id
meta['lastUpdatedAt'] = "2026-04-02"

with open('src/data/papers/metadata.json', 'w', encoding='utf-8') as f:
    json.dump(meta, f, indent=2, ensure_ascii=False)

# Update papers_summary
with open('src/data/papers/papers_summary.json', 'r', encoding='utf-8') as f:
    summary = json.load(f)

summary.append({
  "id": new_id,
  "登録日": "2026-04-02",
  "original_title": "A Randomized Trial of Targeted Hyponatremia Correction in Hospitalized Patients",
  "雑誌名巻号出版年_ページ": "NEJM Evid. 2026 Mar;5(3):EVIDoa2500086.",
  "pmid": 41733398,
  "pubmed_link": "https://pubmed.ncbi.nlm.nih.gov/41733398"
})

with open('src/data/papers/papers_summary.json', 'w', encoding='utf-8') as f:
    json.dump(summary, f, indent=2, ensure_ascii=False)

print(new_id)
