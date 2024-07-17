namespace LibraryAssessmentBackend.Data
{
    public class BookQueryParams
    {
        public string? Title { get; set; }
        public string? Author { get; set; }
        public bool? IsCheckedOut { get; set; }

        public string? OrderBy { get; set; } = string.Empty;
        public bool OrderAsc { get; set; } = true;
    }
}
