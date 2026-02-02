import React from 'react';


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
          <p style={{ whiteSpace: 'pre-wrap' }}>{data.概要.replace(/\\n/g, '\n')}</p>
        </section>

        <section className="my-4">
          <h4>対象</h4>
          <p style={{ whiteSpace: 'pre-wrap' }}>{data.対象.replace(/\\n/g, '\n')}</p>
        </section>

        <section className="my-4">
          <h4>作成プロセス</h4>
          <ul className="list-group">
            <li className="list-group-item" style={{ whiteSpace: 'pre-wrap' }}><strong>開発方法論:</strong> {data.作成プロセス && data.作成プロセス.開発方法論.replace(/\\n/g, '\n')}</li>
            <li className="list-group-item" style={{ whiteSpace: 'pre-wrap' }}><strong>検索戦略と選定基準:</strong> {data.作成プロセス && data.作成プロセス.検索戦略と選定基準.replace(/\\n/g, '\n')}</li>
          </ul>
        </section>

        <section className="my-4">
          <h4>{data.推奨事項 && data.推奨事項.title}</h4>
          {data.推奨事項 && data.推奨事項.recommendations && data.推奨事項.recommendations.map((rec, index) => (
            <div key={index} className="card mb-3">
              <div className="card-header">Clinical Question: {rec.cq}</div>
              <div className="card-body">
                <p className="card-text" style={{ whiteSpace: 'pre-wrap' }}><strong>推奨文:</strong> {rec.recommendation_statement.replace(/\\n/g, '\n')}</p>
                <p className="card-text"><strong>推奨の強さ:</strong> {rec.strength_of_recommendation}</p>
                <p className="card-text"><strong>エビデンスのレベル:</strong> {rec.level_of_evidence}</p>
                {rec.remarks && <p className="card-text" style={{ whiteSpace: 'pre-wrap' }}><strong>補足事項:</strong> {rec.remarks.replace(/\\n/g, '\n')}</p>}
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
                <p className="card-text" style={{ whiteSpace: 'pre-wrap' }}>{point.content.replace(/\\n/g, '\n')}</p>
              </div>
            </div>
          ))}
        </section>

        {data.checklist && (
          <section className="my-4">
            <h4>{data.checklist.title}</h4>
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <tbody>
                  {data.checklist.sections && data.checklist.sections.map((section, sIndex) => (
                    <React.Fragment key={sIndex}>
                      <tr className="table-secondary">
                        <th colSpan="1">{section.section_title}</th>
                      </tr>
                      {section.items && section.items.map((item, iIndex) => (
                        <tr key={iIndex}>
                          <td style={{ whiteSpace: 'pre-wrap' }}>{item}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {data.主要な改訂点 && (
          <section className="my-4">
            <h4>主要な改訂点</h4>
            <p style={{ whiteSpace: 'pre-wrap' }}>{data.主要な改訂点.replace(/\\n/g, '\n')}</p>
          </section>
        )}

      </article>
    </div>
  );
};

export default GuidelinePage;
