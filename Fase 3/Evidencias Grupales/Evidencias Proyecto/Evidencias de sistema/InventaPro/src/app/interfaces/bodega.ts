export interface Bodega {
  bodegaId: number;
  nombre: string;
  direccion: string;
  estadoBodegaId: number;

  estado?: string;
}

export interface BodegaCU {
  bodegaId: number;
  nombre: string;
  direccion: string;
}