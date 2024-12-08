import { Bodega } from "./bodega";
import { Permiso } from "./permiso";

export interface Rol {
  rolId: number;
  nombre: string;
  descripcion: string;
  bodegaId: number;
  bodega?: Bodega;
  estado: number;
  permisos?: Permiso[];
  
  estadoDesc?: string;
}