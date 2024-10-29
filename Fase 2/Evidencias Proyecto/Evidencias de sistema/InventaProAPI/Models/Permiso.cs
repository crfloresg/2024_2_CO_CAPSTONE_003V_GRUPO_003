using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace InventaProAPI.Models
{
  [Table("Permisos")]
  public class Permiso
  {
    [Key]
    [Column("permiso_id")]
    public int PermisoId { get; set; }

    [Required]
    [StringLength(50)]
    [Column("nombre")]
    public string Nombre { get; set; }

    [Column("descripcion")]
    public string Descripcion { get; set; }

    [Column("fecha_creacion")]
    public DateTime FechaCreacion { get; set; }

    [Column("fecha_actualizacion")]
    public DateTime FechaActualizacion { get; set; }

    [JsonIgnore]
    public ICollection<RolesPermiso> RolesPermisos { get; set; }
  }
}
