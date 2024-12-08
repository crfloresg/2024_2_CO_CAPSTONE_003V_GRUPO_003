using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InformeApi.Models
{
  [Table("Api_keys")]
  public class ApiKeys
  {

    [Key]
    [Column]
    public int KeyId { get; set; }

    [Column("key")]
    [Required]
    public string Key { get; set; }

    [Column("bodega_id")]
    [Required]
    public int BodegaId { get; set; }

  }
}
