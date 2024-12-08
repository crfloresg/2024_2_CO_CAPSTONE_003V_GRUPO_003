﻿using Microsoft.AspNetCore.Mvc;
using InventaProAPI.DTOs;
using InventaProAPI.Services;
using InventaProAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using InventaProAPI.Models;
using InformeApi.Models;

namespace InventaProAPI.Controllers
{
  [Route("[controller]")]
  [Authorize]
  [ApiController]
  public class BodegasController : ControllerBase
  {



    private readonly AppDbContext _context;
    private readonly TokenProvider _tokenProvider;
    private readonly AuditoriaService _auditoriaService;
    private readonly InventarioService _inventarioService;



    public BodegasController
      (
        AppDbContext context,
        TokenProvider tokenProvider,
        AuditoriaService auditoriaService, 
        InventarioService inventarioService
      )
    {
      _context = context;
      _tokenProvider = tokenProvider;
      _auditoriaService = auditoriaService;
      _inventarioService = inventarioService;
    }



    [HttpGet]
    public async Task<IActionResult> GetBodegas()
    {
      try
      {
        var bodegas = await _context.Bodegas.Where(x => x.EstadoBodegaId != 0).ToListAsync();
        return Ok(bodegas);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }



    [HttpGet("GetAll")]
    public async Task<IActionResult> GetAllBodegasForCrud()
    { 
      try
      {
        if (!_tokenProvider.HasPermission("r_bodegas_global")) { return Forbid(); }
        var bodegas = await _context.Bodegas.OrderByDescending(x => x.BodegaId).ToListAsync();
        return Ok(bodegas);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }



    [HttpGet("{id}")]
    public async Task<IActionResult> GetBodega(int id)
    {
      try
      {
        if (!_tokenProvider.HasPermission("r_bodegas_global")) { return Forbid(); }
        var bodega = await _context.Bodegas.Where(x => x.BodegaId == id).FirstOrDefaultAsync();
        if (bodega == null) return NotFound();
        return Ok(bodega);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    [HttpPost]
    public async Task<IActionResult> CUBodega(BodegasCURequest body)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!_tokenProvider.HasPermission("cu_bodegas_global")) { return Forbid(); }

        if (body.bodegaId == 0)
        {
          //Create
          var newBodega = new Bodega
          {
            Nombre = body.nombre,
            Direccion = body.direccion,
            TipoBodegaId = 2,
            EstadoBodegaId = 1,
            FechaCreacion = DateTime.Now
          };

          await _context.Bodegas.AddAsync(newBodega);
          await _context.SaveChangesAsync();

          var productos = await _context.Productos.Where(x => x.Estado == 1).ToListAsync();
          foreach (var item in productos)
          {
            var newAlert = new Alerta
            {
              ProductoId = item.ProductoId,
              BodegaId = newBodega.BodegaId,
              TipoAlertaId = 1,
              Mensaje = "Stock minimo",
              EstadoAlertaId = 1,
              Minimo = 0,
              FechaCreacion = DateTime.Now
            };

            await _context.Alertas.AddAsync(newAlert);
            await _context.SaveChangesAsync();
          }

          await _auditoriaService.Auditar(userRequest.UsuarioId, "bodega_create", $"Se creo la bodega {newBodega.BodegaId}", userRequest.BodegaId);
        }
        else
        {
          //Update
          var bodega = await _context.Bodegas.Where(x => x.BodegaId == body.bodegaId && x.EstadoBodegaId != 0).FirstOrDefaultAsync();

          if(bodega == null) { return NotFound(); }

          bodega.Nombre = body.nombre;
          bodega.Direccion = body.direccion;
          bodega.FechaActualizacion = DateTime.Now;
          await _context.SaveChangesAsync();

          await _auditoriaService.Auditar(userRequest.UsuarioId, "bodega_update", $"Se modifico la bodega {body.bodegaId}", userRequest.BodegaId);
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

        if (!_tokenProvider.HasPermission("d_bodegas_global")) { return Forbid(); }

        var bodega = await _context.Bodegas.Where(x => x.BodegaId == id).FirstOrDefaultAsync();

        if (bodega == null) { return NotFound(); }

        bodega.EstadoBodegaId = 0;

        await _context.SaveChangesAsync();

        await _auditoriaService.Auditar(userRequest.UsuarioId, "bodega_desactivado", $"Se deshabilito la bodega {bodega.BodegaId}", userRequest.BodegaId);

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

        if (!_tokenProvider.HasPermission("a_bodegas_global")) { return Forbid(); }

        var bodega = await _context.Bodegas.Where(x => x.BodegaId == id).FirstOrDefaultAsync();

        if (bodega == null) { return NotFound(); }

        bodega.EstadoBodegaId = 1;

        await _context.SaveChangesAsync();

        await _auditoriaService.Auditar(userRequest.UsuarioId, "bodega_activado", $"Se habilito la bodega {bodega.BodegaId}", userRequest.BodegaId);

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
