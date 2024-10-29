using Microsoft.AspNetCore.Authorization;

namespace InformeApi.Policies
{
  public class AuthorizationPolicies
  {
    public static void Policies(AuthorizationOptions options)
    {
      //Inventario
      options.AddPolicy("Ver_Inventario", policy =>
          policy.RequireClaim("permiso", "Ver_Inventario"));
      options.AddPolicy("Editar_Inventario", policy =>
          policy.RequireClaim("permiso", "Editar_Inventario"));
      options.AddPolicy("Agregar_Inventario", policy =>
          policy.RequireClaim("permiso", "Agregar_Inventario"));
      options.AddPolicy("Eliminar_Inventario", policy =>
          policy.RequireClaim("permiso", "Eliminar_Inventario"));
    }
  }
}
