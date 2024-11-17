using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace InventaProAPI.Models
{
  [Table("Transferencias_Detalles")]
  public class TransferenciaDetalle
  {
    [Key]
    [Column("detalle_id")]
    public int DetalleId { get; set; }

    [Required]
    [Column("transferencia_id")]
    [ForeignKey("Transferencia")]
    public int TransferenciaId { get; set; }

    [Required]
    [Column("producto_id")]
    [ForeignKey("Producto")]
    public int ProductoId { get; set; }

    [Required]
    [Column("cantidad_despachada")]
    public int CantidadDespachada { get; set; }

    [Column("cantidad_recibida")]
    public int? CantidadRecibida { get; set; }

    [Column("cantidad_dmg")]
    public int? CantidadDmg { get; set; }

    [Column("cantidad_perdida")]
    public int? CantidadPerdida { get; set; }

    [Required]
    [Column("precio_compra")]
    public int PrecioCompra { get; set; }

    [JsonIgnore]
    public Transferencia Transferencia { get; set; }

    [JsonIgnore]
    public Producto Producto { get; set; }
  }
}
