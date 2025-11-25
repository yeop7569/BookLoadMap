import { supabase } from "../pages/supabase";

/**
 * 카카오 도서 검색 API
 */
export const searchBooksAPI = async (query) => {
  const KAKAO_API_KEY = "6e083fc4445086456e1165ef9b58ef6a";

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

export const saveDraftToSupabase = async (drafts, userId) => {
  if (!userId) {
    console.error("저장 실패: 사용자 ID가 없습니다.");
    return false;
  }

  if (drafts.length === 0) {
    console.log("저장할 내용이 없습니다.");
    return true;
  }

  const dataToSave = {
    user_id: userId,
    draft_data: drafts,
  };

  try {
    const { error } = await supabase
      .from("book_drafts")
      .upsert(dataToSave, {
        onConflict: "user_id",
      })
      .select();

    if (error) throw error;
    console.log("저장 성공");
    return true;
  } catch (error) {
    console.error("Supabase 저장 중 오류 발생:", error.message);
    return false;
  }
};

export const loadDraftFromSupabase = async (userId) => {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from("book_drafts")
      .select("draft_data")
      .eq("user_id", userId)
      .single();

    if (error && error.details?.includes("rows returned")) {
      return [];
    }

    if (error) throw error;

    if (data && data.draft_data) {
      console.log("불러오기 성공");
      return data.draft_data;
    }
    return [];
  } catch (error) {
    console.error("Supabase 불러오기 중 오류 발생:", error.message);
    return [];
  }
};
