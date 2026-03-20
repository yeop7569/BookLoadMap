import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../../../lib/supabase";
import useBookStore from "../../../store/useBookStore";
import {
  searchBooksAPI,
  loadRouteFromSupabase,
  saveRouteToSupabase,
} from "../../../api/bookService";
import BookCard from "../../../components/BookCard";
import SelectedBooksModal from "../../../components/SelectedBookModal";
import type { Book, BookRoute } from "../../../types";

export default function CreatePage() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const {
    routeTitle,
    setRouteTitle,
    category,
    setCategory,
    content,
    setContent,
    user,
    isDataLoaded,
    setIsDataLoaded,
    selectedBooks,
    isModalOpen,
    addBook,
    removeBook,
    updateBookNote,
    openModal,
    closeModal,
    setBooksFromSupabase,
    setUser,
    updateBookGenre,
  } = useBookStore();

  const isAuthenticated = !!user;
  const { id } = useParams<{ id: string }>();

  const loadInitialData = useCallback(async () => {
    if (id === "new") {
      useBookStore.getState().clearSelection();
      setIsDataLoaded(true);
      return;
    }

    if (id && !isDataLoaded) {
      try {
        console.log("📡 페이지 접속 감지: DB에서 데이터를 복구합니다.");
        const { data, error } = await supabase
          .from("Book_Route")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        if (data) {
          const routeData = data as BookRoute;
          if (routeData.selected_books) {
            setBooksFromSupabase(routeData.selected_books);
            setRouteTitle(routeData.Route_title || "");
            setCategory(routeData.category || "");
            setContent(routeData.content || "");
            setIsDataLoaded(true);
          }
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error("데이터 로드 실패:", err.message);
        } else {
          console.error("데이터 로드 중 알 수 없는 오류 발생");
        }
      }
    }
  }, [id, isDataLoaded, setBooksFromSupabase, setRouteTitle, setCategory, setContent, setIsDataLoaded]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  useEffect(() => {
    const loadDraftData = async () => {
      if (!user?.id || isDataLoaded || id) return;

      try {
        setIsDataLoaded(false);
        const drafts = await loadRouteFromSupabase(user.id);
        if (drafts) {
          setBooksFromSupabase(Array.isArray(drafts.selected_books) ? drafts.selected_books : []);
        }
        setIsDataLoaded(true);
      } catch (error) {
        if (error instanceof Error) {
          console.error("데이터 로드 중 오류:", error.message);
        }
      }
    };

    loadDraftData();
  }, [user?.id, isDataLoaded, id, setBooksFromSupabase, setIsDataLoaded]);

  const searchBooks = useCallback(async () => {
    if (!searchText.trim()) {
      setBooks([]);
      return;
    }
    setLoading(true);
    const results = await searchBooksAPI(searchText);
    setBooks(results);
    setLoading(false);
  }, [searchText]);

  const clearSearchResults = useCallback(() => {
    setSearchText("");
    setBooks([]);
  }, []);

  const selectBook = useCallback((book: Book) => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    addBook(book);
    openModal();
    setShowAuthPrompt(false);
  }, [isAuthenticated, addBook, openModal]);

  const handleSaveDraft = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;

    const success = await saveRouteToSupabase(selectedBooks, user.id);
    if (success) {
      alert("성공적으로 저장되었습니다.");
      closeModal();
    }
  }, [isAuthenticated, user?.id, selectedBooks, closeModal]);

  const renderedBooks = useMemo(() => {
    return books.map((b) => {
      const isSelected = selectedBooks.some(
        (sb) => (sb.isbn || sb.title) === (b.isbn || b.title),
      );
      return (
        <BookCard
          key={b.isbn || b.title}
          book={b}
          isSelected={isSelected}
          onSelect={selectBook}
        />
      );
    });
  }, [books, selectedBooks, selectBook]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-10 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
            나만의 <span className="text-blue-500">지식 지도</span> 그리기
          </h1>
          <p className="text-zinc-500 text-lg">
            직접 읽은 소중한 책들을 연결하여 독창적인 지식의 경로를 만들어보세요.
          </p>
        </div>

        {showAuthPrompt && !isAuthenticated && (
          <div className="relative overflow-hidden bg-blue-500 text-black p-6 rounded-[32px] mb-8 shadow-2xl shadow-blue-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-3xl">🔑</span>
              <div>
                <p className="font-black text-lg">작성 내용을 안전하게 보관하세요</p>
                <p className="text-black/70 text-sm font-medium">로그인을 하시면 작성 중인 로드맵이 자동으로 저장되어 언제든 다시 이어갈 수 있습니다.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/Signin")}
                className="btn bg-black text-white px-8 rounded-2xl hover:bg-zinc-800 border-none font-bold"
              >
                로그인하기
              </button>
              <button
                onClick={() => setShowAuthPrompt(false)}
                className="btn btn-ghost text-black font-bold px-6 border-none"
              >
                나중에 하기
              </button>
            </div>
            <div className="absolute right-[-20px] top-[-20px] text-8xl opacity-10 rotate-12 pointer-events-none">📚</div>
          </div>
        )}

        <div className="bg-zinc-900/40 p-6 rounded-[40px] border border-zinc-800/80 backdrop-blur-xl mb-12">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="수록하고 싶은 도서 제목을 검색하세요..."
                className="w-full pl-12 pr-6 py-5 bg-black/40 border border-zinc-700/50 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm font-medium"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchBooks()}
              />
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500">🔍</span>
            </div>
            <button 
              onClick={searchBooks} 
              className="btn btn-primary h-[60px] min-h-[auto] rounded-3xl px-10 text-black font-black hover:scale-105 transition-transform shadow-lg shadow-blue-500/20 border-none"
            >
              검색하기
            </button>
            {(searchText.trim() || books.length > 0) && (
              <button 
                onClick={clearSearchResults} 
                className="btn btn-ghost h-[60px] min-h-[auto] bg-zinc-800/30 hover:bg-zinc-800 rounded-3xl px-6 border border-zinc-700/50 text-zinc-400"
              >
                리셋
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-xl font-bold flex items-center gap-2">
            검색 결과 
            {books.length > 0 && <span className="text-sm font-medium text-zinc-500 ml-2">{books.length}개의 도서 발견</span>}
          </h2>
          
          {selectedBooks.length > 0 && (
            <button 
              onClick={openModal} 
              className="group animate-bounce-subtle flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl text-black font-black shadow-xl hover:scale-105 transition-all"
            >
              <span>선택한 책 ({selectedBooks.length}) 로드맵 구성</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-zinc-500 font-medium">도서를 찾고 있습니다...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-32 bg-zinc-900/10 rounded-[40px] border border-zinc-800/50 border-dashed">
             <div className="text-5xl mb-6 opacity-30">📖</div>
             <p className="text-zinc-500 font-bold italic">먼저 수록하고 싶은 도서를 검색해 보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {renderedBooks}
          </div>
        )}

        {isModalOpen && (
          <SelectedBooksModal
            selectedBooks={selectedBooks}
            removeBook={removeBook}
            updateBookNote={updateBookNote}
            closeModal={closeModal}
            saveDraft={handleSaveDraft}
            updateBookGenre={updateBookGenre}
            user={user}
          />
        )}
      </div>
      
      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
