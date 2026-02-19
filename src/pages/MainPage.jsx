import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { Link } from "react-router-dom";
import supabase from "../lib/supabase";
import { toast } from "sonner";

export default function MainPage() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return (
    <div className="px-4 mb-20">
      {/* Hero Section */}
      <section className="hero bg-base-200 py-16 rounded-3xl my-6">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              나만의 도서 로드맵을 <br className="hidden md:block" />
              발견하고 공유하세요 📚
            </h1>
            <p className="py-6 text-lg text-gray-600">
              무엇부터 읽어야 할지 막막하신가요? <br className="md:hidden" />
              검증된 독서 경로를 따라가보세요.
            </p>
            <Link to="/BookSearch">
              <button className="btn btn-primary btn-lg px-8">
                지금 시작하기
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 로드맵 섹션 */}
      <div className="w-full max-w-7xl mx-auto p-4 py-10">
        <h2 className="text-3xl font-bold mb-8 text-center md:text-left flex items-center justify-center md:justify-start gap-2">
          최신 로드맵 탐색 🔥
        </h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : routes.length === 0 ? (
          <div className="text-center py-20 text-gray-400 bg-base-100 rounded-2xl border border-dashed">
            <p className="text-xl">아직 발행된 로드맵이 없습니다.</p>
            <p className="text-sm mt-2">
              첫 번째 로드맵의 주인공이 되어보세요!
            </p>
          </div>
        ) : (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={24}
            slidesPerView={1} // 모바일 기본값
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={routes.length > 3}
            breakpoints={{
              // 화면 크기별 슬라이드 개수 설정
              640: { slidesPerView: 2 }, // 태블릿 가로
              1024: { slidesPerView: 3 }, // 데스크탑
              1280: { slidesPerView: 4 }, // 큰 화면
            }}
            className="py-4" // 상하단 그림자 잘림 방지 여백
          >
            {routes.map((route) => (
              <SwiperSlide key={route.id} className="h-full pb-6">
                {" "}
                {/* pb-6 추가: 하단 그림자 공간 확보 */}
                <div className="card bg-base-100 shadow-md hover:shadow-xl transition-shadow duration-300 border border-base-200 h-full rounded-2xl overflow-hidden group">
                  {/* 이미지 영역 */}
                  <figure className="aspect-[4/3] relative bg-base-300 overflow-hidden">
                    <img
                      src={
                        route.thumbnail ||
                        "https://placehold.co/600x400?text=No+Image"
                      }
                      alt={route.Route_title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {route.category && (
                      <div className="absolute top-3 left-3 badge badge-primary text-white border-none shadow-sm font-medium px-3 py-1.5 z-10">
                        {route.category}
                      </div>
                    )}
                  </figure>

                  {/* 카드 내용 영역 */}
                  <div className="card-body p-6 flex flex-col">
                    <h2 className="card-title text-xl font-bold line-clamp-1 mb-2 h-7">
                      {route.Route_title || (
                        <span className="text-gray-400 font-normal">
                          제목 없는 로드맵
                        </span>
                      )}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-6 flex-grow h-10 leading-relaxed">
                      {route.content || "작성된 상세 내용이 없습니다."}
                    </p>

                    <div className="card-actions mt-auto">
                      {/* 🚀 Link 컴포넌트로 교체된 부분 */}
                      <Link
                        to={`/BookSearch/Route_Book/${route.id}/detail`}
                        className="btn btn-primary w-full md:w-auto md:px-8 font-bold"
                      >
                        상세보기
                      </Link>
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
