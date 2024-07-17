using LibraryAssessmentBackend.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace LibraryAssessmentBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private UserManager<LibraryUser> _userManager;
        private JwtAuthService _authService;

        public UserController(ILogger<UserController> logger, UserManager<LibraryUser> userManager, JwtAuthService authService)
        {
            _logger = logger;
            _userManager = userManager;
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<string>> Register(RegisterLibraryUserDTO userDto)
        {
            //LibraryUser testUser = new LibraryUser { Email = "user1@user1.com", UserName = "Test1", NormalizedUserName = "user1@user1.com" };
            var res = await _userManager.CreateAsync(new LibraryUser{Email = userDto.Email, UserName = userDto.Email} , userDto.Password);
            if (res.Succeeded)
            {
                var newUser = await _userManager.FindByEmailAsync(userDto.Email);
                await _userManager.AddToRoleAsync(newUser, userDto.Role);
                _logger.LogInformation($"Created user [{userDto.Email}] with role [{userDto.Role}]");
                return Ok();
            }
            else
            {
                _logger.LogInformation(res.Errors.ToString());
                return BadRequest($"Unable to create user: {res.Errors.First().Code}: {res.Errors.First().Description}");
            }

        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthenticationResponse>> Login(LoginLibraryUserDTO userDto)
        {
            var user = await _userManager.FindByEmailAsync(userDto.Email);
            if (user != null)
            {
                if(_userManager.PasswordHasher.VerifyHashedPassword(user, user.PasswordHash, userDto.Password) == PasswordVerificationResult.Success)
                {
                    var roleInfo = await _userManager.GetRolesAsync(user);

                    _logger.LogInformation($"User [{user.ToString()}] as the role [{roleInfo.First()}]");

                    //return Ok($"{{token: {_authService.GenerateToken(user, roleInfo.First())}}}");
                    return Ok(new AuthenticationResponse { Token = _authService.GenerateToken(user, roleInfo.First()) });
                }
                else
                {
                    return BadRequest("Invalid username/password");
                }
                
            }
            else
            {
                _logger.LogInformation($"Could not find user [{userDto.Email}]");
                return BadRequest($"Could not find user [{userDto.Email}]");
            }

        }
    }
}
