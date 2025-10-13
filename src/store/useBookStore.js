import { create } from 'zustand';

// Zustand 스토어 정의
export const useBookStore = create((set) => ({
  // 1. 상태 (State)
  selectedBooks: [], // 선택된 책 목록 (여기에는 note 필드도 포함)
  isModalOpen: false,  // 모달 표시 여부

  // 2. 액션 (Actions) - 상태를 변경하는 함수들

  // 책을 선택 목록에 추가하는 액션
  addBook: (book) => set((state) => {
    const key = book.isbn || book.title;
    const isAlreadySelected = state.selectedBooks.some(b => (b.isbn || b.title) === key);

    if (isAlreadySelected) {
      return state; // 이미 선택된 경우 상태 변경 없음
    }

    // 새로운 책을 추가하고 note 필드를 초기화
    return { 
      selectedBooks: [...state.selectedBooks, { ...book, note: "" }] 
    };
  }),

  // 책을 선택 목록에서 제거하는 액션
  removeBook: (bookToRemove) => set((state) => {
    const key = bookToRemove.isbn || bookToRemove.title;
    return {
      selectedBooks: state.selectedBooks.filter(b => (b.isbn || b.title) !== key)
    };
  }),

  // 특정 책의 후기(Note)를 업데이트하는 액션
  updateBookNote: (bookKey, newNote) => set((state) => ({
    selectedBooks: state.selectedBooks.map(book => {
      const key = book.isbn || book.title;
      if (key === bookKey) {
        return { ...book, note: newNote };
      }
      return book;
    }),
  })),

  // 모달 열기/닫기 액션
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),

  // 목록 전체 초기화 (저장 후 호출 등)
  clearSelection: () => set({ selectedBooks: [], isModalOpen: false }),
}));