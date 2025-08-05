namespace BackEnd.Models;

public class Book
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Author { get; set; }
    public bool Available { get; set; }
    public string? CoverUrl { get; set; }
    public string? DueDate { get; set; }
    public string? UserId { get; set; } // Email of the borrower
    public string? BorrowedDate { get; set; }
    public string? Category { get; set; }
}