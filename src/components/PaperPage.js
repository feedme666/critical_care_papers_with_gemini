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

const PaperPage = ({ data }) => {

  if (!data) {
    return <div>論文が見つかりません。</div>;
  }

  // 音声ファイルは動的にrequireする
  // requireは失敗する可能性があるため、try-catchで囲む
  let audioSrc = null;
  try {
    audioSrc = require(`../assets/audios/paper_${data.id}.mp3`);
  } catch (e) {
    console.warn(`音声ファイルが見つかりません: paper_${data.id}.mp3`);
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
          <h2>{data.題名}</h2>
          {data.original_title && <p className="text-muted">Original Title: {data.original_title}</p>}
          <p className="text-muted">{data.雑誌名_巻号_出版年_ページ}</p>
          <p><strong>筆頭著者:</strong> {data.筆頭著者}</p>
          {data.pmid && (
            <p><strong>PMID:</strong> <a href={data.pubmed_link} target="_blank" rel="noopener noreferrer">{data.pmid}</a></p>
          )}
          <div>
            {data.タグ && data.タグ.map(tag => (
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
            <li className="list-group-item"><strong>Patient:</strong> {data.PICO && data.PICO.P}</li>
            <li className="list-group-item"><strong>Intervention:</strong> {data.PICO && data.PICO.I}</li>
            <li className="list-group-item"><strong>Comparison:</strong> {data.PICO && data.PICO.C}</li>
            <li className="list-group-item"><strong>Outcome:</strong> {data.PICO && data.PICO.O}</li>
          </ul>
        </section>

        <section className="my-4">
          <h4>要約</h4>
          <p>{data.要約}</p>
        </section>

        <section className="my-4">
          <h4>結果</h4>
          <p>{data.結果}</p>
          <div style={{ maxWidth: '600px', margin: 'auto' }}>
            {data.chartData && (
              <Bar options={chartOptions} data={data.chartData} />
            )}
          </div>
        </section>

        <section className="my-4">
          <h4>考察</h4>
          <p>{data.考察}</p>
        </section>

        <section className="my-4">
          <h4>{data.批判的吟味 && data.批判的吟味.title}</h4>
          {data.批判的吟味 && data.批判的吟味.points && data.批判的吟味.points.map((point, index) => (
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
