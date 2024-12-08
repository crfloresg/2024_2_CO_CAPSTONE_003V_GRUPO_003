using InformeApi.Data;
using InformeApi.DTOs;
using InformeApi.Models;
using InformeApi.Services;
using InventaProAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;

namespace InformeApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class IntegracionController : ControllerBase
    {



        private readonly AppDbContext _context;
        private readonly TokenProvider _tokenProvider;
        private readonly AlertaService _alertaService;
        private readonly AuditoriaService _auditoriaService;
        private readonly InventarioService _inventarioService;
        string fechas = DateTime.Now.ToString("dd-MM-yyyy HH:mm");


        public IntegracionController
        (
          AppDbContext context,
          TokenProvider tokenProvider,
          AlertaService alertService,
          AuditoriaService auditoriaService,
          InventarioService inventarioService
        )
        {
            _context = context;
            _tokenProvider = tokenProvider;
            _alertaService = alertService;
            _auditoriaService = auditoriaService;
            _inventarioService = inventarioService;
        }



        //Transferencia a terceros
        [HttpPost("CrearTransferencia")]
        public async Task<IActionResult> CreateTrasnferencia([FromBody] TransferenciaTerceros body, [FromHeader(Name = "X-API-Key")] string apiKey)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                //var userRequest = _tokenProvider.GetAccessTokenData();

                //if (!_tokenProvider.HasPermission("c_transferencias_global")) { return Forbid(); }

                var apikeyExists = await _context.ApiKeys.Where(x => x.Key == apiKey).FirstOrDefaultAsync();

                if (apikeyExists == null ) { return Forbid(); }


                var newTransferencia = new Transferencia
                {
                    BodegaOrigenId = body.bodegaOrigenId,
                    BodegaDestinoId = 0,
                    EstadoTransferenciaId = 5,
                    FechaEnvio = DateTime.Now,
                    UsuarioSolicitanteId = 0,
                    Observaciones = body.observaciones,
                    clave = 0
                };

                await _context.Transferencias.AddAsync(newTransferencia);
                await _context.SaveChangesAsync();

                foreach (var item in body.transferenciasDetalles)
                {
                    var newDetalle = new TransferenciaDetalle
                    {
                        TransferenciaId = newTransferencia.TransferenciaId,
                        ProductoId = item.productoId,
                        Cantidad = item.cantidadDespachada,
                        compra = item.precioCompra
                    };

                    await _context.TransferenciasDetalles.AddAsync(newDetalle);
                    await _context.SaveChangesAsync();

                    await _inventarioService.QuitarDeInventario(body.bodegaOrigenId, item.productoId, item.precioCompra, item.cantidadDespachada);

                }

                await _auditoriaService.Auditar(0, "transferencia_tercero_create", $"Se creo la transferencia a terceros {newTransferencia.TransferenciaId}", body.bodegaOrigenId);

                await transaction.CommitAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return BadRequest(ex.Message);
            }
        }



        //Ver Transferencias a terceros JSON
        [HttpGet("Transferencias/{idBodega}")]
        public async Task<IActionResult> GetTransferencias(int idBodega, [FromHeader(Name = "X-API-Key")] string apiKey)
        {
          try
          {
        //var userRequest = _tokenProvider.GetAccessTokenData();

        //if (!CanRead()) { return Forbid(); }

        // idFilter = _tokenProvider.HasPermission("r_inventarios_global") ? idBodega : userRequest.BodegaId;


        var apikeyExists = await _context.ApiKeys.Where(x => x.Key == apiKey).FirstOrDefaultAsync();

        if (apikeyExists == null) { return Forbid(); }

        var transferencias = await _context
          .Transferencias
          .Where(x => x.BodegaDestinoId == idBodega && x.EstadoTransferenciaId == 5)
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
              d.Cantidad,
              d.Recibido,
              d.compra
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



        //Ver inventario JSON
        [HttpGet("Inventario/{idBodega}")]
        public async Task<IActionResult> GetInventario(int idBodega, [FromHeader(Name = "X-API-Key")] string apiKey)
        {
            try
            {
        //var userRequest = _tokenProvider.GetAccessTokenData();

        //if (!CanRead()) { return Forbid(); }

        // idFilter = _tokenProvider.HasPermission("r_inventarios_global") ? idBodega : userRequest.BodegaId;


        var apikeyExists = await _context.ApiKeys.Where(x => x.Key == apiKey).FirstOrDefaultAsync();

        if (apikeyExists == null) { return Forbid(); }

        var inventario = await _context
                    .Productos
                    .Where(p =>
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
                        LotesInventario = p.LotesInventario
                            .Where(l => l.BodegaId == idBodega && l.Cantidad > 0) // Filter out LotesInventario with 0 cantidad
                            .ToList(),
                        cantidad = p.Inventarios
                            .Where(i => i.BodegaId == idBodega)
                            .FirstOrDefault()
                            .Cantidad
                    })
                    .ToListAsync();

                return Ok(inventario);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        //Informe de Transferencias
        [HttpGet("InformeTransferencia/{IdTransferencia}")]
        public async Task<IActionResult> PdfTransferencia(int IdTransferencia)
        {
            var userRequest = _tokenProvider.GetAccessTokenData();

            var dataForValidation = await _context
              .Transferencias
              .Select(x => new { x.BodegaOrigenId, x.EstadoTransferenciaId, x.TransferenciaId })
              .Where(x => x.TransferenciaId == IdTransferencia)
              .FirstOrDefaultAsync();

            //si esta entransito y lo esta solicitando otra bodega que no sea la central ( la que los envia)        
            if (dataForValidation.EstadoTransferenciaId == 2 && userRequest.BodegaId != dataForValidation.BodegaOrigenId) { return Forbid(); }

            var usuarios = await GetUsuario();
            string? nameEmployee = null;
            string? nameBodega = null;
            string? nametipoBodega = null;

            int bodegaId = 0;
            foreach (var item in usuarios)
            {
                nameEmployee = item.nameUser + " " + item.Apellido;
                nameBodega = item.nameBodegas;
                bodegaId = item.IdBodega;
                nametipoBodega = item.nametipoBodega;
            }

            var infoTransferencia = await GetTransfer(IdTransferencia, bodegaId);
            var reporte = GeneeratePdfService.GetTransferenciaIntegracion(infoTransferencia, nameBodega, bodegaId, nametipoBodega);
            byte[] pdfBytes = reporte.GeneratePdf();
            var mimeType = "application/pdf";
            var fileName = $"Transferencia de productos {fechas}.pdf";

            string base64Pdf = Convert.ToBase64String(pdfBytes);

            var result = new
            {
                FileName = fileName,
                Base64 = base64Pdf
            };
            return Ok(result);
        }
        //Informe de inventario
        [HttpGet("InformeStock/{bodegaid}")]
        public async Task<IActionResult> PdfProcuto(int bodegaid)
        {
            var usuarios = await GetUsuario();
            string? nameEmployee = null;
            string? nameBodega = null;
            string? nametipoBodega = null;

            int bodegaId = 0;
            foreach (var item in usuarios)
            {
                nameEmployee = item.nameUser + " " + item.Apellido;
                nameBodega = item.nameBodegas;
                bodegaId = item.IdBodega;
                nametipoBodega = item.nametipoBodega;
            }

            var informeProd = await GeteProducto(bodegaId);
            var reporte = GeneeratePdfService.generatePdfQuestProductoIntegracion(informeProd, bodegaId, nameBodega, nametipoBodega);
            byte[] pdfBytes = reporte.GeneratePdf();
            var mimeType = "application/pdf";
            var fileName = $"Informe de productos en bodega {fechas}.pdf";

            string base64Pdf = Convert.ToBase64String(pdfBytes);

            var result = new
            {
                FileName = fileName,
                Base64 = base64Pdf
            };
            return Ok(result);
        }

        private async Task<List<DataUsuario>> GetUsuario()
        {
            try
            {
                var userRequest = _tokenProvider.GetAccessTokenData();

                var query = from u in _context.Usuarios
                            join b in _context.Bodegas on u.BodegaId equals b.BodegaId
                            join t in _context.TipoBodegas on b.TipoBodegaId equals t.TipoBodegaId
                            where u.UsuarioId == userRequest.UsuarioId
                            select new DataUsuario
                            {
                                nameUser = u.Nombre,
                                Apellido = u.Apellido,
                                nameBodegas = b.Nombre,
                                IdBodega = b.BodegaId,
                                nametipoBodega = t.Nombre
                            };

                return await query.ToListAsync();
            }
            catch (Exception)
            {
                return new List<DataUsuario>();
            }
        }
        private async Task<List<DataTransfecerencia>> GetTransfer(int IdTransferencia, int bodegaId)
        {
            try
            {
                var userRequest = _tokenProvider.GetAccessTokenData();

                var query = from t in _context.Transferencias
                            join td in _context.TransferenciasDetalles on t.TransferenciaId equals td.TransferenciaId
                            join b in _context.Bodegas on t.BodegaDestinoId equals b.BodegaId
                            join p in _context.Productos on td.ProductoId equals p.ProductoId
                            join e in _context.EstadoTransferencias on t.EstadoTransferenciaId equals e.EstadoTransferenciaId
                            where (bodegaId == 1 || b.BodegaId == bodegaId)
                                && t.TransferenciaId == IdTransferencia
                            select new DataTransfecerencia
                            {
                                BodegaDestino = b.Nombre,
                                Detalle = t.Observaciones,
                                FechaEnvio = t.FechaEnvio.HasValue ? t.FechaEnvio.Value.ToString("dd/MM/yyyy") : " ",
                                FechaRecepcion = t.FechaRecepcion.HasValue ? t.FechaRecepcion.Value.ToString("dd/MM/yyyy") : " ",
                                Estado = e.Nombre,
                                Producto = p.Nombre,
                                Cantidad = td.Cantidad > 0 ? td.Cantidad : 0,
                                CantResibido = td.Recibido > 0 ? td.Recibido : 0,
                                secret = t.clave,
                                codigo = p.Codigo,
                                Compra = td.compra > 0 ? td.compra : 0,
                                Dañado = td.Dañado > 0 ? td.Dañado : 0,
                                Perdido = td.Perdido > 0 ? td.Perdido : 0
                            };

                var result = await query.ToListAsync();

                return result;
            }
            catch (Exception ex)
            {

                return new List<DataTransfecerencia>();
            }
        }
        private async Task<List<InformeProducto>> GeteProducto(int bodegaId)
        {
            try
            {
                var query = from lt in _context.LoteInventarios
                            join p in _context.Productos on lt.ProductoId equals p.ProductoId
                            join b in _context.Bodegas on lt.BodegaId equals b.BodegaId
                            where (bodegaId == 1 || b.BodegaId == bodegaId)
                            select new InformeProducto
                            {
                                prodId = p.ProductoId,
                                codigo = p.Codigo,
                                prodName = p.Nombre,
                                cantidad = lt.Cantidad,
                                venta = p.PrecioVenta,
                                nomBodega = b.Nombre,
                                bodegaId = b.BodegaId,
                                compra = lt.PrecioCompra.ToString()
                            };

                var result = await query.OrderBy(x => x.prodId).ToListAsync();

                return result;
            }
            catch (Exception ex)
            {

                return new List<InformeProducto>();
            }
        }
    }
}
