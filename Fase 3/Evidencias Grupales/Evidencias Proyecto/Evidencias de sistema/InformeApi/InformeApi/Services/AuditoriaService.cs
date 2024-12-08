﻿using InformeApi.Data;
using InformeApi.Models;

namespace InformeApi.Services
{
    public class AuditoriaService
    {
        private readonly IServiceProvider _serviceProvider;

        public AuditoriaService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public async Task Auditar(int usuarioId, string accion, string descripcion, int bodegaId)
        {
            try
            {
                var _context = _serviceProvider.CreateScope().ServiceProvider.GetRequiredService<AppDbContext>();

                var aud = new Auditoria
                {
                    UsuarioId = usuarioId,
                    Accion = accion,
                    Descripcion = descripcion,
                    BodegaId = bodegaId
                };
                await _context.Auditorias.AddAsync(aud);
                await _context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
