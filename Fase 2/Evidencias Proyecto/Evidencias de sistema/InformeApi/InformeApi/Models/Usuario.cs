using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using InformeApi.DTOs;

namespace InformeApi.Models
{
  [Table("Usuarios")]
  public class Usuario
  {
    [Key]
    [Column("usuario_id")]
    public int UsuarioId { get; set; }

    [Required]
    [StringLength(50)]
    [Column("nombre")]
    public string Nombre { get; set; }

    [Required]
    [StringLength(50)]
    [Column("apellido")]
    public string Apellido { get; set; }

    [Required]
    [StringLength(100)]
    [Column("email")]
    public string Email { get; set; }

    [Required]
    [StringLength(255)]
    [Column("password")]
    public string Password { get; set; }

    [Required]
    [Column("rol_id")]
    [ForeignKey("Rol")]
    public int RolId { get; set; }

    [Required]
    [Column("bodega_id")]
    [ForeignKey("Bodega")]
    public int BodegaId { get; set; }

    [Required]
    [Column("estado_usuario_id")]
    [ForeignKey("EstadoUsuario")]
    public int EstadoUsuarioId { get; set; }

    [Column("refresh_token")]
    public string? RefreshToken { get; set; }

    [Column("fecha_creacion")]
    public DateTime FechaCreacion { get; set; }

    [Column("fecha_actualizacion")]
    public DateTime FechaActualizacion { get; set; }

    [JsonIgnore]
    public Rol Rol { get; set; }

    [JsonIgnore]
    public Bodega Bodega { get; set; }

    [JsonIgnore]
    public EstadoUsuario EstadoUsuario { get; set; }

    [JsonIgnore]
    public ICollection<Transferencia> TransferenciasSolicitante { get; set; }

    [JsonIgnore]
    public ICollection<Transferencia> TransferenciasVerificador { get; set; }

    [JsonIgnore]
    public ICollection<Auditoria> Auditorias { get; set; }

    [JsonIgnore]
    public ICollection<Alerta> Alertas { get; set; }

    [JsonIgnore]
    public ICollection<SolicitudInventario> SolicitudesSolicitante { get; set; }

    [JsonIgnore]
    public ICollection<SolicitudInventario> SolicitudesAprobador { get; set; }

    [JsonIgnore]
    public ICollection<Movimiento> Movimientos { get; set; }

    [JsonIgnore]
    public ICollection<Perdida> Perdidas { get; set; }

    public AuthLoginResponse LoginResponse (string accessToken)
    {
      return new AuthLoginResponse
      {
        AccessToken = accessToken,
        Apellido = Apellido,
        Email = Email,
        Nombre = Nombre,
        RolId = RolId,
        UsuarioId = UsuarioId,
        BodegaId = BodegaId,
      };
    }

  }
}
