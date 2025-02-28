﻿using LibraryAssessmentBackend.Data.Repositories;
using LibraryAssessmentBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryAssessmentBackend.Services
{
    public class CheckoutService
    {
        private readonly CheckoutRepository _checkoutRepo;
        public CheckoutService(CheckoutRepository checkoutRepo)
        {
            _checkoutRepo = checkoutRepo;
        }

        public async Task<List<Checkout>> GetActiveCheckoutsByUser(string userId)
        {
            return await _checkoutRepo.GetActiveCheckoutsByUser(userId);
        }

        public async Task<List<Checkout>> GetAllActiveCheckedoutBooks()
        {
            return await _checkoutRepo.GetActiveAllCheckedoutBooks();
        }
    }
}
