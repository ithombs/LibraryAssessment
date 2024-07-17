namespace LibraryAssessmentBackend.Models
{
    public class BookReviewRequest
    {
        public int BookId { get; set; }
        public double Rating { get; set; }
        public string Review { get; set; }
    }
}
