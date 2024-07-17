using System.ComponentModel.DataAnnotations;

namespace LibraryAssessmentBackend.Models
{
    public class Checkout
    {
        [Key]
        public int Id { get; set; }
        public int BookId { get; set; }
        public string UserId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public Book Book { get; set; }
        public LibraryUser User { get; set; }
    }
}
