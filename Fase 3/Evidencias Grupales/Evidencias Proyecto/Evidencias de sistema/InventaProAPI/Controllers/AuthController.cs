using InventaProAPI.Data;
using InventaProAPI.DTOs;
using InventaProAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

namespace InventaProAPI.Controllers
{
  [Route("[controller]")]
  [ApiController]
  public class AuthController : ControllerBase
  {

    private readonly AppDbContext _context;
    private readonly TokenProvider _tokenProvider;
    private readonly IConfiguration _configuration;

    public AuthController(AppDbContext context, TokenProvider tokenProvider, IConfiguration configuration)
    {
      _context = context;
      _tokenProvider = tokenProvider;
      _configuration = configuration;
    }

    [HttpPost]
    public async Task<IActionResult> Login([FromBody] AuthLoginRequest authLogin)
    {
      try
      {

        var user = await _context.Usuarios.Where(u => u.Email == authLogin.Email && u.EstadoUsuarioId != 0).FirstOrDefaultAsync();

        if (user == null) { return Unauthorized(); }

        var verify = BCrypt.Net.BCrypt.Verify(authLogin.Password, user.Password);

        if (!verify) { return Unauthorized(); }

        var rolesPermisos = await _context.RolesPermisos
          .Include(x => x.Permiso)
          .Include(x => x.Rol)
          .Where(x => x.RolId == user.RolId)
          .ToListAsync();

        var permisos = rolesPermisos.Select(x => x.Permiso).ToList();

        var acessToken = _tokenProvider.GetAccessToken(user!, permisos);
        var refreshToken = _tokenProvider.GetRefreshToken(user!);

        user.RefreshToken = refreshToken;
        await _context.SaveChangesAsync();

        var cookieOptions = new CookieOptions
        {
          HttpOnly = true,
          Secure = true,
          SameSite = SameSiteMode.Strict,
          Path = _configuration["Jwt:RefreshToken:Path"],
          Expires = DateTime.UtcNow.AddDays(7)
        };

        Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);

        var response = user.LoginResponse(acessToken);

        return Ok(response);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    [HttpGet("GetBodega")]
    public async Task<IActionResult> GetBodega()
    {
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();
        var bodega = await _context.Bodegas.Where(x => x.BodegaId == userRequest.BodegaId).FirstOrDefaultAsync();
        return Ok(bodega);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    [HttpGet]
    public async Task<IActionResult> RefreshAccessToken()
    {
      try
      {
        var refreshToken = Request.Cookies["refreshToken"];

        if (string.IsNullOrEmpty(refreshToken)) { return NotFound("Refresh token not found"); }



        var handler = new JwtSecurityTokenHandler();
        var jwtSecurityToken = handler.ReadJwtToken(refreshToken);
        var idUsuario = jwtSecurityToken.Claims.First(claim => claim.Type == "usuarioId").Value;
        var email = jwtSecurityToken.Claims.First(claim => claim.Type == "email").Value;

        var user = await _context.Usuarios.Where(u => u.UsuarioId == Int32.Parse(idUsuario) && u.Email == email && u.EstadoUsuarioId != 0).FirstOrDefaultAsync();

        if (user == null) { return NotFound(); }

        if (user.RefreshToken != refreshToken) { return BadRequest("Invalid refresh token."); }

        var rolesPermisos = await _context.RolesPermisos
          .Include(x => x.Permiso)
          .Include(x => x.Rol)
          .Where(x => x.RolId == user.RolId)
          .ToListAsync();


        var permisos = rolesPermisos.Select(x => x.Permiso).ToList();

        var accessToken = _tokenProvider.GetAccessToken(user, permisos);

        return Ok(new { accessToken = accessToken });

      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

  }
}
