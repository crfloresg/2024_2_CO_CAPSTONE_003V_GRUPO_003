using System.ComponentModel.DataAnnotations;

namespace InventaProAPI.DTOs
{
    public class BodegasCURequest
    {
        public int bodegaId { get; set; }

        [Required]
        [StringLength(100)]
        public string nombre { get; set; }

        [StringLength(255)]
        public string direccion { get; set; }
    }
}
