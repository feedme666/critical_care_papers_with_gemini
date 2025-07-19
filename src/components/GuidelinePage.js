import React from 'react';
import { useParams } from 'react-router-dom';
import papers from '../data/papers'; // 論文データをインポート

const GuidelinePage = ({ data }) => {

  if (!data) {
    return <div>ガイドラインが見つかりません。</div>;
  }

  return (
    <div className="container mt-4">
      <article>
        <header>
          <h2>{data.題名}</h2>
          {data.original_title && <p className="text-muted">Original Title: {data.original_title}</p>}
          <p><strong>作成団体:</strong> {data.作成団体}</p>
          <p className="text-muted">{data.雑誌名_巻号_出版年_ページ}</p>
          {data.pmid && (
            <p><strong>PMID:</strong> <a href={data.pubmed_link} target="_blank" rel="noopener noreferrer">{data.pmid}</a></p>
          )}
          <div>
            {data.タグ && data.タグ.map(tag => (
              <span key={tag} className="badge bg-primary me-1">{tag}</span>
            ))}
          </div>
        </header>

        <hr />

        <section className="my-4">
          <h4>概要</h4>
          <p>{data.概要}</p>
        </section>

        <section className="my-4">
          <h4>対象</h4>
          <p>{data.対象}</p>
        </section>

        <section className="my-4">
          <h4>作成プロセス</h4>
          <ul className="list-group">
            <li className="list-group-item"><strong>開発方法論:</strong> {data.作成プロセス && data.作成プロセス.開発方法論}</li>
            <li className="list-group-item"><strong>検索戦略と選定基準:</strong> {data.作成プロセス && data.作成プロセス.検索戦略と選定基準}</li>
          </ul>
        </section>

        <section className="my-4">
          <h4>{data.推奨事項 && data.推奨事項.title}</h4>
          {data.推奨事項 && data.推奨事項.recommendations && data.推奨事項.recommendations.map((rec, index) => (
            <div key={index} className="card mb-3">
              <div className="card-header">Clinical Question: {rec.cq}</div>
              <div className="card-body">
                <p className="card-text"><strong>推奨文:</strong> {rec.recommendation_statement}</p>
                <p className="card-text"><strong>推奨の強さ:</strong> {rec.strength_of_recommendation}</p>
                <p className="card-text"><strong>エビデンスのレベル:</strong> {rec.level_of_evidence}</p>
                {rec.remarks && <p className="card-text"><strong>補足事項:</strong> {rec.remarks}</p>}
              </div>
            </div>
          ))}
        </section>

        <section className="my-4">
          <h4>{data.ガイドラインの批判的吟味 && data.ガイドラインの批判的吟味.title}</h4>
          {data.ガイドラインの批判的吟味 && data.ガイドラインの批判的吟味.points && data.ガイドラインの批判的吟味.points.map((point, index) => (
            <div key={index} className="card mb-3">
              <div className="card-header">{point.subtitle}</div>
              <div className="card-body">
                <p className="card-text">{point.content}</p>
              </div>
            </div>
          ))}
        </section>

        {data.主要な改訂点 && (
          <section className="my-4">
            <h4>主要な改訂点</h4>
            <p>{data.主要な改訂点}</p>
          </section>
        )}

      </article>
    </div>
  );
};

export default GuidelinePage;
