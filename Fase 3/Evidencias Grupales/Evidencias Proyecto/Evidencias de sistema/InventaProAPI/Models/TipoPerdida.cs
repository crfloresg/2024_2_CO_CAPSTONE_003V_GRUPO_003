using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace InventaProAPI.Models
{
  [Table("Tipos_Perdida")]
  public class TipoPerdida
  {
    [Key]
    [Column("tipo_perdida_id")]
    public int TipoPerdidaId { get; set; }

    [Required]
    [StringLength(50)]
    [Column("nombre")]
    public string Nombre { get; set; }

    [JsonIgnore]
    public ICollection<Perdida> Perdidas { get; set; }
  }
}
