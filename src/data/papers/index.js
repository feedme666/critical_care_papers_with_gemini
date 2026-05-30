import papersSummary from './papers_summary.json';

// 一覧表示やフィルタリング用の軽量なデータリスト
const papers = papersSummary;

// 特定の論文の詳細データを動的にインポートする関数
// WebpackのCode Splitting機能により、ビルド時に自動で各JSONファイルが分割されます
export const loadPaperDetail = async (id) => {
  try {
    const module = await import(`./paper_${id}.json`);
    return module.default;
  } catch (error) {
    console.error(`Failed to load paper detail for id ${id}:`, error);
    return null;
  }
};

export default papers;