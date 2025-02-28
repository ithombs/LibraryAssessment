﻿using LibraryAssessmentBackend.Data;
using LibraryAssessmentBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryAssessmentBackend.Services
{
    public class UserService
    {
        private readonly DataContext _dbContext;
        public UserService(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<LibraryUser> GetUserByEmail(string email)
        {
            return await _dbContext.LibraryUsers.Where(u => u.Email == email).FirstAsync();
        }
    }
}
