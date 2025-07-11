import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-dark text-white p-3">
      <div className="container">
        <Link to="/" className="text-white text-decoration-none">
          <h1>Minatojima Critical Care Review</h1>
            <h4>神戸市立医療センター中央市民病院ICU 勉強会データベース</h4>

        </Link>
      </div>
    </header>
  );
};

export default Header;
