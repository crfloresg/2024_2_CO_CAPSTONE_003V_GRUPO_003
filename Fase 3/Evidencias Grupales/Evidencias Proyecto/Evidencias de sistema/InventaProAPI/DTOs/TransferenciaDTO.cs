namespace InventaProAPI.DTOs
{
  public class TransferenciaCreateRequest
  {
    public int bodegaDestinoId { get; set; }
    public string observaciones {  get; set; }
    public int solicitudId { get; set; }
    public List<detalleTransferenciaAux> transferenciasDetalles { get; set; }
  }

  public class detalleTransferenciaAux
  {
    public int productoId { get; set; }
    public int cantidadDespachada { get; set; }
    public int precioCompra { get; set; }
  }

  public class RecepcionCreateRequest
  { 
    public int transferenciaId { get; set; }
    public int bodegaDestinoId { get; set; }
    public List<RecepcionDetalle> detalle { get; set; }
  }

  public class RecepcionDetalle
  { 
    public int detalleId {  get; set; }
    public int productoId { get; set; }
    public int cantidadRecibida { get; set; }
    public int precioCompra { get; set;  }
    public int cantidadDmg { get; set; }
    public int cantidadPerdida { get; set; }
  }

}
