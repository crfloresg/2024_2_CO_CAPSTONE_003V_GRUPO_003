using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace InformeApi.Models
{
  [Table("Detalles_Solicitudes_Inventario")]
  public class SolicitudInventarioDetalle
  {
    [Key]
    [Column("detalle_id")]
    public int DetalleId { get; set; }

    [Required]
    [Column("solicitud_id")]
    [ForeignKey("SolicitudInventario")]
    public int SolicitudId { get; set; }

    [Required]
    [Column("producto_id")]
    [ForeignKey("Producto")]
    public int ProductoId { get; set; }

    [Required]
    [Column("cantidad")]
    public int Cantidad { get; set; }

    [JsonIgnore]
    public SolicitudInventario SolicitudInventario { get; set; }

    [JsonIgnore]
    public Producto Producto { get; set; }
  }
}
