import React, { useState, useEffect } from "react";
import { signInAnonymously, signOut, onAuthStateChange } from "./supabase";

// 분리된 모듈 import
import useBookStore from "../store/useBookStore";
import {
  searchBooksAPI,
  saveDraftToSupabase,
  loadDraftFromSupabase,
} from "../api/bookService";
import BookCard from "../components/BookCard";
import SelectedBooksModal from "../components/SelectedBookModal";

export default function WritePage() {
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
  } = useBookStore();

  const isAuthenticated = !!user;

  // 1. 인증 상태 리스너
  useEffect(() => {
    const subscription = onAuthStateChange((currentUser) => {
      setUser(currentUser);
    });
    return () => subscription?.unsubscribe();
  }, [setUser]);

  // 2. 데이터 로드 로직
  useEffect(() => {
    const loadData = async () => {
      setIsDataLoaded(false);
      if (isAuthenticated && user?.id) {
        const drafts = await loadDraftFromSupabase(user.id);
        setBooksFromSupabase(drafts);
      } else if (!isAuthenticated) {
        setBooksFromSupabase([]);
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

  // 책 선택 핸들러
  const selectBook = (book) => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    addBook(book);
    openModal();
    setShowAuthPrompt(false);
  };

  // 저장 핸들러
  const handleSaveDraft = async () => {
    if (!isAuthenticated || !user.id) {
      console.error("로그인 상태가 아니므로 저장할 수 없습니다.");
      return;
    }

    const success = await saveDraftToSupabase(selectedBooks, user.id);

    if (success) {
      console.log(
        `총 ${selectedBooks.length}권의 책 후기를 성공적으로 저장했습니다!`
      );
      closeModal();
    } else {
      console.error("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">도서 작성하기</h1>

      {/* 상단 인증 버튼 영역 */}
      <div className="text-right mb-4">
        {isAuthenticated ? (
          <div className="flex justify-end items-center space-x-2">
            <span className="text-sm text-success font-semibold">
              ✅ 로그인됨 (ID: {user.id.substring(0, 8)}...)
            </span>
            <button onClick={signOut} className="btn btn-xs btn-error">
              로그아웃
            </button>
          </div>
        ) : (
          <button
            onClick={signInAnonymously}
            className="btn btn-sm btn-primary"
          >
            익명 로그인하기 (저장 필수)
          </button>
        )}
      </div>

      {/* 로그인 안내 메시지 */}
      {showAuthPrompt && !isAuthenticated && (
        <div role="alert" className="alert alert-warning mb-4 shadow-lg">
          <span>책 선택 및 후기 작성을 위해서는 로그인이 필요합니다.</span>
          <button
            onClick={signInAnonymously}
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
      )}

      {/* 검색창 영역 */}
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
          <button
            onClick={clearSearchResults}
            className="btn btn-ghost border border-gray-300"
          >
            초기화
          </button>
        )}
      </div>

      {/* 선택 확인 버튼 */}
      {selectedBooks.length > 0 && (
        <div className="text-right mb-4">
          <button onClick={openModal} className="btn btn-warning">
            선택한 책 ({selectedBooks.length}권) 확인 및 후기 작성
          </button>
        </div>
      )}

      {/* 로딩 표시 */}
      {!isDataLoaded && (
        <div className="text-center p-4">
          <span className="loading loading-spinner loading-lg"></span>
          <p>데이터 로드 중...</p>
        </div>
      )}

      {/* 검색 결과 그리드 */}
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

      {/* 모달 */}
      {isModalOpen && (
        <SelectedBooksModal
          selectedBooks={selectedBooks}
          removeBook={removeBook}
          updateBookNote={updateBookNote}
          closeModal={closeModal}
          saveDraft={handleSaveDraft}
          user={user}
        />
      )}
    </div>
  );
}
