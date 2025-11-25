import { create } from "zustand";

const useBookStore = create((set) => ({
  user: null, // Supabase 사용자 객체 저장
  selectedBooks: [],
  isModalOpen: false,

  // 사용자 상태 설정 액션
  setUser: (user) => set({ user }),

  addBook: (book) =>
    set((state) => {
      const key = book.isbn || book.title;
      const isAlreadySelected = state.selectedBooks.some(
        (b) => (b.isbn || b.title) === key
      );
      if (isAlreadySelected) return state;
      return { selectedBooks: [...state.selectedBooks, { ...book, note: "" }] };
    }),

  removeBook: (bookToRemove) =>
    set((state) => {
      const key = bookToRemove.isbn || bookToRemove.title;
      return {
        selectedBooks: state.selectedBooks.filter(
          (b) => (b.isbn || b.title) !== key
        ),
      };
    }),

  updateBookNote: (bookKey, newNote) =>
    set((state) => ({
      selectedBooks: state.selectedBooks.map((book) => {
        const key = book.isbn || book.title;
        if (key === bookKey) {
          return { ...book, note: newNote };
        }
        return book;
      }),
    })),

  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  clearSelection: () => set({ selectedBooks: [], isModalOpen: false }),
  setBooksFromSupabase: (books) => set({ selectedBooks: books }),
}));

export default useBookStore;
