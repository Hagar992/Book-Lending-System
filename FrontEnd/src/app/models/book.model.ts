export interface User {
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'Member';
}

export interface Book {
  id: number;
  title: string;
  author: string;
  available: boolean;
  coverUrl?: string | undefined; // اختيارية بدل string فارغ
  dueDate?: string;
  userId?: string;
  borrowedDate?: string;
  category?: string;
  publishedDate: string;
}
