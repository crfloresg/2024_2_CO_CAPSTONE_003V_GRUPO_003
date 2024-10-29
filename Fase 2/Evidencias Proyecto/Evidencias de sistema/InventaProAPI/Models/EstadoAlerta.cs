using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace InventaProAPI.Models
{
  [Table("Estados_Alerta")]
  public class EstadoAlerta
  {
    [Key]
    [Column("estado_alerta_id")]
    public int EstadoAlertaId { get; set; }

    [Required]
    [StringLength(50)]
    [Column("nombre")]
    public string Nombre { get; set; }

    [JsonIgnore]
    public ICollection<Alerta> Alertas { get; set; }
  }
}
