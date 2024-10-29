using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace InventaProAPI.Models
{
  [Table("Productos")]
  public class Producto
  {
    [Key]
    [Column("producto_id")]
    public int ProductoId { get; set; }

    [Required]
    [StringLength(100)]
    [Column("nombre")]
    public string Nombre { get; set; }

    [Required]
    [StringLength(200)]
    [Column("codigo")]
    public string Codigo { get; set; }

    [StringLength(50)]
    [Column("categoria")]
    public string? Categoria { get; set; }

    [StringLength(100)]
    [Column("unidad_medida")]
    public string? UnidadMedida { get; set; }

    [Column("precio_venta")]
    public int? PrecioVenta { get; set; }

    [Column("fecha_creacion")]
    public DateTime FechaCreacion { get; set; }

    [Column("fecha_actualizacion")]
    public DateTime FechaActualizacion { get; set; }

    [Column("estado")]
    public int Estado { get; set; }

    public ICollection<Inventario> Inventarios { get; set; }

    [JsonIgnore]
    public ICollection<Movimiento> Movimientos { get; set; }

    public ICollection<LoteInventario> LotesInventario { get; set; }

    [JsonIgnore]
    public ICollection<Perdida> Perdidas { get; set; }

    [JsonIgnore]
    public ICollection<Alerta> Alertas { get; set; }

    [JsonIgnore]
    public ICollection<SolicitudInventarioDetalle> SolicitudesInventarioDetalles { get; set; }

    [JsonIgnore]
    public ICollection<UmbralStock> UmbralesStock { get; set; }

    [JsonIgnore]
    public ICollection<TransferenciaDetalle> DetallesTransferencia { get; set; }
  }
}
