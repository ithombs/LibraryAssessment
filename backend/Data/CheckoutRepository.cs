using Microsoft.EntityFrameworkCore;

namespace LibraryAssessmentBackend.Data
{
    public class CheckoutRepository
    {
        private readonly DataContext _dbContext;
        public CheckoutRepository(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Checkout>> GetActiveCheckoutsByUser(string userId)
        {
            return await _dbContext.Checkouts.Include(c => c.Book)
                .Where(c => c.User.Id == userId)
                .Where(c => c.EndDate == null)
                .OrderByDescending(c => c.StartDate).ToListAsync();
        }

        public async Task<List<Checkout>> GetActiveAllCheckedoutBooks()
        {
            return await _dbContext.Checkouts.Include(c => c.Book)
                .Where(c => c.EndDate == null)
                .OrderByDescending(c => c.StartDate).ToListAsync();
        }
    }
}
