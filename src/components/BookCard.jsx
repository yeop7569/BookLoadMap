export default function BookCard({ book, isSelected, onSelect }) {
  const thumb = (url) => url || "https://placehold.co/400x400?text=No+Image";

  return (
    <div
      className={`border rounded p-2 flex flex-col items-center ${
        isSelected ? "border-4 border-accent shadow-lg" : ""
      }`}
    >
      <img
        src={thumb(book.thumbnail)}
        alt={book.title}
        className="w-32 h-48 object-cover mb-2"
      />
      <h2 className="font-bold text-sm text-center line-clamp-2">
        {book.title}
      </h2>
      <button
        onClick={() => onSelect(book)}
        className={`btn btn-sm mt-2 ${
          isSelected ? "btn-disabled" : "btn-accent"
        }`}
        disabled={isSelected}
      >
        {isSelected ? "선택됨" : "선택"}
      </button>
    </div>
  );
}
