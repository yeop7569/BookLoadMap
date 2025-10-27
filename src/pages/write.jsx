import React, { useState, useEffect } from "react";
import { create } from "zustand";
// `./supabase.js` 파일을 정상적으로 참조하기 위해 재포함
import {
  supabase,
  signInAnonymously,
  signOut,
  onAuthStateChange,
} from "./supabase";

// ----------------------------------------------------
// 1. ZUSTAND STORE 정의 (useBookStore)
//    - user 상태 추가 및 setUser 액션 추가
// ----------------------------------------------------
const useBookStore = create((set) => ({
  user: null, // Supabase 사용자 객체 저장
  selectedBooks: [],
  isModalOpen: false,

  // 사용자 상태 설정 액션
  setUser: (user) => set({ user }),

  addBook: (book) =>
    set((state) => {
      const key = book.isbn || book.title;
      const isAlreadySelected = state.selectedBooks.some(
        (b) => (b.isbn || b.title) === key
      );
      if (isAlreadySelected) return state;
      return { selectedBooks: [...state.selectedBooks, { ...book, note: "" }] };
    }),

  removeBook: (bookToRemove) =>
    set((state) => {
      const key = bookToRemove.isbn || bookToRemove.title;
      return {
        selectedBooks: state.selectedBooks.filter(
          (b) => (b.isbn || b.title) !== key
        ),
      };
    }),

  updateBookNote: (bookKey, newNote) =>
    set((state) => ({
      selectedBooks: state.selectedBooks.map((book) => {
        const key = book.isbn || book.title;
        if (key === bookKey) {
          return { ...book, note: newNote };
        }
        return book;
      }),
    })),

  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  clearSelection: () => set({ selectedBooks: [], isModalOpen: false }),
  setBooksFromSupabase: (books) => set({ selectedBooks: books }),
}));

// ----------------------------------------------------
// 2. MODAL 컴포넌트
// ----------------------------------------------------
function SelectedBooksModal({
  selectedBooks,
  removeBook,
  closeModal,
  saveDraft,
  updateBookNote,
  user,
}) {
  if (selectedBooks.length === 0) return null;

  // 로그인 상태 확인
  const isAuthenticated = !!user;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg">선택된 도서 목록</h3>
        <p className="py-4">책들의 후기를 작성해주세요</p>

        {/* 로그인 안내 메시지 */}
        {!isAuthenticated && (
          <div role="alert" className="alert alert-warning mb-4 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.332 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>후기 작성 및 저장을 위해서는 로그인이 필요합니다.</span>
          </div>
        )}

        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {selectedBooks.map((book) => {
            const bookKey = book.isbn || book.title;
            return (
              <div
                key={bookKey}
                className="flex items-center border p-3 rounded-lg shadow-sm"
              >
                <img
                  src={
                    book.thumbnail ||
                    "https://placehold.co/80x120?text=No+Image"
                  }
                  alt={book.title}
                  className="w-16 h-24 object-cover mr-4 flex-shrink-0"
                />
                <div className="flex-grow">
                  <h4 className="font-semibold text-base">{book.title}</h4>
                  <p className="text-sm text-gray-600 truncate">
                    저자: {book.authors.join(", ")}
                  </p>

                  <textarea
                    className="w-full border rounded p-1 text-sm mt-2"
                    placeholder={
                      isAuthenticated
                        ? "이 책에 대한 후기 작성"
                        : "로그인 후 작성 가능"
                    }
                    value={book.note || ""}
                    onChange={(e) => updateBookNote(bookKey, e.target.value)}
                    disabled={!isAuthenticated} // 로그인되지 않았다면 텍스트 에어리어 비활성화
                  />
                </div>
                <button
                  onClick={() => removeBook(book)}
                  className="btn btn-sm btn-error ml-4 flex-shrink-0"
                  disabled={!isAuthenticated} // 제거 버튼도 로그인 시에만 활성화
                >
                  제외
                </button>
              </div>
            );
          })}
        </div>

        <div className="modal-action">
          <button
            onClick={saveDraft}
            className="btn btn-success"
            disabled={!isAuthenticated} // 저장 버튼 비활성화
          >
            초안으로 저장 (로그인 필요)
          </button>
          <button onClick={closeModal} className="btn">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3. Supabase CRUD 함수
// ----------------------------------------------------

/**
 * Supabase에 초안 데이터를 저장하거나 업데이트합니다 (UPSERT).
 * @param {Array} drafts - 저장할 도서 목록
 * @param {string} userId - 현재 로그인된 사용자 ID (저장 키로 사용됨)
 * @returns {boolean} 성공 여부
 */
const saveDraftToSupabase = async (drafts, userId) => {
  if (!userId) {
    console.error("저장 실패: 사용자 ID가 없습니다.");
    return false;
  }

  // 빈 목록이 저장되지 않도록 처리
  if (drafts.length === 0) {
    console.log("저장할 내용이 없습니다.");
    return true;
  }

  const dataToSave = {
    user_id: userId,
    draft_data: drafts,
  };

  try {
    // 테이블 이름: 'book_drafts' (Supabase에서 이 이름으로 테이블을 생성해야 함)
    // upsert는 user_id가 있으면 업데이트, 없으면 삽입합니다.
    const { error } = await supabase
      .from("book_drafts")
      .upsert(dataToSave, {
        onConflict: "user_id",
      })
      .select();

    if (error) throw error;

    console.log("저장 성공");
    return true;
  } catch (error) {
    console.error("Supabase 저장 중 오류 발생:", error.message);
    return false;
  }
};

/**
 * Supabase에서 초안 데이터를 불러옵니다 (READ).
 * @param {string} userId - 현재 로그인된 사용자 ID
 * @returns {Array} 불러온 도서 목록 배열
 */
const loadDraftFromSupabase = async (userId) => {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from("book_drafts")
      .select("draft_data")
      .eq("user_id", userId)
      .single();

    // 데이터가 없을 때 발생하는 에러(예: 404 Not Found)는 무시하고 빈 배열 반환
    if (error && error.details.includes("rows returned")) {
      return [];
    }

    if (error) throw error;

    if (data && data.draft_data) {
      console.log("불러오기 성공");
      return data.draft_data;
    }
    return [];
  } catch (error) {
    console.error("Supabase 불러오기 중 오류 발생:", error.message);
    return [];
  }
};

// ----------------------------------------------------
// 4. MAIN 컴포넌트 (WritePage)
// ----------------------------------------------------
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

  // 1. 인증 상태 리스너 설정: 앱 로드 시 Supabase에서 사용자 정보를 가져와 Zustand에 반영
  useEffect(() => {
    // onAuthStateChange는 로그인/로그아웃 시 자동으로 호출됩니다.
    const subscription = onAuthStateChange((currentUser) => {
      setUser(currentUser); // Zustand에 사용자 정보 업데이트
    });

    return () => subscription?.unsubscribe();
  }, [setUser]);

  // 2. 데이터 로드 로직: 로그인 상태(user)가 변경될 때마다 데이터를 불러오거나 초기화
  useEffect(() => {
    const loadData = async () => {
      setIsDataLoaded(false); // 로드 시작
      if (isAuthenticated && user?.id) {
        const drafts = await loadDraftFromSupabase(user.id);
        setBooksFromSupabase(drafts);
      } else if (!isAuthenticated) {
        // 로그아웃 시 기존 선택 목록을 비웁니다.
        setBooksFromSupabase([]);
      }
      setIsDataLoaded(true); // 로드 완료
    };

    // user 객체가 초기화된 후, 로그인 상태가 변경될 때마다 데이터를 로드합니다.
    if (user !== undefined) {
      loadData();
    }
  }, [user, isAuthenticated, setBooksFromSupabase]);

  const searchBooks = async () => {
    if (!searchText.trim()) {
      setBooks([]);
      return;
    }
    setLoading(true);

    // ⚠️ 수정: import.meta.env 오류를 피하기 위해 일반 상수로 변경
    const KAKAO_API_KEY = "6e083fc4445086456e1165ef9b58ef6a";
    if (KAKAO_API_KEY === "6e083fc4445086456e1165ef9b58ef6a") {
      console.error(
        "카카오 API 키를 설정해주세요! 검색이 작동하지 않을 수 있습니다."
      );
    }

    try {
      const res = await fetch(
        `https://dapi.kakao.com/v3/search/book?target=title&query=${encodeURIComponent(
          searchText
        )}`,
        { headers: { Authorization: `KakaoAK ${KAKAO_API_KEY}` } }
      );
      const data = await res.json();
      setBooks(data.documents || []);
    } catch (e) {
      console.error("도서 검색 오류:", e);
    } finally {
      setLoading(false);
    }
  };

  const clearSearchResults = () => {
    setSearchText("");
    setBooks([]);
  };

  const thumb = (url) => url || "https://placehold.co/400x400?text=No+Image";

  // 책 선택 핸들러: 로그인 필수 체크 추가
  const selectBook = (book) => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true); // 로그인 안내 메시지 표시
      return;
    }
    addBook(book);
    openModal();
    setShowAuthPrompt(false); // 책 선택 성공 시 안내 메시지 숨김
  };

  // 임시 저장 함수: 로그인 필수 체크 및 Supabase 저장 로직
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
      // clearSelection(); // 저장 후 목록을 비우고 싶다면 이 주석을 해제합니다.
      closeModal();
    } else {
      // 저장 실패 시 사용자에게 알리는 로직 추가 필요
      console.error("저장 중 오류가 발생했습니다. 콘솔을 확인해주세요.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">도서 작성하기</h1>

      {/* 사용자 상태 표시 및 로그인/로그아웃 버튼 */}
      <div className="text-right mb-4">
        {isAuthenticated ? (
          <div className="flex justify-end items-center space-x-2">
            {/* Supabase ID를 너무 길게 표시하면 UI가 깨질 수 있으므로 축약 */}
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

      {/* 로그인 안내 메시지 모달 (책 선택 시 로그인 안 되어 있으면 표시) */}
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

      {/* 검색창 */}
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

      {/* 선택된 책 모달 열기 버튼 */}
      {selectedBooks.length > 0 && (
        <div className="text-right mb-4">
          <button onClick={openModal} className="btn btn-warning">
            선택한 책 ({selectedBooks.length}권) 확인 및 후기 작성
          </button>
        </div>
      )}

      {/* 데이터 로딩 중 표시 (Supabase 로드가 진행되는 동안) */}
      {!isDataLoaded && (
        <div className="text-center p-4">
          <span className="loading loading-spinner loading-lg"></span>
          <p>데이터 로드 중...</p>
        </div>
      )}

      {/* 검색 결과 */}
      {loading && <p>불러오는 중...</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {books.map((b) => {
          const isSelected = selectedBooks.some(
            (sb) => (sb.isbn || sb.title) === (b.isbn || b.title)
          );
          return (
            <div
              key={b.isbn || b.title}
              className={`border rounded p-2 flex flex-col items-center ${
                isSelected ? "border-4 border-accent shadow-lg" : ""
              }`}
            >
              <img
                src={thumb(b.thumbnail)}
                alt={b.title}
                className="w-32 h-48 object-cover mb-2"
              />
              <h2 className="font-bold text-sm text-center line-clamp-2">
                {b.title}
              </h2>
              <button
                onClick={() => selectBook(b)}
                className={`btn btn-sm mt-2 ${
                  isSelected ? "btn-disabled" : "btn-accent"
                }`}
                disabled={isSelected}
              >
                {isSelected ? "선택됨" : "선택"}
              </button>
            </div>
          );
        })}
      </div>

      {/* 선택된 책 모달 */}
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
