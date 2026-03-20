import React, { useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaList, FaTh } from "react-icons/fa";
import { useAuthStore } from "../store/AuthStore";
import { toast } from "sonner";
import { LuNotebookPen } from "react-icons/lu";
import RouteDraft from "../components/RouteDraft";
import type { Book } from "../types";

export default function BookSearch() {
  const [searchText, setSearchText] = useState("");
  const [isGridView, setIsGridView] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const authId = useAuthStore((state) => state.id);
  const navigate = useNavigate();

  const handleRoute = useCallback(() => {
    if (!authId) {
      toast.warning("루트 작성은 로그인이 필요합니다.");
      return;
    }
    navigate(`Route_Book/new/create`);
  }, [authId, navigate]);

  const searchBooks = useCallback(async () => {
    if (!searchText.trim()) {
      setBooks([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const size = 18;
      const res = await fetch(
        `https://dapi.kakao.com/v3/search/book?target=title&query=${encodeURIComponent(
          searchText,
        )}&size=${size}`,
        {
          headers: {
            Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_API_KEY}`,
          },
        },
      );
      if (!res.ok) throw new Error("API 요청 실패");
      const data = await res.json();
      setBooks(data.documents || []);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message || "에러가 발생했어요.");
      } else {
        setError("알 수 없는 에러가 발생했어요.");
      }
    } finally {
      setLoading(false);
    }
  }, [searchText]);

  const thumb = (url?: string) => url || "https://placehold.co/400x400?text=No+Image";

  const renderedBooks = useMemo(() => {
    return books.map((b) => {
      const key = `${b.isbn}_${b.title}`;
      return isGridView ? (
        <Link
          key={key}
          className="group flex flex-col"
          to={`/books/${encodeURIComponent(b.isbn || b.title)}`}
        >
          <div className="relative aspect-[2/3] mb-4 bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 group-hover:border-blue-500/50 transition-all duration-300 shadow-lg group-hover:shadow-blue-500/10">
            <img
              src={thumb(b.thumbnail)}
              alt={b.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
              <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">{b.publisher}</p>
              <p className="text-[11px] text-zinc-300 line-clamp-1">
                {Array.isArray(b.authors) ? b.authors.join(", ") : "저자 미상"}
              </p>
            </div>
          </div>
          <h2 className="text-sm font-bold text-zinc-300 group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight px-1">
            {b.title}
          </h2>
        </Link>
      ) : (
        <Link
          key={key}
          className="flex gap-6 p-6 bg-zinc-900/30 rounded-[32px] border border-zinc-800/50 hover:bg-zinc-900/60 hover:border-blue-500/30 transition-all group"
          to={`/books/${encodeURIComponent(b.isbn || b.title)}`}
        >
          <img
            src={thumb(b.thumbnail)}
            alt={b.title}
            className="w-24 h-36 object-cover rounded-xl shadow-lg border border-zinc-800"
            loading="lazy"
          />
          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">{b.publisher}</p>
            <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
              {b.title}
            </h2>
            <p className="text-sm text-zinc-400 mb-4">
              {Array.isArray(b.authors) && b.authors.length > 0
                ? b.authors.join(", ")
                : "저자 정보 없음"}
            </p>
            <p className="text-xs text-zinc-500 line-clamp-2 md:line-clamp-none max-w-2xl leading-relaxed">
              이 책에 대한 상세 설명은 준비 중입니다.
            </p>
          </div>
        </Link>
      );
    });
  }, [books, isGridView]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-10 pb-24">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
            새로운 지식의 <span className="text-blue-500">길을 찾아서</span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">
            원하시는 책을 검색하고 나만의 독서 경로를 설계해 보세요.
          </p>
        </div>

        <div className="relative z-[110] mb-12 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-zinc-900/30 p-4 rounded-[32px] border border-zinc-800/50 backdrop-blur-xl">
          <div className="relative flex-grow max-w-2xl">
            <input
              type="text"
              placeholder="책 제목이나 저자를 입력하세요..."
              className="w-full pl-14 pr-32 py-4 bg-black/40 border border-zinc-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchBooks()}
            />
            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500" />
            <button
              onClick={searchBooks}
              className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-primary btn-sm rounded-xl px-6 h-10 min-h-[auto] text-black font-black"
            >
              검색
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="btn btn-primary rounded-2xl h-14 min-h-[auto] px-8 text-black font-black hover:scale-105 transition-transform flex items-center gap-2 shadow-xl shadow-blue-500/10 border-none"
              onClick={handleRoute}
            >
              <LuNotebookPen size={20} />
              <span className="hidden sm:inline">나만의 도서 루트 작성</span>
              <span className="sm:hidden">루트 작성</span>
            </button>

            <div className="flex bg-black/40 p-1.5 rounded-2xl border border-zinc-800">
              <button
                onClick={() => setIsGridView(true)}
                className={`p-3 rounded-xl transition-all ${
                  isGridView ? "bg-zinc-800 text-blue-400 shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <FaTh size={18} />
              </button>
              <button
                onClick={() => setIsGridView(false)}
                className={`p-3 rounded-xl transition-all ${
                  !isGridView ? "bg-zinc-800 text-blue-400 shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <FaList size={18} />
              </button>
            </div>
            
            <RouteDraft>
              <div className="btn btn-ghost bg-zinc-900/50 hover:bg-zinc-900 h-14 w-14 p-0 rounded-2xl border border-zinc-800 relative group flex items-center justify-center cursor-pointer">
                <LuNotebookPen size={20} className="text-zinc-400 group-hover:text-white transition-colors" />
              </div>
            </RouteDraft>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-zinc-500 font-medium animate-pulse">도서 정보를 불러오는 중...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-20 bg-red-500/5 border border-red-500/20 rounded-[32px]">
            <p className="text-red-400 font-bold mb-4">{error}</p>
            <button onClick={searchBooks} className="btn btn-outline btn-sm rounded-full">다시 시도</button>
          </div>
        )}

        {!loading && !error && (
          <>
            {books.length === 0 ? (
              <div className="text-center py-32 bg-zinc-900/20 rounded-[40px] border border-zinc-800 border-dashed">
                <div className="text-6xl mb-6">🔍</div>
                <p className="text-xl font-bold text-zinc-500">
                  {searchText
                    ? `"${searchText}"에 대한 검색 결과가 없습니다.`
                    : "어떤 책을 찾고 계신가요?"}
                </p>
                <p className="text-zinc-600 mt-2">찾으시는 책이 없다면 정확한 제목을 입력해 보세요.</p>
              </div>
            ) : (
              <div
                className={`grid gap-8 ${
                  isGridView
                    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
                    : "grid-cols-1"
                }`}
              >
                {renderedBooks}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
