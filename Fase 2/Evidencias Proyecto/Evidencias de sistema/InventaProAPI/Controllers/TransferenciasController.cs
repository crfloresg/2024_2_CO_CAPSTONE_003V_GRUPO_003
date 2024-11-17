using InventaProAPI.Data;
using InventaProAPI.DTOs;
using InventaProAPI.Models;
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
  public class TransferenciasController : ControllerBase
  {



    private readonly AppDbContext _context;
    private readonly TokenProvider _tokenProvider;
    private readonly AuditoriaService _auditoriaService;
    private readonly InventarioService _inventarioService;


    public TransferenciasController(AppDbContext context, TokenProvider tokenProvider, AuditoriaService auditoriaService, InventarioService inventarioService)
    {
      _context = context;
      _tokenProvider = tokenProvider;
      _auditoriaService = auditoriaService;
      _inventarioService = inventarioService;
    }



    [HttpGet("{bodegaId}")]
    public async Task<IActionResult> GetTransferenciasByBodegaId(int bodegaId)
    {
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanRead()) { return Forbid(); }

        if (!_tokenProvider.HasPermission("r_transferencias_global") && bodegaId != userRequest.BodegaId)
        {
          return Forbid();
        }

        var transferencias = await _context
          .Transferencias
          .Where(x => x.BodegaDestinoId == bodegaId && x.EstadoTransferenciaId != 5)
          .Select(x => new
          {
            x.TransferenciaId,
            x.BodegaDestinoId,
            x.EstadoTransferenciaId,
            estadosTransferencia = x.EstadoTransferencia,
            x.FechaEnvio,
            x.FechaRecepcion,
            x.Observaciones,
            transferenciasDetalles = x.DetallesTransferencia
            .Select(d => new {
              d.ProductoId,
              d.CantidadDespachada,
              d.CantidadRecibida,
              d.PrecioCompra
            })
            .ToList()

          })
          .OrderByDescending(x => x.TransferenciaId)
          .ToListAsync();


        return Ok(transferencias);

      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    [HttpGet("Terceros/{bodegaId}")]
    public async Task<IActionResult> GetTransferenciasByBodegaIdTerceros(int bodegaId)
    {
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        if (_tokenProvider.HasPermission("r_transferencias_terceros_global") || _tokenProvider.HasPermission("r_transferencias_terceros_bodega")) { return Forbid(); }

        if (!_tokenProvider.HasPermission("r_transferencias_terceros_global") && bodegaId != userRequest.BodegaId)
        {
          return Forbid();
        }

        var transferencias = await _context
          .Transferencias
          .Where(x => x.BodegaDestinoId == bodegaId && x.EstadoTransferenciaId == 5)
          .Select(x => new
          {
            x.TransferenciaId,
            x.BodegaDestinoId,
            x.EstadoTransferenciaId,
            estadosTransferencia = x.EstadoTransferencia,
            x.FechaEnvio,
            x.FechaRecepcion,
            x.Observaciones,
            transferenciasDetalles = x.DetallesTransferencia
            .Select(d => new {
              d.ProductoId,
              d.CantidadDespachada,
              d.CantidadRecibida,
              d.PrecioCompra
            })
            .ToList()

          })
          .OrderByDescending(x => x.TransferenciaId)
          .ToListAsync();


        return Ok(transferencias);

      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }



    [HttpGet("Detalle/{transferenciaId}")]
    public async Task<IActionResult> GetOneTransferencia(int transferenciaId)
    {
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanRead()) { return Forbid(); }

        var transferencias = await _context
          .Transferencias
          .Where(x => x.TransferenciaId == transferenciaId)
          .Select(x => new
          {
            x.TransferenciaId,
            x.BodegaOrigenId,
            x.BodegaDestinoId,
            x.EstadoTransferenciaId,
            estadosTransferencia = x.EstadoTransferencia,
            x.FechaEnvio,
            x.FechaRecepcion,
            x.Observaciones,
            transferenciasDetalles = x.DetallesTransferencia
            .Select(d => new {
              d.ProductoId,
              d.CantidadDespachada,
              d.CantidadRecibida,
              d.PrecioCompra,
              producto = d.Producto
            })
            .ToList()

          })
          .FirstOrDefaultAsync();


        return Ok(transferencias);

      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }



    //Entrega los detalles de la recepcion
    [HttpGet("Recepcion/{transferenciaId}/{secret}")]
    public async Task<IActionResult> GetOneTransferenciaByIdAndSecret(int transferenciaId, int secret)
    {
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanRecepcionar()) { return Forbid(); }

        var transferencia = await _context
          .Transferencias
          .Where(x => x.TransferenciaId == transferenciaId && x.EstadoTransferenciaId == 2)
          .Select(x => new
          {
            x.TransferenciaId,
            x.BodegaDestinoId,
            x.EstadoTransferenciaId,
            estadosTransferencia = x.EstadoTransferencia,
            x.FechaEnvio,
            x.FechaRecepcion,
            x.Observaciones,
            x.Secret,
            transferenciasDetalles = x.DetallesTransferencia
            .Select(d => new {
              d.DetalleId,
              d.ProductoId,
              d.CantidadDespachada,
              d.CantidadRecibida,
              d.PrecioCompra,
              producto = d.Producto
            })
            .ToList()

          })
          .FirstOrDefaultAsync();

        if(transferencia == null) { return NotFound(); }

        if(transferencia.Secret != secret) { return Forbid(); }

        if(transferencia.BodegaDestinoId != userRequest.BodegaId && !_tokenProvider.HasPermission("c_recepciones_global")) { return Forbid(); }

        return Ok(transferencia);

      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }



    //Recepciona una transferencia
    [HttpPost("Recepcion")]
    public async Task<IActionResult> CreateRecepcion([FromBody] RecepcionCreateRequest body)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanRecepcionar()) { return Forbid(); }

        var transferencia = await _context.Transferencias.Where(x => x.TransferenciaId == body.transferenciaId).FirstOrDefaultAsync();

        if(transferencia == null) { return NotFound(); }

        if (transferencia.BodegaDestinoId != userRequest.BodegaId && !_tokenProvider.HasPermission("c_recepciones_global")) { return Forbid(); }

        transferencia.FechaRecepcion = DateTime.Now;
        transferencia.EstadoTransferenciaId = 3;

        await _context.SaveChangesAsync();

        foreach (var item in body.detalle)
        {

          var detalle = await _context.TransferenciasDetalles.Where(x => x.DetalleId == item.detalleId).FirstOrDefaultAsync();

          if(detalle == null) { return NotFound(); }

          detalle.CantidadRecibida = item.cantidadRecibida;
          detalle.CantidadDmg = item.cantidadDmg;
          detalle.CantidadPerdida = item.cantidadPerdida;
          await _context.SaveChangesAsync();

          await _inventarioService.AgregarAInventario(body.bodegaDestinoId, item.productoId, item.precioCompra, item.cantidadRecibida);
          if(item.cantidadPerdida > 0)
          {
            await _inventarioService.Perdida(item.productoId, body.bodegaDestinoId, item.cantidadPerdida, 2, "Perdida durante el envío", userRequest.UsuarioId, item.precioCompra);
          }
          if(item.cantidadDmg > 0)
          {
            await _inventarioService.Perdida(item.productoId, body.bodegaDestinoId, item.cantidadDmg, 1, "Dañado durante el envío", userRequest.UsuarioId, item.precioCompra);
          }
        }

        await _auditoriaService.Auditar(userRequest.UsuarioId, "recepcion_create", $"Recepciono la transferencia {body.transferenciaId}", userRequest.BodegaId);

        await transaction.CommitAsync();
        return Ok();
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return BadRequest(ex.Message);
      }
    }



    [HttpPost]
    public async Task<IActionResult> CreateTrasnferencia([FromBody] TransferenciaCreateRequest body)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!_tokenProvider.HasPermission("c_transferencias_global")) { return Forbid(); }

        var newTransferencia = new Transferencia
        {
          BodegaOrigenId = 1,
          BodegaDestinoId = body.bodegaDestinoId,
          EstadoTransferenciaId = 2,
          FechaEnvio = DateTime.Now,
          UsuarioSolicitanteId = userRequest.UsuarioId,
          Observaciones = body.observaciones,
          Secret = new Random().Next(10000, 100000)
      };

        await _context.Transferencias.AddAsync(newTransferencia);
        await _context.SaveChangesAsync();

        foreach (var item in body.transferenciasDetalles)
        {
          var newDetalle = new TransferenciaDetalle
          {
            TransferenciaId = newTransferencia.TransferenciaId,
            ProductoId = item.productoId,
            CantidadDespachada = item.cantidadDespachada,
            PrecioCompra = item.precioCompra
          };

          await _context.TransferenciasDetalles.AddAsync(newDetalle);
          await _context.SaveChangesAsync();

          await _inventarioService.QuitarDeInventario(1, item.productoId, item.precioCompra, item.cantidadDespachada);
          
        }

        await _auditoriaService.Auditar(userRequest.UsuarioId, "transferencia_create", $"Se creo la transferencia {newTransferencia.TransferenciaId}", userRequest.BodegaId);

        await transaction.CommitAsync();
        return Ok();
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return BadRequest(ex.Message);
      }
    }



    [HttpGet("Cancel/{transferenciaId}")]
    public async Task<IActionResult> CancelTransferencia(int transferenciaId)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {

        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!_tokenProvider.HasPermission("d_transferencias_global")) { return Forbid(); }


        var transferencia = await _context
          .Transferencias
          .Where(x => 
          x.TransferenciaId == transferenciaId && 
          x.FechaRecepcion == null &&
          x.EstadoTransferenciaId != 3 &&
          x.FechaCancelado == null
          )
          .Include(x => x.DetallesTransferencia)
          .FirstOrDefaultAsync();

        if (transferencia == null) { return NotFound(); }

        transferencia.EstadoTransferenciaId = 4;
        transferencia.FechaCancelado = DateTime.Now;

        await _context.SaveChangesAsync();

        foreach (var item in transferencia.DetallesTransferencia)
        {
          //1 siendo bodega central
          await _inventarioService.AgregarAInventario(1, item.ProductoId, item.PrecioCompra, item.CantidadDespachada);           
        }

        await _auditoriaService.Auditar(userRequest.UsuarioId, "transferencia_delete", $"Se cancelo la transferencia {transferenciaId}", userRequest.BodegaId);

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
      return _tokenProvider.HasPermission("r_transferencias_bodega") || _tokenProvider.HasPermission("r_transferencias_global");
    }



    private bool CanRecepcionar()
    {
      return _tokenProvider.HasPermission("c_recepciones_bodega") || _tokenProvider.HasPermission("c_recepciones_global");
    }


  }
}
