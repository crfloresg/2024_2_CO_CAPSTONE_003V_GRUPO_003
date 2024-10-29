using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace InformeApi.Models
{
  [Table("Transferencias")]
  public class Transferencia
  {
    [Key]
    [Column("transferencia_id")]
    public int TransferenciaId { get; set; }

    [Required]
    [Column("bodega_origen_id")]
    [ForeignKey("BodegaOrigen")]
    public int BodegaOrigenId { get; set; }

    [Required]
    [Column("bodega_destino_id")]
    [ForeignKey("BodegaDestino")]
    public int BodegaDestinoId { get; set; }

    [Required]
    [Column("estado_transferencia_id")]
    [ForeignKey("EstadoTransferencia")]
    public int EstadoTransferenciaId { get; set; }

    [Column("fecha_solicitud")]
    public DateTime FechaSolicitud { get; set; }

    [Column("fecha_envio")]
    public DateTime? FechaEnvio { get; set; }

    [Column("fecha_recepcion")]
    public DateTime? FechaRecepcion { get; set; }

    [Required]
    [Column("usuario_solicitante_id")]
    [ForeignKey("UsuarioSolicitante")]
    public int UsuarioSolicitanteId { get; set; }

    [Column("usuario_verificador_id")]
    [ForeignKey("UsuarioVerificador")]
    public int? UsuarioVerificadorId { get; set; }

    [Column("observaciones")]
    public string Observaciones { get; set; }

    [JsonIgnore]
    public Producto Producto { get; set; }

    [JsonIgnore]
    public Bodega BodegaOrigen { get; set; }

    [JsonIgnore]
    public Bodega BodegaDestino { get; set; }

    [JsonIgnore]
    public EstadoTransferencia EstadoTransferencia { get; set; }

    [JsonIgnore]
    public Usuario UsuarioSolicitante { get; set; }

    [JsonIgnore]
    public Usuario UsuarioVerificador { get; set; }

    [JsonIgnore]
    public ICollection<Movimiento> Movimientos { get; set; }

    [JsonIgnore]
    public ICollection<TransferenciaDetalle> DetallesTransferencia { get; set; }
  }
}
