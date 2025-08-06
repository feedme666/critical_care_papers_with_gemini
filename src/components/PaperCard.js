import React from 'react';
import { Card, Badge, Col } from 'react-bootstrap';

const PaperCard = ({ paper, onCardClick }) => {
  return (
    <Col key={paper.id}>
      <Card 
        className="h-100 shadow-sm paper-card"
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
