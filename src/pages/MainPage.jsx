import React, { useEffect, useState } from "react"; // 👈 useState 추가
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { Link } from "react-router-dom";
import supabase from "../lib/supabase";
import { toast } from "sonner"; // 👈 toast 임포트 확인

export default function MainPage() {
  // 1. 상태값들은 모두 컴포넌트 안으로!
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. 발행된 로드맵 조회 함수
  const fetchRoutes = async () => {
    try {
      setLoading(true); // 로딩 시작
      const { data: Book_Routes, error } = await supabase
        .from("Book_Route")
        .select("*")
        .eq("status", "Publish")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error(error.message);
      }

      if (Book_Routes) {
        setRoutes(Book_Routes);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // 성공하든 실패하든 로딩 끝
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return (
    <div className="px-4">
      {/* Hero Section */}
      <section className="hero bg-base-200 py-12">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold">당신만을 위한 도서 로드맵 📚</h1>
            <p className="py-4 text-lg">
              독서에도 순서가 있습니다. 추천 해드릴게요.
            </p>
            <Link to="/BookSearch">
              <button className="btn btn-primary">지금 시작하기</button>
            </Link>
          </div>
        </div>
      </section>

      {/* 로드맵 섹션 */}
      <div className="w-full max-w-5xl mx-auto p-4 py-10">
        <h2 className="text-2xl font-bold mb-6">최신 로드맵 탐색 🔥</h2>

        {/* 3. 로딩 중일 때 처리 */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : routes.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            발행된 로드맵이 없습니다.
          </div>
        ) : (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={3}
            autoplay={{ delay: 3000 }}
            loop={routes.length > 3} // 데이터가 충분할 때만 루프
          >
            {/* 4. 가짜 데이터(books) 대신 진짜 데이터(routes) 사용 */}
            {routes.map((route) => (
              <SwiperSlide key={route.id}>
                <div className="card bg-base-100 shadow-xl mx-auto w-80 border border-base-200 h-[420px]">
                  <figure className="h-48 overflow-hidden">
                    <img
                      src={
                        route.thumbnail ||
                        "https://placehold.co/400x300?text=No+Image"
                      }
                      alt={route.Route_title}
                      className="w-full h-full object-cover"
                    />
                  </figure>
                  <div className="card-body">
                    <div className="badge badge-outline text-xs mb-1">
                      {route.category}
                    </div>
                    <h2 className="card-title text-lg line-clamp-1">
                      {route.Route_title}
                    </h2>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {route.content}
                    </p>
                    <div className="card-actions justify-end mt-auto">
                      {/* 상세페이지 링크는 나중에 연결 */}
                      <button className="btn btn-sm btn-primary">
                        상세보기
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}
