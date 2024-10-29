using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using InformeApi.Models;

namespace InformeApi.Services
{
    public class TokenProvider
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public TokenProvider(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetAccessToken(Usuario user, List<Permiso> permisos)
        {
            var watch = System.Diagnostics.Stopwatch.StartNew();
            string secretKey = _configuration["Jwt:AccessToken:Secret"]!;
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>()
    {
        new Claim("usuarioId", user.UsuarioId.ToString()),
        new Claim("bodegaId", user.BodegaId.ToString()),
        new Claim("email", user.Email)
    };

            foreach (var permiso in permisos)
            {
                claims.Add(new Claim("permiso", permiso.Nombre));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(_configuration.GetValue<int>("Jwt:AccessToken:ExpirationInMinutes")),
                //Expires = DateTime.UtcNow.AddSeconds(3),
                SigningCredentials = credentials,
                Issuer = _configuration["Jwt:AccessToken:Issuer"],
                Audience = _configuration["Jwt:AccessToken:Audience"]
            };

            var handler = new JsonWebTokenHandler();

            string token = handler.CreateToken(tokenDescriptor);
            watch.Stop();
            var elapsedMs = watch.ElapsedMilliseconds;
            Console.WriteLine("time it took");
            Console.WriteLine(elapsedMs.ToString());

            return token;
        }

        public string GetRefreshToken(Usuario user)
        {
            string secretKey = _configuration["Jwt:RefreshToken:Secret"]!;
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                    new[]
                    {
                       new Claim("usuarioId", user.UsuarioId.ToString()),
                       new Claim("email", user.Email)
                    }),
                Expires = DateTime.UtcNow.AddDays(_configuration.GetValue<int>("Jwt:RefreshToken:ExpirationInDays")),
                SigningCredentials = credentials,
                Issuer = _configuration["Jwt:RefreshToken:Issuer"],
                Audience = _configuration["Jwt:RefreshToken:Audience"]
            };

            var handler = new JsonWebTokenHandler();

            string token = handler.CreateToken(tokenDescriptor);

            return token;
        }

        public AccessToken GetAccessTokenData()
        {
            var httpContext = _httpContextAccessor.HttpContext;

            if (httpContext == null || httpContext.User == null)
            {
                throw new InvalidOperationException("HTTP context or user is not available.");
            }

            var user = httpContext.User;

            var accessTokenData = new AccessToken
            {
                BodegaId = int.Parse(user.FindFirst("bodegaId")?.Value ?? "0"),
                UsuarioId = int.Parse(user.FindFirst("usuarioId")?.Value ?? "0"),
                Email = user.FindFirst("email")?.Value
            };

            // Extract permiso claims
            var permisoClaims = user.FindAll("permiso");
            accessTokenData.Permisos = permisoClaims.Select(c => c.Value).ToList();

            return accessTokenData;
        }

        public bool HasPermission(string permiso)
        {
            var httpContext = _httpContextAccessor.HttpContext;
            var user = httpContext.User;
            var permisoClaims = user.FindAll("permiso");

            var can = permisoClaims.Any(c => c.Value == permiso);


            return can;
        }
    }
}
