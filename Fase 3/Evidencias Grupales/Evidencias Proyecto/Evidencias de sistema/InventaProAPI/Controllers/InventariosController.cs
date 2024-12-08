﻿using InventaProAPI.Data;
using InventaProAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventaProAPI.Controllers
{
  [Route("[controller]")]
  [ApiController]
  public class InventariosController : ControllerBase
  {
    private readonly AppDbContext _context;
    private readonly TokenProvider _tokenProvider;
    private readonly AuditoriaService _auditoriaService;



    public InventariosController(AppDbContext context, TokenProvider tokenProvider, AuditoriaService auditoriaService)
    {
      _context = context;
      _tokenProvider = tokenProvider;
      _auditoriaService = auditoriaService;
    }



    [HttpGet("{idBodega}")]
    [Authorize]
    public async Task<IActionResult> GetInventario(int idBodega)
    {
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanRead()) { return Forbid(); }

        var idFilter = _tokenProvider.HasPermission("r_inventarios_global") ? idBodega : userRequest.BodegaId;

        var inventario = await _context
            .Productos
            .Where(p =>
                p.Inventarios != null &&
                p.LotesInventario != null &&
                p.LotesInventario.Any(l =>
                    l.BodegaId == idFilter &&
                    l.Cantidad > 0))
            .Select(p => new
            {
              p.ProductoId,
              p.Nombre,
              p.Codigo,
              p.Categoria,
              p.UnidadMedida,
              p.PrecioVenta,
              p.Estado,
              LotesInventario = p.LotesInventario
                    .Where(l => l.BodegaId == idFilter && l.Cantidad > 0) // Filter out LotesInventario with 0 cantidad
                    .ToList(),
              cantidad = p.Inventarios
                    .Where(i => i.BodegaId == idFilter)
                    .FirstOrDefault()
                    .Cantidad
            })
            .OrderByDescending(x => x.ProductoId)
            .ToListAsync();

        return Ok(inventario);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }



    [HttpGet("BySolicitud/{idBodega}/{idSolicitud}")]
    [Authorize]
    public async Task<IActionResult> GetInventarioBySolicitud(int idBodega, int idSolicitud)
    {
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanRead()) { return Forbid(); }

        //var idFilter = _tokenProvider.HasPermission("r_inventarios_global") ? idBodega : userRequest.BodegaId;

        var verificarEstadoSol = await _context.SolicitudInventarios.Where(x => x.SolicitudId == idSolicitud && x.EstadoSolicitudId == 2).FirstOrDefaultAsync();

        if(verificarEstadoSol == null) { return NotFound(); }

        var verificarTipoBodega = await _context.Bodegas.Where(x => idBodega == x.BodegaId && x.TipoBodegaId == 1).FirstOrDefaultAsync();

        if (verificarTipoBodega == null) { return Forbid(); }

        var inventario = await _context
            .Productos
            .Where(p =>
                p.SolicitudesInventarioDetalles.Any(sid => sid.SolicitudId == idSolicitud) && // Filter by solicitud_id
                p.Inventarios != null &&
                p.LotesInventario != null &&
                p.LotesInventario.Any(l =>
                    l.BodegaId == idBodega &&
                    l.Cantidad > 0))
            .Select(p => new
            {
              p.ProductoId,
              p.Nombre,
              p.Codigo,
              p.Categoria,
              p.UnidadMedida,
              p.PrecioVenta,
              p.Estado,
              cantidadSolicitada = p.SolicitudesInventarioDetalles.Where(x => x.SolicitudId == idSolicitud).FirstOrDefault().Cantidad,
              LotesInventario = p.LotesInventario
                    .Where(l => l.BodegaId == idBodega && l.Cantidad > 0) // Filter out LotesInventario with 0 cantidad
                    .ToList(),
              cantidad = p.Inventarios
                    .Where(i => i.BodegaId == idBodega)
                    .FirstOrDefault()
                    .Cantidad,
              cantidadAprobada = p.SolicitudesInventarioDetalles.Where(x => x.SolicitudId == idSolicitud).FirstOrDefault().CantidadAprobada,
            })
            .OrderByDescending(x => x.ProductoId)
            .ToListAsync();

        return Ok(inventario);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }



    private bool CanRead()
    {
      return
        _tokenProvider.HasPermission("r_inventarios_global") ||
        _tokenProvider.HasPermission("r_inventarios_bodega") ||
        _tokenProvider.HasPermission("ad_solicitudes_global") ||
        _tokenProvider.HasPermission("c_transferencias_global") ||
        _tokenProvider.HasPermission("c_perdidas_bodega") ||
        _tokenProvider.HasPermission("c_perdidas_global");
    }



  }
}
