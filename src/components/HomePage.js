import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import metadata from '../data/papers/metadata.json';
import PaperDetailModal from './PaperDetailModal';
import FilterablePaperList from './FilterablePaperList';
import { loadPaperDetail } from '../data/papers'; // 非同期インポート用の関数

const HomePage = () => {
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation(); // locationオブジェクトを取得

  // URLに基づいてモーダルを開く
  useEffect(() => {
    if (id) {
      const paperId = parseInt(id, 10);
      setIsLoadingDetail(true);
      loadPaperDetail(paperId).then(paper => {
        if (paper) {
          setSelectedPaper(paper);
        } else {
          // 論文が見つからない場合はホームページにリダイレクト
          navigate(`/${location.search}`, { replace: true });
        }
        setIsLoadingDetail(false);
      });
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
        show={!!selectedPaper || isLoadingDetail} 
        onHide={handleCloseModal} 
        paper={selectedPaper} 
        isLoading={isLoadingDetail}
      />
    </div>
  );
};

export default HomePage;