import supabase from "../lib/supabase";
import type { Book, BookRoute } from "../types";

const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;

/**
 * 카카오 도서 검색 API
 */
export const searchBooksAPI = async (query: string): Promise<Book[]> => {
  if (!query.trim()) return [];

  try {
    const res = await fetch(
      `https://dapi.kakao.com/v3/search/book?target=title&query=${encodeURIComponent(
        query
      )}`,
      { headers: { Authorization: `KakaoAK ${KAKAO_API_KEY}` } }
    );
    const data = await res.json();
    return data.documents || [];
  } catch (e) {
    console.error("도서 검색 오류:", e);
    return [];
  }
};

/**
 * 나만의 루트 저장 (임시 저장 또는 등록)
 */
export const saveRouteToSupabase = async (selectedBooks: Book[], userId: string): Promise<boolean> => {
  if (!userId) {
    console.error("저장 실패: 사용자 ID가 없습니다.");
    return false;
  }

  try {
    const { error } = await supabase.from("Book_Route").upsert(
      {
        author: userId,
        route_title: selectedBooks[0]?.title + " 외 루트" || "새 루트",
        book_title: selectedBooks[0]?.title || "",
        comment: "임시 저장된 루트입니다.",
      },
      { onConflict: "author" }
    );

    if (error) throw error;
    console.log("저장 성공");
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Supabase 저장 중 오류 발생:", error.message);
    } else {
      console.error("Supabase 저장 중 알 수 없는 오류 발생");
    }
    return false;
  }
};

/**
 * 저장된 루트 불러오기
 */
export const loadRouteFromSupabase = async (userId: string): Promise<BookRoute | null> => {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from("Book_Route")
      .select("*")
      .eq("author", userId);

    if (error) throw error;
    if (data && data.length > 0) {
      return data[0] as BookRoute;
    }
    return null;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Supabase 불러오기 중 오류 발생:", error.message);
    } else {
      console.error("Supabase 불러오기 중 알 수 없는 오류 발생");
    }
    return null;
  }
};
