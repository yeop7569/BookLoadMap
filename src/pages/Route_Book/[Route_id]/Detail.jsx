// RouteDetail.jsx (기존 파일)
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../../lib/supabase";
export default function RouteDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      const { data: roadmap, error } = await supabase
        .from("Book_Route")
        .select("*")
        .eq("id", id)
        .single();

      if (roadmap) setData(roadmap);
    };
    fetchDetail();
  }, [id]);

  if (!data) return <div className="p-10 text-center">불러오는 중...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* 로드맵 기본 정보 */}
      <h1 className="text-3xl font-bold mb-2">{data.Route_title}</h1>
      <div className="badge badge-secondary mb-6">{data.category}</div>
      <p className="text-gray-600 mb-10">{data.content}</p>

      {/* 핵심: 저장된 책 리스트 순서대로 보여주기 */}
      <div className="space-y-8">
        <h2 className="text-xl font-bold underline decoration-primary">
          독서 경로 리스트
        </h2>
        {data.selected_books?.map((book, index) => (
          <div
            key={index}
            className="flex gap-6 border-l-4 border-primary pl-4 py-2"
          >
            <img
              src={book.thumbnail}
              className="w-24 h-36 object-cover rounded shadow-md"
            />
            <div>
              <h3 className="font-bold text-lg">
                {index + 1}. {book.title}
              </h3>
              <p className="text-sm text-gray-400 mb-3">
                {book.authors?.join(", ")}
              </p>
              {/* 사용자가 작성했던 추천 이유(note) */}
              <div className="bg-base-200 p-3 rounded-lg text-sm italic">
                "{book.note || "추천 이유가 작성되지 않았습니다."}"
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
