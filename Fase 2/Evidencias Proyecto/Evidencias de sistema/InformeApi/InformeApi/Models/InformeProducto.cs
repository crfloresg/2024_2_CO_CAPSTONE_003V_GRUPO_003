using System.Security;

namespace InformeApi.Models
{
    public class InformeProducto
    {
        public int prodId { get; set; }
        public string? prodName { get; set; }
        public string? codigo { get; set; }
        public int cantidad { get; set; }
        public int? venta {get; set; }
        public string? compra {get; set; }
        public string? nomBodega { get; set; }
        public int bodegaId { get; set; }
        
    }
    public class InformeEmpleado
    {
        public string? nameUsuario { get; set; }
        public string? apellido { get; set; }
        public string? email { get; set; }
        public string? nameBodega { get; set; }
        public string? nameRol {  get; set; }
    }
    public class InformeBodega
    {
        public int bodegaId { get; set; }
        public string? nameBodegas { get; set; }
        public string? direccion { get; set; }
        public string? tipoBodega { get; set; }
    }

    public class DataUsuario
    {
        public string? nameBodegas { get; set; }
        public string? nameUser { get; set; }
        public string? Apellido { get; set; }        
        public int IdBodega { get; set; }   
        public string? nametipoBodega { get; set; }
    }
    public class DataAuditor
    {
        public int idUsu { get; set; }
        public string? nameUsu { get; set; }
        public string? apellido { get; set; }
        public string? nameBodega { get; set; }
        public string? accion { get; set; }
        public string? detalle { get; set; }
        public string? fechaAud { get; set; }
    }
    public class DataPerdida
    {
        public string? nameProd { get; set; }
        public string? nameBodega { get; set; }
        public string? TipoPerdida { get; set; }
        public int cantida { get; set; }
        public string? detalle { get; set; }
        public string? fechaReg { get; set; }
    }
    public class DataTransfecerencia
    {
        public int idTransferencia { get; set; }
        public string? BodegaOrigen { get; set; }
        public string? BodegaDestino { get; set; }
        public string? UsuSolicitante { get; set; }
        public string? AppSolicitante { get; set; }
        public string? UsuVerificador {  get; set; }
        public string? AppVerificador {  get; set; }
        public string? Detalle { get; set; }
        public string? FechaEnvio { get; set; }
        public string? FechaCanelado { get; set; }
        public string? FechaRecepcion { get; set; }
        public string? FechaCreacion { get; set; }
        public string? Estado { get; set; }
        public string? Producto {  get; set; }
        public int Cantidad { get; set; }
        public int CantResibido {  get; set; }
        public int Compra {  get; set; }
        public int secret {  get; set; }
        public string? codigo { get; set; }
        public int Dañado { get; set; }
        public int Perdido { get; set; }
    }
    public class AlertaStock
    {
        public string? NombreProducto { get; set; }
        public int Minimo { get; set; }
    }
    public class DetallesCompra
    {
        public int CompraId { get; set; }
        public string? Nombre {  get; set; }
        public string? Fecha { get; set; }
        public string? Detalle { get; set; }
        public string? Distribuidor { get; set; }
        public string? Codigo   { get; set; }
        public int PrecioCompra { get; set; }
        public int Cantidad { get; set; }
    }
}
