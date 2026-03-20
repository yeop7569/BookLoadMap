import React from "react";
import MainPage from "./pages/MainPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BookSearch from "./pages/BookSearch";
import CreatePage from "./pages/Route_Book/[Route_id]/create";
import MyPage from "./pages/MyPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/Auth/Sign-In";
import SignUp from "./pages/Auth/Sign-up";
import RouteDetail from "./pages/Route_Book/[Route_id]/Detail";
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <Toaster position="top-center" richColors />
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/BookSearch/Route_Book/:id/create"
          element={<CreatePage />}
        />
        <Route
          path="/BookSearch/Route_Book/:id/detail"
          element={<RouteDetail />}
        />
        <Route path="/booksearch" element={<BookSearch />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="*" element={<div className="min-h-screen bg-black flex items-center justify-center text-white text-2xl font-black">404 - 페이지를 찾을 수 없습니다</div>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
