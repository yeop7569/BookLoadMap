// src/components/Header.jsx
export default function Header() {
    return (
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">BookMap</h1>
        <nav className="space-x-4">
          <button className="text-gray-700 hover:text-blue-500">로그인</button>
          <button className="text-gray-700 hover:text-blue-500">회원가입</button>
        </nav>
      </header>
    );
  }
  