using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace InformeApi.Models
{
  [Table("Solicitudes_Inventario")]
  public class SolicitudInventario
  {
    [Key]
    [Column("solicitud_id")]
    public int SolicitudId { get; set; }

    [Required]
    [Column("sucursal_id")]
    [ForeignKey("Sucursal")]
    public int SucursalId { get; set; }

    [Required]
    [Column("estado_solicitud_id")]
    [ForeignKey("EstadoSolicitudInventario")]
    public int EstadoSolicitudId { get; set; }

    [Column("fecha_solicitud")]
    public DateTime FechaSolicitud { get; set; }

    [Column("fecha_aprobacion")]
    public DateTime? FechaAprobacion { get; set; }

    [Column("fecha_rechazo")]
    public DateTime? FechaRechazo { get; set; }

    [Column("fecha_completada")]
    public DateTime? FechaCompletada { get; set; }

    [Required]
    [Column("usuario_solicitante_id")]
    [ForeignKey("UsuarioSolicitante")]
    public int UsuarioSolicitanteId { get; set; }

    [Column("usuario_aprobador_id")]
    [ForeignKey("UsuarioAprobador")]
    public int? UsuarioAprobadorId { get; set; }

    [Column("observaciones")]
    public string Observaciones { get; set; }

    [JsonIgnore]
    public Bodega Sucursal { get; set; }

    [JsonIgnore]
    public EstadoSolicitudInventario EstadoSolicitudInventario { get; set; }

    [JsonIgnore]
    public Usuario UsuarioSolicitante { get; set; }

    [JsonIgnore]
    public Usuario UsuarioAprobador { get; set; }

    [JsonIgnore]
    public ICollection<SolicitudInventarioDetalle> DetallesSolicitudesInventario { get; set; }
  }
}
