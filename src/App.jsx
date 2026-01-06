import MainPage from "./pages/MainPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BookSearch from "./pages/BookSearch";
import CreatePage from "./pages/create";
import MyPage from "./pages/MyPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/Sign-In";
import SignUp from "./pages/Sign-up";
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <Toaster position="top-center" richColors />
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/booksearch" element={<BookSearch />} />
        <Route path="*" element={<div>없는페이지임</div>} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
