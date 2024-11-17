namespace InventaProAPI.DTOs
{
  public class PerdidasCreateRequest
  {
    public List<PerdidasCreateAux> perdidas {  get; set; }
  }

  public class PerdidasCreateAux
  {
    public int productoId { get; set; }
    public int bodegaId { get; set; }
    public int cantidad { get; set; }
    public int tipoPerdida { get; set; }
    public string descripcion { get; set; }
    public int precioCompra { get; set; }
  }
}
