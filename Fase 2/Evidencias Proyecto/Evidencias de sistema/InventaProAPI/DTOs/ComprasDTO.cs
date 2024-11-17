namespace InventaProAPI.DTOs
{
  public class CompraCreateRequest
  {
    public string documentoB64 { get; set; }
    public string observacion { get; set; }
    public int distribuidorId { get; set; }
    public List<CompraDetalleAux> compraDetalles { get; set; }
  }

  public class CompraDetalleAux
  {
    public int productoId { get; set; }
    public int cantidad { get; set; }
    public int precioCompra { get; set; }

  }

}
