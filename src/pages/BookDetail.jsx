import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(
          `https://dapi.kakao.com/v3/search/book?target=isbn&query=${encodeURIComponent(id)}`,
          {
            headers: {
              Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_API_KEY}`,
            },
          }
        );
        if (!res.ok) throw new Error('API 요청 실패');
        const data = await res.json();
        setBook(data.documents?.[0] || null);
      } catch (e) {
        setError(e.message || '에러 발생');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) return <div className="p-10 text-center">불러오는 중...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!book) return <div className="p-10 text-center">책 정보를 찾을 수 없습니다</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
  <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row gap-6">
    {/* 이미지 영역 */}
    <div className="flex justify-center sm:justify-start">
      <img
        src={book.thumbnail || 'https://placehold.co/400x300?text=No+Image'}
        alt={book.title}
        className="w-40 sm:w-56 md:w-64 lg:w-72 object-cover rounded"
      />
    </div>

    {/* 텍스트 영역 */}
    <div className="flex-1">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">
        {book.title}
      </h1>
      <p className="text-gray-700 mb-1">
        저자: {book.authors?.length ? book.authors.join(', ') : '정보 없음'}
      </p>
      <p className="text-gray-700 mb-1">출판사: {book.publisher}</p>
      <p className="text-gray-700 mb-1">출판일: {book.datetime?.slice(0, 10)}</p>
      <p className="text-gray-500 mt-4 whitespace-pre-line">{book.contents}</p>
      <a
        href={book.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-4 text-blue-600 underline"
      >
        카카오 도서 링크
      </a>
    </div>
  </div>
</div>

  );
}
