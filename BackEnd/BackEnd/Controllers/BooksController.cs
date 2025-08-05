using BackEnd.Data;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BooksController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BooksController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
    {
        return await _context.Books.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Book>> GetBook(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null) return NotFound();
        return book;
    }

    [HttpPost]
    public async Task<ActionResult<Book>> AddBook(Book book)
    {
        _context.Books.Add(book);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBook(int id, Book book)
    {
        if (id != book.Id) return BadRequest();
        _context.Entry(book).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null) return NotFound();
        _context.Books.Remove(book);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{id}/borrow")]
    public async Task<IActionResult> BorrowBook(int id, [FromQuery] string userEmail)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null || !book.Available) return BadRequest("Book not available");
        book.Available = false;
        book.UserId = userEmail;
        book.BorrowedDate = DateTime.Now.ToString("yyyy-MM-dd");
        book.DueDate = DateTime.Now.AddDays(7).ToString("yyyy-MM-dd");
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpPost("{id}/return")]
    public async Task<IActionResult> ReturnBook(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null || book.Available) return BadRequest("Book not borrowed");
        book.Available = true;
        book.UserId = null;
        book.BorrowedDate = null;
        book.DueDate = null;
        await _context.SaveChangesAsync();
        return Ok();
    }
}