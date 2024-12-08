using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace InformeApi.DTOs
{
  public class AlertasCURequest
  {
    public int ProductoId { get; set; }

    public int AlertaId { get; set; }

    public int minimo { get; set; }

    [StringLength(50)]
    public string? Mensaje { get; set; }
    
    public int BodegaId { get; set; }

    public int TipoAlerta { get; set; }

    public int Estado { get; set; }
  }
}
