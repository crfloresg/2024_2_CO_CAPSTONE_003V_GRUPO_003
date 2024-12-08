using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace InventaProAPI.Models
{
  [Table("Estados_Solicitud_Inventario")]
  public class EstadoSolicitudInventario
  {
    [Key]
    [Column("estado_solicitud_id")]
    public int EstadoSolicitudId { get; set; }

    [Required]
    [StringLength(50)]
    [Column("nombre")]
    public string Nombre { get; set; }

    [JsonIgnore]
    public ICollection<SolicitudInventario> SolicitudesInventario { get; set; }
  }
}
