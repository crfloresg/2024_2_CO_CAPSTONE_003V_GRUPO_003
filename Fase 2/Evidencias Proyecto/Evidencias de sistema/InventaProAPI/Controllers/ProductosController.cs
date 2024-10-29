using InventaProAPI.Data;
using InventaProAPI.DTOs;
using InventaProAPI.Models;
using InventaProAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace InventaProAPI.Controllers
{
  [Route("[controller]")]
  [ApiController]
  public class ProductosController : ControllerBase
  {
    private readonly AppDbContext _context;
    private readonly TokenProvider _tokenProvider;
    private readonly AuditoriaService _auditoriaService;

    public ProductosController(AppDbContext context, TokenProvider tokenProvider, AuditoriaService auditoriaService)
    {
      _context = context;
      _tokenProvider = tokenProvider;
      _auditoriaService = auditoriaService;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetProcutos()
    {
      try
      {

        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanRead()) { return Forbid(); }

        var productos = await _context.Productos
          .Select(x => new {
            x.ProductoId,
            x.Nombre,
            x.Codigo,
            x.Categoria,
            x.UnidadMedida,
            x.PrecioVenta,
            x.Estado          
          })
          .ToListAsync();

        return Ok(productos);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }



    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetOneProcuto(int id)
    {
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanRead()) { return Forbid(); }

        var productos = await _context.Productos
          .Select(x => new {
            x.ProductoId,
            x.Nombre,
            x.Codigo,
            x.Categoria,
            x.UnidadMedida,
            x.PrecioVenta,
            x.Estado
          })
          .Where(x => x.ProductoId == id)
          .FirstOrDefaultAsync();

        return Ok(productos);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }



    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CUProducto([FromBody] ProductosCURequest productosCURequest)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanCU()) { return Forbid(); }

        if(productosCURequest.ProductoId == 0)
        {
          //Create
          var newProducto = new Producto { 
            Nombre = productosCURequest.Nombre,
            Codigo = productosCURequest.Codigo,
            Categoria = productosCURequest.Categoria,
            UnidadMedida = productosCURequest.UnidadMedida,
            PrecioVenta = productosCURequest.PrecioVenta,
            Estado = productosCURequest.Estado
          };

          await _context.AddAsync(newProducto);
          await _context.SaveChangesAsync();
          await _auditoriaService.Auditar(userRequest.UsuarioId, "producto_create", $"Se creo el producto {newProducto.ProductoId}");
        }
        else
        {
          //Update
          var producto = await _context.Productos.Where(x => x.ProductoId == productosCURequest.ProductoId).FirstOrDefaultAsync();

          if (producto == null) { return NotFound(); }

          producto.Nombre = productosCURequest.Nombre;
          producto.Codigo = productosCURequest.Codigo;
          producto.Categoria = productosCURequest.Categoria;
          producto.UnidadMedida = productosCURequest.UnidadMedida;
          producto.PrecioVenta = productosCURequest.PrecioVenta;
          producto.Estado = productosCURequest.Estado;

          await _context.SaveChangesAsync();

          await _auditoriaService.Auditar(userRequest.UsuarioId, "producto_update", $"Se modifico el producto {producto.ProductoId}");
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
    [Authorize]
    public async Task<IActionResult> DeleteProducto(int id)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();

      try
      {

        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanDelete()) { return Forbid(); }

        var producto = await _context.Productos.Where(x => x.ProductoId == id).FirstOrDefaultAsync();

        if(producto == null) { return NotFound(); }

        producto.Estado = 0;

        await _context.SaveChangesAsync();

        await _auditoriaService.Auditar(userRequest.UsuarioId, "producto_desactivado", $"Se deshabilito el producto {producto.ProductoId}");

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
    [Authorize]
    public async Task<IActionResult> ActivateProducto(int id)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();

      try
      {

        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanActivate()) { return Forbid(); }

        var producto = await _context.Productos.Where(x => x.ProductoId == id).FirstOrDefaultAsync();

        if (producto == null) { return NotFound(); }

        producto.Estado = 1;

        await _context.SaveChangesAsync();

        await _auditoriaService.Auditar(userRequest.UsuarioId, "producto_activate", $"Se habilito el producto {producto.ProductoId}");

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
      return _tokenProvider.HasPermission("r_productos");
    }

    private bool CanCU()
    {
      return _tokenProvider.HasPermission("cu_productos");
    }

    private bool CanActivate()
    {
      return _tokenProvider.HasPermission("a_productos");
    }

    private bool CanDelete()
    {
      return _tokenProvider.HasPermission("d_productos");
    }
  }
}
