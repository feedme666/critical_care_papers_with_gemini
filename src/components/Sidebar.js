import React from 'react';
import './Sidebar.css';

const Sidebar = ({ selectedTags, setSelectedTags, selectedYear, setSelectedYear, radioNamePrefix = '' }) => {

  const allTags = {
    "臓器・疾患別": ["呼吸器系", "循環器系", "腎尿路系", "脳神経系", "消化器系", "内分泌・代謝系", "血液・免疫系", "皮膚・軟部組織系", "感染・炎症系", "外傷", "医療安全・倫理系", "その他"],
    "研究デザイン別": ["ランダム化比較試験", "コホート研究", "症例対照研究", "システマティックレビュー・メタアナリシス", "観察研究", "基礎研究", "ガイドライン・提言"]
  };

  const handleTagChange = (tag) => {
    setSelectedTags(prevSelectedTags =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter(t => t !== tag)
        : [...prevSelectedTags, tag]
    );
  };

  return (
    <div className="sidebar-sticky">
      <div className="mb-4">
        <h5>タグで絞り込み</h5>
        {Object.entries(allTags).map(([category, tags]) => (
          <div key={category} className="mb-3">
            <strong>{category}</strong>
            {tags.map(tag => (
              <div key={tag} className="form-check">
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
        <h5>登録年で絞り込み</h5>
        {['すべて', '2023', '2024', '2025'].map(year => (
          <div key={year} className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name={`${radioNamePrefix}registrationYear`}
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
    </div>
  );
};

export default Sidebar;