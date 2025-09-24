// services/kakaoApi.ts
export async function searchBooks(query) {
  const res = await fetch(
    `https://dapi.kakao.com/v3/search/book?target=title&query=${query}`,
    {
      headers: {
        Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_API_KEY}`,
      },
    }
  );
  if (!res.ok) throw new Error("API 요청 실패");
  return res.json();
}
