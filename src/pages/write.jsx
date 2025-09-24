import React, { useState } from "react";

export default function WritePage() {
  const [searchText, setSearchText] = useState("");
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const searchBooks = async () => {
    if (!searchText.trim()) return;
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

      {/* 검색 결과 */}
      {loading && <p>불러오는 중...</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {books.map((b) => (
          <div key={b.isbn || b.title} className="border rounded p-2 flex flex-col items-center">
            <img src={thumb(b.thumbnail)} alt={b.title} className="w-32 h-48 object-cover mb-2" />
            <h2 className="font-bold text-sm text-center">{b.title}</h2>
            <button
              onClick={() => setSelectedBook(b)}
              className="btn btn-accent btn-sm mt-2"
            >
              선택
            </button>
          </div>
        ))}
      </div>

      {/* 선택한 책 + 후기 작성 */}
      {selectedBook && (
        <div className="border rounded p-4 mb-4">
          <h2 className="font-bold text-lg mb-2">{selectedBook.title}</h2>
          <img src={thumb(selectedBook.thumbnail)} alt={selectedBook.title} className="w-40 h-60 object-cover mb-2" />
          <textarea
            className="w-full border rounded p-2"
            placeholder="후기 작성"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button className="btn btn-primary mt-2">등록</button>
        </div>
      )}
    </div>
  );
}
