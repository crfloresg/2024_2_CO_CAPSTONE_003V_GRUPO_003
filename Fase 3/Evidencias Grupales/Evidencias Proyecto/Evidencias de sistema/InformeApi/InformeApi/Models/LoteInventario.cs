using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace InformeApi.Models
{
  [Table("Lotes_Inventario")]
  public class LoteInventario
  {
    [Key]
    [Column("lote_id")]
    public int LoteId { get; set; }

    [Required]
    [Column("producto_id")]
    [ForeignKey("Producto")]
    public int ProductoId { get; set; }

    [Required]
    [Column("bodega_id")]
    [ForeignKey("Bodega")]
    public int BodegaId { get; set; }

    [Required]
    [Column("cantidad")]
    public int Cantidad { get; set; }

    [Required]
    [Column("precio_compra")]
    public decimal PrecioCompra { get; set; }

    [Column("fecha_compra")]
    public DateTime FechaCompra { get; set; }

    [Column("fecha_vencimiento")]
    public DateTime? FechaVencimiento { get; set; }

    [JsonIgnore]
    public Producto Producto { get; set; }

    [JsonIgnore]
    public Bodega Bodega { get; set; }

    [JsonIgnore]
    public Alerta Alerta { get; set; }

        [JsonIgnore]
    public ICollection<Movimiento> Movimientos { get; set; }
  }
}
