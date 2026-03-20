import React, { memo } from "react";
import type { Book } from "../types";

interface BookCardProps {
  book: Book;
  isSelected: boolean;
  onSelect: (book: Book) => void;
}

const BookCard = memo(({ book, isSelected, onSelect }: BookCardProps) => {
  const thumb = (url?: string) => url || "https://placehold.co/400x400?text=No+Image";

  return (
    <div
      className={`border rounded p-2 flex flex-col items-center transition-all ${
        isSelected ? "border-4 border-accent shadow-lg scale-[1.02]" : "hover:border-zinc-500"
      }`}
    >
      <img
        src={thumb(book.thumbnail)}
        alt={book.title}
        className="w-32 h-48 object-cover mb-2"
        loading="lazy"
      />
      <h2 className="font-bold text-sm text-center line-clamp-2 min-h-[40px]">
        {book.title}
      </h2>
      <button
        onClick={() => onSelect(book)}
        className={`btn btn-sm mt-2 w-full ${
          isSelected ? "btn-disabled" : "btn-accent"
        }`}
        disabled={isSelected}
      >
        {isSelected ? "선택됨" : "선택"}
      </button>
    </div>
  );
});

BookCard.displayName = "BookCard";

export default BookCard;
