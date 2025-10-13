import React, { useState } from "react";
import { create } from 'zustand'; // Zustand 라이브러리 임포트

// ----------------------------------------------------
// 1. ZUSTAND STORE 정의 (useBookStore)
// 선택된 책 목록 및 모달 상태를 관리합니다.
// ----------------------------------------------------
const useBookStore = create((set) => ({
  // 상태 (State)
  selectedBooks: [], // 선택된 책 목록 (note 필드 포함)
  isModalOpen: false,  // 모달 표시 여부

  // 액션 (Actions) - 상태 변경 함수

  // 책을 선택 목록에 추가 (중복 방지)
  addBook: (book) => set((state) => {
    const key = book.isbn || book.title;
    const isAlreadySelected = state.selectedBooks.some(b => (b.isbn || b.title) === key);

    if (isAlreadySelected) {
      return state;
    }

    // 새로운 책을 추가하고 note 필드를 초기화
    return { 
      selectedBooks: [...state.selectedBooks, { ...book, note: "" }] 
    };
  }),

  // 책을 선택 목록에서 제거
  removeBook: (bookToRemove) => set((state) => {
    const key = bookToRemove.isbn || bookToRemove.title;
    return {
      selectedBooks: state.selectedBooks.filter(b => (b.isbn || b.title) !== key)
    };
  }),

  // 특정 책의 후기(Note)를 업데이트
  updateBookNote: (bookKey, newNote) => set((state) => ({
    selectedBooks: state.selectedBooks.map(book => {
      const key = book.isbn || book.title;
      if (key === bookKey) {
        // 불변성을 지켜 note만 업데이트
        return { ...book, note: newNote }; 
      }
      return book;
    }),
  })),

  // 모달 열기/닫기
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),

  // 목록 전체 초기화 (예: 저장 후)
  clearSelection: () => set({ selectedBooks: [], isModalOpen: false }),
}));


// ----------------------------------------------------
// 2. MODAL 컴포넌트
// props로 받은 Zustand 액션을 사용하도록 수정되었습니다.
// ----------------------------------------------------
function SelectedBooksModal({ selectedBooks, removeBook, closeModal, saveDraft, updateBookNote }) {
  if (selectedBooks.length === 0) return null;

  return (
    // DaisyUI Modal 클래스 사용
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg">선택된 도서 목록</h3>
        <p className="py-4">책들의 후기를 작성해주세요</p>

        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {selectedBooks.map((book) => {
            const bookKey = book.isbn || book.title; // Zustand 액션 호출을 위한 고유 키
            return (
              <div key={bookKey} className="flex items-center border p-3 rounded-lg shadow-sm">
                <img src={book.thumbnail || "https://placehold.co/80x120?text=No+Image"} alt={book.title} className="w-16 h-24 object-cover mr-4 flex-shrink-0" />
                <div className="flex-grow">
                  <h4 className="font-semibold text-base">{book.title}</h4>
                  <p className="text-sm text-gray-600 truncate">저자: {book.authors.join(', ')}</p>
                  
                  <textarea
                    className="w-full border rounded p-1 text-sm mt-2"
                    placeholder="이 책에 대한 후기 작성"
                    value={book.note || ""}
                    // **[변경]** props로 받은 updateBookNote 액션 함수를 직접 호출
                    onChange={(e) => updateBookNote(bookKey, e.target.value)}
                  />
                </div>
                <button
                  onClick={() => removeBook(book)} // props로 받은 removeBook 액션 호출
                  className="btn btn-sm btn-error ml-4 flex-shrink-0"
                >
                  제외
                </button>
              </div>
            );
          })}
        </div>

        <div className="modal-action">
          <button onClick={saveDraft} className="btn btn-success">
            초안으로 저장 (후기 포함)
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
// 3. MAIN 컴포넌트 (WritePage)
// Zustand Hook을 사용하여 상태를 가져옵니다.
// ----------------------------------------------------
export default function WritePage() {
  // 로컬 상태 (검색 관련 상태는 여전히 로컬에 유지)
  const [searchText, setSearchText] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // **[변경]** Zustand에서 전역 상태와 액션 함수를 가져옵니다.
  const { 
    selectedBooks, 
    isModalOpen, 
    addBook, 
    removeBook, 
    updateBookNote,
    openModal, 
    closeModal 
  } = useBookStore(); 


  const searchBooks = async () => {
    // ... (검색 로직은 변경 없음)
    if (!searchText.trim()) {
        setBooks([]); 
        return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://dapi.kakao.com/v3/search/book?target=title&query=${encodeURIComponent(searchText)}`,
        {
          headers: {
            Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_API_KEY}`,
          },
        }
      );
      const data = await res.json();
      setBooks(data.documents || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const thumb = (url) => url || "https://placehold.co/400x400?text=No+Image";

  // 책 선택 핸들러: **[변경]** Zustand의 addBook 액션 사용
  const selectBook = (book) => {
    addBook(book); // Zustand 액션으로 selectedBooks 상태 변경
    openModal();   // Zustand 액션으로 isModalOpen 상태 변경
  };
  
  // 임시 저장 함수
  const handleSaveDraft = () => {
      console.log("저장할 도서 목록:", selectedBooks);
      // TODO: 서버 API로 selectedBooks 데이터를 전송하는 로직 구현
      alert(`총 ${selectedBooks.length}권의 책 후기를 초안으로 저장했습니다!`);
      closeModal(); // Zustand 액션으로 모달 닫기
  };


  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">도서 작성하기</h1>

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
      </div>
      
      {/* 선택된 책 모달 열기 버튼 */}
      {selectedBooks.length > 0 && (
          <div className="text-right mb-4">
              <button 
                onClick={openModal} // **[변경]** Zustand 액션 사용
                className="btn btn-warning"
              >
                  선택한 책 ({selectedBooks.length}권) 확인 및 후기 작성
              </button>
          </div>
      )}

      {/* 검색 결과 */}
      {loading && <p>불러오는 중...</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {books.map((b) => {
            const isSelected = selectedBooks.some(sb => (sb.isbn || sb.title) === (b.isbn || b.title));
            return (
                <div key={b.isbn || b.title} className={`border rounded p-2 flex flex-col items-center ${isSelected ? 'border-4 border-accent shadow-lg' : ''}`}>
                  <img src={thumb(b.thumbnail)} alt={b.title} className="w-32 h-48 object-cover mb-2" />
                  <h2 className="font-bold text-sm text-center line-clamp-2">{b.title}</h2>
                  <button
                    onClick={() => selectBook(b)}
                    className={`btn btn-sm mt-2 ${isSelected ? 'btn-disabled' : 'btn-accent'}`}
                    disabled={isSelected} 
                  >
                    {isSelected ? '선택됨' : '선택'}
                  </button>
                </div>
            );
        })}
      </div>

      {/* 선택된 책 모달 */}
      {isModalOpen && ( // **[변경]** isModalOpen 상태를 Zustand에서 가져옴
          <SelectedBooksModal 
              selectedBooks={selectedBooks} // **[변경]** Zustand 상태를 직접 props로 전달
              removeBook={removeBook} // **[변경]** Zustand 액션을 직접 props로 전달
              updateBookNote={updateBookNote} // **[변경]** Zustand 액션을 직접 props로 전달
              closeModal={closeModal} // **[변경]** Zustand 액션을 직접 props로 전달
              saveDraft={handleSaveDraft}
          />
      )}
    </div>
  );
}
