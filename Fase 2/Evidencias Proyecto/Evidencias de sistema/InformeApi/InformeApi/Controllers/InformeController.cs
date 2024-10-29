using InformeApi.Data;
using InformeApi.Models;
using InformeApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using System;
using System.ComponentModel;

namespace InformeApi.Controllers
{
    [Route("")]
    [ApiController]
    public class InformeController : Controller
    {
        private readonly AppDbContext _context;
        private readonly TokenProvider _tokenProvider;
        public InformeController(AppDbContext context, TokenProvider tokenProvider)
        {
            _context = context;
            _tokenProvider = tokenProvider;
        }


        [HttpGet("Empleados")]
        public async Task<IActionResult> PdfEmpleados(int bodegaid)
        {
          var usuarios = await GetUsuario();
          string nameEmployee = null;
          string nameBodega = null;

          foreach (var item in usuarios)
          {
            nameEmployee = item.nameUser + " " + item.Apellido;
            nameBodega = item.nameBodegas;
          }

          var informeEmpleado = await GetEmpleados(bodegaid);
          var reporte = GeneeratePdfService.GetEmpleados(informeEmpleado, bodegaid, nameEmployee, nameBodega);
          byte[] pdfBytes = reporte.GeneratePdf();
          var mimeType = "application/pdf";
          var fileName = "Planilla de empleados.pdf";

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
            var usuarios = await GetUsuario();
            string? nameEmployee = null;
            string? nameBodega = null;
            foreach (var item in usuarios)
            {
                nameEmployee = item.nameUser +" " + item.Apellido;
                nameBodega = item.nameBodegas;
            }

            var informeProd = await GeteProducto(bodegaid);
            var reporte =  GeneeratePdfService.generatePdfQuestProducto(informeProd, bodegaid, nameEmployee, nameBodega);
            byte[] pdfBytes = reporte.GeneratePdf();
            var mimeType = "application/pdf";
            var fileName = "Informe de productos en bodega.pdf";

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
            var usuarios = await GetUsuario();
            string? nameEmployee = null;
            string? nameBodega = null;
            foreach (var item in usuarios)
            {
                nameEmployee = item.nameUser + " " + item.Apellido;
                nameBodega = item.nameBodegas;
            }

            var informeBodega = await GetBodega();
            var reporte = GeneeratePdfService.GetBodega(informeBodega, nameEmployee, nameBodega);
            byte[] pdfBytes = reporte.GeneratePdf();
            var mimeType = "application/pdf";
            var fileName = "Informe de bodegas.pdf";

            string base64Pdf = Convert.ToBase64String(pdfBytes);

            var result = new
            {
              FileName = fileName,
              Base64 = base64Pdf
            };

            return Ok(result);
    }
        private async Task<List<InformeProducto>> GeteProducto(int bodegaid)
        {
            try
            {
                var userRequest = _tokenProvider.GetAccessTokenData();

                var query = from lt in _context.LoteInventarios
                            join p in _context.Productos on lt.ProductoId equals p.ProductoId
                            join b in _context.Bodegas on lt.BodegaId equals b.BodegaId
                            where bodegaid != 3 ? lt.BodegaId == bodegaid : true
                            select new InformeProducto
                            {
                                prodId = p.ProductoId,
                                codigo = p.Codigo,
                                prodName = p.Nombre,
                                cantidad = lt.Cantidad,
                                venta = p.PrecioVenta,
                                nomBodega = b.Nombre,
                                bodegaId = b.BodegaId
                            };

                var result = await query.ToListAsync();

                return result; 
            }
            catch (Exception ex) {

                return new List<InformeProducto>();
            }
        }

        private async Task<List<InformeEmpleado>> GetEmpleados(int bodegaid)
        {
            try
            {
                var userRequest = _tokenProvider.GetAccessTokenData();

                var query = from u in _context.Usuarios
                            join r in _context.Rols on u.RolId equals r.RolId
                            join b in _context.Bodegas on u.BodegaId equals b.BodegaId
                            where bodegaid != 3 ? u.BodegaId == bodegaid : true
                            select new InformeEmpleado
                            {
                                nameUsuario = u.Nombre,
                                apellido = u.Apellido,
                                email = u.Email,
                                nameBodega = b.Nombre,
                                nameRol = r.Nombre
                            };

                var result = await query.ToListAsync();

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
                var userRequest = _tokenProvider.GetAccessTokenData();

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
                            where u.UsuarioId == userRequest.UsuarioId
                            select new DataUsuario
                            {
                                nameUser = u.Nombre,
                                Apellido = u.Apellido,
                                nameBodegas = b.Nombre
                            };

                var result = await query.ToListAsync();

                return result;
            }
            catch (Exception ex)
            {

                return new List<DataUsuario>();
            }
        }
    }
}
