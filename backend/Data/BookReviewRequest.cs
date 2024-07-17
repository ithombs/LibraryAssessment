namespace LibraryAssessmentBackend.Data
{
    public class BookReviewRequest
    {
        public int BookId { get; set; }
        public double Rating { get; set; }
        public string Review { get; set; }
    }
}
