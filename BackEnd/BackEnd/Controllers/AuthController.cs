using BackEnd.Data;
using BackEnd.Dtos;
using BackEnd.DTOs;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // POST: api/Auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {

            //لو فيه أي فيلد ناقص أو مش مطابق للفاليديشن، السيرفر هيرجع BadRequest مع كائن كبير فيه أخطاء الفاليديشن.
            //لو عايز تظهره بشكل أوضح للفرونت، ممكن تبسطه وتخليه
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid data", errors = ModelState });
            }


            var existingUser = await FindUserByUsernameOrEmail(registerDto.Username, registerDto.Email);

            if (existingUser != null)
            {
                return BadRequest("User already exists");
            }

            var user = new User
            {
                Name = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Role = string.IsNullOrEmpty(registerDto.Role) ? "Member" : registerDto.Role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            //خلّي الـ Response يرجع JSON بدل نص عادي، بالشكل ده
            return Ok(new { message = "User registered successfully" });

        }

        // POST: api/Auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserDto request)
        {
            // البحث عن المستخدم بالاسم أو الإيميل
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Username || u.Name == request.Username);

            // لو المستخدم مش موجود أو الباسورد غلط
            if (user == null || string.IsNullOrEmpty(user.PasswordHash) ||
                !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Invalid credentials"
                });
            }
            var token = GenerateJwtToken(user);
            return Ok(new
            {
                success = true,
                message = "Login successful",
                token = token,
                name = user.Name ?? string.Empty,
                email = user.Email ?? string.Empty,
                role = user.Role ?? "Member"
            });
        }

        private async Task<User?> FindUserByUsernameOrEmail(string username, string? email = null)
        {
            return await _context.Users.FirstOrDefaultAsync(
                u => u.Name == username || u.Email == username || (email != null && u.Email == email)
            );
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Email ?? string.Empty),
                new Claim(ClaimTypes.Role, user.Role ?? "Member")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
