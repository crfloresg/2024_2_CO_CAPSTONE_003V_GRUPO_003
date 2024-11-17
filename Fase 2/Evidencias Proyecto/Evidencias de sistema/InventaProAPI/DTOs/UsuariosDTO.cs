using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace InventaProAPI.DTOs
{
  public class UsuarioCURequest
  {
    [Required]
    public int UsuarioId { get; set; }

    [StringLength(12)]
    [Required]
    public string Run { get; set; }

    [Required]
    [StringLength(50)]
    public string Nombre { get; set; }

    [Required]
    [StringLength(50)]
    public string Apellido { get; set; }

    [Required]
    [StringLength(100)]
    public string Email { get; set; }

    [StringLength(255)]
    public string Password { get; set; }

    [Required]
    public int RolId { get; set; }

    [Required]
    public int BodegaId { get; set; }
  }
}
