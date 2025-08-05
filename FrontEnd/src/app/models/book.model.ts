export interface Book {
  id: number;
  title: string;
  author: string;
  available: boolean;
  coverUrl?: string; // اختياري
  dueDate?: string | null; // داعم string, null, أو undefined
  userId?: string | null; // داعم string, null, أو undefined
  borrowedDate?: string | null; // داعم string, null, أو undefined
  category?: string;
}