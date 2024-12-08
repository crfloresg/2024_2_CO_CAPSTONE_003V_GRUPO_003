using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InformeApi.Models
{
    [Table("Compra")]
    public class Compra
    {
        [Key]
        [Column("compra_id")]
        public int CompraId { get; set; }

        [Required]
        [Column("Bodega_id")]
        public int BodeaId { get; set; }

        [Required]
        [Column("distribuidor_id")]
        public int DistribuidorId { get; set; }

        [Required]
        [StringLength(50)]
        [Column("documento_url")]
        public string? DocumentoUrl { get; set; }

        [Required]
        [StringLength(100)]
        [Column("observacion")]
        public string? Observacion { get; set; }

        [Required]
        [Column("fecha")]
        public DateTime Fecha { get; set; }

        [Required]
        [Column("fecha_creacion")]
        public DateTime Creacion { get; set; }
    }
}
