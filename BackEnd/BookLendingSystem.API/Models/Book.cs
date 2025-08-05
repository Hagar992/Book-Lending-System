namespace BookLendingSystem.API.Models
{
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string CoverUrl { get; set; }
        public string Category { get; set; }
        public bool Available { get; set; }
        public int? BorrowedById { get; set; }
        public DateTime? BorrowedDate { get; set; }
        public DateTime? DueDate { get; set; }

        public User BorrowedBy { get; set; }
    }
}