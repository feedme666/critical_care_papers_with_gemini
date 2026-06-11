const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/data/papers');
const files = fs.readdirSync(dir);

const summary = [];

files.forEach(file => {
  if (file.startsWith('paper_') && file.endsWith('.json')) {
    const filePath = path.join(dir, file);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      
      // 必要なプロパティを抽出
      const summaryItem = {
        id: data.id,
        type: data.type || (data.PICO ? 'paper' : 'guideline'),
        題名: data.題名,
        original_title: data.original_title,
        筆頭著者: data.筆頭著者 || null,
        作成団体: data.作成団体 || null,
        雑誌名_巻号_出版年_ページ: data.雑誌名_巻号_出版年_ページ || data.雑誌名巻号出版年_ページ || null,
        雑誌名巻号出版年_ページ: data.雑誌名巻号出版年_ページ || data.雑誌名_巻号_出版年_ページ || null,
        登録日: data.登録日,
        タグ: data.タグ || [],
        pmid: data.pmid || null,
        pubmed_link: data.pubmed_link || null
      };

      if (data.研究の種類) {
        summaryItem.研究の種類 = data.研究の種類;
      }
      
      summary.push(summaryItem);
    } catch (e) {
      console.error(`Failed to process ${file}:`, e);
    }
  }
});

// ID順にソートして綺麗にする
summary.sort((a, b) => a.id - b.id);

const summaryPath = path.join(dir, 'papers_summary.json');
fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf8');
console.log(`Successfully generated ${summaryPath} with ${summary.length} items.`);
