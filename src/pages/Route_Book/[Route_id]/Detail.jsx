import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../../../lib/supabase";
import { toast } from "sonner";
import dayjs from "dayjs";

export default function RouteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRouteDetail = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("Book_Route")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast.error("정보를 불러오지 못했습니다.");
        console.error(error);
      } else {
        setRoute(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchRouteDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-white mb-4">로드맵을 찾을 수 없습니다.</h1>
        <button onClick={() => navigate("/")} className="btn btn-primary">홈으로 돌아가기</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-32">
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] min-h-[400px] overflow-hidden mb-[-100px] z-0">
        <img 
          src={route.thumbnail || "https://placehold.co/1200x800?text=No+Image"} 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent"></div>
        <div className="absolute left-6 top-10">
           <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-2xl"
          >
            🠔
          </button>
        </div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Header Card */}
        <div className="bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800/50 p-10 md:p-16 rounded-[48px] shadow-2xl mb-16">
          <div className="flex flex-wrap items-center gap-3 mb-6">
             <span className="badge badge-primary font-black px-4 py-3 rounded-full uppercase tracking-wider text-[10px] h-auto">
               {route.category || "General"}
             </span>
             <span className="text-zinc-500 font-bold text-xs uppercase tracking-widest">
                {dayjs(route.created_at).format("YYYY년 MM월 DD일 작성")}
             </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-[1.1]">
            {route.Route_title || "제목 없는 로드맵"}
          </h1>

          <div className="flex items-center gap-4 py-8 border-y border-zinc-800/50 mb-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500"></div>
            <div>
              <p className="text-sm font-bold text-white">커뮤니티 가이드</p>
              <p className="text-xs text-zinc-500">지식의 나침반 제공자</p>
            </div>
          </div>

          <p className="text-lg md:text-xl text-zinc-400 leading-relaxed font-medium">
            {route.content || "이 로드맵에 대한 상세 가이드가 준비되지 않았습니다."}
          </p>
        </div>

        {/* Roadmap List */}
        <div className="space-y-12">
          <h2 className="text-2xl font-black border-l-4 border-blue-500 pl-6 mb-12">로드맵 단계별 가이드</h2>
          
          <div className="relative border-l-2 border-zinc-800 ml-5 pl-10 space-y-20 py-4">
             {route.selected_books && route.selected_books.length > 0 ? (
               route.selected_books.map((book, index) => (
                 <div key={index} className="relative group">
                    {/* Timeline Node */}
                    <div className="absolute left-[-40px] top-0 w-8 h-8 rounded-xl bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center text-xs font-black text-zinc-500 group-hover:border-blue-500 group-hover:text-blue-500 transition-all shadow-xl">
                      {index + 1}
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 bg-zinc-900/20 p-8 rounded-[32px] border border-zinc-800/50 hover:bg-zinc-900/40 transition-all">
                       <img 
                        src={book.thumbnail || "https://placehold.co/120x180?text=No+Image"} 
                        alt={book.title}
                        className="w-32 h-48 object-cover rounded-2xl shadow-2xl flex-shrink-0"
                      />
                      <div className="flex flex-col">
                        <h3 className="text-2xl font-bold text-white mb-2 leading-tight">{book.title}</h3>
                        <p className="text-sm text-zinc-500 font-bold mb-6 tracking-tight">
                          {Array.isArray(book.authors) ? book.authors.join(", ") : book.authors}
                        </p>
                        
                        <div className="bg-black/40 p-6 rounded-2xl border border-zinc-800/50 border-dashed">
                          <p className="text-zinc-400 text-sm leading-relaxed italic">
                            {book.note || "작성된 코멘트가 없습니다. 이 단계의 학습 포인트를 놓치지 마세요."}
                          </p>
                        </div>
                      </div>
                    </div>
                 </div>
               ))
             ) : (
               <p className="text-zinc-500 italic">등록된 도서가 없습니다.</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
