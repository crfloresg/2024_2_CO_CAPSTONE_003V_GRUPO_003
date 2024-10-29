using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace InformeApi.Models
{
  [Table("Inventario")]
  public class Inventario
  {
    [Key]
    [Column("inventario_id")]
    public int InventarioId { get; set; }

    [Required]
    [Column("bodega_id")]
    [ForeignKey("Bodega")]
    public int BodegaId { get; set; }

    [Required]
    [Column("producto_id")]
    [ForeignKey("Producto")]
    public int ProductoId { get; set; }

    [Column("cantidad")]
    public int Cantidad { get; set; }

    [Column("fecha_actualizacion")]
    public DateTime FechaActualizacion { get; set; }

    [JsonIgnore]
    public Bodega Bodega { get; set; }

    [JsonIgnore]
    public Producto Producto { get; set; }
  }
}
