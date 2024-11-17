using InformeApi.Data;
using InformeApi.Models;

namespace InformeApi.Services
{
    public class AlertaService
    {
        private readonly IServiceProvider _serviceProvider;

        public AlertaService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public async Task addAlert(int productoId,int bodegaId,int minStock)
        {
            try
            {
                var _contex = _serviceProvider.CreateScope().ServiceProvider.GetRequiredService<AppDbContext>();
                var alert = new Alerta
                {
                    ProductoId = productoId,
                    BodegaId = bodegaId,
                    TipoAlertaId = 1,
                    Mensaje = "Stock minimo",
                    EstadoAlertaId = 1,
                    Minimo = minStock
                };
                await _contex.Alertas.AddAsync(alert);
                await _contex.SaveChangesAsync();
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
    }
}
