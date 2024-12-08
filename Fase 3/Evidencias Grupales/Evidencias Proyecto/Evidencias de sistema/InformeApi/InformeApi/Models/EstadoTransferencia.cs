using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace InformeApi.Models
{
  [Table("Estados_Transferencia")]
  public class EstadoTransferencia
  {
    [Key]
    [Column("estado_transferencia_id")]
    public int EstadoTransferenciaId { get; set; }

    [Required]
    [StringLength(50)]
    [Column("nombre")]
    public string Nombre { get; set; }

    [JsonIgnore]
    public ICollection<Transferencia> Transferencias { get; set; }
  }
}
