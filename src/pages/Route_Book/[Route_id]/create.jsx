import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../../lib/supabase";
import useBookStore from "../../../store/useBookStore";
import {
  searchBooksAPI,
  saveRouteToSupabase,
  loadRouteFromSupabase,
} from "../../../api/bookService";
import BookCard from "../../../components/BookCard";
import SelectedBooksModal from "../../../components/SelectedBookModal";

export default function CreatePage() {
  const navigate = useNavigate(); // 이동 함수
  const [searchText, setSearchText] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const {
    user,
    selectedBooks,
    isModalOpen,
    addBook,
    removeBook,
    updateBookNote,
    openModal,
    closeModal,
    setBooksFromSupabase,
    setUser,
    updateBookGenre,
  } = useBookStore();

  const isAuthenticated = !!user;

  // 1. 인증 상태 리스너 (실제 Supabase 세션 감시)
  useEffect(() => {
    // 세션 정보를 가져오고 변경사항을 구독합니다.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  // 3. 데이터 로드 로직 (기존 유지)
  useEffect(() => {
    const loadData = async () => {
      setIsDataLoaded(false);
      if (isAuthenticated && user?.id) {
        const drafts = await loadRouteFromSupabase(user.id);
        if (drafts) {
          setBooksFromSupabase([drafts]);
        } else {
          setBooksFromSupabase([]);
        }
      }
      setIsDataLoaded(true);
    };

    if (user !== undefined) {
      loadData();
    }
  }, [user, isAuthenticated, setBooksFromSupabase]);

  // 검색 핸들러
  const searchBooks = async () => {
    if (!searchText.trim()) {
      setBooks([]);
      return;
    }
    setLoading(true);
    const results = await searchBooksAPI(searchText);
    setBooks(results);
    setLoading(false);
  };

  const clearSearchResults = () => {
    setSearchText("");
    setBooks([]);
  };

  // 책 선택 핸들러 (로그인 안되어 있으면 로그인 페이지 권유)
  const selectBook = (book) => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    addBook(book);
    openModal();
    setShowAuthPrompt(false);
  };

  // 저장 핸들러 (기존 유지)

  const handleSaveDraft = async () => {
    if (!isAuthenticated || !user.id) return;

    const success = await saveRouteToSupabase(selectedBooks, user.id);
    if (success) {
      alert("성공적으로 저장되었습니다.");
      closeModal();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">도서 루트 작성</h1>

      {/* 로그인 안내 메시지 - 로그인 페이지 유도 */}
      {showAuthPrompt && !isAuthenticated && (
        <div role="alert" className="alert alert-warning mb-4 shadow-lg">
          <span>작성 내용을 저장하시려면 로그인이 필요합니다.</span>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/Signin")}
              className="btn btn-sm btn-primary"
            >
              로그인하기
            </button>
            <button
              onClick={() => setShowAuthPrompt(false)}
              className="btn btn-sm btn-ghost"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 검색창 영역 (기존 유지) */}
      <div className="flex mb-4 gap-2">
        <input
          type="text"
          placeholder="책 제목 입력"
          className="flex-1 border rounded px-3 py-2"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchBooks()}
        />
        <button onClick={searchBooks} className="btn btn-primary">
          검색
        </button>
        {(searchText.trim() || books.length > 0) && (
          <button onClick={clearSearchResults} className="btn btn-ghost border">
            리셋
          </button>
        )}
      </div>

      {/* 선택 확인 버튼 및 검색 결과 그리드 (기존 유지) */}
      {selectedBooks.length > 0 && (
        <div className="text-right mb-4">
          <button onClick={openModal} className="btn btn-warning">
            선택한 책 ({selectedBooks.length}권) 작성
          </button>
        </div>
      )}

      {loading && <p>불러오는 중...</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {books.map((b) => {
          const isSelected = selectedBooks.some(
            (sb) => (sb.isbn || sb.title) === (b.isbn || b.title)
          );
          return (
            <BookCard
              key={b.isbn || b.title}
              book={b}
              isSelected={isSelected}
              onSelect={selectBook}
            />
          );
        })}
      </div>

      {isModalOpen && (
        <SelectedBooksModal
          selectedBooks={selectedBooks}
          removeBook={removeBook}
          updateBookNote={updateBookNote}
          closeModal={closeModal}
          saveDraft={handleSaveDraft}
          updateBookGenre={updateBookGenre}
          user={user}
        />
      )}
    </div>
  );
}
