using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace InventaProAPI.Models
{
  [Table("Compra")]
  public class Compra
  {
    [Key]
    [Column("compra_id")]
    public int CompraId { get; set; }

    [Required]
    [ForeignKey("Bodega")]
    [Column("bodega_id")]
    public int BodegaId { get; set; }

    [JsonIgnore]
    public Bodega Bodega { get; set; }

    [Required]
    [ForeignKey("Distribuidor")]
    [Column("distribuidor_id")]
    public int DistribuidorId { get; set; }

    public Distribuidor Distribuidor { get; set; }

    [Required]
    [Column("documento_url")]
    public string DocumentoUrl { get; set; }

    [Required]
    [Column("observacion")]
    public string Observacion { get; set; }

    [Column("fecha")]
    public DateTime Fecha { get; set; }

    [Column("fecha_cancelado")]
    public DateTime? FechaCancelado { get; set; }

    public ICollection<CompraDetalles> compraDetalles { get; set; }

  }
}
