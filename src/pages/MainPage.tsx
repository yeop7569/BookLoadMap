import React, { useEffect, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import supabase from "../lib/supabase";
import { toast } from "sonner";
import type { BookRoute } from "../types";

export default function MainPage() {
  const [routes, setRoutes] = useState<BookRoute[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoutes = useCallback(async () => {
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
        setRoutes(Book_Routes as BookRoute[]);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 blur-[120px] rounded-full"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest uppercase bg-white/5 border border-white/10 rounded-full text-blue-400">
            당신의 성장을 위한 필독의 지도
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter">
            지식의 바다에서 <br />
            <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-400 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
              길을 잃지 마세요
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            분야별 전문가와 독서가들이 설계한 검증된 로드맵을 따라 <br className="hidden md:block" />
            가장 효율적인 성장의 경로를 발견하고 공유하세요.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/BookSearch">
              <button className="btn btn-primary btn-lg rounded-full px-12 text-black font-black hover:scale-105 transition-transform">
                로드맵 만들기
              </button>
            </Link>
            <button 
              onClick={() => {
                const el = document.getElementById('explore');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn btn-outline btn-lg rounded-full px-12 text-white border-white/20 hover:bg-white/5 hover:border-white/40 transition-all"
            >
              최신 로드맵 탐색
            </button>
          </div>
        </div>

        <div className="absolute top-1/4 left-10 text-6xl opacity-10 animate-pulse rotate-12">📚</div>
        <div className="absolute bottom-1/4 right-10 text-6xl opacity-10 animate-pulse -rotate-12">🚀</div>
      </section>

      <div id="explore" className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl font-black tracking-tight mb-4">
              최신 로드맵 탐색 🔥
            </h2>
            <p className="text-zinc-400 text-lg">
              커뮤니티가 추천하는 최고의 독서 가이드들을 지금 바로 확인해 보세요.
            </p>
          </div>
          <Link to="/BookSearch" className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">
            전체 보기 &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : routes.length === 0 ? (
          <div className="text-center py-32 bg-zinc-900/30 rounded-[40px] border border-zinc-800 border-dashed">
            <p className="text-2xl font-bold text-zinc-500">아직 발행된 로드맵이 없습니다.</p>
            <p className="text-zinc-600 mt-4 max-w-sm mx-auto">
              당신이 읽은 책들을 지도 삼아 첫 번째 로드맵의 가이드가 되어보세요!
            </p>
            <Link to="/BookSearch">
              <button className="btn btn-primary btn-md rounded-full mt-8 font-bold">
                첫 로드맵 작성하기
              </button>
            </Link>
          </div>
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={32}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1440: { slidesPerView: 4 },
            }}
            className="pb-16"
          >
            {routes.map((route) => (
              <SwiperSlide key={route.id}>
                <div className="group relative h-full bg-zinc-900/50 rounded-[32px] overflow-hidden border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-500 flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={route.thumbnail || "https://placehold.co/600x400?text=No+Image"}
                      alt={route.Route_title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                    {route.category && (
                      <div className="absolute top-4 left-4 badge badge-primary font-bold px-4 py-3 rounded-full shadow-lg border-none text-[10px] uppercase tracking-wider">
                        {route.category}
                      </div>
                    )}
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-3 line-clamp-1 group-hover:text-blue-400 transition-colors leading-tight">
                      {route.Route_title || "제목 없는 로드맵"}
                    </h3>
                    <p className="text-zinc-500 text-sm line-clamp-2 mb-8 leading-relaxed flex-grow">
                      {route.content || "상세 설명이 비어 있는 로드맵입니다."}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500"></div>
                        <span className="text-xs font-medium text-zinc-400">커뮤니티 가이드</span>
                      </div>
                      <Link
                        to={`/BookSearch/Route_Book/${route.id}/detail`}
                        className="text-white font-bold text-sm flex items-center gap-1 group/btn"
                      >
                        상세보기
                        <span className="transition-transform group-hover/btn:translate-x-1">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 6s ease infinite;
        }
      `}</style>
    </div>
  );
}
