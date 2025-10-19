import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import metadata from '../data/papers/metadata.json';
import PaperDetailModal from './PaperDetailModal';
import FilterablePaperList from './FilterablePaperList';
import allPapers from '../data/papers'; // すべての論文データをインポート

const HomePage = () => {
  const [selectedPaper, setSelectedPaper] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation(); // locationオブジェクトを取得

  // URLに基づいてモーダルを開く
  useEffect(() => {
    if (id) {
      const paperId = parseInt(id, 10);
      const paper = allPapers.find(p => p.id === paperId);
      if (paper) {
        setSelectedPaper(paper);
      } else {
        // 論文が見つからない場合はホームページにリダイレクト
        navigate(`/${location.search}`, { replace: true });
      }
    } else {
      setSelectedPaper(null);
    }
  }, [id, navigate, location.search]);

  const handleCardClick = useCallback((paper) => {
    // 現在のクエリパラメータを維持したままURLを変更
    navigate(`/paper/${paper.id}${location.search}`);
  }, [navigate, location.search]);

  const handleCloseModal = useCallback(() => {
    // 現在のクエリパラメータを維持したままURLをルートに戻す
    navigate(`/${location.search}`);
  }, [navigate, location.search]);

  return (
    <div className="container-fluid mt-4">
      <p className="text-muted text-end mb-1">最終更新日: {metadata.lastUpdatedAt}</p>
      <FilterablePaperList onCardClick={handleCardClick} />
      <PaperDetailModal 
        show={!!selectedPaper} 
        onHide={handleCloseModal} 
        paper={selectedPaper} 
      />
    </div>
  );
};

export default HomePage;