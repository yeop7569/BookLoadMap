import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LuNotebookPen } from "react-icons/lu";
import { toast } from "sonner";
import { useAuthStore } from "../store/AuthStore";
import supabase from "../lib/supabase";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

// 1. 버튼 컴포넌트
function DraftButton({ hasDraft, modalId }) {
  return (
    <label
      htmlFor={modalId}
      className="btn btn-primary text-white-300 relative"
    >
      <LuNotebookPen size={20} />
      {/* 데이터가 있을 때만 빨간 점 표시 */}
      {hasDraft && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
        </span>
      )}
    </label>
  );
}

// 2. 메인 페이지 컴포넌트
function RouteDraft({ children }) {
  const modalId = "my_modal_6";
  const [hasDraft, setHasDraft] = useState(false);
  const authId = useAuthStore((state) => state.id);
  const [drafts, setDraft] = useState([]);
  const navigate = useNavigate();

  const fetchDrafts = async () => {
    if (!authId) return;

    try {
      let { data: Book_Route, error } = await supabase
        .from("Book_Route")
        .select("*")
        .eq("author", authId)
        .eq("status", "draft");

      if (error) {
        toast.error(error.message);
        return;
      }

      if (Book_Route) {
        setDraft(Book_Route);
        setHasDraft(Book_Route.length > 0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (authId) fetchDrafts();
  }, [authId]);

  const modalContent = (
    <>
      <input type="checkbox" id={modalId} className="modal-toggle" />
      <div className="modal z-[1000]" role="dialog">
        <div className="modal-box bg-zinc-950 border border-zinc-800 rounded-[32px] p-8 shadow-2xl overflow-hidden max-w-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
               <span className="text-blue-500">임시 저장</span> 로드맵
            </h3>
            <label htmlFor={modalId} className="btn btn-ghost btn-sm rounded-full">✕</label>
          </div>
          
          <p className="text-zinc-500 mb-8 font-medium">
            작성 중단했던 로드맵이 있습니다. <br />
            이어서 작성하거나 관리할 수 있습니다.
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">저장된 목록 ({drafts.length})</span>
            </div>
            
            <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
              {drafts.length > 0 ? (
                drafts.map((draft, index) => (
                  <div
                    key={draft.id}
                    className="group flex items-center justify-between p-5 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 rounded-2xl transition-all cursor-pointer"
                    onClick={() => {
                      document.getElementById(modalId).checked = false;
                      navigate(`/BookSearch/Route_Book/${draft.id}/create`);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-200 group-hover:text-blue-400 transition-colors line-clamp-1">
                          {draft.Route_title || "제목 없는 로드맵"}
                        </p>
                        <p className="text-[11px] text-zinc-600 mt-1">
                          {dayjs(draft.created_at).format("YYYY년 MM월 DD일 작성")}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-zinc-500 group-hover:text-blue-500 transition-colors">
                      열기 🡥
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 flex flex-col items-center justify-center gap-4 bg-zinc-900/20 rounded-3xl border border-zinc-800/50 border-dashed">
                  <span className="text-4xl opacity-20">📂</span>
                  <p className="text-zinc-600 font-medium">저장된 임시 로드맵이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
          <div className="modal-action mt-10">
            <label htmlFor={modalId} className="btn bg-zinc-800 hover:bg-zinc-700 border-none text-white rounded-xl px-8 font-bold w-full h-14 min-h-[auto]">
              닫기
            </label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor={modalId}>Close</label>
      </div>
    </>
  );

  return (
    <>
      {children ? (
        <label htmlFor={modalId} className="cursor-pointer">
          {children}
        </label>
      ) : (
        <DraftButton hasDraft={hasDraft} modalId={modalId} />
      )}
      {createPortal(modalContent, document.body)}
    </>
  );
}

export default RouteDraft;
