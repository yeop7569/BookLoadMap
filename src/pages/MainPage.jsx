import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
 const books = [
    {
      id: 1,
      title: '모던 자바스크립트',
      description: 'JavaScript 입문자를 위한 완벽 가이드',
      image: 'https://placehold.co/400x300',
    },
    {
      id: 2,
      title: '리액트 완전 정복',
      description: 'React로 만드는 프론트엔드 실전 프로젝트',
      image: 'https://placehold.co/400x300',
    },
    {
      id: 3,
      title: '웹 성능 최적화',
      description: '사용자 경험을 향상시키는 퍼포먼스 전략',
      image: 'https://placehold.co/400x300',
    },
     {
      id: 4,
      title: '배포 잘하기',
      description: '사용자 경험을 향상시키는 퍼포먼스 전략',
      image: 'https://placehold.co/400x300',
    },
  ];
export default function MainPage() {
  return (
    <div className="px-4">
      {/* Hero Section */}
      <section className="hero bg-base-200 py-12">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold">당신만을 위한 도서 로드맵 📚</h1>
            <p className="py-4 text-lg">관심 분야에 맞는 책을 추천하고, 읽은 책을 기반으로 다음 단계를 안내합니다.</p>
            <button className="btn btn-primary">지금 시작하기</button>
          </div>
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <div className="w-full max-w-5xl mx-auto p-4">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={30}
        slidesPerView={3}
        autoplay={{ delay: 3000 }}
        loop={true}
      >
        {books.map((book) => (
          <SwiperSlide key={book.id}>
            <div className="card bg-base-100 shadow-xl mx-auto w-80">
              <figure>
                <img src={book.image} alt={book.title} />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{book.title}</h2>
                <p>{book.description}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  


    </div>
  );
}
