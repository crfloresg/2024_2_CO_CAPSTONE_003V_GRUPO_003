using InformeApi.Models;
using InventaProAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace InventaProAPI.Data
{
  public class AppDbContext : DbContext
  {
    public AppDbContext(DbContextOptions options) : base(options) { }
    public DbSet<Alerta> Alertas { get; set; }
    public DbSet<Auditoria> Auditorias { get; set; }
    public DbSet<Bodega> Bodegas { get; set; }
    public DbSet<EstadoAlerta> EstadoAlertas { get; set; }
    public DbSet<EstadoBodega> EstadoBodegas { get; set; }
    public DbSet<EstadoSolicitudInventario> EstadoSolicitudInventarios { get; set; }
    public DbSet<EstadoTransferencia> EstadoTransferencias { get; set; }
    public DbSet<EstadoUsuario> EstadoUsuarios { get; set; }
    public DbSet<Inventario> Inventarios { get; set; }
    public DbSet<LoteInventario> LoteInventarios { get; set; }
    public DbSet<Perdida> Perdidas { get; set; }
    public DbSet<Permiso> Permisos { get; set; }
    public DbSet<Producto> Productos { get; set; }
    public DbSet<Rol> Rols { get; set; }
    public DbSet<RolesPermiso> RolesPermisos { get; set; }
    public DbSet<SolicitudInventario> SolicitudInventarios { get; set; }
    public DbSet<SolicitudInventarioDetalle> SolicitudInventarioDetalles { get; set; }
    public DbSet<TipoAlerta> TipoAlertas { get; set; }
    public DbSet<TipoBodega> TipoBodegas { get; set; }
    public DbSet<TipoPerdida> TipoPerdidas { get; set; }
    public DbSet<Transferencia> Transferencias { get; set; }
    public DbSet<TransferenciaDetalle> TransferenciasDetalles { get; set; }
    public DbSet<UmbralStock> UmbralStocks { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Compra> Compras { get; set; }
    public DbSet<CompraDetalles> CompraDetalles { get; set; }
    public DbSet<Distribuidor> Distribuidores { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);

      // Configurar la relación entre Transferencia y BodegaOrigen
      modelBuilder.Entity<Transferencia>()
          .HasOne(t => t.BodegaOrigen)
          .WithMany(b => b.TransferenciasOrigen)
          .HasForeignKey(t => t.BodegaOrigenId)
          .OnDelete(DeleteBehavior.Restrict)
          .HasConstraintName("FK_Transferencia_BodegaOrigen");

      // Configurar la relación entre Transferencia y BodegaDestino
      modelBuilder.Entity<Transferencia>()
          .HasOne(t => t.BodegaDestino)
          .WithMany(b => b.TransferenciasDestino)
          .HasForeignKey(t => t.BodegaDestinoId)
          .OnDelete(DeleteBehavior.Restrict)
          .HasConstraintName("FK_Transferencia_BodegaDestino");

      // Configurar la relación entre Transferencia y UsuarioSolicitante
      modelBuilder.Entity<Transferencia>()
          .HasOne(t => t.UsuarioSolicitante)
          .WithMany(u => u.TransferenciasSolicitante)
          .HasForeignKey(t => t.UsuarioSolicitanteId)
          .OnDelete(DeleteBehavior.Restrict)
          .HasConstraintName("FK_Transferencia_UsuarioSolicitante");

      // Configurar la relación entre Transferencia y UsuarioVerificador
      modelBuilder.Entity<Transferencia>()
          .HasOne(t => t.UsuarioVerificador)
          .WithMany(u => u.TransferenciasVerificador)
          .HasForeignKey(t => t.UsuarioVerificadorId)
          .OnDelete(DeleteBehavior.Restrict)
          .HasConstraintName("FK_Transferencia_UsuarioVerificador");

      // Configurar la relación entre SolicitudInventario y Usuario (Solicitante)
      modelBuilder.Entity<SolicitudInventario>()
          .HasOne(s => s.UsuarioSolicitante)
          .WithMany(u => u.SolicitudesSolicitante)
          .HasForeignKey(s => s.UsuarioSolicitanteId)
          .OnDelete(DeleteBehavior.Restrict)
          .HasConstraintName("FK_SolicitudInventario_UsuarioSolicitante");

      // Configurar la relación entre SolicitudInventario y Usuario (Aprobador)
      modelBuilder.Entity<SolicitudInventario>()
          .HasOne(s => s.UsuarioAprobador)
          .WithMany(u => u.SolicitudesAprobador)
          .HasForeignKey(s => s.UsuarioAprobadorId)
          .OnDelete(DeleteBehavior.Restrict)
          .HasConstraintName("FK_SolicitudInventario_UsuarioAprobador");

      // Configurar la relación entre TransferenciaDetalle y Transferencia
      modelBuilder.Entity<TransferenciaDetalle>()
          .HasOne(td => td.Transferencia)
          .WithMany(t => t.DetallesTransferencia)
          .HasForeignKey(td => td.TransferenciaId)
          .OnDelete(DeleteBehavior.Cascade)
          .HasConstraintName("FK_TransferenciaDetalle_Transferencia");

      // Configurar la relación entre TransferenciaDetalle y Producto
      modelBuilder.Entity<TransferenciaDetalle>()
          .HasOne(td => td.Producto)
          .WithMany(p => p.DetallesTransferencia)
          .HasForeignKey(td => td.ProductoId)
          .OnDelete(DeleteBehavior.Restrict)
          .HasConstraintName("FK_TransferenciaDetalle_Producto");

      // Opcional: Configurar otras relaciones si es necesario
    }
  }
}
