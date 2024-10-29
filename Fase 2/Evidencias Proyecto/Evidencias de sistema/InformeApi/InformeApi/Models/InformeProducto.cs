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
    }
}
