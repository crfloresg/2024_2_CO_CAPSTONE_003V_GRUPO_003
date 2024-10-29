using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace InformeApi.DTOs
{

  public class RolesPermisoRequest
  {
    public int RolId { get; set; }
    public string Nombre { get; set; }
    public string Descripcion { get; set; }
    public int BodegaId { get; set; }
    public int Estado { get; set; }
    public List<permisoAux> Permisos { get; set; }
  }

  public class RolesPermisosResponse
  {
    public int RolId { get; set; }
    public string Nombre { get; set; }
    public string Descripcion { get; set; }
    public int BodegaId { get; set; }
    public ICollection<permisoAux> Permisos { get; set; }
  }

  public class permisoAux
  {
    public int PermisoId { get; set; }
    public string Nombre { get; set; }
    public string Descripcion { get; set; }
  }
}
