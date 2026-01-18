import React from "react";
import { LuNotebookPen } from "react-icons/lu";

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
          <p className="py-4">
            작성 중인 루트가 있습니다 이어서 작성하거나 삭제하세요.
          </p>
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
