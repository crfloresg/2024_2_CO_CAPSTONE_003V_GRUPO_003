using InventaProAPI.Data;
using InventaProAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventaProAPI.Controllers
{
  [Route("[controller]")]
  [ApiController]
  public class PermisosController : ControllerBase
  {

    private readonly AppDbContext _context;
    private readonly TokenProvider _tokenProvider;

    public PermisosController(AppDbContext context, TokenProvider tokenProvider)
    {
      _context = context;
      _tokenProvider = tokenProvider;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetPermisos()
    {
      try
      {

        var userRequest = _tokenProvider.GetAccessTokenData();

        var query = _context.Permisos
          .Select(x => new
          {
            x.PermisoId,
            x.Nombre,
            x.Descripcion
          });

        //if (userRequest.BodegaId != 1)
        //{
        //  query = query.Where(x => x.BodegaId == userRequest.BodegaId);
        //}

        var permisos = await query.ToListAsync();

        if (permisos! == null) { return NotFound(); }

        return Ok(permisos);

      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

  }
}
