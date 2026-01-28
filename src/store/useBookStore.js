import { create } from "zustand";

const useBookStore = create((set) => ({
  // --- 상태 (State) ---
  user: null,
  selectedBooks: [],
  isModalOpen: false,
  isDataLoaded: false, // 👈 문지기 상태
  routeTitle: "",
  category: "",
  content: "",
  setRouteTitle: (title) => set({ routeTitle: title }),
  setCategory: (category) => set({ category: category }),
  setContent: (content) => set({ content: content }),
  // --- 액션 (Actions) ---

  // 💡 [추가] 문지기 상태를 변경하는 함수
  setIsDataLoaded: (val) => set({ isDataLoaded: val }),

  setUser: (user) => {
    set({ user });
    if (!user) {
      set({ selectedBooks: [], isModalOpen: false, isDataLoaded: false });
    }
  },

  // 중복된 setBooksFromSupabase를 하나로 통합하고 안전하게 배열 처리
  setBooksFromSupabase: (books) =>
    set({
      selectedBooks: Array.isArray(books) ? books : [],
    }),

  addBook: (book) =>
    set((state) => {
      const key = book.isbn || book.title;
      const isAlreadySelected = state.selectedBooks.some(
        (b) => (b.isbn || b.title) === key,
      );
      if (isAlreadySelected) return state;

      return {
        selectedBooks: [...state.selectedBooks, { ...book, note: "" }],
      };
    }),

  removeBook: (bookToRemove) =>
    set((state) => ({
      selectedBooks: state.selectedBooks.filter(
        (b) =>
          (b.isbn || b.title) !== (bookToRemove.isbn || bookToRemove.title),
      ),
    })),

  updateBookNote: (bookKey, newNote) =>
    set((state) => ({
      selectedBooks: state.selectedBooks.map((book) =>
        (book.isbn || book.title) === bookKey
          ? { ...book, note: newNote }
          : book,
      ),
    })),

  updateBookGenre: (bookKey, newGenre) =>
    set((state) => ({
      selectedBooks: state.selectedBooks.map((book) =>
        (book.isbn || book.title) === bookKey
          ? { ...book, genre: newGenre }
          : book,
      ),
    })),

  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),

  clearSelection: () =>
    set({
      selectedBooks: [],
      isModalOpen: false,
      isDataLoaded: false,
      routeTitle: "",
      category: "",
      content: "",
    }),
}));

export default useBookStore;
