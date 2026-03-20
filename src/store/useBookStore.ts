import { create } from "zustand";
import type { Book, User } from "../types";

interface BookState {
  user: User | null;
  selectedBooks: Book[];
  isModalOpen: boolean;
  isDataLoaded: boolean;
  routeTitle: string;
  category: string;
  content: string;
  setRouteTitle: (title: string) => void;
  setCategory: (category: string) => void;
  setContent: (content: string) => void;
  setIsDataLoaded: (val: boolean) => void;
  setUser: (user: User | null) => void;
  setBooksFromSupabase: (books: Book[]) => void;
  addBook: (book: Book) => void;
  removeBook: (bookToRemove: Book) => void;
  updateBookNote: (bookKey: string, newNote: string) => void;
  updateBookGenre: (bookKey: string, newGenre: string) => void;
  openModal: () => void;
  closeModal: () => void;
  clearSelection: () => void;
}

const useBookStore = create<BookState>((set) => ({
  // --- 상태 (State) ---
  user: null,
  selectedBooks: [],
  isModalOpen: false,
  isDataLoaded: false,
  routeTitle: "",
  category: "",
  content: "",

  setRouteTitle: (title) => set({ routeTitle: title }),
  setCategory: (category) => set({ category: category }),
  setContent: (content) => set({ content: content }),
  setIsDataLoaded: (val) => set({ isDataLoaded: val }),

  setUser: (user) => {
    set({ user });
    if (!user) {
      set({ selectedBooks: [], isModalOpen: false, isDataLoaded: false });
    }
  },

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
