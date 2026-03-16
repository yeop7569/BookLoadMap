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

    let result;
    if (id === "new") {
      result = await supabase
        .from("Book_Route")
        .insert([updateData])
        .select();
    } else {
      result = await supabase
        .from("Book_Route")
        .update(updateData)
        .eq("id", id)
        .select();
    }

    const { data, error } = result;

    if (error) {
      toast.error(error.message);
    } else {
      if (data && data.length > 0) {
        toast.success(id === "new" ? "로드맵을 생성하였습니다!" : "로드맵을 발행하였습니다!");
        closeModal();
        navigate("/");
      } else {
        toast.error("처리 대상을 찾지 못했습니다.");
      }
    }
  };

  const handleSave = async () => {
    const updateData = {
      status: "draft",
      selected_books: selectedBooks,
      Route_title: routeTitle,
      content: content,
      thumbnail: selectedBooks[0]?.thumbnail,
      category: category,
      book_title: selectedBooks.map((b) => b.title).join(", "),
      author: authId,
    };

    let result;
    if (id === "new") {
      result = await supabase
        .from("Book_Route")
        .insert([updateData])
        .select();
    } else {
      result = await supabase
        .from("Book_Route")
        .update(updateData)
        .eq("id", id)
        .select();
    }

    const { data, error } = result;

    if (error) {
      toast.error(error.message);
    } else {
      if (data && data.length > 0) {
        toast.success(id === "new" ? "신규 로드맵이 임시 저장되었습니다!" : "임시 저장완료!");
        if (id === "new") {
          // 신규 생성의 경우 생성된 ID로 URL 변경 (새로고침 시에도 유지되도록)
          navigate(`/BookSearch/Route_Book/${data[0].id}/create`, { replace: true });
        }
        closeModal();
      } else {
        toast.error("처리 대상을 찾지 못했습니다.");
      }
    }
  };

  return (
    <div className="modal modal-open z-[110]">
      <div className="modal-box max-w-4xl bg-zinc-950 border border-zinc-800 rounded-[40px] shadow-2xl p-0 overflow-hidden">
        {selectedBooks.length === 0 ? (
          <div className="py-24 text-center">
            <div className="text-7xl mb-6">🏜️</div>
            <h3 className="text-2xl font-black text-white mb-2">선택된 도서가 없습니다</h3>
            <p className="text-zinc-500 mb-8 max-w-xs mx-auto">로드맵을 구성하려면 먼저 도서를 검색해 주세요.</p>
            <button onClick={closeModal} className="btn btn-primary btn-md rounded-full px-10 border-none font-bold">확인</button>
          </div>
        ) : (
          <div className="flex flex-col h-[85vh]">
            {/* Header */}
            <div className="px-10 py-8 border-b border-zinc-800 bg-black/40 backdrop-blur-xl">
              <h3 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                <span className="text-blue-500">지식의 길</span> 구성하기
              </h3>
              <p className="text-sm text-zinc-500 mt-2">이 로드맵이 가리키는 방향을 상세히 설명해 주세요.</p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto px-10 py-8 custom-scrollbar space-y-10">
              {/* 로드맵 기본 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="form-control">
                    <label className="label mb-2 px-1">
                      <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">로드맵 제목</span>
                    </label>
                    <input
                      type="text"
                      placeholder="예: 2024년 주니어 개발자 성장 루트"
                      className="input w-full bg-zinc-900/50 border-zinc-800 focus:border-blue-500 rounded-2xl h-14 text-white font-medium placeholder:text-zinc-700 transition-all font-sans"
                      value={routeTitle || ""}
                      onChange={(e) => setRouteTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label mb-2 px-1">
                      <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">카테고리</span>
                    </label>
                    <input
                      type="text"
                      placeholder="예: IT/프론트엔드/자기계발"
                      className="input w-full bg-zinc-900/50 border-zinc-800 focus:border-blue-500 rounded-2xl h-14 text-white font-medium placeholder:text-zinc-700 transition-all"
                      value={category || ""}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-control h-full">
                  <label className="label mb-2 px-1">
                    <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">로드맵 가이드 (상세)</span>
                  </label>
                  <textarea
                    placeholder="이 경로를 따라 읽어야 하는 이유나 대상 독자를 구체적으로 적어주세요."
                    className="textarea w-full h-[calc(100%-48px)] bg-zinc-900/50 border-zinc-800 focus:border-blue-500 rounded-3xl text-white font-medium placeholder:text-zinc-700 leading-relaxed transition-all min-h-[160px]"
                    value={content || ""}
                    onChange={(e) => setContent(e.target.value)}
                  ></textarea>
                </div>
              </div>

              {/* 도서 리스트 */}
              <div>
                <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 border-l-2 border-blue-500 pl-4">수록 도서 큐레이션 ({selectedBooks.length})</h4>
                <div className="space-y-6">
                  {selectedBooks.map((book, idx) => {
                    const bookKey = book.isbn || book.title;
                    return (
                      <div
                        key={bookKey}
                        className="group relative flex gap-6 bg-zinc-900/40 border border-zinc-800/80 p-6 rounded-[32px] hover:border-zinc-700 transition-all shadow-sm"
                      >
                         <div className="relative flex-shrink-0">
                            <span className="absolute -top-3 -left-3 w-8 h-8 rounded-xl bg-blue-500 text-black font-black flex items-center justify-center text-xs shadow-lg z-10 rotate-[-10deg]">
                              {idx + 1}
                            </span>
                            <img
                              src={book.thumbnail || "https://placehold.co/80x120?text=No+Image"}
                              alt={book.title}
                              className="w-20 h-28 object-cover rounded-xl shadow-2xl transition-transform group-hover:scale-105"
                            />
                         </div>
                        <div className="flex-grow space-y-4">
                          <div>
                            <h5 className="font-bold text-white text-base line-clamp-1 mb-1">{book.title}</h5>
                            <p className="text-xs text-zinc-500 font-medium tracking-tight">
                              {Array.isArray(book.authors) ? book.authors.join(", ") : book.authors}
                            </p>
                          </div>
                          <textarea
                            className="textarea w-full bg-black/40 border-zinc-800 focus:border-blue-500/50 rounded-2xl text-xs h-20 leading-relaxed placeholder:text-zinc-800 transition-all font-sans italic"
                            placeholder="이 책이 이 단계에서 필요한 이유를 적어주세요."
                            value={book.note || ""}
                            onChange={(e) => updateBookNote(bookKey, e.target.value)}
                          />
                        </div>
                        <button
                          onClick={() => removeBook(book)}
                          className="btn btn-ghost hover:bg-red-500/10 hover:text-red-400 text-zinc-700 w-10 h-10 p-0 rounded-full transition-all absolute top-2 right-2"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-10 py-8 bg-zinc-900/60 border-t border-zinc-800 backdrop-blur-xl flex justify-between items-center gap-4">
               <button onClick={closeModal} className="text-zinc-500 font-bold hover:text-white transition-colors">나중에 하기</button>
               <div className="flex gap-4">
                 <button
                   onClick={handleSave}
                   className="btn btn-ghost bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 text-white rounded-2xl px-8 font-bold"
                   disabled={!isAuthenticated}
                 >
                   임시 저장
                 </button>
                 <button
                   onClick={handlePublish}
                   className="btn btn-primary bg-blue-500 hover:bg-blue-400 border-none text-black rounded-2xl px-12 font-black shadow-xl shadow-blue-500/10 hover:scale-105 transition-all h-14 min-h-[auto]"
                   disabled={!isAuthenticated}
                 >
                   로드맵 발행하기 &rarr;
                 </button>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
