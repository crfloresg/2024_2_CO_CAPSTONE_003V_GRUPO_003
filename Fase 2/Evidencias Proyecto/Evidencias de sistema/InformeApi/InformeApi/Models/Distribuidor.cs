using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InformeApi.Models
{
    [Table("Distribuidores")]
    public class Distribuidor
    {
        [Key]
        [Column("distribuidor_id")]
        public int DistribuidorId { get; set; }

        [Required]
        [StringLength(50)]
        [Column("nombre")]
        public string Nombre { get; set; }

        [Required]
        [StringLength(50)]
        [Column("direccion")]
        public string Direccion { get; set; }

        [Required]
        [StringLength(50)]
        [Column("telefono")]
        public string Telefono { get; set; }

        [Required]
        [StringLength(50)]
        [Column("correo_electronico")]
        public string Correo { get; set; }

        [Required]
        [Column("estado")]
        public int Estado { get; set; }

        [Required]
        [Column("fecha_registro")]
        public DateTime FechaRegistro { get; set; }

        [Required]
        [Column("fecha_modificacion")]
        public DateTime FechaModificacion { get; set; }
    }
}
