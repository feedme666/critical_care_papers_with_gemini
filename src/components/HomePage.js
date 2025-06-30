import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import papers from '../data/papers'; // 論文データをインポート

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPapers = papers.filter(p => {
    if (!p.題名) {
      return false;
    }
    const titleMatch = p.題名.toLowerCase().includes(searchTerm.toLowerCase());
    const authorMatch = p.筆頭著者 && p.筆頭著者.toLowerCase().includes(searchTerm.toLowerCase());
    const journalMatch = p.雑誌名_巻号_出版年_ページ && p.雑誌名_巻号_出版年_ページ.toLowerCase().includes(searchTerm.toLowerCase());
    const tagsMatch = p.タグ && p.タグ.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return titleMatch || authorMatch || journalMatch || tagsMatch;
  });

  return (
    <div className="container mt-4">
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

      <h2>神戸市立医療センター中央市民病院ICU 勉強会データベース</h2>
      <h3>〜 論文一覧 〜</h3>
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