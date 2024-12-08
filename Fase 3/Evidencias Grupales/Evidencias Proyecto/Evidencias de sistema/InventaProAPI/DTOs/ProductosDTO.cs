using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace InventaProAPI.DTOs
{
  public class ProductosCURequest
  {
    public int ProductoId { get; set; }

    [StringLength(100)]
    public string Nombre { get; set; }

    [StringLength(200)]
    public string? Codigo { get; set; }

    [StringLength(50)]
    public string? Categoria { get; set; }

    [StringLength(100)]
    public string? UnidadMedida { get; set; }

    public int? PrecioVenta { get; set; }

    public int Estado { get; set; }
  }
}
