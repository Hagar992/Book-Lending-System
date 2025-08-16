import { Book } from '../models/book.model'; // المسار الصحيح

describe('Book model', () => {
  it('should create a valid book object', () => {
    const book: Book = {
      id: 1,
      title: 'Test Book',
      author: 'Test Author',
      publishedDate: '2025-01-01',
      available: true
    };

    expect(book.title).toBe('Test Book');
    expect(book.id).toBeGreaterThan(0);
  });
});
