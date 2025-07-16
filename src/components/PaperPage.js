import React from 'react';
import { useParams } from 'react-router-dom';
import papers from '../data/papers'; // 論文データをインポート
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PaperPage = () => {
  const { id } = useParams();
  const currentPaper = papers.find(p => p.id === parseInt(id));

  if (!currentPaper) {
    return <div>論文が見つかりません。</div>;
  }

  // 音声ファイルは動的にrequireする
  // requireは失敗する可能性があるため、try-catchで囲む
  let audioSrc = null;
  try {
    audioSrc = require(`../assets/audios/paper_${currentPaper.id}.mp3`);
  } catch (e) {
    console.warn(`音声ファイルが見つかりません: paper_${currentPaper.id}.mp3`);
  }


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
    <div className="container mt-4">
      <article>
        <header>
          <h2>{currentPaper.題名}</h2>
          {currentPaper.original_title && <p className="text-muted">Original Title: {currentPaper.original_title}</p>}
          <p className="text-muted">{currentPaper.雑誌名_巻号_出版年_ページ}</p>
          <p><strong>筆頭著者:</strong> {currentPaper.筆頭著者}</p>
          {currentPaper.pmid && (
            <p><strong>PMID:</strong> <a href={currentPaper.pubmed_link} target="_blank" rel="noopener noreferrer">{currentPaper.pmid}</a></p>
          )}
          <div>
            {currentPaper.タグ && currentPaper.タグ.map(tag => (
              <span key={tag} className="badge bg-primary me-1">{tag}</span>
            ))}
          </div>
          {audioSrc && (
            <div className="my-3">
              <h5>音声で聴く</h5>
              <audio controls src={audioSrc}>
                お使いのブラウザは音声再生に対応していません。
              </audio>
            </div>
          )}
        </header>

        <hr />

        <section className="my-4">
          <h4>PICO</h4>
          <ul className="list-group">
            <li className="list-group-item"><strong>Patient:</strong> {currentPaper.PICO && currentPaper.PICO.P}</li>
            <li className="list-group-item"><strong>Intervention:</strong> {currentPaper.PICO && currentPaper.PICO.I}</li>
            <li className="list-group-item"><strong>Comparison:</strong> {currentPaper.PICO && currentPaper.PICO.C}</li>
            <li className="list-group-item"><strong>Outcome:</strong> {currentPaper.PICO && currentPaper.PICO.O}</li>
          </ul>
        </section>

        <section className="my-4">
          <h4>要約</h4>
          <p>{currentPaper.要約}</p>
        </section>

        <section className="my-4">
          <h4>結果</h4>
          <p>{currentPaper.結果}</p>
          <div style={{ maxWidth: '600px', margin: 'auto' }}>
            {currentPaper.chartData && (
              <Bar options={chartOptions} data={currentPaper.chartData} />
            )}
          </div>
        </section>

        <section className="my-4">
          <h4>考察</h4>
          <p>{currentPaper.考察}</p>
        </section>

        <section className="my-4">
          <h4>{currentPaper.批判的吟味 && currentPaper.批判的吟味.title}</h4>
          {currentPaper.批判的吟味 && currentPaper.批判的吟味.points && currentPaper.批判的吟味.points.map((point, index) => (
            <div key={index} className="card mb-3">
              <div className="card-header">{point.subtitle}</div>
              <div className="card-body">
                <p className="card-text">{point.content}</p>
              </div>
            </div>
          ))}
        </section>

      </article>
    </div>
  );
};

export default PaperPage;
