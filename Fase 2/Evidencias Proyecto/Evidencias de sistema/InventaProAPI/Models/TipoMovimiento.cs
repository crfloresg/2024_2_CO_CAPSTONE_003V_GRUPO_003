using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace InventaProAPI.Models
{
  [Table("Tipos_Movimiento")]
  public class TipoMovimiento
  {
    [Key]
    [Column("tipo_movimiento_id")]
    public int TipoMovimientoId { get; set; }

    [Required]
    [StringLength(50)]
    [Column("nombre")]
    public string Nombre { get; set; }

    [JsonIgnore]
    public ICollection<Movimiento> Movimientos { get; set; }
  }
}
