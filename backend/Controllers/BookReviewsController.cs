using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryAssessmentBackend.Data;
using Microsoft.AspNetCore.Authorization;
using LibraryAssessmentBackend.Models;

namespace LibraryAssessmentBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BookReviewsController : ControllerBase
    {
        private readonly DataContext _context;

        public BookReviewsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/BookReviews
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookReview>>> GetBookReviews()
        {
            return await _context.BookReviews.ToListAsync();
        }

        // GET: api/BookReviews/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<List<BookReview>>> GetBookReviews(int id)
        {
            var bookReview = await _context.BookReviews.Where(e => e.BookId == id).ToListAsync();

            if (bookReview == null)
            {
                return NotFound();
            }

            return bookReview;
        }

        [HttpGet("UserBookReview/{bookId}")]
        public async Task<ActionResult<BookReview>> GetBookReview(int bookId)
        {
            //get user from token info
            string email = this.User.Identity.Name;
            LibraryUser user = await _context.LibraryUsers.Where(u => u.Email == email).FirstAsync();

            var bookReview = await _context.BookReviews.Where(e => e.BookId == bookId)
                                                        .Where(e => e.UserId == user.Id).FirstOrDefaultAsync();

            if (bookReview == null)
            {
                return NotFound();
            }

            return bookReview;
        }

        // PUT: api/BookReviews/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{bookId}")]
        [Authorize(Roles = "Librarian")]
        public async Task<IActionResult> PutBookReview(int bookid, BookReviewRequest bookReview)
        {
            //get user from token info
            string email = this.User.Identity.Name;
            LibraryUser user = await _context.LibraryUsers.Where(u => u.Email == email).FirstAsync();

            BookReview updatedReview = new BookReview { BookId = bookid, UserId = user.Id, Rating = bookReview.Rating, Review = bookReview.Review };

            if (bookid != bookReview.BookId)
            {
                return BadRequest();
            }

            _context.Entry(updatedReview).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookReviewExists(bookid, user.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/BookReviews
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Roles = "Librarian")]
        public async Task<ActionResult<BookReview>> PostBookReview(BookReviewRequest bookReviewRequest)
        {
            //get user from token info
            string email = this.User.Identity.Name;
            LibraryUser user = await _context.LibraryUsers.Where(u => u.Email == email).FirstAsync();

            //create new BookReview from User and BookReviewRequest data
            BookReview newReview = new BookReview{
                BookId = bookReviewRequest.BookId,
                UserId = user.Id,
                Rating = bookReviewRequest.Rating,
                Review = bookReviewRequest.Review,
                User = user
            };


            var res = await _context.BookReviews.AddAsync(newReview);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (BookReviewExists(newReview.BookId, user.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetBookReview", new { id = newReview.BookId }, newReview);
        }

        // DELETE: api/BookReviews/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Librarian")]
        public async Task<IActionResult> DeleteBookReview(int id)
        {
            var bookReview = await _context.BookReviews.FindAsync(id);
            if (bookReview == null)
            {
                return NotFound();
            }

            _context.BookReviews.Remove(bookReview);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookReviewExists(int bookId, string userId)
        {
            return _context.BookReviews.Any(e => e.BookId == bookId && e.UserId == userId);
        }
    }
}
