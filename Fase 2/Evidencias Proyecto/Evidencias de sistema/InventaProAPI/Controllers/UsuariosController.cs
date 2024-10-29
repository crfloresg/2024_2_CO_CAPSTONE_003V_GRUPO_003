using InventaProAPI.Data;
using InventaProAPI.DTOs;
using InventaProAPI.Models;
using InventaProAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventaProAPI.Controllers
{
  [Route("[controller]")]
  [ApiController]
  public class UsuariosController : ControllerBase
  {

    private readonly AppDbContext _context;
    private readonly TokenProvider _tokenProvider;
    private readonly AuditoriaService _auditoriaService;

    public UsuariosController(AppDbContext context, TokenProvider tokenProvider, AuditoriaService auditoriaService)
    {
      _context = context;
      _tokenProvider = tokenProvider;
      _auditoriaService = auditoriaService;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetUsuarios()
    {
      try
      {

        var userRequest = _tokenProvider.GetAccessTokenData();

        if(!CanRead()) { return Forbid(); }

        var query = _context.Usuarios
          .Include(x => x.Rol)
          .Include(x => x.Bodega)
          .Select(
            x => new {
              x.UsuarioId,
              x.Nombre,
              x.Apellido,
              x.Email,
              x.RolId,
              Rol = new
              {
                x.Rol.RolId,
                x.Rol.Nombre,
                x.Rol.Descripcion,
                x.Rol.BodegaId
              },
              x.BodegaId,
              Bodega = new
              {
                x.Bodega.BodegaId,
                x.Bodega.Nombre,
                x.Bodega.Direccion
              },
              x.EstadoUsuarioId
            }
          );

        if (!_tokenProvider.HasPermission("r_usuarios_global"))
        {
          query = query.Where(x => x.BodegaId == userRequest.BodegaId);
        }

        var usuarios = await query.ToListAsync();

        if(usuarios == null) { return NotFound(); }

        return Ok(usuarios);
      }
      catch (Exception ex) 
      { 
        return BadRequest(ex.Message);
      }
    }



    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetUsuariosById(int id)
    {
      try
      {
        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanRead()) { return Forbid(); }

        var usuarios = await _context.Usuarios
          .Where(x => x.UsuarioId == id)
          .Include(x => x.Rol)
          .Include(x => x.Bodega)
          .Select(
            x => new {
              x.UsuarioId,
              x.Nombre,
              x.Apellido,
              x.Email,
              x.RolId,
              Rol = new
              {
                x.Rol.RolId,
                x.Rol.Nombre,
                x.Rol.Descripcion,
                x.Rol.BodegaId
              },
              x.BodegaId,
              Bodega = new
              {
                x.Bodega.BodegaId,
                x.Bodega.Nombre,
                x.Bodega.Direccion
              },
              x.EstadoUsuarioId
            }
          )
          .FirstOrDefaultAsync();

        if (usuarios == null) { return NotFound(); }

        if (!_tokenProvider.HasPermission("r_usuarios_global") && userRequest.BodegaId != usuarios.BodegaId) { return Forbid(); }

        return Ok(usuarios);
      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }



    [HttpGet("Opciones")]
    [Authorize]
    public async Task<IActionResult> GetOpciones() 
    {
      try
      {

        if (!CanCU()) { return Forbid(); }

        var userRequest = _tokenProvider.GetAccessTokenData();

        var queryBodega = _context.Bodegas
          .Where(x => x.EstadoBodegaId == 1)
          .Select(x => new
          {
            x.BodegaId,
            x.Nombre,
            x.Direccion
          });

        var queryRoles = _context.Rols
          .Where(x => x.Estado == 1)
          .Select(x => new
          {
            x.RolId,
            x.Nombre,
            x.Descripcion,
            x.BodegaId
          });

        if (_tokenProvider.HasPermission("cu_usuarios_bodega") && !_tokenProvider.HasPermission("cu_usuarios_global"))
        {
          queryBodega = queryBodega.Where(x => x.BodegaId == userRequest.BodegaId);
          queryRoles = queryRoles.Where(x => x.BodegaId == userRequest.BodegaId);
        }

        var bodegas = await queryBodega.ToListAsync();
        var roles = await queryRoles.ToListAsync();

        return Ok(new {bodegas = bodegas, roles = roles});

      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }



    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CUUsuario([FromBody] UsuarioCURequest usuarioCU)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {

        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanCU()) { return Forbid(); }

        var rol = await _context.Rols.Where(x => x.RolId == usuarioCU.RolId).FirstOrDefaultAsync();

        if (!_tokenProvider.HasPermission("cu_usuarios_global") && 
          (usuarioCU.BodegaId != userRequest.BodegaId || rol.BodegaId != userRequest.BodegaId))
        {
          return Forbid();
        }


        if (usuarioCU.UsuarioId == 0)
        {

          if (usuarioCU.Password.Length == 0 || usuarioCU.Password == null) { return BadRequest(); }

          var u = new Usuario 
          { 
            Nombre = usuarioCU.Nombre,
            Apellido = usuarioCU.Apellido,
            Email = usuarioCU.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(usuarioCU.Password),
            RolId = usuarioCU.RolId,
            BodegaId = usuarioCU.BodegaId,
            EstadoUsuarioId = 1
          };

          if (!_tokenProvider.HasPermission("cu_usuarios_global")) { u.BodegaId =  userRequest.BodegaId; }

          await _context.Usuarios.AddAsync(u);
          await _context.SaveChangesAsync();
          await _auditoriaService.Auditar(userRequest.UsuarioId, "usuario_create", $"Se creo el usuario {u.UsuarioId}");
        }
        else
        {
          var userToModify = await _context.Usuarios.Where(x => x.UsuarioId == usuarioCU.UsuarioId && x.EstadoUsuarioId == 1).FirstOrDefaultAsync();

          if (userToModify == null) { return NotFound(); }

          userToModify.Nombre = usuarioCU.Nombre;
          userToModify.Apellido = usuarioCU.Apellido;
          userToModify.Email = usuarioCU.Email;
          userToModify.RolId = usuarioCU.RolId;
          userToModify.BodegaId = usuarioCU.BodegaId;

          if (!_tokenProvider.HasPermission("cu_usuarios_global")) { userToModify.BodegaId = userRequest.BodegaId; }

          if (usuarioCU.Password.Length > 0) { userToModify.Password = BCrypt.Net.BCrypt.HashPassword(usuarioCU.Password); }

          await _context.SaveChangesAsync();

          await _auditoriaService.Auditar(userRequest.UsuarioId, "usuario_update", $"Se modifico el usuario {userToModify.UsuarioId}");
        }

        await transaction.CommitAsync();
        return Ok();
      }
      catch(Exception ex) 
      {
        await transaction.RollbackAsync();
        return BadRequest(ex.Message);
      }
    }



    [HttpGet("Delete/{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteUsuario(int id)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();

      try
      {

        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanDelete()) { return Forbid(); }

        var user = await _context.Usuarios.Where(x => x.UsuarioId == id).FirstOrDefaultAsync();

        if ( user == null ) { return NotFound(); }

        if(!_tokenProvider.HasPermission("d_usuarios_global") && user.BodegaId != userRequest.BodegaId) { return Forbid(); }

        user.RefreshToken = null;
        user.EstadoUsuarioId = 0;

        await _context.SaveChangesAsync();

        await _auditoriaService.Auditar(userRequest.UsuarioId, "usuario_delete", $"Se deshabilito el usuario {user.UsuarioId}");

        await transaction.CommitAsync();

        return Ok();

      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return BadRequest(ex.Message);
      }
    }



    [HttpGet("Activate/{id}")]
    [Authorize]
    public async Task<IActionResult> ActivateUsuario(int id)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {

        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanActivate()) { return Forbid(); }

        var user = await _context.Usuarios.Where(x => x.UsuarioId == id).FirstOrDefaultAsync();

        if (user == null) { return NotFound(); }

        if (!_tokenProvider.HasPermission("a_usuarios_global") && user.BodegaId != userRequest.BodegaId) { return Forbid(); }

        user.EstadoUsuarioId = 1;

        await _context.SaveChangesAsync();

        await _auditoriaService.Auditar(userRequest.UsuarioId, "usuario_activate", $"Se habilito el usuario {user.UsuarioId}");

        await transaction.CommitAsync( );

        return Ok();

      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return BadRequest(ex.Message);
      }
    }



    private bool CanRead()
    {
      return _tokenProvider.HasPermission("r_usuarios_global") || _tokenProvider.HasPermission("r_usuarios_bodega");
    }

    private bool CanCU()
    {
      return _tokenProvider.HasPermission("cu_usuarios_global") || _tokenProvider.HasPermission("cu_usuarios_bodega");
    }

    private bool CanActivate()
    {
      return _tokenProvider.HasPermission("a_usuarios_global") || _tokenProvider.HasPermission("a_usuarios_bodega");
    }

    private bool CanDelete()
    {
      return _tokenProvider.HasPermission("d_usuarios_global") || _tokenProvider.HasPermission("d_usuarios_bodega");
    }

  }
}
