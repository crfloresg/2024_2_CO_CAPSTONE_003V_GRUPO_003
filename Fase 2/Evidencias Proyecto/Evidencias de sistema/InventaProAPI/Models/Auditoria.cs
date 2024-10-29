using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace InventaProAPI.Models
{
  [Table("Auditorias")]
  public class Auditoria
  {
    [Key]
    [Column("auditoria_id")]
    public int AuditoriaId { get; set; }

    [Required]
    [Column("usuario_id")]
    [ForeignKey("Usuario")]
    public int UsuarioId { get; set; }

    [Required]
    [StringLength(100)]
    [Column("accion")]
    public string Accion { get; set; }

    [Column("descripcion")]
    public string Descripcion { get; set; }

    //[Column("fecha_accion")]
    //public DateTime FechaAccion { get; set; }

    [JsonIgnore]
    public Usuario Usuario { get; set; }
  }
}
