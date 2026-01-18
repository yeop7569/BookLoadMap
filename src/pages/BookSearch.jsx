import React, { useState } from "react";
import { Link, Route, useNavigate, useParams } from "react-router-dom";
import { FaSearch, FaList, FaTh } from "react-icons/fa";
import { useAuthStore } from "../store/AuthStore";
import { toast } from "sonner";
import supabase from "../lib/supabase";
import { LuNotebookPen } from "react-icons/lu";
import { VscCircleSmall, VscCircleFilled } from "react-icons/vsc";
import RouteDraft from "../components/RouteDraft";

export default function BookSearch() {
  const [searchText, setSearchText] = useState("");
  const [isGridView, setIsGridView] = useState(true);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const authId = useAuthStore((state) => state.id);
  const navigate = useNavigate();

  const handleRoute = async () => {
    if (!authId) {
      toast.warning("루트 작성은 로그인이 필요합니다.");
      return;
    }
    // 도서 루트 생성  버튼 클릭
    //정책 auth.uid()= ahthor
    const { data, error } = await supabase
      .from("Book_Route")
      .insert([
        {
          Route_title: null,
          content: null,
          thumbnail: null,
          category: null,
          book_title: null,
          author: authId,
        },
      ])

      .select();

    if (error) {
      toast.error(error.message);
      return;
    }
    console.log(data);

    if (data) {
      toast.success("루트를 생성하였습니다.");
    }

    navigate(`Route_Book/${data[0].id}/create`);
  };
  // 카카오 책 검색 API 호출
  const searchBooks = async () => {
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
      setError(e.message || "에러가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  const thumb = (url) => url || "https://placehold.co/400x400?text=No+Image";

  return (
    <div className="container mx-auto px-4 py-16">
      {/* 상단: 검색 + 뷰 토글 + 작성하기 버튼 */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="책 제목을 입력하세요"
            className="w-full pl-10 pr-24 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchBooks()}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <button
            onClick={searchBooks}
            className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-primary btn-sm"
          >
            검색
          </button>
        </div>

        {/* 작성하기 버튼 */}

        <button
          className="btn btn-primary text-white-400"
          onClick={handleRoute}
        >
          <LuNotebookPen />
          나만의 도서 루트 작성
        </button>
        {/* 임시 저장 버튼  */}
        <RouteDraft>
          {" "}
          <button className="btn btn-primary text-white-300 relative">
            <LuNotebookPen size={20} />
            <VscCircleFilled
              size={16}
              className="absolute -top-1 -right-1 text-red-500"
            />
          </button>
        </RouteDraft>

        {/* 뷰 토글 */}
        <div className="flex space-x-2">
          <button
            onClick={() => setIsGridView(true)}
            className={`p-2 rounded-lg ${
              isGridView ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            <FaTh />
          </button>
          <button
            onClick={() => setIsGridView(false)}
            className={`p-2 rounded-lg ${
              !isGridView ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            <FaList />
          </button>
        </div>
      </div>

      {/* 상태 표시 */}
      {loading && (
        <div className="text-center py-10 text-gray-500">불러오는 중...</div>
      )}
      {error && <div className="text-center py-4 text-red-500">{error}</div>}

      {/* 결과 영역 */}
      {!loading && !error && (
        <>
          {books.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xl text-gray-500">
                {searchText
                  ? "검색 결과가 없습니다"
                  : "원하시는 책이 있는지 확인해보세요 최대 18개까지 검색이 됩니다."}
              </p>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                isGridView
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {books.map((b) => {
                const key = `${b.isbn}_${b.datetime || b.title}`;
                return (
                  <Link
                    key={key}
                    className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col items-center"
                    to={`/books/${encodeURIComponent(b.isbn || b.title)}`}
                  >
                    <img
                      src={thumb(b.thumbnail)}
                      alt={b.title}
                      className="w-40 sm:w-32 aspect-[2/3] object-cover rounded-t mb-4"
                    />
                    <div className="p-4 w-full">
                      <h2 className="text-lg font-bold text-gray-900 line-clamp-2">
                        {b.title}
                      </h2>
                      <p className="text-sm text-gray-700 mt-1">
                        {Array.isArray(b.authors) && b.authors.length > 0
                          ? b.authors.join(", ")
                          : "저자 정보 없음"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {b.publisher}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
