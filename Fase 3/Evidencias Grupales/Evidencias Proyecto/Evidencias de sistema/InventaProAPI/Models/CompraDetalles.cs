using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace InventaProAPI.Models
{
  [Table("Compra_Detalles")]
  public class CompraDetalles
  {

    [Key]
    [Column("detalle_id")]
    public int DetalleId { get; set; }

    [Required]
    [ForeignKey("Compras")]
    [Column("compra_id")]
    public int CompraId { get; set; }

    [JsonIgnore]
    public Compra Compra { get; set; }

    [Required]
    [ForeignKey("Producto")]
    [Column("producto_id")]
    public int ProductoId { get; set; }

    public Producto Producto { get; set; }

    [Required]
    [Column("cantidad")]
    public int Cantidad { get; set; }
    
    [Required]
    [Column("precio_compra")]
    public int PrecioCompra {  get; set; }


  }
}
