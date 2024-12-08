using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace InventaProAPI.Models
{
  [Table("Roles_Permisos")]
  public class RolesPermiso
  {
    [Key]
    [Column("rol_permiso_id")]
    public int RolPermisoId { get; set; }

    [Column("rol_id")]
    [ForeignKey("Rol")]
    public int RolId { get; set; }

    [Column("permiso_id")]
    [ForeignKey("Permiso")]
    public int PermisoId { get; set; }

    [JsonIgnore]
    public Rol Rol { get; set; }

    [JsonIgnore]
    public Permiso Permiso { get; set; }
  }
}
