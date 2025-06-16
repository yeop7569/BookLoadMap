import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-base-200 text-base-content py-6 px-8 fixed bottom-0 left-0">
      <div className="max-w-7xl mx-auto flex justify-between">
        <aside className="flex flex-col gap-2">
          <p className="text-lg font-bold">BookLoadMap</p>
          <p>당신의 책 추천 로드맵<br />© 2025 BookLoadMap. All rights reserved.</p>
        </aside>
        <nav className="flex flex-col gap-2">
          <h6 className="footer-title">Links</h6>
          <a className="link link-hover">홈</a>
         
          <a className="link link-hover">문의</a>
        </nav>
      </div>
    </footer>
  );
}
