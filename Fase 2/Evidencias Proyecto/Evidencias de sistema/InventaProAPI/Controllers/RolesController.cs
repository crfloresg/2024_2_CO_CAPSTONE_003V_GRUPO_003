using InventaProAPI.Data;
using InventaProAPI.DTOs;
using InventaProAPI.Models;
using InventaProAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace InventaProAPI.Controllers
{
  [Route("[controller]")]
  [ApiController]
  public class RolesController : ControllerBase
  {

    private readonly AppDbContext _context;
    private readonly TokenProvider _tokenProvider;
    private readonly AuditoriaService _auditoriaService;

    public RolesController(AppDbContext context, TokenProvider tokenProvider, AuditoriaService auditoriaService)
    {
      _context = context;
      _tokenProvider = tokenProvider;
      _auditoriaService = auditoriaService;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetRoles()
    {
      try
      {

        if (!CanRead()) { return Forbid(); }

        var userRequest = _tokenProvider.GetAccessTokenData();

        var query = _context.Rols
          .Include(x => x.Bodega)
          .Select(x => new
          {
            x.RolId,
            x.Nombre,
            x.Descripcion,
            x.BodegaId,
            x.Bodega,
            x.Estado
          });

        if (!_tokenProvider.HasPermission("r_roles_global"))
        {
          query = query.Where(x => x.BodegaId == userRequest.BodegaId);
        }

        var roles = await query.ToListAsync();

        if ( roles! ==  null ) { return NotFound(); }

        return Ok(roles);

      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }



    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetRolConPermisos(int id)
    {
      try
      {

        var userRequest = _tokenProvider.GetAccessTokenData();

        if(!CanRead()) { return Forbid(); }

        var rolesPermisos = await _context.RolesPermisos
          .Include(x => x.Permiso)
          .Include(x => x.Rol)
          .Where(x => x.RolId == id)
          .ToListAsync();

        var permisos = rolesPermisos.Select(x => x.Permiso)
        .Select(x => new {
          x.PermisoId,
          x.Nombre,
          x.Descripcion
        })
        .ToList();

        var rol = await _context.Rols.Where(x => x.RolId == id).FirstOrDefaultAsync();

        if(rol == null) { return NotFound(); }

        var response = new
        {
          RolId = rol.RolId,
          Nombre = rol.Nombre,
          Descripcion = rol.Descripcion,
          BodegaId = rol.BodegaId,
          estado = rol.Estado,
          Permisos = permisos
        };

        if (!_tokenProvider.HasPermission("r_roles_global") && userRequest.BodegaId != response.BodegaId) { return Forbid(); }

        return Ok(response);

      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }



    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CuRol([FromBody] RolesPermisoRequest body)
    {

      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {

        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanCU()) { return Forbid(); }

        var rolIdGlobal = 0;

        if(body.RolId == 0)
        {
          var newRol = new Rol {
            Nombre = body.Nombre,
            Descripcion = body.Descripcion,
            BodegaId = body.BodegaId,
            Estado = body.Estado,
          };

          if (!_tokenProvider.HasPermission("cu_roles_global"))
          {
            newRol.BodegaId = userRequest.BodegaId;
          }

          await _context.Rols.AddAsync(newRol);
          await _context.SaveChangesAsync();

          await _auditoriaService.Auditar(userRequest.UsuarioId, "rol_create", $"Se creo el rol {newRol.RolId}");

          rolIdGlobal = newRol.RolId;

        }
        else
        {
          var rol = await _context.Rols.Where(x => x.RolId == body.RolId && x.Estado == 1).FirstOrDefaultAsync();

          rol.Nombre = body.Nombre;
          rol.Descripcion = body.Descripcion;
          rol.BodegaId = body.BodegaId;
          rol.Estado = body.Estado;

          if (!_tokenProvider.HasPermission("cu_roles_global"))
          {
            if (rol.BodegaId != userRequest.BodegaId){
              return Forbid();
            }

            rol.BodegaId = userRequest.BodegaId;
          }

          await _context.SaveChangesAsync();

          await _auditoriaService.Auditar(userRequest.UsuarioId, "rol_update", $"Se modifico el rol {rol.RolId}");

          rolIdGlobal = rol.RolId;
        }

        await _context.RolesPermisos.Where(x => x.RolId == rolIdGlobal).ExecuteDeleteAsync();
        await _context.SaveChangesAsync();

        

        foreach (var item in body.Permisos)
        {
          var newRolPermiso = new RolesPermiso {
            RolId = rolIdGlobal,
            PermisoId = item.PermisoId
          };

          await _context.RolesPermisos.AddAsync(newRolPermiso);
          await _context.SaveChangesAsync();
        }

        await transaction.CommitAsync();

        return Ok();

      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return BadRequest(ex.Message);
      }
    }



    [HttpGet("Opciones")]
    [Authorize]
    public async Task<IActionResult> GetOpciones()
    {
      try
      {

        if (!_tokenProvider.HasPermission("cu_usuarios_global")) { return Forbid(); }

        var bodegas = await _context.Bodegas
          .Where(x => x.EstadoBodegaId == 1)
          .Select(x => new
          {
            x.BodegaId,
            x.Nombre,
            x.Direccion
          }) 
          .ToListAsync();

        if(bodegas.Count == 0) { return NotFound(); }

        return Ok(bodegas);

      }
      catch (Exception ex)
      {
        return BadRequest(ex.Message);
      }
    }

    [HttpGet("Delete/{id}")]
    [Authorize] 
    public async Task<IActionResult> DeleteRol(int id)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {

        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanDelete()) { return Forbid(); }

        var rol = await _context.Rols.Where(x => x.RolId == id).FirstOrDefaultAsync();

        if (rol == null) { return NotFound(); }

        if (!_tokenProvider.HasPermission("d_roles_global") && rol.BodegaId != userRequest.BodegaId) { return Forbid(); }

        rol.Estado = 0;

        await _context.SaveChangesAsync();

        await _auditoriaService.Auditar(userRequest.UsuarioId, "rol_delete", $"Se deshabilito el rol {rol.RolId}");

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
    public async Task<IActionResult> ActivateRol(int id)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {

        var userRequest = _tokenProvider.GetAccessTokenData();

        if (!CanActivate()) { return Forbid(); }

        var rol = await _context.Rols.Where(x => x.RolId == id).FirstOrDefaultAsync();

        if (rol == null) { return NotFound(); }

        if (!_tokenProvider.HasPermission("a_roles_global") && rol.BodegaId != userRequest.BodegaId) { return Forbid(); }

        rol.Estado = 1;

        await _context.SaveChangesAsync();

        await _auditoriaService.Auditar(userRequest.UsuarioId, "rol_activate", $"Se habilito el rol {rol.RolId}");

        await transaction.CommitAsync();

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
      return _tokenProvider.HasPermission("r_roles_global") || _tokenProvider.HasPermission("r_roles_bodega");
    }

    private bool CanCU()
    {
      return _tokenProvider.HasPermission("cu_roles_global") || _tokenProvider.HasPermission("cu_roles_bodega");
    }

    private bool CanActivate()
    {
      return _tokenProvider.HasPermission("a_roles_global") || _tokenProvider.HasPermission("a_roles_bodega");
    }

    private bool CanDelete()
    {
      return _tokenProvider.HasPermission("d_roles_global") || _tokenProvider.HasPermission("d_roles_bodega");
    }

  }
}
