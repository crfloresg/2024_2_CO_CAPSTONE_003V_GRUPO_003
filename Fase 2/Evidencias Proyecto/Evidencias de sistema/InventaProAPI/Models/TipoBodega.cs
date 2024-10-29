using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace InventaProAPI.Models
{
  [Table("Tipos_Bodega")]
  public class TipoBodega
  {
    [Key]
    [Column("tipo_bodega_id")]
    public int TipoBodegaId { get; set; }

    [Required]
    [StringLength(50)]
    [Column("nombre")]
    public string Nombre { get; set; }

    [JsonIgnore]
    public ICollection<Bodega> Bodegas { get; set; }
  }
}
