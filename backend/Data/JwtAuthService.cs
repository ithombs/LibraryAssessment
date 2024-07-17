using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LibraryAssessmentBackend.Data
{
    public class JwtAuthService
    {
        private readonly IConfiguration _configuration;
        public JwtAuthService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(LibraryUser user, string role)
        {
            var handler = new JwtSecurityTokenHandler();
            //var key = Encoding.ASCII.GetBytes(JwtAuthUtils.PrivateKey);
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var credentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = GenerateClaims(user, role),
                Expires = DateTime.UtcNow.AddMinutes(60),
                SigningCredentials = credentials,
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"]
            };

            var token = handler.CreateToken(tokenDescriptor);
            return handler.WriteToken(token);
        }

        private static ClaimsIdentity GenerateClaims(LibraryUser user, string role)
        {
            var claims = new ClaimsIdentity();

            claims.AddClaim(new Claim(ClaimTypes.Name, user.Email));
            claims.AddClaim(new Claim(ClaimTypes.Role, role));

            return claims;
        }
    }
}
