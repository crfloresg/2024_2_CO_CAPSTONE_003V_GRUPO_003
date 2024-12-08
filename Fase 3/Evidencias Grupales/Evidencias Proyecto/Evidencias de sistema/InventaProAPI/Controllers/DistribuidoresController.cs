using Microsoft.AspNetCore.Mvc;
using InventaProAPI.DTOs;
using InventaProAPI.Services;
using InventaProAPI.Data;
using Microsoft.EntityFrameworkCore;
using InformeApi.Models;
using InventaProAPI.Models;

namespace InventaProAPI.Controllers
{
  [Route("[controller]")]
  [ApiController]
  public class DistribuidoresController : ControllerBase
  {



    private readonly AppDbContext _context;
    private readonly TokenProvider _tokenProvider;
    private readonly AuditoriaService _auditoriaService;
    private readonly InventarioService _inventarioService;



    public DistribuidoresController(AppDbContext context, TokenProvider tokenProvider, AuditoriaService auditoriaService, InventarioService inventarioService)
    {
      _context = context;
      _tokenProvider = tokenProvider;
      _auditoriaService = auditoriaService;
      _inventarioService = inventarioService;
    }



    [HttpGet]
    public async Task<IActionResult> GetDistribuidores()
    {
      try
      {
        if (!_tokenProvider.HasPermission("r_distribuidores_global")) { return Forbid(); }
        var distribuidores = await _context.Distribuidores.OrderByDescending(x => x.DistribuidorId).ToListAsync();
        return Ok(distribuidores);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }



    [HttpGet("{id}")]
    public async Task<IActionResult> GetDistribuidor(int id)
    {
      try
      {
        if (!_tokenProvider.HasPermission("r_distribuidores_global")) { return Forbid(); }
        var distribuidor = await _context.Distribuidores.Where(x => x.DistribuidorId == id).FirstOrDefaultAsync();
        if (distribuidor == null) return NotFound();
        return Ok(distribuidor);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }



    [HttpPost]
    public async Task<IActionResult> CreateDistribuidor(DistribuidorDTO body)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!_tokenProvider.HasPermission("cu_distribuidores_global")) { return Forbid(); }

        if (body.distribuidorId == 0)
        {
          //Create
          var newDist = new Distribuidor
          {
            Nombre = body.nombre,
            Estado = 1,
            Direccion = body.direccion,
            Telefono = body.telefono,
            CorreoElectronico = body.correoElectronico,
            FechaRegistro = DateTime.Now
          };

          await _context.Distribuidores.AddAsync(newDist);
          await _context.SaveChangesAsync();

          await _auditoriaService.Auditar(userRequest.UsuarioId, "distribuidor_create", $"Se creo el distribuidor {newDist.DistribuidorId}", userRequest.BodegaId);
        }
        else
        {
          //Update
          var distribuidor = await _context.Distribuidores.Where(x => x.DistribuidorId == body.distribuidorId && x.Estado != 0).FirstOrDefaultAsync();

          if (distribuidor == null) { return NotFound(); }

          distribuidor.Nombre = body.nombre;
          distribuidor.Direccion = body.direccion;
          distribuidor.Telefono = body.telefono;
          distribuidor.CorreoElectronico = body.correoElectronico;
          distribuidor.FechaModificacion = DateTime.Now;

          await _context.SaveChangesAsync();
          await _auditoriaService.Auditar(userRequest.UsuarioId, "distribuidor_update", $"Se modifico el distribuidor {body.distribuidorId}", userRequest.BodegaId);
        }

        await transaction.CommitAsync();
        return Ok();
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return BadRequest(ex.Message);
      }
    }



    [HttpGet("Delete/{id}")]
    public async Task<IActionResult> DeleteProducto(int id)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();

      try
      {

        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!_tokenProvider.HasPermission("d_distribuidores_global")) { return Forbid(); }

        var distribuidor = await _context.Distribuidores.Where(x => x.DistribuidorId == id).FirstOrDefaultAsync();

        if (distribuidor == null) { return NotFound(); }

        distribuidor.Estado = 0;

        await _context.SaveChangesAsync();

        await _auditoriaService.Auditar(userRequest.UsuarioId, "distribuidor_desactivado", $"Se deshabilito el distribuidor {distribuidor.DistribuidorId}", userRequest.BodegaId);

        await transaction.CommitAsync();

        return Ok();

      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return BadRequest(ex.Message);
      }
    }



    [HttpGet("Activate/{id}")]
    public async Task<IActionResult> ActivateProducto(int id)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();

      try
      {

        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!_tokenProvider.HasPermission("a_distribuidores_global")) { return Forbid(); }

        var distribuidor = await _context.Distribuidores.Where(x => x.DistribuidorId == id).FirstOrDefaultAsync();

        if (distribuidor == null) { return NotFound(); }

        distribuidor.Estado = 1;

        await _context.SaveChangesAsync();

        await _auditoriaService.Auditar(userRequest.UsuarioId, "distribuidor_activado", $"Se habilito el distribuidor {distribuidor.DistribuidorId}", userRequest.BodegaId);

        await transaction.CommitAsync();

        return Ok();

      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return BadRequest(ex.Message);
      }
    }



  }

}
