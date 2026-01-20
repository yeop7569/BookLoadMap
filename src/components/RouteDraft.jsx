import React from "react";
import { LuNotebookPen } from "react-icons/lu";
import Separator from "./Ui/seperator";

// 1. 버튼 컴포넌트 분리
function DraftButton({ hasDraft, modalId }) {
  return (
    <label
      htmlFor={modalId}
      className="btn btn-primary text-white-300 relative"
    >
      <LuNotebookPen size={20} />

      {/* 프롭스(hasDraft)가 true일 때만 빨간 점을 보여줌 */}
      {hasDraft && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
        </span>
      )}
    </label>
  );
}

// 2. 메인 페이지 컴포넌트
function RouteDraft() {
  const modalId = "my_modal_6";
  const [hasDraft, setHasDraft] = React.useState(true); // 나중에 데이터 유무에 따라 false로 바꿀 수 있음

  return (
    <>
      {/* 컴포넌트 호출하며 프롭스 전달 */}
      <DraftButton hasDraft={hasDraft} modalId={modalId} />

      {/* 모달 로직 */}
      <input type="checkbox" id={modalId} className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">임시 저장 루트</h3>
          <p className="py-4 opacity-50 text-base">
            작성 중인 루트가 있습니다 이어서 작성하거나 삭제하세요.
          </p>
          <div className="grid gap-3 py-4">
            <div className="flex items-center gap-2">
              <p>임시 저장</p>
              <p className=" text-base text-blue-600 -mr-[6px]">10</p>
              <p>건</p>
            </div>
            <Separator />
            <div className="min-h-60 flex items-center justify-center">
              <p className="text-muted-foreground/50">정보가 없습니다.</p>
            </div>
            <div className="min-h-60  flex flex-col items-center justify-center gap-3">
              <div className="w-full flex items-center justify-between py-2 px-4 rounded-md cursor-pointer">
                <div className="flex items-start  gap-2">
                  <div className="w-5 h-5 mt-[3px] aspect-square badge badge-primary text-foreground">
                    1
                  </div>
                  <div className="flex flex-col ">
                    <p>등록된 루트가 없습니다.</p>

                    <p className="text-xs opacity-50">2026/1/21</p>
                  </div>
                </div>
                <div className="badge badge-primary badge-outline badge-sm mt-2">
                  작성중
                </div>
              </div>
            </div>
          </div>
          <div className="modal-action">
            <label htmlFor={modalId} className="btn">
              닫기
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default RouteDraft;
