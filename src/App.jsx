import React from "react";
import MainPage from "./pages/MainPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BookSearch from "./pages/BookSearch";
import WritePage from "./pages/write";
import MyPage from "./pages/MyPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/Sign-in";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/write" element={<WritePage />} />
        <Route path="/booksearch" element={<BookSearch />} />
        <Route path="*" element={<div>없는페이지임</div>} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/SignIn" element={<SignIn />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
