import { create } from "zustand";

const useBookStore = create((set) => ({
  // --- 상태 (State) ---
  user: null,
  selectedBooks: [],
  isModalOpen: false,

  // --- 액션 (Actions) ---

  // 사용자 상태 설정 및 로그아웃 처리
  setUser: (user) => {
    set({ user });
    // 만약 로그아웃(user가 null)되면 선택된 책 목록도 비워주는 것이 안전합니다.
    if (!user) {
      set({ selectedBooks: [], isModalOpen: false });
    }
  },

  // 책 추가 (중복 체크 포함)
  addBook: (book) =>
    set((state) => {
      const key = book.isbn || book.title;
      const isAlreadySelected = state.selectedBooks.some(
        (b) => (b.isbn || b.title) === key
      );
      if (isAlreadySelected) return state;

      return {
        selectedBooks: [...state.selectedBooks, { ...book, note: "" }],
      };
    }),

  // 책 제거
  removeBook: (bookToRemove) =>
    set((state) => ({
      selectedBooks: state.selectedBooks.filter(
        (b) => (b.isbn || b.title) !== (bookToRemove.isbn || bookToRemove.title)
      ),
    })),

  // 후기(메모) 업데이트
  updateBookNote: (bookKey, newNote) =>
    set((state) => ({
      selectedBooks: state.selectedBooks.map((book) =>
        (book.isbn || book.title) === bookKey
          ? { ...book, note: newNote }
          : book
      ),
    })),

  // 모달 제어
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),

  // 데이터 초기화 및 외부 데이터 주입
  clearSelection: () => set({ selectedBooks: [], isModalOpen: false }),
  setBooksFromSupabase: (books) => set({ selectedBooks: books || [] }),
}));

export default useBookStore;
