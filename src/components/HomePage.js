import React, { useState } from 'react';
import metadata from '../data/papers/metadata.json';
import { Row } from 'react-bootstrap';
import PaperDetailModal from './PaperDetailModal';
import FilterablePaperList from './FilterablePaperList';

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);

  const handleCardClick = (paper) => {
    setSelectedPaper(paper);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPaper(null);
  };

  return (
    <div className="container-fluid mt-4">
      <p className="text-muted text-end mb-1">最終更新日: {metadata.lastUpdatedAt}</p>
      <FilterablePaperList onCardClick={handleCardClick} />
      <PaperDetailModal show={showModal} onHide={handleCloseModal} paper={selectedPaper} />
    </div>
  );
};

export default HomePage;