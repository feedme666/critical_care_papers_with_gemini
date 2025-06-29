import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-dark text-white p-3">
      <div className="container">
        <Link to="/" className="text-white text-decoration-none">
          <h1>Critical Care Papers</h1>
        </Link>
      </div>
    </header>
  );
};

export default Header;
