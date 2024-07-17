using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Linq;
using System.Net;

namespace LibraryAssessmentBackend.Data
{
    public class BookRepository
    {
        private readonly DataContext _dbContext;
        public BookRepository(DataContext dbContext) { 
            _dbContext = dbContext;
        }

        public async Task<List<Book>> GetFeaturedBooks()
        {
            var randBooks = await _dbContext.Books.OrderBy(b => Guid.NewGuid()).Take(5).ToListAsync();
            return randBooks;
        }

        public async Task<List<Book>> GetBooks(BookQueryParams queryParams)
        {
            //var books = _dbContext.Books.AsQueryable();
            var books = GetBooksWithRating();
            //books = books.Include(b => b.Reviews);

            if (!string.IsNullOrEmpty(queryParams.Title))
            {
                books = books.Where(b => b.Title.Contains(queryParams.Title));
            }

            if (!string.IsNullOrEmpty(queryParams.Author))
            {
                books = books.Where(b => b.Author.Contains(queryParams.Author));
            }

            if (queryParams.IsCheckedOut != null)
            {
                books = books.Where(b => b.IsCheckedOut == queryParams.IsCheckedOut);
            }

            if (!string.IsNullOrEmpty(queryParams.OrderBy))
            {
                if (queryParams.OrderAsc)
                {
                    books = books.OrderBy(o => EF.Property<object>(o, queryParams.OrderBy));
                }
            }

            return await books.ToListAsync();
        }

        private IQueryable<Book> GetBooksWithRating()
        {
            var booksWithRating = _dbContext.Books.AsQueryable();

            booksWithRating = booksWithRating.Select(b => new Book
            {
                AverageRating = b.Reviews.Where(r => r.BookId == b.Id).Select(r => r.Rating).DefaultIfEmpty().Average(),
                Id = b.Id,
                Title = b.Title,
                Author = b.Author,
                CoverImage = b.CoverImage,
                PublicationDate = b.PublicationDate,
                Publisher = b.Publisher,
                Category = b.Category,
                ISBN = b.ISBN,
                PageCount = b.PageCount,
                IsCheckedOut = b.IsCheckedOut,
                Description = b.Description,

            });

            return booksWithRating;
        }

        public async Task<List<Book>> GetAllBooks()
        {
            var books = GetBooksWithRating();
            return await books.ToListAsync();

            //return await _dbContext.Books.ToListAsync();
        }

        public async Task<Book?> GetBookByBookId(int bookId)
        {
            var book = _dbContext.Books.Include(b => b.Reviews)
                .Where(b => b.Id == bookId)
                   .Select(b => new Book
                   {
                       AverageRating = b.Reviews.Where(r => r.BookId == bookId).Select(r => r.Rating).DefaultIfEmpty().Average(),
                       Id = b.Id,
                       Title = b.Title,
                       Author = b.Author,
                       CoverImage = b.CoverImage,
                       PublicationDate = b.PublicationDate,
                       Publisher = b.Publisher,
                       Category = b.Category,
                       ISBN = b.ISBN,
                       PageCount = b.PageCount,
                       IsCheckedOut = b.IsCheckedOut,
                       Description = b.Description,

                   }).FirstOrDefaultAsync();
            return await book;
            //return await _dbContext.Books.FindAsync(bookId);
        }

        public async Task<List<BookReview>> GetReviewsByBookId(int bookId)
        {
            _dbContext.BookReviews.Include(review => review.User);
            return await _dbContext.BookReviews.Where(review => review.BookId == bookId).ToListAsync();
        }

        public async Task<int> CreateBook(Book book)
        {
            await _dbContext.Books.AddAsync(book);
            return await _dbContext.SaveChangesAsync();
        }

        public async Task<int> UpdateBook(Book book)
        {
            _dbContext.Books.Update(book);
            return await _dbContext.SaveChangesAsync();
        }

        public async Task<int> DeleteBook(Book book)
        {
            _dbContext.Books.Remove(book);
            return await _dbContext.SaveChangesAsync();
        }

        public async Task<int> CreateBookReview(BookReview bookReview)
        {
            await _dbContext.BookReviews.AddAsync(bookReview);
            return await _dbContext.SaveChangesAsync();
        }

        public async Task<int> UpdateBookReview(BookReview bookReview)
        {
            _dbContext.BookReviews.Update(bookReview);
            return await _dbContext.SaveChangesAsync();
        }

        public async Task<int> DeleteBookReview(BookReview bookReview)
        {
            _dbContext.BookReviews.Remove(bookReview);
            return await _dbContext.SaveChangesAsync();
        }

        public async Task<int> CheckoutBook(int bookId, string userId)
        {
            var checkout = new Checkout {BookId = bookId, UserId = userId, StartDate = DateTime.Now };
            _dbContext.Checkouts.Add(checkout);
            return await _dbContext.SaveChangesAsync();
        }

        public async Task<int> CheckInBook(int bookId)
        {
            var lastCheckout = await _dbContext.Checkouts.Where(c => c.BookId == bookId && c.EndDate == null).FirstOrDefaultAsync();
            if (lastCheckout != null)
            {
                lastCheckout.EndDate = DateTime.Now;
            }
            return await _dbContext.SaveChangesAsync();
        }
    }
}
