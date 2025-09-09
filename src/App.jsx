import React from 'react';
import MainPage from './pages/MainPage';
import Header from './components/Header';
import Footer from './components/Footer';
import DetailPage from './pages/DetailPage';
import BookDetailPage from './pages/BookDetail';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        
        <Route path="/detail" element={<DetailPage />} />
        <Route path="*" element={<div>없는페이지임</div>} />
         <Route path="/books/:isbn" element={<BookDetailPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
