import { Bodega } from "./bodega";
import { Rol } from "./rol";

export interface Usuario {
  usuarioId: number;
  nombre: string;
  apellido: string;
  email: string;
  rolId: number;
  estadoUsuarioId: number;
  rol: Rol;
  bodegaId: number;
  bodega: Bodega;
}

export interface UsuarioCU {
  usuarioId?: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rolId?: number;
  bodegaId?: number;
}