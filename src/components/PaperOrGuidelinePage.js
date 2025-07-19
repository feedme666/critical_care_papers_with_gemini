import React from 'react';
import { useParams } from 'react-router-dom';
import papers from '../data/papers';
import PaperPage from './PaperPage';
import GuidelinePage from './GuidelinePage';

const PaperOrGuidelinePage = () => {
  const { id } = useParams();
  const data = papers.find(p => p.id === parseInt(id));

  if (!data) {
    return <div>コンテンツが見つかりません。</div>;
  }

  if (data.type === 'guideline') {
    return <GuidelinePage data={data} />;
  } else if (data.type === 'paper') {
    return <PaperPage data={data} />;
  } else {
    return <div>不明なコンテンツタイプです。</div>;
  }
};

export default PaperOrGuidelinePage;
