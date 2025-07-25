import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScrollToTopWrapper from './components/ScrollToTopWrapper';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import PaperOrGuidelinePage from './components/PaperOrGuidelinePage';
import { FilterProvider } from './context/FilterContext'; // FilterProviderをインポート
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router basename="/critical_care_papers_with_gemini">
      <FilterProvider> {/* FilterProviderでラップ */}
        <ScrollToTopWrapper>
          <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/paper/:id" element={<PaperOrGuidelinePage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ScrollToTopWrapper>
      </FilterProvider>
    </Router>
  );
}

export default App;