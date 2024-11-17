using InventaProAPI.Data;
using InventaProAPI.DTOs;
using InventaProAPI.Models;
using InventaProAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventaProAPI.Controllers
{
  [Route("[controller]")]
  [ApiController]
  public class PerdidasController : ControllerBase
  {





    private readonly AppDbContext _context;
    private readonly TokenProvider _tokenProvider;
    private readonly AuditoriaService _auditoriaService;
    private readonly InventarioService _inventarioService;


    public PerdidasController(AppDbContext context, TokenProvider tokenProvider, AuditoriaService auditoriaService, InventarioService inventarioService)
    {
      _context = context;
      _tokenProvider = tokenProvider;
      _auditoriaService = auditoriaService;
      _inventarioService = inventarioService;
    }



    [HttpGet("{bodegaId}")]
    public async Task<IActionResult> GetPerdidasByBodegaId(int bodegaId)
    {
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanRead()) { return Forbid(); }

        if(!_tokenProvider.HasPermission("r_perdidas_global") && bodegaId != userRequest.BodegaId) { return Forbid(); }

        var perdidas = await _context
          .Perdidas
          .Include(x => x.TipoPerdida)
          .Include(x => x.Bodega)
          .Include(x => x.Producto)
          .Where(x => x.BodegaId == bodegaId)
          .OrderByDescending(x => x.PerdidaId)
          .ToListAsync();

        return Ok(perdidas);

      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }


    [HttpGet("TipoPerdidas")]
    public async Task<IActionResult> GetTipos()
    {
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanCreate()) { return Forbid(); }

        var tipos = await _context
          .TipoPerdidas
          .ToListAsync();

        return Ok(tipos);

      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }


    [HttpPost]
    public async Task<IActionResult> CreatePerdida([FromBody]PerdidasCreateRequest body)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanCreate()) { return Forbid(); }

        if(!_tokenProvider.HasPermission("c_perdidas_global") && body.perdidas[0].bodegaId != userRequest.BodegaId) { return Forbid(); }

        foreach (var item in body.perdidas)
        {
          await _inventarioService.Perdida(item.productoId, item.bodegaId, item.cantidad, item.tipoPerdida, item.descripcion, userRequest.UsuarioId, item.precioCompra);
          await _inventarioService.QuitarDeInventario(item.bodegaId, item.productoId, item.precioCompra, item.cantidad);
          await _auditoriaService.Auditar(userRequest.UsuarioId, "perdida_create", $"Se registró una perdida de {item.cantidad} de el producto {item.productoId} a un precio de {item.precioCompra}", item.bodegaId);
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



    private bool CanRead()
    {
      return _tokenProvider.HasPermission("r_perdidas_bodega") || _tokenProvider.HasPermission("r_perdidas_global");
    }


    private bool CanCreate()
    {
      return _tokenProvider.HasPermission("c_perdidas_bodega") || _tokenProvider.HasPermission("c_perdidas_global");
    }

  }
}

