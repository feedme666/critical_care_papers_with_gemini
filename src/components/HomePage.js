import React, { useState, useEffect } from 'react';
import { useFilter } from '../context/FilterContext';
import papers from '../data/papers';
import metadata from '../data/papers/metadata.json';
import { Row, Col, Button, Offcanvas, Spinner } from 'react-bootstrap';
import { BsGridFill, BsList } from 'react-icons/bs';
import Sidebar from './Sidebar';
import PaperList from './PaperList';
import PaperDetailModal from './PaperDetailModal';

const HomePage = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedTags,
    sortOrder,
    setSortOrder,
    selectedYear,
  } = useFilter();

  const [isLoading, setIsLoading] = useState(true);
  const [layout, setLayout] = useState('grid'); // 'grid' or 'list'
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleShowOffcanvas = () => setShowOffcanvas(true);
  const handleCloseOffcanvas = () => setShowOffcanvas(false);

  const handleCardClick = (paper) => {
    setSelectedPaper(paper);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPaper(null);
  };

  const filteredPapers = papers
    .filter(p => {
      if (!p.題名) {
        return false;
      }

      const titleMatch = p.題名.toLowerCase().includes(searchTerm.toLowerCase());
      const authorMatch = p.筆頭著者 && p.筆頭著者.toLowerCase().includes(searchTerm.toLowerCase());
      const journalMatch = p.雑誌名_巻号_出版年_ページ && p.雑誌名_巻号_出版年_ページ.toLowerCase().includes(searchTerm.toLowerCase());
      const tagsSearchMatch = p.タグ && p.タグ.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const keywordMatch = titleMatch || authorMatch || journalMatch || tagsSearchMatch;
      const tagFilterMatch = selectedTags.length === 0 || (p.タグ && selectedTags.every(selectedTag => p.タグ.includes(selectedTag)));
      const yearFilterMatch = selectedYear === 'すべて' || (p.登録日 && p.登録日.startsWith(selectedYear));

      return keywordMatch && tagFilterMatch && yearFilterMatch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.登録日);
      const dateB = new Date(b.登録日);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const toggleSortOrder = () => {
    setSortOrder(prevSortOrder => (prevSortOrder === 'desc' ? 'asc' : 'desc'));
  };

  return (
    <div className="container-fluid mt-4">
      <p className="text-muted text-end mb-1">最終更新日: {metadata.lastUpdatedAt}</p>
      <Row>
        {/* Desktop Sidebar */}
        <Col md={3} className="d-none d-md-block">
          <Sidebar />
        </Col>

        {/* Main Content */}
        <Col md={9}>
          <div className="row mb-4">
            <div className="col-12 d-md-none mb-3">
              <Button variant="primary" className="w-100" onClick={handleShowOffcanvas}>
                フィルター（タップして絞り込みタグ表示）
              </Button>
            </div>
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="キーワードで論文を検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <button className="btn btn-primary w-100 d-none d-md-block" onClick={() => {}}>検索</button>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0 h5">論文一覧</h4>
            <div>
              <Button variant={layout === 'grid' ? 'primary' : 'outline-secondary'} size="sm" className="me-2" onClick={() => setLayout('grid')}><BsGridFill /></Button>
              <Button variant={layout === 'list' ? 'primary' : 'outline-secondary'} size="sm" className="me-2" onClick={() => setLayout('list')}><BsList /></Button>
              <Button variant="outline-secondary" size="sm" onClick={toggleSortOrder}>
                登録日: {sortOrder === 'desc' ? '新しい順' : '古い順'}
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <PaperList papers={filteredPapers} onCardClick={handleCardClick} layout={layout} />
          )}

        </Col>
      </Row>

      {/* Mobile Offcanvas Sidebar */}
      <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} responsive="md">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>フィルター</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Sidebar />
        </Offcanvas.Body>
      </Offcanvas>

      <PaperDetailModal show={showModal} onHide={handleCloseModal} paper={selectedPaper} />
    </div>
  );
};

export default HomePage;
