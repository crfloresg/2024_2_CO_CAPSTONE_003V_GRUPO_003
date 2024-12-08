using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace InformeApi.Models
{
  [Table("Umbrales_stock")]
  public class UmbralStock
  {
    [Key]
    [Column("umbral_id")]
    public int UmbralId { get; set; }

    [Required]
    [Column("producto_id")]
    [ForeignKey("Producto")]
    public int ProductoId { get; set; }

    [Required]
    [Column("bodega_id")]
    [ForeignKey("Bodega")]
    public int BodegaId { get; set; }

    [Required]
    [Column("umbral")]
    public int Umbral { get; set; }

    [JsonIgnore]
    public Producto Producto { get; set; }

    [JsonIgnore]
    public Bodega Bodega { get; set; }
  }
}
