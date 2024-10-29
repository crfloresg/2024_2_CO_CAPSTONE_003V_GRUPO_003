using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace InventaProAPI.Models
{
  [Table("Estados_Bodegas")]
  public class EstadoBodega
  {
    [Key]
    [Column("estado_bodega_id")]
    public int EstadoBodegaId { get; set; }

    [Required]
    [StringLength(50)]
    [Column("nombre")]
    public string Nombre { get; set; }

    [JsonIgnore]
    public ICollection<Bodega> Bodegas { get; set; }
  }
}
