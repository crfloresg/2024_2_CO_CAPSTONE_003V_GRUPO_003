namespace InformeApi.DTOs
{
  public class TransferenciaTerceros
  {
    public int bodegaOrigenId { get; set; }
    public string observaciones { get; set; }
    public List<detalleTransferencia> transferenciasDetalles { get; set; }
  }

  public class detalleTransferencia
  {
    public int productoId { get; set; }
    public int cantidadDespachada { get; set; }
    public int precioCompra { get; set; }
  }
}
