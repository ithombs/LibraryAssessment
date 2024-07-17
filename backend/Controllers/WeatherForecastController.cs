using LibraryAssessmentBackend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace LibraryAssessmentBackend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;
        private UserManager<LibraryUser> _userManager;
        public WeatherForecastController(ILogger<WeatherForecastController> logger, UserManager<LibraryUser> userManager)
        {
            _logger = logger;
            _userManager = userManager;
        }

        [HttpGet(Name = "GetWeatherForecast"), Authorize]
        public IEnumerable<WeatherForecast> Get()
        {
            var user = this.User;
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }

        [HttpGet("Testing")]
        public void Testing()
        {   
            _logger.LogInformation("Num users: " + _userManager.Users.ToList().Count);
            _logger.LogInformation("Hit the test method");
        }

        [HttpGet("TestingSignUp")]
        public void TestSignUp()
        {
            LibraryUser testUser = new LibraryUser { Email = "user1@user1.com", UserName = "Test1", NormalizedUserName = "user1@user1.com" };
            var res = _userManager.CreateAsync(testUser, "Test123!");
            if (res.Result.Succeeded)
            {
                _logger.LogInformation("Created user");
            }
            else
            {
                _logger.LogInformation(res.Result.Errors.ToString());
            }

        }
    }
}
