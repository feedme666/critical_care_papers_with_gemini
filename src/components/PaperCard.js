import React from 'react';
import { Card, Badge, Col } from 'react-bootstrap';

const PaperCard = ({ paper, onCardClick }) => {
  let cardClass = "h-100 shadow-sm paper-card";
  if (paper.タグ) {
    if (paper.タグ.some(tag => tag === "ガイドライン・提言")) {
      cardClass += " bg-guideline";
    } else if (paper.タグ.some(tag => tag.includes("ランダム化比較試験"))) {
      cardClass += " bg-rct";
    }
  }

  return (
    <Col key={paper.id}>
      <Card 
        className={cardClass}
        onClick={() => onCardClick(paper)}
        style={{ cursor: 'pointer' }}
      >
        <Card.Body className="d-flex flex-column">
          <Card.Title>{paper.題名}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{paper.筆頭著者}</Card.Subtitle>
          <Card.Text className="mb-1">
            <small>{paper.雑誌名_巻号_出版年_ページ}</small>
          </Card.Text>
          <Card.Text>
            <small className="text-muted">登録日: {paper.登録日}</small>
          </Card.Text>
          <div className="mt-auto">
            {paper.タグ && paper.タグ.map(tag => (
              <Badge pill bg="secondary" key={tag} className="me-1 fw-normal">
                {tag}
              </Badge>
            ))}
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default PaperCard;
