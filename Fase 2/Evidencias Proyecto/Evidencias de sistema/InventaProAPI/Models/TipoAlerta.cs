using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace InventaProAPI.Models
{
  [Table("Tipos_Alerta")]
  public class TipoAlerta
  {
    [Key]
    [Column("tipo_alerta_id")]
    public int TipoAlertaId { get; set; }

    [Required]
    [StringLength(50)]
    [Column("nombre")]
    public string Nombre { get; set; }

    [JsonIgnore]
    public ICollection<Alerta> Alertas { get; set; }
  }
}
