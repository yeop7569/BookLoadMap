// App.js
import React from 'react';
import MainPage from './pages/MainPage';
import Header from './components/Header';
import Footer from './components/Footer';
import DetailPage from './pages/DetailPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/detail" element={<DetailPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
