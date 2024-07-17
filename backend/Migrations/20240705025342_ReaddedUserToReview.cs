﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LibraryAssessmentBackend.Migrations
{
    /// <inheritdoc />
    public partial class ReaddedUserToReview : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_BookReviews_UserId",
                table: "BookReviews",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_BookReviews_AspNetUsers_UserId",
                table: "BookReviews",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_BookReviews_Books_BookId",
                table: "BookReviews",
                column: "BookId",
                principalTable: "Books",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BookReviews_AspNetUsers_UserId",
                table: "BookReviews");

            migrationBuilder.DropForeignKey(
                name: "FK_BookReviews_Books_BookId",
                table: "BookReviews");

            migrationBuilder.DropIndex(
                name: "IX_BookReviews_UserId",
                table: "BookReviews");
        }
    }
}
