using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryAssessmentBackend.Models
{
    [PrimaryKey(nameof(BookId), nameof(UserId))]
    public class BookReview
    {
        [ForeignKey("Book")]
        public int BookId { get; set; }
        public string UserId { get; set; }
        public double Rating { get; set; }
        public string? Review { get; set; }
        public LibraryUser User { get; set; }
        public Book Book { get; set; }
    }
}
