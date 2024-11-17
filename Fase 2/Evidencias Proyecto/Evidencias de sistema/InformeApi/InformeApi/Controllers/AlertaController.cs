using InformeApi.Data;
using InformeApi.DTOs;
using InformeApi.Models;
using InformeApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InformeApi.Controllers
{
    [Route("")]
    [Authorize]
    [ApiController]
    public class AlertaController : Controller
    {
        private readonly AppDbContext _context;
        private readonly TokenProvider _tokenProvider;
        private readonly AlertaService _alertaService;
        private readonly AuditoriaService _auditoriaService;

        public AlertaController(AppDbContext context, TokenProvider tokenProvider, AlertaService alertService, AuditoriaService auditoriaService)
        {
            _context = context;
            _tokenProvider = tokenProvider;
            _alertaService = alertService;
            _auditoriaService = auditoriaService;
        }

        [HttpGet("StockAlerta/{bodegaId}")]
        public async Task<IActionResult> ConsultaStockMin(int bodegaId)
        {
            var userRequest = _tokenProvider.GetAccessTokenData();

            if (!CanRead()) { return Forbid(); }

            if (bodegaId != userRequest.BodegaId && !_tokenProvider.HasPermission("r_alarmas_global")) { return Forbid(); }

            var stonckMin = await GetDiferenciaStock(bodegaId);

            return Ok(stonckMin);
        }

        [HttpGet("AlertaLote/{bodegaId}")]
        public async Task<IActionResult> GetProcutos(int bodegaId)
        {
            try
            {
                var userRequest = _tokenProvider.GetAccessTokenData();

                if (!CanRead()) { return Forbid(); }
                if (bodegaId != userRequest.BodegaId && !_tokenProvider.HasPermission("r_alertas_global")) { return Forbid();  }

                var productos = await _context.LoteInventarios
                       .Include(x => x.Bodega)
                       .Include(x => x.Producto)
                       .Where(x => x.BodegaId == bodegaId)
                       .Where(x => x.Bodega != null && x.Producto != null)
                       .Join(
                           _context.Alertas, lote => new { lote.ProductoId, lote.BodegaId }, alerta => new { alerta.ProductoId, alerta.BodegaId },
                           (lote, alerta) => new { Lote = lote, Alerta = alerta }
                       )
                       .GroupBy(x => new {
                           x.Lote.ProductoId,
                           NombreProducto = x.Lote.Producto.Nombre,
                           NombreBodega = x.Lote.Bodega.Nombre,
                           Codigo = x.Lote.Producto.Codigo,
                           Estado = x.Alerta.EstadoAlertaId,
                           Minimo = x.Alerta.Minimo,
                           AlertaId = x.Alerta.AlertaId
                       })
                       .Select(g => new {
                           ProductoId = g.Key.ProductoId,
                           NombreProducto = g.Key.NombreProducto,
                           NombreBodega = g.Key.NombreBodega,
                           Codigo = g.Key.Codigo,
                           Estado = g.Key.Estado,
                           CantidadTotal = g.Sum(x => x.Lote.Cantidad),
                           Minimo = g.Key.Minimo,
                           AlertaId = g.Key.AlertaId
                       })
                       .ToListAsync();

                return Ok(productos);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("UpdateAlert/{alertId}/{minStock}/{estado}/{option}")]
        public async Task<IActionResult> UpdateAlerta(int alertId, int minStock, int estado, int option)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var userRequest = _tokenProvider.GetAccessTokenData();

                if(estado == 3 && !CanDelete()) { return Forbid(); }
                if(estado == 1 && !CanActivate()) {  return Forbid(); }

                var alerta = await _context.Alertas.FirstOrDefaultAsync();

                if (alerta == null) { return NotFound(); }

                if(
                    (alerta.BodegaId != userRequest.BodegaId && !_tokenProvider.HasPermission("a_alarmas_global")) ||
                    (alerta.BodegaId != userRequest.BodegaId && !_tokenProvider.HasPermission("d_alarmas_global"))
                  )
                {
                    return Forbid();
                }

                switch (option)
                {
                    case 1:
                        alerta.Minimo = minStock;
                        break;
                    case 2:
                        alerta.EstadoAlertaId = estado;
                        break;
                }

                await _context.SaveChangesAsync();
                switch (estado)
                {
                    case 1:
                        await _auditoriaService.Auditar(userRequest.UsuarioId, "alerta_Activada", $"Se activado la alerta {alerta.AlertaId}", userRequest.BodegaId);
                        break;
                    case 3:
                        await _auditoriaService.Auditar(userRequest.UsuarioId, "alerta_desactivada", $"Se deshabilito la alerta {alerta.AlertaId}", userRequest.BodegaId);
                        break;
                    default:
                        await _auditoriaService.Auditar(userRequest.UsuarioId, "Stock_min_updatiado", $"Se cambiado el stock minimo {alerta.AlertaId}", userRequest.BodegaId);
                        break;
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

        [HttpGet("AddAlert/{productoId}")]
        public async Task<IActionResult> AddAlerta(int productoId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var userRequest = _tokenProvider.GetAccessTokenData();

                await _alertaService.addAlert(productoId, userRequest.BodegaId, 100);

                await _context.SaveChangesAsync();
                await _auditoriaService.Auditar(userRequest.UsuarioId, "Alerta_create", $"Se registró una alerta de {productoId}", userRequest.BodegaId);

                await transaction.CommitAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("OneAlert/{alertaId}")]
        public async Task<IActionResult> OneAlert(int alertaId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var userRequest = _tokenProvider.GetAccessTokenData();

                if(!CanRead()) { return Forbid(); }

                var alertas = await _context.Alertas
                 .Select(x => new {
                     x.ProductoId,
                     x.Minimo,
                     x.AlertaId,
                     x.BodegaId
                 })
                 .Where(x => x.AlertaId == alertaId)
                 .FirstOrDefaultAsync();

                if (alertas == null) { return NotFound(); }

                if (alertas.BodegaId != userRequest.BodegaId && !_tokenProvider.HasPermission("r_alarmas_global")) { return Forbid(); }

                return Ok(alertas);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("UpdateStock")]
        public async Task<IActionResult> UpdateStock([FromBody] AlertasCURequest alertasCURequest)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var userRequest = _tokenProvider.GetAccessTokenData();

                if (alertasCURequest.BodegaId != userRequest.BodegaId && !_tokenProvider.HasPermission("u_alarmas_global")) { return Forbid(); }

                var alert = await _context.Alertas.Where(x => x.AlertaId == alertasCURequest.AlertaId).FirstOrDefaultAsync();

                if (alert == null) { return NotFound(); }

                alert.Minimo = alertasCURequest.minimo;

                await _context.SaveChangesAsync();
                await _auditoriaService.Auditar(userRequest.UsuarioId, "stock_minimo_update", $"Se modifico el stock minimo {alert.AlertaId}", userRequest.BodegaId);

                await transaction.CommitAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest(ex.Message);
            }
        }
        
        private async Task<List<AlertaStock>> GetDiferenciaStock(int bodegaId)
        {
            try
            {
                var query = await (from a in _context.Alertas
                                   join ta in _context.TipoAlertas on a.TipoAlertaId equals ta.TipoAlertaId
                                   join p in _context.Productos on a.ProductoId equals p.ProductoId
                                   join e in _context.EstadoAlertas on a.EstadoAlertaId equals e.EstadoAlertaId
                                   where ta.Nombre == "bajo_stock"
                                         && e.Nombre == "pendiente"
                                         && a.BodegaId == bodegaId
                                   let cantidadActual = _context.LoteInventarios
                                       .Where(l => l.ProductoId == a.ProductoId && l.BodegaId == a.BodegaId)
                                       .Sum(l => l.Cantidad)
                                   where a.Minimo + 50 >= cantidadActual
                                   select new AlertaStock
                                   {
                                       NombreProducto = p.Nombre,
                                       Minimo = cantidadActual
                                   }).ToListAsync();

                return query;
            }
            catch (Exception ex)
            {

                return new List<AlertaStock>();
            }
        }

        private bool CanRead()
        {
            return _tokenProvider.HasPermission("r_alarmas_global") || _tokenProvider.HasPermission("r_alarmas_bodega");
        }

        private bool CanUpdate()
        {
            return _tokenProvider.HasPermission("u_alarmas_global") || _tokenProvider.HasPermission("u_alarmas_bodega");
        }

        private bool CanActivate()
        {
            return _tokenProvider.HasPermission("a_alarmas_global") || _tokenProvider.HasPermission("a_alarmas_bodega");
        }

        private bool CanDelete()
        {
            return _tokenProvider.HasPermission("d_alarmas_global") || _tokenProvider.HasPermission("d_alarmas_bodega");
        }

    }
}
