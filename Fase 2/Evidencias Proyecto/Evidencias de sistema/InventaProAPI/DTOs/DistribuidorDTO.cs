using System;
using System.ComponentModel.DataAnnotations;

namespace InventaProAPI.DTOs
{
    public class DistribuidorDTO
    {
        public int distribuidorId { get; set; }

        [Required]
        [StringLength(255)]
        public string nombre { get; set; }

        [StringLength(255)]
        public string? direccion { get; set; }

        [StringLength(20)]
        public string? telefono { get; set; }

        [StringLength(255)]
        public string? correoElectronico { get; set; }
    }
}

