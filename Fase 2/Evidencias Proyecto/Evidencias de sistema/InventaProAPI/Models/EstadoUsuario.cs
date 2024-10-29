using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace InventaProAPI.Models
{
  [Table("Estados_Usuarios")]
  public class EstadoUsuario
  {
    [Key]
    [Column("estado_usuario_id")]
    public int EstadoUsuarioId { get; set; }

    [Required]
    [StringLength(50)]
    [Column("nombre")]
    public string Nombre { get; set; }

    [JsonIgnore]
    public ICollection<Usuario> Usuarios { get; set; }
  }
}
