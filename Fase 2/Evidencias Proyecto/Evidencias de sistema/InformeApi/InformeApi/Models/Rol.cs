using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using InformeApi.DTOs;

namespace InformeApi.Models
{
  [Table("Roles")]
  public class Rol
  {
    [Key]
    [Column("rol_id")]
    public int RolId { get; set; }

    [Required]
    [StringLength(50)]
    [Column("nombre")]
    public string Nombre { get; set; }

    [Column("descripcion")]
    public string Descripcion { get; set; }

    [Required]
    [ForeignKey("Bodega")]
    [Column("bodega_id")]
    public int BodegaId { get; set; }

    public Bodega Bodega { get; set; }

    [Column("fecha_creacion")]
    public DateTime FechaCreacion { get; set; }

    [Column("fecha_actualizacion")]
    public DateTime FechaActualizacion { get; set; }

    [Column("estado")]
    public int Estado {  get; set; }

    [JsonIgnore]
    public ICollection<RolesPermiso> RolesPermisos { get; set; }

    [JsonIgnore]
    public ICollection<Usuario> Usuarios { get; set; }

    public RolesPermisosResponse RolesPermisosResponse(List<permisoAux> permisos)
    {
      return new RolesPermisosResponse
      {
        RolId = RolId,
        Nombre = Nombre,
        Descripcion = Descripcion,
        BodegaId = BodegaId,
        Permisos = permisos
      };
    }

  }
}
