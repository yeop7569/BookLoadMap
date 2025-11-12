import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const CurriculumCard = ({ curriculum, onEdit, onDelete }) => (
  <div className="flex flex-col items-center gap-5 w-full group">
    <div className="w-full aspect-[1.58] bg-gray-200 rounded-[10px] overflow-hidden relative">
      <img
        src={curriculum.imageUrl}
        alt={curriculum.title}
        className="w-full h-full object-cover"
      />
      {/* Hover Overlay with Action Buttons */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
        <button
          onClick={() => onEdit(curriculum)}
          className="bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-lg transition-all transform hover:scale-110 shadow-lg"
          aria-label="Edit curriculum"
        >
          <FaEdit size={20} />
        </button>
        <button
          onClick={() => onDelete(curriculum.id)}
          className="bg-error hover:bg-red-600 text-white p-3 rounded-lg transition-all transform hover:scale-110 shadow-lg"
          aria-label="Delete curriculum"
        >
          <FaTrash size={20} />
        </button>
      </div>
    </div>
    <div className="flex flex-col items-start gap-1 w-full">
      <h3 className="text-base font-semibold text-gray-900 leading-tight w-full break-words">
        {curriculum.title}
      </h3>
      <p className="text-sm text-gray-500 leading-snug w-full break-words">
        {curriculum.description}
      </p>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs bg-base-200 text-gray-600 px-2 py-1 rounded">
          {curriculum.category}
        </span>
        <span className="text-xs text-gray-400">
          {curriculum.lessons} lessons
        </span>
      </div>
    </div>
  </div>
);

const MyPage = () => {
  // 임시 로그인 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [curriculums, setCurriculums] = useState([
    {
      id: 1,
      title: "Introduction to React",
      description: "Learn the basics of React and modern web development",
      imageUrl:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
      category: "Web Development",
      lessons: 12,
    },
    {
      id: 2,
      title: "Advanced JavaScript",
      description: "Master async/await, promises, and ES6+ features",
      imageUrl:
        "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
      category: "Programming",
      lessons: 18,
    },
    {
      id: 3,
      title: "CSS & Tailwind",
      description: "Build beautiful, responsive layouts with modern CSS",
      imageUrl:
        "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=250&fit=crop",
      category: "Design",
      lessons: 15,
    },
  ]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleEdit = (curriculum) => {
    console.log("Edit curriculum:", curriculum);
    alert(`Editing: ${curriculum.title}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setCurriculums(curriculums.filter((c) => c.id !== deleteId));
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  // 임시 로그인 함수
  const handleLogin = () => {
    setIsLoggedIn(true);
    alert("로그인되었습니다!");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    alert("로그아웃되었습니다.");
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center">
      {/* Navigation */}
      <nav className="w-full bg-base-200 shadow-sm">
        <div className="max-w-[960px] mx-auto h-16 px-5 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">My Page®</div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-6">
              <a
                href="#"
                className="text-[15px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Home
              </a>
              <a
                href="#"
                className="text-[15px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Curriculums
              </a>
              <a
                href="#"
                className="text-[15px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                About
              </a>
            </div>

            {/* 로그인/마이페이지 버튼 */}
            {!isLoggedIn ? (
              <button onClick={handleLogin} className="btn btn-primary btn-sm">
                로그인
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button className="btn btn-ghost btn-sm">마이페이지</button>
                <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                  로그아웃
                </button>
              </div>
            )}
          </div>
          {/* Mobile Menu Button */}
          <button className="sm:hidden text-gray-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      {isLoggedIn ? (
        <main className="w-full max-w-[960px] px-5 py-10 sm:py-20 flex flex-col gap-10 sm:gap-20">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
            <div className="flex flex-col gap-2.5">
              <h1 className="text-2xl sm:text-[32px] font-bold tracking-tight leading-none text-gray-900">
                Manage Curriculums
              </h1>
              <h2 className="text-[15px] font-medium text-gray-500 leading-snug max-w-[330px]">
                View, edit, or remove your book curriculums here.
              </h2>
              <div className="mt-2 text-sm text-gray-500">
                Total: {curriculums.length} curriculums
              </div>
            </div>

            {/* 새 커리큘럼 추가 버튼 */}
            <button className="btn btn-primary gap-2 self-start sm:self-auto">
              <FaPlus size={16} />
              Add New
            </button>
          </div>

          {/* Curriculum Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-y-[30px] sm:gap-x-2.5 w-full">
            {curriculums.map((curriculum) => (
              <CurriculumCard
                key={curriculum.id}
                curriculum={curriculum}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        </main>
      ) : (
        // 로그인 전 안내 메시지
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              로그인이 필요합니다
            </h2>
            <p className="text-gray-600 mb-6">
              나만의 커리큘럼을 관리하려면 로그인해주세요.
            </p>
            <button onClick={handleLogin} className="btn btn-primary btn-lg">
              로그인하기
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Delete Curriculum?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this curriculum? This action
              cannot be undone.
            </p>
            <div className="modal-action">
              <button onClick={cancelDelete} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn btn-error">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
