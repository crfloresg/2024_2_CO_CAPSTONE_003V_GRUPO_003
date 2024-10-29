using InventaProAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventaProAPI.Controllers
{
  [Route("[controller]")]
  [ApiController]
  public class BodegasController : ControllerBase
  {

    private readonly AppDbContext _context;

    public BodegasController(AppDbContext context)
    {
      _context = context;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAllBodegas()
    {
      try
      {
        var bodegas = await _context.Bodegas
          .Select(x => new
          {
            x.BodegaId,
            x.Nombre,
            x.Direccion
          })
          .ToListAsync();

        if(bodegas == null) { return NotFound(); }

        return Ok(bodegas);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

  }
}
