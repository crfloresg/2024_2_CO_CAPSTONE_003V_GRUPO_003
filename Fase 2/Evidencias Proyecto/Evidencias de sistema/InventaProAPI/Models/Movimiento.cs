using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace InventaProAPI.Models
{
  [Table("Movimientos")]
  public class Movimiento
  {
    [Key]
    [Column("movimiento_id")]
    public int MovimientoId { get; set; }

    [Required]
    [Column("producto_id")]
    [ForeignKey("Producto")]
    public int ProductoId { get; set; }

    [Required]
    [Column("bodega_id")]
    [ForeignKey("Bodega")]
    public int BodegaId { get; set; }

    [Required]
    [Column("tipo_movimiento_id")]
    [ForeignKey("TipoMovimiento")]
    public int TipoMovimientoId { get; set; }

    [Required]
    [Column("cantidad")]
    public int Cantidad { get; set; }

    [Column("fecha_movimiento")]
    public DateTime FechaMovimiento { get; set; }

    [Required]
    [Column("usuario_id")]
    [ForeignKey("Usuario")]
    public int UsuarioId { get; set; }

    [Column("referencia_id")]
    public int? ReferenciaId { get; set; }

    [Column("lote_id")]
    [ForeignKey("LoteInventario")]
    public int? LoteId { get; set; }

    [JsonIgnore]
    public Producto Producto { get; set; }

    [JsonIgnore]
    public Bodega Bodega { get; set; }

    [JsonIgnore]
    public TipoMovimiento TipoMovimiento { get; set; }

    [JsonIgnore]
    public Usuario Usuario { get; set; }

    [JsonIgnore]
    public LoteInventario LoteInventario { get; set; }
  }
}
