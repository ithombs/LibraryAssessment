using LibraryAssessmentBackend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LibraryAssessmentBackend.Data
{
    public class DataContext : IdentityDbContext<LibraryUser>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { 
        }

        public DbSet<LibraryUser> LibraryUsers { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<BookReview> BookReviews { get; set; }
        public DbSet<Checkout> Checkouts { get; set; }
    }
}
