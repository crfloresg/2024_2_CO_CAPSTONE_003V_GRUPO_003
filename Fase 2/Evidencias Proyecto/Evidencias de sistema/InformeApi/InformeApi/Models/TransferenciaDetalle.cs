using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace InformeApi.Models
{
  //[Table("transferencias_detalles")]
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
    public int Cantidad { get; set; }

    [Required]
    [Column("precio_compra")]
    public int compra { get; set; }

    [Required]
    [Column("cantidad_recibida")]
    public int Recibido { get; set; }

    [Required]
    [Column("cantidad_dmg")]
    public int Dañado { get; set; }

    [Required]
    [Column("cantidad_perdida")]
    public int Perdido { get; set; }

    [JsonIgnore]
    public Transferencia Transferencia { get; set; }

    [JsonIgnore]
    public Producto Producto { get; set; }
  }
}