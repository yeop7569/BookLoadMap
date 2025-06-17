// src/components/Header.jsx
import { Link } from 'react-router-dom';
export default function Header() {
    return (
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
           <Link to="/">
        <button className="text-xl font-bold text-blue-600">BookMap</button>
        </Link> 
        <nav className="space-x-4">
          <button className="text-gray-700 hover:text-blue-500">로그인</button>
          <button className="text-gray-700 hover:text-blue-500">회원가입</button>
        </nav>
      </header>
    );
  }
  