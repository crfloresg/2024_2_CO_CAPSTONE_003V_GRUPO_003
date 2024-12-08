import { Bodega } from "./bodega";
import { Rol } from "./rol";

export interface Usuario {
  usuarioId: number;
  run: string;
  nombre: string;
  apellido: string;
  email: string;
  rolId: number;
  estadoUsuarioId: number;
  rol: Rol;
  bodegaId: number;
  bodega: Bodega;

  estado?: string;
}

export interface UsuarioCU {
  usuarioId?: number;
  run: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rolId?: number;
  bodegaId?: number;
}