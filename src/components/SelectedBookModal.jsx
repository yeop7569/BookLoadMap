import { useEffect, useState } from "react";
import { toast } from "sonner";
import supabase from "../lib/supabase";
import { useAuthStore } from "../store/AuthStore";
import { Navigate, useParams } from "react-router-dom";
import useBookStore from "../store/useBookStore";
import { useNavigate } from "react-router-dom";
export default function SelectedBooksModal({
  selectedBooks,
  removeBook,
  closeModal,
  updateBookNote,
  user,
}) {
  // 로드맵 전체에 대한 상태
  const {
    routeTitle,
    setRouteTitle,
    category,
    setCategory,
    content,
    setContent,
  } = useBookStore();
  const navigate = useNavigate();
  const authId = useAuthStore((state) => state.id);
  const { id } = useParams();
  const isAuthenticated = !!user;
  const setBooksFromSupabase = useBookStore(
    (state) => state.setBooksFromSupabase,
  );

  // 발행/업데이트 핸들러
  const handlePublish = async () => {
    const updateData = {
      status: "Publish",
      selected_books: selectedBooks,
      Route_title: routeTitle,
      content: content,
      thumbnail: selectedBooks[0]?.thumbnail,
      category: category,
      book_title: selectedBooks.map((b) => b.title).join(", "),
      author: authId,
    };

    const { data, error } = await supabase
      .from("Book_Route")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) {
      toast.error(error.message);
    } else {
      if (data && data.length > 0) {
        toast.success("로드맵을 발행하였습니다!");
        closeModal();
        navigate("/");
      } else {
        // 💡 여기가 실행된다면 ID가 일치하는 행을 못 찾은 것입니다.
        toast.error("업데이트할 대상을 찾지 못했습니다. (ID 불일치)");
      }
    }
  };

  const handleSave = () => {
    toast.info("작성 내용을 로컬에 유지합니다.");
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl border-t-8 border-primary">
        {selectedBooks.length === 0 ? (
          /* --- Case 1: 선택된 책이 없을 때 (Empty State) --- */
          <div className="py-12 text-center">
            <div className="text-5xl mb-4">📖</div>
            <h3 className="text-xl font-bold text-gray-700">
              선택된 도서가 없습니다
            </h3>
            <p className="text-gray-500 mt-2">
              로드맵 발행을 위해 책을 추가해 주세요.
            </p>
            <div className="modal-action justify-center mt-6">
              <button onClick={closeModal} className="btn btn-primary px-10">
                확인
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="font-bold text-2xl text-primary mb-1">
              나의 독서 로드맵 발행
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              전체적인 로드맵의 주제와 설명을 입력해주세요.
            </p>
            {/* --- 로드맵 정보 입력 영역 --- */}
            <div className="grid grid-cols-1 gap-4 bg-base-200 p-5 rounded-2xl mb-6">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-bold">로드맵 제목</span>
                </label>
                <input
                  type="text"
                  placeholder="예: 2024년 개발자 필독서 루트"
                  className="input input-bordered w-full"
                  value={routeTitle || ""}
                  onChange={(e) => setRouteTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-bold">카테고리</span>
                  </label>
                  <input
                    type="text"
                    placeholder="예: IT/자기계발"
                    className="input input-bordered w-full"
                    value={category || ""}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-bold">대표 썸네일</span>
                  </label>
                  <div className="flex items-center gap-2 text-xs text-gray-400 border rounded-lg px-3 bg-white h-[3rem]">
                    {selectedBooks[0]?.thumbnail
                      ? "✅ 첫 번째 도서 이미지 자동 선택"
                      : "선택된 도서 없음"}
                  </div>
                </div>
              </div>

              {/* 상세 설명 영역 */}
              <div className="form-control mt-4">
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <label className="label pt-2 w-full md:w-32 shrink-0">
                    <span className="label-text font-bold text-base text-gray-700">
                      로드맵 상세 설명
                    </span>
                  </label>
                  <div className="flex-grow w-full">
                    <textarea
                      placeholder="이 로드맵에 대한 전체적인 소개를 적어주세요."
                      className="textarea textarea-bordered w-full h-32 text-sm leading-relaxed"
                      value={content || ""}
                      onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    <p className="text-xs text-gray-400 mt-1 pl-1">
                      ※ 로드맵의 목적이나 추천 대상을 상세히 적으면 더 많은
                      사람이 조회합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>{" "}
            <h4 className="font-bold mb-3 flex items-center gap-2">
              📚 포함된 도서 리스트{" "}
              <div className="badge badge-secondary">
                {selectedBooks.length}
              </div>
            </h4>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {selectedBooks.map((book) => {
                const bookKey = book.isbn || book.title;
                return (
                  <div
                    key={bookKey}
                    className="flex gap-4 border p-3 rounded-xl bg-white shadow-sm relative"
                  >
                    <img
                      src={
                        book.thumbnail ||
                        "https://placehold.co/80x120?text=No+Image"
                      }
                      alt={book.title}
                      className="w-16 h-24 object-cover rounded shadow-sm flex-shrink-0"
                    />
                    <div className="flex-grow">
                      <h5 className="font-bold text-black text-sm line-clamp-1 ">
                        {book.title}
                      </h5>
                      <p className="text-xs text-gray-400 mb-2">
                        {Array.isArray(book.authors)
                          ? book.authors.join(", ")
                          : book.authors}
                      </p>
                      <textarea
                        className="textarea textarea-bordered w-full text-xs h-16 leading-tight"
                        placeholder="이 책을 추천하는 이유를 적어주세요."
                        value={book.note || ""}
                        onChange={(e) =>
                          updateBookNote(bookKey, e.target.value)
                        }
                      />
                    </div>
                    <button
                      onClick={() => removeBook(book)}
                      className="btn btn-circle btn-ghost btn-xs text-error absolute top-2 right-2"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
            {/* --- 하단 액션 버튼 --- */}
            <div className="modal-action mt-8">
              <button onClick={closeModal} className="btn btn-ghost">
                닫기
              </button>
              <button
                onClick={handleSave}
                className="btn btn-outline btn-info"
                disabled={!isAuthenticated}
              >
                임시 저장
              </button>
              <button
                onClick={handlePublish}
                className="btn btn-warning px-10 shadow-lg"
                disabled={!isAuthenticated}
              >
                로드맵 발행하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
