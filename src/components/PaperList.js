import React from 'react';
import { Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';
import PaperCard from './PaperCard';

const PaperListItem = ({ paper, onCardClick }) => (
  <ListGroupItem action onClick={() => onCardClick(paper)}>
    <Row className="align-items-center">
      <Col xs={10}>
        <div className="fw-bold">{paper.題名}</div>
        <small className="text-muted">{paper.雑誌名_巻号_出版年_ページ}</small>
      </Col>
      <Col xs={2} className="text-end">
        <small>{paper.登録日}</small>
      </Col>
    </Row>
  </ListGroupItem>
);

const PaperList = ({ papers, onCardClick, layout }) => {
  if (layout === 'list') {
    return (
      <ListGroup variant="flush">
        {papers.map((p) => (
          <PaperListItem key={p.id} paper={p} onCardClick={onCardClick} />
        ))}
      </ListGroup>
    );
  }

  return (
    <Row xs={1} sm={1} md={2} lg={3} className="g-4">
      {papers.map((p) => (
        <PaperCard key={p.id} paper={p} onCardClick={onCardClick} />
      ))}
    </Row>
  );
};

export default PaperList;
