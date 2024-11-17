using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventaProAPI.Models
{
    [Table("Distribuidores")]
    public class Distribuidor
    {
        [Key]
        [Column("distribuidor_id")]
        public int DistribuidorId { get; set; }

        [Required]
        [StringLength(255)]
        public string Nombre { get; set; }

        [StringLength(255)]
        public string? Direccion { get; set; }

        [StringLength(20)]
        public string? Telefono { get; set; }

        [StringLength(255)]
        [Column("correo_electronico")]
        public string? CorreoElectronico { get; set; }

        [Required]
        public int Estado { get; set; }

        [Column("fecha_registro")]
        public DateTime? FechaRegistro { get; set; }

        [Column("fecha_modificacion")]
        public DateTime? FechaModificacion { get; set; }
    }
}
