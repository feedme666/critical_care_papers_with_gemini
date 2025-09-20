import React from 'react';
import { Modal, Button, Badge } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';

const PaperDetailModal = ({ show, onHide, paper }) => {
  if (!paper) return null;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '重要なポイント',
      },
    },
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered dialogClassName="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title>{paper.題名}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {paper.original_title && <p className="text-muted">Original Title: {paper.original_title}</p>}
        <p className="text-muted">{paper.雑誌名_巻号_出版年_ページ}</p>
        <p><strong>{paper.type === 'guideline' ? '作成団体:' : '筆頭著者:'}</strong> {paper.type === 'guideline' ? paper.作成団体 : paper.筆頭著者}</p>
        {paper.pmid && (
          <p><strong>PMID:</strong> <a href={paper.pubmed_link} target="_blank" rel="noopener noreferrer">{paper.pmid}</a></p>
        )}
        <div>
          {paper.タグ && paper.タグ.map(tag => (
            <Badge bg="primary" key={tag} className="me-1">{tag}</Badge>
          ))}
        </div>
        <hr />

        {/* 研究論文のセクション */}
        {paper.type === 'paper' && paper.PICO && (
          <section className="my-4">
            <h4>PICO</h4>
            <ul className="list-group">
              <li className="list-group-item"><strong>Patient:</strong> {paper.PICO.P}</li>
              <li className="list-group-item"><strong>Intervention:</strong> {paper.PICO.I}</li>
              <li className="list-group-item"><strong>Comparison:</strong> {paper.PICO.C}</li>
              <li className="list-group-item"><strong>Outcome:</strong> {paper.PICO.O}</li>
            </ul>
          </section>
        )}

        <section className="my-4">
          <h4>{paper.type === 'guideline' ? '概要' : '要約'}</h4>
          <p>{paper.type === 'guideline' ? paper.概要 : paper.要約}</p>
        </section>

        {paper.type === 'paper' && paper.結果 && (
            <section className="my-4">
                <h4>結果</h4>
                <p>{paper.結果}</p>
                <div style={{ maxWidth: '600px', margin: 'auto' }}>
                  {/* 新しい 'charts' 配列形式に対応 */}
                  {paper.charts && Array.isArray(paper.charts) && paper.charts.map((chart, index) => (
                    <div key={index} className="mb-4">
                      <h5>{chart.title}</h5>
                      <Bar options={{...chartOptions, plugins: {...chartOptions.plugins, title: {...chartOptions.plugins.title, text: chart.title}}}} data={chart.chartData} />
                    </div>
                  ))}

                  {/* 古い 'chartData' オブジェクト形式にフォールバック */}
                  {!paper.charts && paper.chartData && (
                    <Bar options={chartOptions} data={paper.chartData} />
                  )}
                </div>
            </section>
        )}

        {paper.type === 'paper' && paper.考察 && (
            <section className="my-4">
                <h4>考察</h4>
                <p>{paper.考察}</p>
            </section>
        )}
        
        {/* ガイドラインのセクション */}
        {paper.type === 'guideline' && (
            <>
                <section className="my-4">
                    <h4>対象</h4>
                    <p>{paper.対象}</p>
                </section>

                <section className="my-4">
                    <h4>作成プロセス</h4>
                    <ul className="list-group">
                        <li className="list-group-item"><strong>開発方法論:</strong> {paper.作成プロセス?.開発方法論}</li>
                        <li className="list-group-item"><strong>検索戦略と選定基準:</strong> {paper.作成プロセス?.検索戦略と選定基準}</li>
                    </ul>
                </section>

                <section className="my-4">
                    <h4>{paper.推奨事項?.title}</h4>
                    {paper.推奨事項?.recommendations?.map((rec, index) => (
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
            </>
        )}


        {/* 共通のセクション (批判的吟味) */}
        {(paper.批判的吟味 || paper.ガイドラインの批判的吟味) && (
            <section className="my-4">
                <h4>{paper.批判的吟味?.title || paper.ガイドラインの批判的吟味?.title}</h4>
                {(paper.批判的吟味?.points || paper.ガイドラインの批判的吟味?.points)?.map((point, index) => (
                    <div key={index} className="card mb-3">
                        <div className="card-header">{point.subtitle}</div>
                        <div className="card-body">
                            <p className="card-text">{point.content}</p>
                        </div>
                    </div>
                ))}
            </section>
        )}

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          閉じる
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaperDetailModal;
