import React from 'react';
import { Link } from 'react-router-dom';
import { useFilter } from '../context/FilterContext'; // useFilterをインポート
import papers from '../data/papers'; // 論文データをインポート
import metadata from '../data/papers/metadata.json'; // metadata.jsonをインポート

const HomePage = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedTags,
    setSelectedTags,
    sortOrder,
    setSortOrder,
    selectedYear,
    setSelectedYear,
  } = useFilter();

  const allTags = {
    "臓器・疾患別": ["呼吸器系", "循環器系", "腎尿路系", "脳神経系", "消化器系", "内分泌・代謝系", "血液・免疫系", "皮膚・軟部組織系", "感染・炎症系", "医療安全・倫理系", "その他"],
    "研究デザイン別": ["ランダム化比較試験", "コホート研究", "症例対照研究", "システマティックレビュー・メタアナリシス", "観察研究", "基礎研究", "ガイドライン・提言"]
  };

  const handleTagChange = (tag) => {
    setSelectedTags(prevSelectedTags =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter(t => t !== tag)
        : [...prevSelectedTags, tag]
    );
  };

  const filteredPapers = papers
    .filter(p => {
      if (!p.題名) {
        return false;
      }

      // キーワード検索
      const titleMatch = p.題名.toLowerCase().includes(searchTerm.toLowerCase());
      const authorMatch = p.筆頭著者 && p.筆頭著者.toLowerCase().includes(searchTerm.toLowerCase());
      const journalMatch = p.雑誌名_巻号_出版年_ページ && p.雑誌名_巻号_出版年_ページ.toLowerCase().includes(searchTerm.toLowerCase());
      const tagsSearchMatch = p.タグ && p.タグ.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const keywordMatch = titleMatch || authorMatch || journalMatch || tagsSearchMatch;

      // タグフィルタリング
      const tagFilterMatch = selectedTags.length === 0 ||
                             (p.タグ && selectedTags.every(selectedTag => p.タグ.includes(selectedTag)));

      // 登録年フィルタリング
      const yearFilterMatch = selectedYear === 'すべて' || (p.登録日 && p.登録日.startsWith(selectedYear));

      return keywordMatch && tagFilterMatch && yearFilterMatch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.登録日);
      const dateB = new Date(b.登録日);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    }); // 登録日で昇順または降順にソート

  const toggleSortOrder = () => {
    setSortOrder(prevSortOrder => (prevSortOrder === 'desc' ? 'asc' : 'desc'));
  };

  return (
    <div className="container mt-4">
      <p className="text-muted text-end mb-1">最終更新日: {metadata.lastUpdatedAt}</p>
      <div className="row mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="キーワードで論文を検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <button className="btn btn-primary w-100" onClick={() => { /* 検索ボタンはonChangeでリアルタイム検索されるため、ここでは特に処理は不要 */ }}>検索</button>
        </div>
      </div>

      <div className="mb-4">
        <h5>- タグで絞り込み</h5>
        {Object.entries(allTags).map(([category, tags]) => (
          <div key={category} className="mb-2">
            <strong>{category}: </strong>
            {tags.map(tag => (
              <div key={tag} className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`tag-${tag}`}
                  value={tag}
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagChange(tag)}
                />
                <label className="form-check-label" htmlFor={`tag-${tag}`}>
                  {tag}
                </label>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h5>- 登録年で絞り込み</h5>
        {['すべて', '2023', '2024', '2025'].map(year => (
          <div key={year} className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="registrationYear"
              id={`year-${year}`}
              value={year}
              checked={selectedYear === year}
              onChange={(e) => setSelectedYear(e.target.value)}
            />
            <label className="form-check-label" htmlFor={`year-${year}`}>
              {year}
            </label>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">論文一覧 （内容の正確性については適宜論文を参照のこと）</h4>
        <button className="btn btn-outline-secondary" onClick={toggleSortOrder}>
          登録日: {sortOrder === 'desc' ? '新しい順' : '古い順'}
        </button>
      </div>
      <div className="list-group">
        {filteredPapers.map((p) => {
          const paperId = p.id; // JSONのidプロパティを使用
          console.log('HomePage - Paper ID:', paperId, 'Title:', p.題名);

          return (
            <Link key={paperId} to={`/paper/${paperId}`} className="list-group-item list-group-item-action">
              <h5 className="mb-1">{p.題名}</h5>
              <p className="mb-1"><strong>筆頭著者:</strong> {p.筆頭著者}</p>
              <p className="mb-1"><strong>雑誌情報:</strong> {p.雑誌名_巻号_出版年_ページ}</p>
              <p className="mb-1"><strong>登録日:</strong> {p.登録日}</p>
              <div>
                {p.タグ && p.タグ.map(tag => (
                  <span key={tag} className="badge bg-secondary me-1">{tag}</span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;