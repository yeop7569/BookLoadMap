export interface Book {
  id?: string;
  title: string;
  thumbnail?: string;
  isbn?: string;
  authors?: string[];
  publisher?: string;
  contents?: string;
  genre?: string;
  note?: string;
}

export interface BookRoute {
  id: string;
  Route_title: string;
  category: string;
  content: string;
  thumbnail?: string;
  selected_books: Book[];
  created_at?: string;
  user_id?: string;
  status: 'Publish' | 'Draft';
}

export interface User {
  id: string;
  email?: string;
}
