import React from "react";

export default function SelectedBooksModal({
  selectedBooks,
  removeBook,
  closeModal,
  saveDraft,
  updateBookNote,
  user,
}) {
  if (selectedBooks.length === 0) return null;

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
                    disabled={!isAuthenticated}
                  />
                </div>
                <button
                  onClick={() => removeBook(book)}
                  className="btn btn-sm btn-error ml-4 flex-shrink-0"
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
            className="btn btn-success"
            disabled={!isAuthenticated}
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
