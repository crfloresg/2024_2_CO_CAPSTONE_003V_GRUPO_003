﻿using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace InformeApi.Models
{
  [Table("Perdidas")]
  public class Perdida
  {
    [Key]
    [Column("perdida_id")]
    public int PerdidaId { get; set; }

    [Required]
    [Column("producto_id")]
    [ForeignKey("Producto")]
    public int ProductoId { get; set; }

    [Required]
    [Column("bodega_id")]
    [ForeignKey("Bodega")]
    public int BodegaId { get; set; }

    [Required]
    [Column("cantidad")]
    public int Cantidad { get; set; }

    [Required]
    [Column("tipo_perdida_id")]
    [ForeignKey("TipoPerdida")]
    public int TipoPerdidaId { get; set; }

    [Column("descripcion")]
    public string Descripcion { get; set; }

    [Column("fecha_registro")]
    public DateTime FechaRegistro { get; set; }

    [Required]
    [Column("usuario_id")]
    [ForeignKey("Usuario")]
    public int UsuarioId { get; set; }

    [JsonIgnore]
    public Producto Producto { get; set; }

    [JsonIgnore]
    public Bodega Bodega { get; set; }

    [JsonIgnore]
    public TipoPerdida TipoPerdida { get; set; }

    [JsonIgnore]
    public Usuario Usuario { get; set; }
  }
}