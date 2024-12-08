namespace InventaProAPI.DTOs
{
  public class AuthLoginRequest
  {
    public string Email { get; set; }
    public string Password { get; set; }
  }

  public class AuthLoginResponse
  {
    public int UsuarioId { get; set; }

    public string Nombre { get; set; }

    public string Apellido { get; set; }

    public string Email { get; set; }

    public int RolId { get; set; }

    public int BodegaId { get; set; }

    public string AccessToken { get; set; }
  }
}
