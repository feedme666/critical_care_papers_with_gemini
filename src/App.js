import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScrollToTopWrapper from './components/ScrollToTopWrapper';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import PaperOrGuidelinePage from './components/PaperOrGuidelinePage';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router basename="/critical_care_papers_with_gemini">
      <ScrollToTopWrapper>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              {/* /paper/:id でもHomePageをレンダリングし、モーダル表示を制御 */}
              <Route path="/paper/:id" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ScrollToTopWrapper>
    </Router>
  );
}

export default App;