import React from "react";

export default function SelectedBooksModal({
  selectedBooks,
  removeBook,
  closeModal,
  saveDraft,
  updateBookNote,
  updateBookGenre, // 👈 Zustand에서 새로 만든 함수를 props로 받아옵니다.
  user,
}) {
  if (selectedBooks.length === 0) return null;
  const isAuthenticated = !!user;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg text-primary">나의 독서 리스트</h3>
        <p className="py-2 text-sm text-gray-500">
          장르와 후기를 자유롭게 기록해 보세요.
        </p>

        {!isAuthenticated && (
          <div
            role="alert"
            className="alert alert-warning mb-4 shadow-lg text-sm"
          >
            <span>작성 및 저장을 위해 로그인이 필요합니다.</span>
          </div>
        )}

        <div className="space-y-4 max-h-96 overflow-y-auto pr-2 mt-4">
          {selectedBooks.map((book) => {
            const bookKey = book.isbn || book.title;
            return (
              <div
                key={bookKey}
                className="flex gap-4 border p-4 rounded-xl shadow-sm bg-base-50"
              >
                <img
                  src={
                    book.thumbnail ||
                    "https://placehold.co/80x120?text=No+Image"
                  }
                  alt={book.title}
                  className="w-20 h-28 object-cover rounded shadow-md flex-shrink-0"
                />

                <div className="flex-grow">
                  <h4 className="font-bold text-md leading-tight">
                    {book.title}
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">
                    {book.authors.join(", ")}
                  </p>

                  {/* 💡 장르 입력 필드 추가 */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-gray-400 shrink-0">
                      장르:
                    </span>
                    <input
                      type="text"
                      className="input input-bordered input-xs w-full max-w-[150px]"
                      placeholder="예: 소설, IT, 경제"
                      value={book.genre || ""}
                      onChange={(e) => updateBookGenre(bookKey, e.target.value)}
                      disabled={!isAuthenticated}
                    />
                  </div>

                  <textarea
                    className="textarea textarea-bordered w-full text-sm leading-tight h-20"
                    placeholder={
                      isAuthenticated
                        ? "이 책의 한 줄 평 혹은 기대평을 적어주세요."
                        : "로그인 후 작성 가능"
                    }
                    value={book.note || ""}
                    onChange={(e) => updateBookNote(bookKey, e.target.value)}
                    disabled={!isAuthenticated}
                  />
                </div>

                <button
                  onClick={() => removeBook(book)}
                  className="btn btn-ghost btn-sm text-error p-0"
                  disabled={!isAuthenticated}
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
            className="btn btn-primary"
            disabled={!isAuthenticated}
          >
            로드맵 저장하기
          </button>
          <button onClick={closeModal} className="btn btn-ghost">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
