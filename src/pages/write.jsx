import React, { useState } from "react";

// Modal 컴포넌트를 분리하여 가독성을 높일 수 있지만, 여기서는 간단히 같은 파일에 구현합니다.
function SelectedBooksModal({ selectedBooks, removeBook, closeModal, saveDraft }) {
  if (selectedBooks.length === 0) return null;

  return (
    // DaisyUI Modal 클래스 사용
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg">선택된 도서 목록</h3>
        <p className="py-4">선택하신 책들에 대한 후기를 작성하거나 초안으로 저장할 수 있습니다.</p>

        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {selectedBooks.map((book) => (
            <div key={book.isbn || book.title} className="flex items-center border p-3 rounded-lg shadow-sm">
              <img src={book.thumbnail || "https://placehold.co/80x120?text=No+Image"} alt={book.title} className="w-16 h-24 object-cover mr-4 flex-shrink-0" />
              <div className="flex-grow">
                <h4 className="font-semibold text-base">{book.title}</h4>
                <p className="text-sm text-gray-600 truncate">저자: {book.authors.join(', ')}</p>
                {/* 각 책마다 후기(note) 필드를 추가 */}
                <textarea
                  className="w-full border rounded p-1 text-sm mt-2"
                  placeholder="이 책에 대한 후기 작성"
                  value={book.note || ""}
                  onChange={(e) => book.onNoteChange(e.target.value, book)} // onNoteChange는 부모 컴포넌트에서 전달
                />
              </div>
              <button
                onClick={() => removeBook(book)}
                className="btn btn-sm btn-error ml-4 flex-shrink-0"
              >
                제외
              </button>
            </div>
          ))}
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


export default function WritePage() {
  const [searchText, setSearchText] = useState("");
  const [books, setBooks] = useState([]);
  // 단일 객체 대신 여러 책을 담을 배열로 변경
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  // 모달 표시 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false);

  const searchBooks = async () => {
    if (!searchText.trim()) {
        setBooks([]); // 검색어가 없으면 결과를 비웁니다.
        return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://dapi.kakao.com/v3/search/book?target=title&query=${encodeURIComponent(searchText)}`,
        {
          headers: {
            // 환경 변수 사용
            Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_API_KEY}`,
          },
        }
      );
      const data = await res.json();
      // 검색 결과로 가져온 책에 note 필드가 없으므로 추가하지 않습니다.
      setBooks(data.documents || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const thumb = (url) => url || "https://placehold.co/400x400?text=No+Image";

  // 책 선택 핸들러: 선택된 목록에 추가 (이미 있으면 추가하지 않음)
  const selectBook = (book) => {
    // 이미 선택된 책인지 확인 (ISBN을 고유 식별자로 사용, 없으면 title)
    const key = book.isbn || book.title;
    const isAlreadySelected = selectedBooks.some(b => (b.isbn || b.title) === key);

    if (!isAlreadySelected) {
      // 새로운 책을 추가할 때 후기(note) 필드도 초기화하여 추가
      setSelectedBooks([...selectedBooks, { ...book, note: "" }]);
    }
    // 선택 후 바로 모달을 열어줄 수도 있습니다.
    setIsModalOpen(true);
  };
  
  // 선택된 책 제거 핸들러
  const removeBook = (bookToRemove) => {
    const key = bookToRemove.isbn || bookToRemove.title;
    setSelectedBooks(selectedBooks.filter(b => (b.isbn || b.title) !== key));
  };
  
  // 모달 내에서 개별 책의 후기(note)를 업데이트하는 핸들러
  const updateBookNote = (newNote, bookToUpdate) => {
      const key = bookToUpdate.isbn || bookToUpdate.title;
      setSelectedBooks(selectedBooks.map(book => {
          if ((book.isbn || book.title) === key) {
              return { ...book, note: newNote };
          }
          return book;
      }));
  };

  // 임시 저장 함수 (실제 서버 통신 로직을 여기에 구현)
  const handleSaveDraft = () => {
      console.log("저장할 도서 목록:", selectedBooks);
      // TODO: 서버 API로 selectedBooks 데이터를 전송하는 로직 구현
      alert(`총 ${selectedBooks.length}권의 책 후기를 초안으로 저장했습니다!`);
      setIsModalOpen(false); // 저장 후 모달 닫기
      // setSelectedBooks([]); // 필요하다면 저장 후 선택 목록 초기화
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
              <button onClick={() => setIsModalOpen(true)} className="btn btn-warning">
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
                    disabled={isSelected} // 이미 선택했으면 비활성화
                  >
                    {isSelected ? '선택됨' : '선택'}
                  </button>
                </div>
            );
        })}
      </div>

      {/* 선택된 책 모달 */}
      {isModalOpen && (
          <SelectedBooksModal 
              selectedBooks={selectedBooks.map(book => ({
                ...book,
                // 모달 컴포넌트 내에서 note를 수정할 수 있도록 콜백 함수를 각 책 객체에 추가합니다.
                onNoteChange: updateBookNote
              }))}
              removeBook={removeBook}
              closeModal={() => setIsModalOpen(false)}
              saveDraft={handleSaveDraft}
          />
      )}
    </div>
  );
}