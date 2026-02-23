import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../../../lib/supabase";
import { toast } from "sonner";
import dayjs from "dayjs";

export default function RouteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [routeData, setRouteData] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      // 1. 로드맵 기본 정보 가져오기
      const { data: route, error: routeError } = await supabase
        .from("Book_Route")
        .select("*")
        .eq("id", id)
        .single();

      if (routeError) throw routeError;
      setRouteData(route);

      // 2. 해당 로드맵에 포함된 책 목록 가져오기 (만약 별도 테이블이라면 여기서 fetch)
      // 현재는 route 데이터 안에 selected_books가 JSON 형태로 들어있다고 가정하거나
      // 관련 테이블에서 가져오는 로직을 여기에 넣으시면 됩니다.
      if (route.selected_books) {
        setBooks(route.selected_books);
      }
    } catch (error) {
      toast.error("데이터를 불러오는데 실패했습니다.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!routeData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-gray-500">존재하지 않는 로드맵입니다.</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          메인으로 이동
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 pb-20">
      {/* --- 상단 Hero 섹션 --- */}
      <section className="bg-gradient-to-b from-primary/10 to-transparent pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="badge badge-primary badge-outline mb-6 px-4 py-3 font-semibold">
            {routeData.category || "미분류"}
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tight text-gray-900">
            {routeData.Route_title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed whitespace-pre-wrap">
            {routeData.content || "이 로드맵에 대한 상세 설명이 없습니다."}
          </p>

          <div className="flex items-center justify-center gap-4 mt-10 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
              <span className="text-gray-400">By</span>
              <span className="font-bold text-gray-800">작성자 님</span>
              <span className="text-gray-300 mx-1">|</span>
              <span className="text-gray-500">
                {dayjs(routeData.created_at).format("YYYY.MM.DD")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* --- 메인 콘텐츠: 타임라인형 리스트 --- */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-12 border-b pb-6">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            추천 독서 경로
            <div className="badge badge-neutral">{books.length}</div>
          </h3>
        </div>

        <div className="relative space-y-16">
          {books.length > 0 ? (
            books.map((book, index) => (
              <div
                key={index}
                className="relative flex flex-col md:flex-row gap-8 group"
              >
                {/* 왼쪽 스텝 표시 (데스크탑 전용 선) */}
                <div className="hidden md:flex flex-col items-center absolute -left-16 h-full">
                  <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black shadow-lg z-10 group-hover:scale-110 transition-transform">
                    {index + 1}
                  </div>
                  {index !== books.length - 1 && (
                    <div className="w-1 h-full bg-base-200 mt-2"></div>
                  )}
                </div>

                {/* 책 카드 디자인 */}
                <div className="card md:card-side bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-200 w-full overflow-hidden">
                  <figure className="w-full md:w-56 bg-base-200 shrink-0">
                    <img
                      src={
                        book.thumbnail ||
                        "https://placehold.co/400x600?text=No+Image"
                      }
                      alt={book.title}
                      className="w-full h-full object-cover shadow-inner"
                    />
                  </figure>
                  <div className="card-body p-8 justify-center">
                    <div className="md:hidden badge badge-primary mb-3">
                      STEP {index + 1}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {book.title}
                    </h2>
                    <p className="text-primary font-medium mb-4">
                      {book.authors?.join(", ")}
                    </p>

                    <div className="relative mt-2 p-5 bg-base-200/50 rounded-2xl">
                      <span className="absolute -top-3 left-4 text-4xl text-primary/20 font-serif">
                        “
                      </span>
                      <p className="text-gray-700 leading-relaxed relative z-10">
                        {book.comment ||
                          "작성자가 남긴 코멘트가 없습니다. 이 책을 통해 얻을 수 있는 통찰을 발견해 보세요."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-base-200/30 rounded-3xl border-2 border-dashed border-base-300">
              <p className="text-gray-400 text-lg">
                등록된 책 정보가 없습니다.
              </p>
            </div>
          )}
        </div>

        {/* --- 하단 CTA 섹션 --- */}
        <div className="mt-32 p-10 md:p-16 bg-neutral rounded-[3rem] text-neutral-content text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-10 -mt-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/20 rounded-full -ml-10 -mb-10 blur-3xl"></div>

          <h4 className="text-3xl font-black mb-4 relative z-10">
            이 로드맵이 도움이 되었나요?
          </h4>
          <p className="mb-10 text-lg opacity-80 max-w-md mx-auto relative z-10">
            당신만의 독서 노하우를 담은 로드맵을 만들어 지식을 나눠보세요.
          </p>
          <button
            className="btn btn-primary btn-lg px-10 rounded-2xl font-bold relative z-10"
            onClick={() => navigate("/BookSearch")}
          >
            나도 로드맵 만들기
          </button>
        </div>
      </div>
    </div>
  );
}
