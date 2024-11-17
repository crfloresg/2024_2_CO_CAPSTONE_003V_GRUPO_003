using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using InformeApi.Models;

namespace InventaProAPI.Models
{
  [Table("Bodegas")]
  public class Bodega
  {
    [Key]
    [Column("bodega_id")]
    public int BodegaId { get; set; }

    [Required]
    [StringLength(100)]
    [Column("nombre")]
    public string Nombre { get; set; }

    [StringLength(255)]
    [Column("direccion")]
    public string Direccion { get; set; }

    [Required]
    [Column("tipo_bodega_id")]
    [ForeignKey("TipoBodega")]
    public int TipoBodegaId { get; set; }

    [Required]
    [Column("estado_bodega_id")]
    [ForeignKey("EstadoBodega")]
    public int EstadoBodegaId { get; set; }

    [Column("fecha_creacion")]
    public DateTime FechaCreacion { get; set; }

    [Column("fecha_actualizacion")]
    public DateTime FechaActualizacion { get; set; }

    [JsonIgnore]
    public TipoBodega TipoBodega { get; set; }

    [JsonIgnore]
    public EstadoBodega EstadoBodega { get; set; }

    [JsonIgnore]
    public ICollection<Inventario> Inventarios { get; set; }

    [JsonIgnore]
    public ICollection<Transferencia> TransferenciasOrigen { get; set; }

    [JsonIgnore]
    public ICollection<Transferencia> TransferenciasDestino { get; set; }

    [JsonIgnore]
    public ICollection<LoteInventario> LotesInventario { get; set; }

    [JsonIgnore]
    public ICollection<Alerta> Alertas { get; set; }

    [JsonIgnore]
    public ICollection<SolicitudInventario> SolicitudesSucursal { get; set; }
  }
}
