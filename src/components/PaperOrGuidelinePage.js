import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { loadPaperDetail } from '../data/papers';
import PaperPage from './PaperPage';
import GuidelinePage from './GuidelinePage';
import { Spinner } from 'react-bootstrap';

const PaperOrGuidelinePage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    loadPaperDetail(parseInt(id, 10)).then(paperData => {
      setData(paperData);
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">読み込み中...</span>
        </Spinner>
      </div>
    );
  }

  if (!data) {
    return <div className="container mt-4">コンテンツが見つかりません。</div>;
  }

  if (data.type === 'guideline') {
    return <GuidelinePage data={data} />;
  } else if (data.type === 'paper') {
    return <PaperPage data={data} />;
  } else {
    return <div className="container mt-4">不明なコンテンツタイプです。</div>;
  }
};

export default PaperOrGuidelinePage;
