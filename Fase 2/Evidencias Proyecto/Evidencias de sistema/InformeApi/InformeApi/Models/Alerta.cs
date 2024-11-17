using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace InformeApi.Models
{
  [Table("Alertas")]
  public class Alerta
  {
    [Key]
    [Column("alerta_id")]
    public int AlertaId { get; set; }

    [Required]
    [Column("producto_id")]
    [ForeignKey("Producto")]
    public int ProductoId { get; set; }

    [Required]
    [Column("bodega_id")]
    [ForeignKey("Bodega")]
    public int BodegaId { get; set; }

    [Required]
    [Column("tipo_alerta_id")]
    [ForeignKey("TipoAlerta")]
    public int TipoAlertaId { get; set; }

    [Required]
    [Column("mensaje")]
    public string Mensaje { get; set; }

    [Required]
    [Column("stockMin")]
    public int Minimo { get; set; }

    [Required]
    [Column("estado_alerta_id")]
    [ForeignKey("EstadoAlerta")]
    public int EstadoAlertaId { get; set; }

    [Column("fecha_creacion")]
    public DateTime FechaCreacion { get; set; }

    [Column("fecha_resolucion")]
    public DateTime? FechaResolucion { get; set; }

    [JsonIgnore]
    public Producto Producto { get; set; }

    [JsonIgnore]
    public Bodega Bodega { get; set; }

    [JsonIgnore]
    public TipoAlerta TipoAlerta { get; set; }

    [JsonIgnore]
    public EstadoAlerta EstadoAlerta { get; set; }
  }
}
