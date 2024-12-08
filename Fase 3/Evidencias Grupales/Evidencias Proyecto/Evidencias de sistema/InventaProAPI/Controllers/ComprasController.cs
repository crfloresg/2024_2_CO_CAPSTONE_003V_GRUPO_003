using InventaProAPI.Data;
using InventaProAPI.DTOs;
using InventaProAPI.Models;
using InventaProAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Text.RegularExpressions;

namespace InventaProAPI.Controllers
{
  [Route("[controller]")]
  [ApiController]
  [Authorize]
  public class ComprasController : ControllerBase
  {


    private readonly string _folder = "pdfs";
    private readonly AppDbContext _context;
    private readonly TokenProvider _tokenProvider;
    private readonly AuditoriaService _auditoriaService;
    private readonly InventarioService _inventarioService;
    private readonly IWebHostEnvironment _environment;



    public ComprasController(
      AppDbContext context, 
      TokenProvider tokenProvider, 
      AuditoriaService auditoriaService, 
      InventarioService inventarioService,
      IWebHostEnvironment environment)
    {
      _context = context;
      _tokenProvider = tokenProvider;
      _auditoriaService = auditoriaService;
      _inventarioService = inventarioService;
      _environment = environment;
    }



    [HttpGet]
    public async Task<IActionResult> GetAll() 
    {
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanRead()) { return Forbid(); }

        var compras = await _context.Compras.OrderByDescending(x => x.CompraId).Include(x => x.Distribuidor).ToListAsync();

        return Ok(compras);

      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }



    [HttpGet("{compraId}")]
    public async Task<IActionResult> GetOne(int compraId)
    {
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanRead()) { return Forbid(); }

        var compra = await _context
          .Compras
          .Where(x => x.CompraId == compraId)
          .Include(x => x.Distribuidor)
          .Include(x => x.compraDetalles)
          .ThenInclude(y => y.Producto)
          .FirstOrDefaultAsync();

        return Ok(compra);

      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    [HttpGet("Options")]
    public async Task<IActionResult> GetOptions()
    {
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!_tokenProvider.HasPermission("c_compras_global")) { return Forbid(); }

        var distribuidores = await _context.Distribuidores.OrderByDescending(x => x.Estado == 1).ToListAsync();

        return Ok(distribuidores);

      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    [HttpPost]
    public async Task<IActionResult> CreateCompra([FromBody] CompraCreateRequest body)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!_tokenProvider.HasPermission("c_compras_global")) { return Forbid(); }

        

        var newCompra = new Compra
        {
          BodegaId = 1, //Id bodega central
          DocumentoUrl = "", // Agregar subida de documento!!!
          Observacion = body.observacion,
          DistribuidorId = body.distribuidorId,
          Fecha = DateTime.Now,
        };

        await _context.Compras.AddAsync(newCompra);
        await _context.SaveChangesAsync();

        var pdfPath = SavePdf(body.documentoB64, newCompra.CompraId);

        Console.WriteLine("path inside endpoint: ", pdfPath);

        newCompra.DocumentoUrl = pdfPath;

        await _context.SaveChangesAsync();

        foreach ( var detalle in body.compraDetalles )
        {
          var newDetalle = new CompraDetalles
          {
            CompraId = newCompra.CompraId,
            ProductoId = detalle.productoId,
            Cantidad = detalle.cantidad,
            PrecioCompra = detalle.precioCompra
          };

          await _context.CompraDetalles.AddAsync(newDetalle);
          await _context.SaveChangesAsync();

          await _inventarioService.AgregarAInventario(1, detalle.productoId, detalle.precioCompra, detalle.cantidad);

        }

        await _auditoriaService.Auditar(userRequest.UsuarioId, "compra_create", $"Creo la compra {newCompra.CompraId}", userRequest.BodegaId);

        await transaction.CommitAsync();
        return Ok();
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return BadRequest(ex.Message);
      }
    }



    [HttpGet("Cancel/{compraId}")]
    public async Task<IActionResult> CancelCompra(int compraId)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {

        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!_tokenProvider.HasPermission("d_compras_global")) { return Forbid(); }

        var compra = await _context
          .Compras
          .Where(
            x =>
            x.CompraId == compraId &&
            x.FechaCancelado == null
          )
          .Include(x => x.compraDetalles)
          .FirstOrDefaultAsync();

        if (compra == null) { return NotFound(); }

        compra.FechaCancelado = DateTime.Now;

        await _context.SaveChangesAsync();

        foreach (var item in compra.compraDetalles)
        {
          //1 siendo bodega central
          await _inventarioService.QuitarDeInventario(1, item.ProductoId, item.PrecioCompra, item.Cantidad);
        }

        await _auditoriaService.Auditar(userRequest.UsuarioId, "compra_delete", $"Se cancelo la compra {compraId}", userRequest.BodegaId);

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
      return _tokenProvider.HasPermission("r_compras_global");
    }



    private string SavePdf(string b64, int compraId)
    {
      try
      {
        var base64Data = Regex.Replace(b64, "^data:application/pdf;base64,", "");

        byte[] pdfBytes = Convert.FromBase64String(base64Data);

        // Define file paths based on environment
        string path;
        if (_environment.IsDevelopment())
        {
          path = Path.Combine(_environment.WebRootPath, _folder);
        }
        else
        {
          path = Path.Combine("/var/www/docs/", _folder);
        }

        Console.WriteLine("Attempting to save file to path: " + path);

        if (!Directory.Exists(path))
        {
          Directory.CreateDirectory(path);
          Console.WriteLine("Directory created at path: " + path);
        }

        var fileName = $"{compraId}-{DateTime.Now:yyyyMMddHHmmss}.pdf";
        var filePath = Path.Combine(path, fileName);

        System.IO.File.WriteAllBytes(filePath, pdfBytes);

        // Return the accessible path for the file
        return _environment.IsDevelopment()
            ? $"/{_folder}/{fileName}"
            : $"/files/{_folder}/{fileName}";
      }
      catch (Exception ex)
      {
        Console.WriteLine("Error saving PDF: " + ex.Message);
        return "";
      }
    }



  }
}
