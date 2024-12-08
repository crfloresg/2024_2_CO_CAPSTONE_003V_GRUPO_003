namespace InformeApi.Models
{
  public class AccessToken
  {
    public int UsuarioId { get; set; }
    public int BodegaId { get; set; }
    public string Email { get; set; }
    public List<string> Permisos { get; set; } = new List<string>();
  }
}
