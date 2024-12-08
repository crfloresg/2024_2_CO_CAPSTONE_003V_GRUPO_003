namespace InventaProAPI.DTOs
{
  public class SolicitudesCURequest
  {
    public int solicitudId { get; set; }
    public int bodegaId { get; set; }
    public List<detalleAux> detallesSolicitudesInventario { get; set; }
  }

  public class detalleAux
  {
    public int productoId { get; set; }
    public int cantidad { get; set; }
  }

  public class SolicitudesADRequest 
  {
    public int solicitudId { get; set; }
    
    public bool accept {  get; set; }
    public string observacion {  get; set; }
    public List<detalleAuxAD> detalles{ get; set; }
  }

  public class detalleAuxAD
  {
    public int detalleId { get; set; }
    public int cantidad { get; set; }
  }
}
