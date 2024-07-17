using LibraryAssessmentBackend.Data.Repositories;
using LibraryAssessmentBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryAssessmentBackend.Services
{
    public class BookService
    {
        private readonly BookRepository _bookRepo;
        public BookService(BookRepository bookRepo)
        {
            _bookRepo = bookRepo;
        }

        public async Task<List<Book>> GetAllBooks()
        {
            return await _bookRepo.GetAllBooks();
        }

        public async Task<List<Book>> GetFeaturedBooks()
        {
            return await _bookRepo.GetFeaturedBooks();
        }

        public async Task<List<Book>> GetBooks(BookQueryParams queryParams)
        {
            return await _bookRepo.GetBooks(queryParams);
        }

        public async Task<Book?> GetBookByBookId(int bookId)
        {
            return await _bookRepo.GetBookByBookId(bookId);
        }

        public async Task<List<BookReview>> GetReviewsByBookId(int bookId)
        {
            return await _bookRepo.GetReviewsByBookId(bookId);
        }

        public async Task<int> CheckoutBook(int bookId, string userId)
        {
            var book = await _bookRepo.GetBookByBookId(bookId);
            await _bookRepo.CheckoutBook(bookId, userId);

            book.IsCheckedOut = true;
            return await _bookRepo.UpdateBook(book);
        }

        public async Task<int> MarkBookAsReturned(int bookId)
        {
            var book = await _bookRepo.GetBookByBookId(bookId);
            await _bookRepo.CheckInBook(bookId);

            book.IsCheckedOut = false;
            return await _bookRepo.UpdateBook(book);
        }

        public async Task<int> CreateBook(Book book)
        {
            return await _bookRepo.CreateBook(book);
        }

        public async Task<int> UpdateBook(Book book)
        {
            return await _bookRepo.UpdateBook(book);
        }

        public async Task<int> DeleteBook(Book book)
        {
            return await _bookRepo.DeleteBook(book);
        }

        public async Task<int> CreateBookReview(BookReview bookReview)
        {
            return await _bookRepo.CreateBookReview(bookReview);
        }

        public async Task<int> UpdateBookReview(BookReview bookReview)
        {
            return await _bookRepo.UpdateBookReview(bookReview);
        }

        public async Task<int> DeleteBookReview(BookReview bookReview)
        {
            return await _bookRepo.DeleteBookReview(bookReview);
        }
    }
}
