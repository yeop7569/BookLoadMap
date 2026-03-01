import { useNavigate } from "react-router-dom";
// 경로와 철자를 확인하세요 (Separator가 맞을 확률이 높음)
import Separator from "../../../components/Ui/Separator";

export default function RouteDetail() {
  const navigate = useNavigate();

  return (
    // flex 제거하여 수직으로 쌓이게 변경
    <main className="w-full min-h-screen p-6 bg-[#0a0a0a] text-white">
      {/* 상단 배경 영역 */}
      <div className="relative w-full h-[400px] bg-zinc-900 bg-cover bg-[50%_35%] overflow-hidden rounded-2xl">
        {/* 뒤로가기 버튼 */}
        <button
          className="z-50 absolute top-6 left-6 text-2xl font-bold hover:scale-110 transition-transform cursor-pointer"
          onClick={() => navigate("/")}
        >
          🠔
        </button>

        {/* 그라데이션 (pointer-events-none 필수) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/60 via-transparent"></div>

        {/* 텍스트를 이미지 위에 중앙 정렬하고 싶을 때 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-sm text-zinc-400 mb-2">프로그래밍</p>
          <h1 className="text-4xl font-extrabold tracking-tight">
            수파베이스 활용 Crud
          </h1>
          {/* Separator의 너비를 지정해서 배치 */}
          <div className="w-32 mt-4">
            <Separator />
          </div>
        </div>
      </div>

      {/* 하단 상세 내용 섹션 */}
      <section className="mt-12 max-w-4xl mx-auto">
        {/* 여기에 추가 내용을 작성하세요 */}
      </section>
    </main>
  );
}
