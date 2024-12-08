using InformeApi.Data;
using InformeApi.Models;
using Microsoft.EntityFrameworkCore;

namespace InventaProAPI.Services
{
  public class InventarioService
  {


    private readonly IServiceProvider _serviceProvider;

    public InventarioService(IServiceProvider serviceProvider)
    {
      _serviceProvider = serviceProvider;
    }

    public async Task QuitarDeInventario(int bodegaId, int productoId, int precioCompra, int cantidad)
    {
      try
      {
        var _context = _serviceProvider.CreateScope().ServiceProvider.GetRequiredService<AppDbContext>();

        //Lo quitamos del lote
        var lote = await _context.LoteInventarios.Where(x =>
          x.BodegaId == bodegaId &&
          x.ProductoId == productoId &&
          x.PrecioCompra == precioCompra &&
          cantidad <= x.Cantidad
        ).FirstOrDefaultAsync();

        if(lote == null) { throw new Exception("Lote no encontrado o cantidad insuficiente en bodega"); }

        lote.Cantidad -= cantidad;
        await _context.SaveChangesAsync();

        //Lo quitamos del inventario
        var inventario = await _context.Inventarios.Where(x =>
          x.BodegaId == bodegaId &&
          x.ProductoId == productoId &&
          cantidad <= x.Cantidad
        ).FirstOrDefaultAsync();

        if (inventario == null) { throw new Exception("inventario no encontrado o cantidad insuficiente en bodega"); }

        inventario.Cantidad -= cantidad;
        await _context.SaveChangesAsync();
      }
      catch (Exception ex)
      {
        throw ex;
      }
    }




    public async Task AgregarAInventario(int bodegaId, int productoId, int precioCompra, int cantidad)
    {
      try
      {
        var _context = _serviceProvider.CreateScope().ServiceProvider.GetRequiredService<AppDbContext>();

        //Lo agregamos al lote
        var lote = await _context.LoteInventarios.Where(x =>
          x.BodegaId == bodegaId &&
          x.ProductoId == productoId &&
          x.PrecioCompra == precioCompra
        ).FirstOrDefaultAsync();

        if (lote == null) {
          // si no existe el lote, lo creamos
          var newLote = new LoteInventario
          {
            ProductoId = productoId,
            BodegaId = bodegaId,
            Cantidad = cantidad,
            PrecioCompra = precioCompra,
            FechaCompra = DateTime.Now,
          };        

          await _context.LoteInventarios.AddAsync(newLote);
          await _context.SaveChangesAsync();
        }
        else
        {
          //Si existe lo modificamos
          lote.Cantidad += cantidad;
          await _context.SaveChangesAsync();
        }



        

        //Lo Agregamos al inventario
        var inventario = await _context.Inventarios.Where(x =>
          x.BodegaId == bodegaId &&
          x.ProductoId == productoId
        ).FirstOrDefaultAsync();

        if (inventario == null) {
          //Si no existe lo creamos
          var newInv = new Inventario
          {
            BodegaId = bodegaId,
            ProductoId = productoId,
            Cantidad = cantidad,
            FechaActualizacion = DateTime.Now
          };

          await _context.Inventarios.AddAsync(newInv);
          await _context.SaveChangesAsync();
        }
        else
        {
          //Si existe lo modificamos
          inventario.Cantidad += cantidad;
          await _context.SaveChangesAsync();
        }

        
      }
      catch (Exception ex)
      {
        throw ex;
      }
    }


    //public async Task Perdida(int productoId, int bodegaId, int cantidad, int tipoPerdida, string descripcion, int usuarioId, int precioCompra)
    //{
    //  try
    //  {
    //    var _context = _serviceProvider.CreateScope().ServiceProvider.GetRequiredService<AppDbContext>();

    //    var newPerdida = new Perdida
    //    {
    //      ProductoId = productoId,
    //      BodegaId = bodegaId,
    //      Cantidad = cantidad,
    //      TipoPerdidaId = tipoPerdida,
    //      Descripcion = descripcion,
    //      UsuarioId = usuarioId,
    //      PrecioCompra = precioCompra,
    //      FechaRegistro = DateTime.Now
    //    };

    //    await _context.Perdidas.AddAsync(newPerdida);
    //    await _context.SaveChangesAsync();
    //  }
    //  catch (Exception ex)
    //  {
    //    throw ex;
    //  }
    //}



  }
}
