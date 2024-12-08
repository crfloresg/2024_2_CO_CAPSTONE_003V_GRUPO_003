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
  [ApiController]
  public class SolicitudesController : ControllerBase
  {



    private readonly AppDbContext _context;
    private readonly TokenProvider _tokenProvider;
    private readonly AuditoriaService _auditoriaService;



    public SolicitudesController(AppDbContext context, TokenProvider tokenProvider, AuditoriaService auditoriaService)
    {
      _context = context;
      _tokenProvider = tokenProvider;
      _auditoriaService = auditoriaService;
    }



    [HttpGet("SolicitudesByIdBodega/{idBodega}")]
    [Authorize]
    public async Task<IActionResult> GetSolicitudes(int idBodega)
    {
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanRead()) { return Forbid(); }

        var idFilter = 0;

        if (!_tokenProvider.HasPermission("r_solicitudes_global"))
        {
          idFilter = userRequest.BodegaId;
        }
        else
        {
          idFilter = idBodega;
        }

        var solicitudes = await _context
          .SolicitudInventarios
          .Where(x => x.DetallesSolicitudesInventario.Count > 0)
          .Include(x => x.Bodega)
          .Include(x => x.EstadoSolicitudInventario)
          .Include(x => x.DetallesSolicitudesInventario)
            .ThenInclude(x => x.Producto)
          .Where(x => x.BodegaId == idFilter)
          .OrderByDescending(x => x.SolicitudId)
          .ToListAsync();
        

        return Ok(solicitudes);

      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }



    [HttpGet("SolicitudesByIdBodegaForTransferencia/{idBodega}")]
    [Authorize]
    public async Task<IActionResult> SolicitudesByIdBodegaForTransferencia(int idBodega)
    {
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        //if (!CanRead()) { return Forbid(); }

        var today = DateTime.Today;
        var startOfWeek = today.AddDays(-(int)today.DayOfWeek + (int)DayOfWeek.Monday);
        var endOfWeek = DateTime.Now;


        var solicitudes = await _context
          .SolicitudInventarios
          .Where(x => x.DetallesSolicitudesInventario.Count > 0)
          .Include(x => x.DetallesSolicitudesInventario)
          .Where(x => 
            x.BodegaId == idBodega &&
            x.EstadoSolicitudId == 2 &&
            (x.FechaAprobacion >= startOfWeek &&
            x.FechaAprobacion <= endOfWeek)
          )
          .SelectMany(x => x.DetallesSolicitudesInventario.Select(y => new
          {
            y.ProductoId,
            y.Cantidad
          }))
          .ToListAsync();


        return Ok(solicitudes);

      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }



    [HttpGet("SolicitudByIdSolicitud/{idSolicitud}")]
    [Authorize]
    public async Task<IActionResult> GetOneSolicitud(int idSolicitud)
    {
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanRead()) { return Forbid(); }

        var solicitudes = await _context
          .SolicitudInventarios
          .Where(x => x.DetallesSolicitudesInventario.Count > 0)
          .Include(x => x.Bodega)
          .Include(x => x.EstadoSolicitudInventario)
          .Include(x => x.DetallesSolicitudesInventario)
            .ThenInclude(x => x.Producto)
          .Where(x => x.SolicitudId == idSolicitud)
          .FirstOrDefaultAsync();

        if (solicitudes == null) { return NotFound(); }

        if(solicitudes.BodegaId != userRequest.BodegaId && !_tokenProvider.HasPermission("r_solicitudes_global")) { return Forbid(); }

        return Ok(solicitudes);

      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }



    [HttpGet("Opciones/{idBodega}")]
    [Authorize]
    public async Task<IActionResult> GetOpciones(int idBodega)
    {
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();
        if (!CanCU()) { return Forbid(); }

        if(idBodega != userRequest.BodegaId && !_tokenProvider.HasPermission("cu_solicitudes_global")) { return Forbid(); }

        var productos = await _context
          .Productos
          .Include(x => x.Inventarios.Where(i => i.BodegaId == idBodega))
          .Where(x => x.Estado == 1)
          .ToListAsync();


        return Ok(productos);

      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }



    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CU([FromBody] SolicitudesCURequest body)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanCU()) { return Forbid(); }

        var auxId = body.solicitudId;


        if(body.solicitudId == 0)
        {

          if (body.bodegaId != userRequest.BodegaId && !_tokenProvider.HasPermission("cu_solicitudes_global")) { return Forbid(); }

          //Creamos
          var newSolicitud = new SolicitudInventario
          {
            BodegaId = body.bodegaId,
            EstadoSolicitudId = 1,
            UsuarioSolicitanteId = userRequest.UsuarioId,
            FechaSolicitud = DateTime.Now
          };

          await _context.SolicitudInventarios.AddAsync(newSolicitud);
          await _context.SaveChangesAsync();

          auxId = newSolicitud.SolicitudId;

          await _auditoriaService.Auditar(userRequest.UsuarioId, "solicitud_create", $"Se creo la solicitud {newSolicitud.SolicitudId}", userRequest.BodegaId);
        }
        else
        {
          //Modificamos

          var solicitud = await _context.SolicitudInventarios.Where(x => x.SolicitudId == auxId).FirstOrDefaultAsync();

          if(solicitud == null ) {  return NotFound(); }

          if(solicitud.BodegaId != userRequest.BodegaId && !_tokenProvider.HasPermission("cu_solicitudes_global")) { return Forbid(); }

          solicitud.FechaModificacion = DateTime.Now;

          await _auditoriaService.Auditar(userRequest.UsuarioId, "solicitud_update", $"Se modifico la solicitud {solicitud.SolicitudId}", userRequest.BodegaId);

          await _context.SolicitudInventarioDetalles.Where(x => x.SolicitudId == solicitud.SolicitudId).ExecuteDeleteAsync();
          await _context.SaveChangesAsync();

        }


        

        foreach (var item in body.detallesSolicitudesInventario)
        {
          if(item.cantidad > 0)
          {
            var detalle = new SolicitudInventarioDetalle
            {
              SolicitudId = auxId,
              ProductoId = item.productoId,
              Cantidad = item.cantidad
            };
            await _context.SolicitudInventarioDetalles.AddAsync(detalle);
            await _context.SaveChangesAsync();
          }
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



    [HttpPost("AcceptDeny")]
    [Authorize]
    public async Task<IActionResult> AcceptDenySolicitud([FromBody] SolicitudesADRequest body)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!_tokenProvider.HasPermission("ad_solicitudes_global")) 
        {
          await transaction.RollbackAsync();
          return Forbid(); 
        }

        var solicitud = await _context.SolicitudInventarios.Where(x => x.SolicitudId == body.solicitudId).FirstOrDefaultAsync();

        if(solicitud == null) 
        {
          await transaction.RollbackAsync();
          return NotFound();
        }

        solicitud.Observaciones = body.observacion;

        if (body.accept == true)
        {
          solicitud.FechaAprobacion = DateTime.Now;
          solicitud.EstadoSolicitudId = 2;
          await _context.SaveChangesAsync();
          await _auditoriaService.Auditar(userRequest.UsuarioId, "solicitud_accept", $"Se acepto la solicitud {body.solicitudId}", userRequest.BodegaId);


          foreach (var item in body.detalles)
          {
            var detalleSol = await _context.SolicitudInventarioDetalles.Where(x => x.DetalleId == item.detalleId).FirstOrDefaultAsync();
            if(detalleSol == null) 
            { 
              await transaction.RollbackAsync(); 
              return NotFound(); 
            }

            detalleSol.CantidadAprobada = item.cantidad;
            await _context.SaveChangesAsync();

          }


        }
        else
        {
          solicitud.FechaRechazo = DateTime.Now;
          solicitud.EstadoSolicitudId = 3;
          await _context.SaveChangesAsync();
          await _auditoriaService.Auditar(userRequest.UsuarioId, "solicitud_deny", $"Se denego la solicitud {body.solicitudId}", userRequest.BodegaId);
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

    [HttpGet("Cancel/{id}")]
    [Authorize]
    public async Task<IActionResult> CancelSolicitud(int id)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {

        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanDelete()) { return Forbid(); }

        var solicitud = await _context.SolicitudInventarios.Where(x => x.SolicitudId == id).FirstOrDefaultAsync();

        if (solicitud == null) { return NotFound(); }

        if (!_tokenProvider.HasPermission("d_solicitudes_global") && solicitud.BodegaId != userRequest.BodegaId) { return Forbid(); }

        solicitud.EstadoSolicitudId = 5;

        await _context.SaveChangesAsync();

        await _auditoriaService.Auditar(userRequest.UsuarioId, "solicitud_delete", $"Se cancelo la solicitud {solicitud.SolicitudId}", userRequest.BodegaId);

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
      return _tokenProvider.HasPermission("r_solicitudes_global") || _tokenProvider.HasPermission("r_solicitudes_bodega");
    }

    private bool CanCU()
    {
      return _tokenProvider.HasPermission("cu_solicitudes_global") || _tokenProvider.HasPermission("cu_solicitudes_bodega");
    }

    private bool CanActivate()
    {
      return _tokenProvider.HasPermission("a_solicitudes_global") || _tokenProvider.HasPermission("a_solicitudes_bodega");
    }

    private bool CanDelete()
    {
      return _tokenProvider.HasPermission("d_solicitudes_global") || _tokenProvider.HasPermission("d_solicitudes_bodega");
    }

  }
}
