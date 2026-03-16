import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/AuthStore";
import supabase from "../lib/supabase";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function MyPage() {
  const authId = useAuthStore((state) => state.id);
  const email = useAuthStore((state) => state.email);
  const [myRoutes, setMyRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyRoutes = async () => {
    if (!authId) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("Book_Route")
        .select("*")
        .eq("author", authId)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error(error.message);
      } else {
        setMyRoutes(data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authId) {
      fetchMyRoutes();
    }
  }, [authId]);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm("정말로 이 로드맵을 삭제하시겠습니까?")) return;

    try {
      const { error } = await supabase
        .from("Book_Route")
        .delete()
        .eq("id", id)
        .eq("author", authId); // 본인 확인 안전장치

      if (error) {
        toast.error("삭제 실패: " + error.message);
      } else {
        toast.success("로드맵이 삭제되었습니다.");
        setMyRoutes(myRoutes.filter((route) => route.id !== id));
      }
    } catch (error) {
      toast.error("에러가 발생했습니다.");
    }
  };

  if (!authId) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6">
        <div className="text-6xl mb-6">🔒</div>
        <h1 className="text-2xl font-black text-white mb-2">로그인이 필요합니다</h1>
        <p className="text-zinc-500 mb-8 text-center">나만의 로드맵을 관리하려면 로그인을 해주세요.</p>
        <button
          onClick={() => navigate("/Signin")}
          className="btn btn-primary px-10 rounded-2xl text-black font-black"
        >
          로그인하러 가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-16 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-16 bg-zinc-900/30 p-10 rounded-[40px] border border-zinc-800/50 backdrop-blur-xl">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-4xl shadow-2xl shadow-blue-500/20">
            👤
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black tracking-tight text-white mb-2">
              <span className="text-blue-500">{email?.split("@")[0]}</span>님의 서재
            </h1>
            <p className="text-zinc-500 font-medium">관리 중인 로드맵: {myRoutes.length}개</p>
          </div>
          <div className="md:ml-auto flex gap-4">
            <button 
              onClick={() => navigate("/BookSearch")}
              className="btn btn-ghost bg-zinc-800/50 hover:bg-zinc-800 rounded-2xl px-6 font-bold text-sm"
            >
              새 로드맵 만들기
            </button>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-bold border-l-4 border-blue-500 pl-4">내 로드맵 아카이브</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : myRoutes.length === 0 ? (
          <div className="text-center py-32 bg-zinc-900/10 rounded-[40px] border border-zinc-800 border-dashed">
            <p className="text-zinc-500 font-bold mb-6">아직 작성한 로드맵이 없습니다.</p>
            <button 
              onClick={() => navigate("/BookSearch")}
              className="btn btn-outline btn-primary rounded-full px-10"
            >
              첫 로드맵 작성 시작하기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center sm:text-left">
            {myRoutes.map((route) => (
              <div 
                key={route.id}
                onClick={() => navigate(`/BookSearch/Route_Book/${route.id}/detail`)}
                className="group relative bg-zinc-900/40 border border-zinc-800 rounded-[32px] overflow-hidden hover:border-blue-500/30 transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    route.status === 'Publish' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    {route.status === 'Publish' ? 'Published' : 'Draft'}
                  </span>
                </div>

                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={route.thumbnail || "https://placehold.co/600x400?text=No+Image"} 
                    alt={route.Route_title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2">{route.category || "Uncategorized"}</p>
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-1 group-hover:text-blue-400 transition-colors">
                    {route.Route_title || "제목 없는 로드맵"}
                  </h3>
                  <p className="text-zinc-500 text-sm line-clamp-2 mb-8 leading-relaxed flex-grow">
                    {route.content || "상세 내용이 없습니다."}
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-zinc-800 mt-auto">
                    <span className="text-[11px] font-medium text-zinc-600">
                      {dayjs(route.created_at).format("YYYY.MM.DD")}
                    </span>
                    <div className="flex gap-2">
                       <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/BookSearch/Route_Book/${route.id}/create`);
                        }}
                        className="btn btn-ghost btn-sm h-9 px-4 rounded-xl text-zinc-400 hover:text-white transition-colors text-xs font-bold"
                      >
                        수정
                      </button>
                      <button 
                        onClick={(e) => handleDelete(route.id, e)}
                        className="btn btn-ghost btn-sm h-9 px-4 rounded-xl text-zinc-700 hover:text-red-500 hover:bg-red-500/10 transition-colors text-xs font-bold"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
