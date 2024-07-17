using LibraryAssessmentBackend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.Hosting;
using System.ComponentModel.DataAnnotations.Schema;
namespace LibraryAssessmentBackend.Data
{
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string CoverImage { get; set; }
        public string Publisher { get; set; }
        public DateOnly PublicationDate { get; set; }
        public string Category { get; set; }
        public string ISBN { get; set; }
        public int PageCount { get; set; }
        public bool IsCheckedOut { get; set; }
        public String Description { get; set; }
        public ICollection<BookReview> Reviews { get; } = new List<BookReview>();
        public List<Checkout> Checkouts { get; } = new List<Checkout>();
        [NotMapped]
        public double AverageRating { get; set; } = 0;
    }
}