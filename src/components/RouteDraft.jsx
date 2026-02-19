import React, { useEffect, useState } from "react";
import { LuNotebookPen } from "react-icons/lu";
import Separator from "./Ui/seperator";
import { toast } from "sonner";
import { useAuthStore } from "../store/AuthStore";
import supabase from "../lib/supabase";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

// 1. 버튼 컴포넌트 (동일)
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
function RouteDraft() {
  const modalId = "my_modal_6";
  const [hasDraft, setHasDraft] = useState(false); // 초기값 false로 변경
  const authId = useAuthStore((state) => state.id);
  const [drafts, setDraft] = useState([]);
  const navigate = useNavigate();

  const fetchDrafts = async () => {
    if (!authId) return; // 로그인 안 되어 있으면 중단

    try {
      let { data: Book_Route, error } = await supabase
        .from("Book_Route")
        .select("*")
        .eq("author", authId)
        .eq("status", "draft"); // 👈 null에서 "draft"로 수정!

      if (error) {
        toast.error(error.message);
        return;
      }

      if (Book_Route) {
        setDraft(Book_Route);
        // 데이터가 1개라도 있으면 true, 없으면 false
        setHasDraft(Book_Route.length > 0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (authId) fetchDrafts();
  }, [authId]);

  return (
    <>
      <DraftButton hasDraft={hasDraft} modalId={modalId} />

      <input type="checkbox" id={modalId} className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">임시 저장 루트</h3>
          <p className="py-4 opacity-50 text-base">
            작성 중인 루트가 있습니다 이어서 작성하거나 삭제하세요.
          </p>

          <div className="grid gap-3 py-4">
            <div className="flex items-center gap-2 font-bold">
              <p>임시 저장</p>
              <p className="text-base text-blue-600 -mr-[6px]">
                {drafts.length}
              </p>
              <p>건</p>
            </div>
            <Separator />

            <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {drafts.length > 0 ? (
                drafts.map((draft, index) => (
                  <div
                    key={draft.id}
                    className="flex flex-col border-b last:border-none hover:bg-base-200 rounded-lg transition-colors"
                  >
                    <div
                      className="w-full flex items-center justify-between py-4 px-4 cursor-pointer"
                      onClick={() => {
                        // 모달 닫기 위해 체크박스 해제 (선택사항)
                        document.getElementById(modalId).checked = false;
                        navigate(`/BookSearch/Route_Book/${draft.id}/create`);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-primary text-white text-xs font-bold shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex flex-col">
                          <p className="font-semibold text-gray-800 line-clamp-1">
                            {draft.Route_title || "제목 없는 로드맵"}
                          </p>
                          <p className="text-xs opacity-50">
                            작성일 :{" "}
                            {dayjs(draft.created_at).format("YYYY.MM.DD")}
                          </p>
                        </div>
                      </div>
                      <div className="badge badge-primary badge-outline badge-sm shrink-0">
                        작성중
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="min-h-40 flex flex-col items-center justify-center gap-2">
                  <div className="text-4xl opacity-20">📂</div>
                  <p className="text-gray-400">임시 저장된 정보가 없습니다.</p>
                </div>
              )}
            </div>
          </div>

          <div className="modal-action">
            <label htmlFor={modalId} className="btn btn-ghost">
              닫기
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default RouteDraft;
