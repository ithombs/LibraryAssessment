using LibraryAssessmentBackend.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using LibraryAssessmentBackend.Controllers;
using Bogus;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<DataContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<BookRepository>();
builder.Services.AddScoped<BookService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<CheckoutRepository>();
builder.Services.AddScoped<CheckoutService>();
builder.Services.AddTransient<JwtAuthService>();

builder.Services.AddIdentity<LibraryUser, IdentityRole>()
    .AddEntityFrameworkStores<DataContext>()
    .AddSignInManager()
    .AddRoles<IdentityRole>();

builder.Services.AddAuthentication(options => {
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidateLifetime = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("EnableCORS", builder =>
    {
        builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


//app.MapIdentityApi<LibraryUser>();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

//Run migrations
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<DataContext>();
    if (dbContext.Database.GetPendingMigrations().Any())
    {
        dbContext.Database.Migrate();
    }

    if(dbContext.Books.ToList().Count() == 0)
    {
        var titleIndex = 0;
        var genres = new[] { "Science Fiction", "Mystery", "Romance", "Thriller", "Non Fiction", "Biography" };
        var bookTitles = new[] { "Into the Deep", "Big Blue Sea", "Needful Things", "The Dark Forest", "Desperation", "Curious George", "Secerts of the Lost", "Fly Away", "So Long and Thanks For All The Fish", "War and Piece" };

        //Seed books
        var testBookRules = new Faker<Book>()
            .StrictMode(false)
            .RuleFor(b => b.Title, f => bookTitles[titleIndex++])
            .RuleFor(b => b.Author, f => f.Name.FirstName() + " " + f.Name.LastName())
            .RuleFor(b => b.CoverImage, f => "150x150.png")
            .RuleFor(b => b.Description, f => f.Lorem.Paragraph())
            .RuleFor(b => b.Publisher, f => f.Company.CompanyName())
            .RuleFor(b => b.PublicationDate, f => f.Date.PastDateOnly())
            .RuleFor(b => b.Category, f => f.PickRandom(genres))
            .RuleFor(b => b.ISBN, f => f.Random.Replace("###-#-##-######-#"))
            .RuleFor(b => b.PageCount, f => f.Random.Number(10, 800));

        var testBooks = testBookRules.Generate(10);

        dbContext.Books.AddRange(testBooks);
        await dbContext.SaveChangesAsync();
    }
}

//Seed user roles in database
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    foreach(LibraryRole role in Enum.GetValues(typeof(LibraryRole)))
    {
        if(!await roleManager.RoleExistsAsync(role.ToString()))
        {
            await roleManager.CreateAsync(new IdentityRole(role.ToString()));
        }
    }
}

app.UseCors("EnableCORS");
app.Run();
