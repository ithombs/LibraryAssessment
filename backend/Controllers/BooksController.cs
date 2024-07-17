using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryAssessmentBackend.Data;
using Microsoft.AspNetCore.Authorization;

namespace LibraryAssessmentBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BookService _bookService;
        private readonly UserService _userService;
        private readonly CheckoutService _checkoutService;

        public BooksController(BookService bookService, UserService userService, CheckoutService checkoutService)
        {
            _bookService = bookService;
            _userService = userService;
            _checkoutService = checkoutService;
        }

        // GET: api/Books
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
        {
            return await _bookService.GetAllBooks();
        }

        
        [HttpGet("FilteredBooks")]
        public async Task<ActionResult<List<Book>>> GetBooks([FromQuery] BookQueryParams queryParams)
        {
            return await _bookService.GetBooks(queryParams);
        }
        
        [HttpGet("FeaturedBooks")]
        public async Task<ActionResult<List<Book>>> GetFeaturedBooks()
        {
            return await _bookService.GetFeaturedBooks();
        }

        // GET: api/Books/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
            var book = await _bookService.GetBookByBookId(id);

            if (book == null)
            {
                return NotFound();
            }

            return book;
        }

        // PUT: api/Books/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize(Roles = "Librarian")]
        public async Task<IActionResult> PutBook(int id, Book book)
        {
            if (id != book.Id)
            {
                return BadRequest();
            }

            try
            {
                _bookService.UpdateBook(book);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (_bookService.GetBookByBookId(id) == null)
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

        // POST: api/Books
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Roles = "Librarian")]
        public async Task<ActionResult<Book>> PostBook(Book book)
        {
            await _bookService.CreateBook(book);

            return CreatedAtAction("GetBook", new { id = book.Id }, book);
        }

        [HttpPost("Checkout/{bookId}")]
        [Authorize]
        public async Task<ActionResult> PostBookCheckout(int bookId)
        {
            string email = this.User.Identity.Name;
            LibraryUser user = await _userService.GetUserByEmail(email);

            await _bookService.CheckoutBook(bookId, user.Id);
            return Ok();
        }

        [HttpPost("Return/{bookId}")]
        [Authorize(Roles = "Librarian")]
        public async Task<ActionResult> PostBookReturn(int bookId)
        {
            await _bookService.MarkBookAsReturned(bookId);
            return Ok();
        }

        // DELETE: api/Books/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Librarian")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _bookService.GetBookByBookId(id);
            if (book == null)
            {
                return NotFound();
            }

            await _bookService.DeleteBook(book);

            return NoContent();
        }

        [HttpGet("ActiveCheckoutsByUser")]
        [Authorize]
        public async Task<ActionResult<List<Checkout>>> GetActiveCheckoutsByUser()
        {
            string email = this.User.Identity.Name;
            LibraryUser user = await _userService.GetUserByEmail(email);

            return await _checkoutService.GetActiveCheckoutsByUser(user.Id);
        }

        [HttpGet("ActiveCheckouts")]
        [Authorize(Roles = "Librarian")]
        public async Task<ActionResult<List<Checkout>>> GetActiveCheckouts()
        {
            return await _checkoutService.GetAllActiveCheckedoutBooks();
        }
    }
}
