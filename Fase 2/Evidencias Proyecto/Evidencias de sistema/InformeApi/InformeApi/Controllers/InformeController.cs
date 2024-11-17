using InformeApi.Data;
using InformeApi.Models;
using InformeApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using System;
using System.ComponentModel;

namespace InformeApi.Controllers
{
    //return File(pdfBytes, mimeType, "Planilla de 2empleados.pdf")2;
    //return Ok(result)2;
    [Route("")]
    [Authorize]  
    [ApiController]
    public class InformeController : Controller
    {
        private readonly AppDbContext _context;
        private readonly TokenProvider _tokenProvider;
        private readonly AlertaService _alertaService;
        private readonly AuditoriaService _auditoriaService;

        string fechas = DateTime.Now.ToString("dd-MM-yyyy HH:mm");
        public InformeController(AppDbContext context, TokenProvider tokenProvider, AlertaService alertService, AuditoriaService auditoriaService)
        {
            _context = context;
            _tokenProvider = tokenProvider;
            _alertaService = alertService;
            _auditoriaService = auditoriaService;
        }

        [HttpGet("Empleados")]
        public async Task<IActionResult> PdfEmpleados(int bodegaid)
        {

            var userRequest = _tokenProvider.GetAccessTokenData();

            if (!CanGetInformes()) { return Forbid(); }

            if (userRequest.BodegaId != bodegaid && !_tokenProvider.HasPermission("r_informes_global")) { return Forbid(); }

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

          var informeEmpleado = await GetEmpleados(bodegaId);
          var reporte = GeneeratePdfService.GetEmpleados(informeEmpleado, bodegaId, nameEmployee, nameBodega, nametipoBodega);
          byte[] pdfBytes = reporte.GeneratePdf();
          var mimeType = "application/pdf";
          var fileName = $"Planilla de empleados {fechas}.pdf";

          string base64Pdf = Convert.ToBase64String(pdfBytes);

          var result = new
          {
            FileName = fileName,
            Base64 = base64Pdf
          };

             return Ok(result);
        }
        [HttpGet("Productos")]
        public async Task<IActionResult> PdfProcuto(int bodegaid)
        {

            var userRequest = _tokenProvider.GetAccessTokenData();

            if (!CanGetInformes()) { return Forbid(); }

            if (userRequest.BodegaId != bodegaid && !_tokenProvider.HasPermission("r_informes_global")) { return Forbid(); }

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

            var informeProd = await GeteProducto( bodegaId);
            var reporte =  GeneeratePdfService.generatePdfQuestProducto(informeProd, bodegaId, nameEmployee, nameBodega, nametipoBodega);
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
        [HttpGet("Bodega")]
        public async Task<IActionResult> PdfBodegas()
        {

            if (!_tokenProvider.HasPermission("r_informes_global")) { return Forbid(); }

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

            var informeBodega = await GetBodega();
            var reporte = GeneeratePdfService.GetBodega(informeBodega, nameEmployee, nameBodega);
            byte[] pdfBytes = reporte.GeneratePdf();
            var mimeType = "application/pdf";
            var fileName = $"Planilla de Bodegas {fechas}.pdf";

            string base64Pdf = Convert.ToBase64String(pdfBytes);

            var result = new
            {
                FileName = fileName,
                Base64 = base64Pdf
            };
            return Ok(result);
        }
        [HttpGet("Auditoria")]
        public async Task<IActionResult> PdfAuditoria(int usuId)
        {

            var userRequest = _tokenProvider.GetAccessTokenData();
            if (!CanGetInformes()) { return Forbid(); }
            
            var aux = await _context.Usuarios.Select(x => new { x.UsuarioId, x.BodegaId }).Where(x => x.UsuarioId == usuId).FirstOrDefaultAsync();

            if (userRequest.BodegaId != aux.BodegaId && !_tokenProvider.HasPermission("r_informes_global")) { return Forbid(); }

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

            var informeAuditor = await GetAuditorias(usuId, bodegaId);
            var reporte = GeneeratePdfService.GetAuditoria(informeAuditor, nameEmployee, nameBodega, bodegaId, nametipoBodega);
            byte[] pdfBytes = reporte.GeneratePdf();
            var mimeType = "application/pdf";
            var fileName = $"Informe de historial actividad {fechas}.pdf";

            string base64Pdf = Convert.ToBase64String(pdfBytes);

            var result = new
            {
                FileName = fileName,
                Base64 = base64Pdf

            };
            return Ok(result);
        }
        [HttpGet("Perdida")]
        public async Task<IActionResult> PdfPerdidas(int bodegaid,string tipoperdida)
        {

            var userRequest = _tokenProvider.GetAccessTokenData();

            if (!CanGetInformes()) { return Forbid(); }

            if (userRequest.BodegaId != bodegaid && !_tokenProvider.HasPermission("r_informes_global")) { return Forbid(); }

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

            var informePerdida = await GetPerdida( tipoperdida, bodegaId);
            var reporte = GeneeratePdfService.GetAuditoria(informePerdida, nameEmployee, nameBodega, bodegaId, nametipoBodega);
            byte[] pdfBytes = reporte.GeneratePdf();
            var mimeType = "application/pdf";
            var fileName = $"Informe de historial actividad {fechas}.pdf";

            string base64Pdf = Convert.ToBase64String(pdfBytes);

            var result = new
            {
                FileName = fileName,
                Base64 = base64Pdf

            };
             return Ok(result);
        }
        
    
        
        [HttpGet("Transferencia")]
        public async Task<IActionResult> PdfTransferencia(int IdTransferencia)
        {
          var userRequest = _tokenProvider.GetAccessTokenData();

            if (!CanGetDetalleTransferencia()) { return Forbid(); }

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
            var reporte = GeneeratePdfService.GetTransferencia(infoTransferencia, nameEmployee, nameBodega, bodegaId, nametipoBodega);
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
        [HttpGet("DetalleCompra/{compraId}")]
        public async Task<IActionResult> PdfDetalleCompra(int compraId)
        {
            var userRequest = _tokenProvider.GetAccessTokenData();

            if (!_tokenProvider.HasPermission("r_compras_global")) { return Forbid(); }

            var infoDetalleCompra = await GetCompras(compraId);

            var reporte = GeneeratePdfService.GetCompraDetalle(infoDetalleCompra);
            byte[] pdfBytes = reporte.GeneratePdf();
            var mimeType = "application/pdf";
            var fileName = $"Informe compra productos {fechas}.pdf";

            string base64Pdf = Convert.ToBase64String(pdfBytes);

            var result = new
            {
                FileName = fileName,
                Base64 = base64Pdf
            };
            return Ok(result);
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

                var result = await query.OrderBy(x=>x.prodId).ToListAsync();

                return result; 
            }
            catch (Exception ex) {

                return new List<InformeProducto>();
            }
        }
        private async Task<List<InformeEmpleado>> GetEmpleados( int bodegaId)
        {
            try
            {
                var query = from u in _context.Usuarios
                            join r in _context.Rols on u.RolId equals r.RolId
                            join b in _context.Bodegas on u.BodegaId equals b.BodegaId
                            where (bodegaId == 1 || b.BodegaId == bodegaId)
                            select new InformeEmpleado
                            {
                                nameUsuario = u.Nombre,
                                apellido = u.Apellido,
                                email = u.Email,
                                nameBodega = b.Nombre,
                                nameRol = r.Nombre
                            };

                var result = await query.OrderBy(x=>x.nameBodega).ToListAsync();

                return result;
            }
            catch (Exception ex)
            {

                return new List<InformeEmpleado>();
            }
        }
        private async Task<List<InformeBodega>> GetBodega()
        {
            try
            {
                var query = from b in  _context.Bodegas
                            join tb in _context.TipoBodegas on b.TipoBodegaId equals tb.TipoBodegaId
                            select new InformeBodega
                            {
                                bodegaId = b.BodegaId,
                                nameBodegas = b.Nombre,
                                direccion = b.Direccion,
                                tipoBodega = tb.Nombre
                            };

                var result = await query.ToListAsync();

                return result;
            }
            catch (Exception ex)
            {

                return new List<InformeBodega>();
            }
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
        private async Task<List<DataAuditor>> GetAuditorias(int usuId, int bodegaId)
        {
            try
            {
                var query = from a in _context.Auditorias
                            join u in _context.Usuarios on a.UsuarioId equals u.UsuarioId
                            join b in _context.Bodegas on u.BodegaId equals b.BodegaId
                           where (bodegaId == 1 || b.BodegaId == bodegaId)
                                && u.UsuarioId == usuId
                            select new DataAuditor
                            {
                                nameUsu = u.Nombre,
                                apellido = u.Apellido,
                                idUsu = a.UsuarioId,
                                nameBodega = b.Nombre,
                                accion = a.Accion,
                                detalle = a.Descripcion,
                                fechaAud = a.FechaAccion.ToString("dd-MM-yyyy HH:mm")
                            };

                var result = await query.OrderBy(x => x.idUsu).ToListAsync();

                return result;
            }
            catch (Exception ex)
            {

                return new List<DataAuditor>();
            }
        }
        private async Task<List<DataPerdida>> GetPerdida(string tipoperdida, int bodegaId)
        {
            try
            {
                var query = from pe in _context.Perdidas
                            join tp in _context.TipoPerdidas on pe.TipoPerdidaId equals tp.TipoPerdidaId
                            join p in _context.Productos on pe.ProductoId equals p.ProductoId
                            join b in _context.Bodegas on pe.BodegaId equals b.BodegaId
                           where (bodegaId == 1 || b.BodegaId == bodegaId)
                                &&(tipoperdida == "todo" || tp.Nombre == tipoperdida)
                            select new DataPerdida
                            {
                               cantida = pe.Cantidad,
                               TipoPerdida = tp.Nombre,
                               nameBodega = b.Nombre,
                               detalle = pe.Descripcion,
                               fechaReg = pe.FechaRegistro.ToString("dd-MM-yyyy"),
                               nameProd = p.Nombre
                            };

                var result = await query.ToListAsync();

                return result;
            }
            catch (Exception ex)
            {

                return new List<DataPerdida>();
            }
        }
        private async Task<List<DataTransfecerencia>> GetTransfer(int IdTransferencia,int bodegaId)
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
                                Cantidad = td.Cantidad > 0 ? td.Cantidad: 0,
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
        private async Task<List<DetallesCompra>> GetCompras(int compraId)
        {
            try
            {
                var userRequest = _tokenProvider.GetAccessTokenData();

                var query = from c in _context.Compras
                            join cd in _context.DetallleCompra on c.CompraId equals cd.CompraId
                            join b in _context.Distribuidores on c.DistribuidorId equals b.DistribuidorId
                            join p in _context.Productos on cd.ProductoId equals p.ProductoId
                            where c.CompraId == compraId && c.BodeaId == userRequest.BodegaId
                            select new DetallesCompra
                            {
                                CompraId = compraId,
                                Nombre = p.Nombre,
                                Fecha = c.Fecha.ToString("dd/MM/yyyy"),
                                Detalle = c.Observacion,
                                Distribuidor = b.Nombre,
                                Codigo = p.Codigo,
                                PrecioCompra = cd.Compra,
                                Cantidad = cd.Cantidad
                            };

                var result = await query.ToListAsync();

                return result;

            }
            catch (Exception ex)
            {

                return new List<DetallesCompra>();
            }
        }

        private bool CanGetDetalleTransferencia()
        {
            return _tokenProvider.HasPermission("r_transferencias_global") || _tokenProvider.HasPermission("r_transferencias_bodega");
        }

        private bool CanGetInformes()
        {
          return _tokenProvider.HasPermission("r_informes_global") || _tokenProvider.HasPermission("r_informes_bodega");
        }




    }
}