using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InformeApi.Models
{
    [Table("Compra_Detalles")]
    public class DetalleCompras
    {
        [Key]
        [Column("detalle_id")]
        public int DetalleId { get; set; }

        [Required]
        [Column("compra_id")]
        public int CompraId { get; set; }

        [Required]
        [Column("producto_id")]
        public int ProductoId { get; set; }

        [Required]
        [Column("cantidad")]
        public int Cantidad { get; set; }

        [Required]
        [Column("precio_compra")]
        public int Compra { get; set; }
    }
}
