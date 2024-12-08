using InventaProAPI.Data;
using InventaProAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventaProAPI.Controllers
{
  [Route("[controller]")]
  [Authorize]
  [ApiController]
  public class DashboardController : ControllerBase
  {



    private readonly AppDbContext _context;
    private readonly TokenProvider _tokenProvider;
    private readonly AuditoriaService _auditoriaService;
    private readonly InventarioService _inventarioService;


    public DashboardController(AppDbContext context, TokenProvider tokenProvider, AuditoriaService auditoriaService, InventarioService inventarioService)
    {
      _context = context;
      _tokenProvider = tokenProvider;
      _auditoriaService = auditoriaService;
      _inventarioService = inventarioService;
    }



   [HttpGet("Perdidas/{idBodega}/{startDate}/{endDate}")]
    public async Task<IActionResult> GetPerdidas(int idBodega, DateTime startDate, DateTime endDate)
    {
            try
            {
                var userRequest = _tokenProvider.GetAccessTokenData();

                if (!CanRead())
                {
                    return Forbid();
                }

                if (idBodega != userRequest.BodegaId && !_tokenProvider.HasPermission("r_dashboard_global"))
                {
                    return Forbid();
                }

                var perdidas = await _context.Perdidas
                    .Where(x => x.BodegaId == idBodega
                                && x.FechaRegistro.Date >= startDate.Date
                                && x.FechaRegistro.Date <= endDate.Date)
                    .GroupBy(x => x.Producto.Nombre)
                    .Select(g => new
                    {
                        name = g.Key,
                        value = g.Sum(x => x.Cantidad)
                    })
                    .ToListAsync();

                return Ok(perdidas);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



    [HttpGet("Solicitados/{idBodega}/{startDateStr}/{endDateStr}")]
    public async Task<IActionResult> GetSolicitados(int idBodega, DateTime startDateStr, DateTime endDateStr)
    {
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanRead()) { return Forbid(); }

        if (idBodega != userRequest.BodegaId && !_tokenProvider.HasPermission("r_dashboard_global")) { return Forbid(); }

        var solicitados = await _context
          .SolicitudInventarioDetalles
          .Where(x => x.SolicitudInventario.BodegaId == idBodega
                && x.SolicitudInventario.FechaSolicitud >= startDateStr
                && x.SolicitudInventario.FechaSolicitud <= endDateStr)
          .GroupBy(x => x.Producto.Nombre)
          .Select(g => new
          {
            name = g.Key,
            value = g.Sum(x => x.Cantidad)
          })
          .ToListAsync();

        return Ok(solicitados);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }



    [HttpGet("Transferidos/{idBodega}/{startDateStr}/{endDateStr}")]
    public async Task<IActionResult> GetTransferidos(int idBodega, DateTime startDateStr, DateTime endDateStr)
    {
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanRead()) { return Forbid(); }

        if (idBodega != userRequest.BodegaId && !_tokenProvider.HasPermission("r_dashboard_global")) { return Forbid(); }

        var transferidos = await _context.TransferenciasDetalles
                    .Where(x => x.Transferencia.BodegaOrigenId == idBodega
                            && x.Transferencia.FechaRecepcion >= startDateStr
                            && x.Transferencia.FechaRecepcion <= endDateStr)
                    .GroupBy(x => x.Producto.Nombre).Select(g => new
        {
          name = g.Key,
          value = g.Sum(x => x.CantidadDespachada)
        }).ToListAsync();

        return Ok(transferidos);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    private bool CanRead()
    {
      return
        _tokenProvider.HasPermission("r_dashboard_global") ||
        _tokenProvider.HasPermission("r_dashboard_bodega");
    }

  }
}
